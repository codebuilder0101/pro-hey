import { SUBSCRIPTION_GROUP } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import type { Eip712TransactionRequest } from "@hey/indexer";
import { RemoveGroupMembersDocument } from "@hey/indexer";
import apolloClient from "@hey/indexer/apollo/client";
import type { Context } from "hono";
import getBuilderAccessToken from "src/utils/getBuilderAccessToken";
import lensPg from "src/utils/lensPg";
import signer from "src/utils/signer";
import { sendEip712Transaction } from "viem/zksync";

const sponsoredTransactionData = (raw: Eip712TransactionRequest) => {
  return {
    data: raw.data,
    gas: BigInt(raw.gasLimit),
    maxFeePerGas: BigInt(raw.maxFeePerGas),
    maxPriorityFeePerGas: BigInt(raw.maxPriorityFeePerGas),
    nonce: raw.nonce,
    paymaster: raw.customData.paymasterParams?.paymaster,
    paymasterInput: raw.customData.paymasterParams?.paymasterInput,
    to: raw.to,
    value: BigInt(raw.value)
  };
};

const removeExpiredSubscribers = async (ctx: Context) => {
  try {
    const accounts = await lensPg.query(
      `
        SELECT account
        FROM "group"."member"
        WHERE "group"::TEXT LIKE $1
        LIMIT 20;
      `,
      [`%${SUBSCRIPTION_GROUP.replace("0x", "").toLowerCase()}%`]
    );

    const accessToken = await getBuilderAccessToken();

    const addresses = accounts.map((account) =>
      `0x${account.account.toString("hex")}`.toLowerCase()
    );

    const { data } = await apolloClient().mutate({
      mutation: RemoveGroupMembersDocument,
      variables: {
        request: { ban: false, group: SUBSCRIPTION_GROUP, accounts: addresses }
      },
      context: { headers: { authorization: `Bearer ${accessToken}` } }
    });

    const hash = await await sendEip712Transaction(signer, {
      account: signer.account,
      ...sponsoredTransactionData(data.removeGroupMembers.raw)
    });

    return ctx.json({ success: true, addresses, hash });
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default removeExpiredSubscribers;
