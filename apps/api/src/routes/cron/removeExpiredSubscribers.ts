import { SUBSCRIPTION_GROUP } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
import { RemoveGroupMembersDocument } from "@hey/indexer";
import apolloClient from "@hey/indexer/apollo/client";
import type { Context } from "hono";
import getBuilderAccessToken from "src/utils/getBuilderAccessToken";
import lensPg from "src/utils/lensPg";
import signer from "src/utils/signer";
import { sendEip712Transaction } from "viem/zksync";

const removeExpiredSubscribers = async (ctx: Context) => {
  try {
    const accounts = await lensPg.query(
      `
        SELECT account
        FROM "group"."member"
        WHERE "group"::TEXT LIKE $1
        AND timestamp < NOW() - INTERVAL '365 days'
        LIMIT 50;
      `,
      [`%${SUBSCRIPTION_GROUP.replace("0x", "").toLowerCase()}%`]
    );

    const addresses = accounts.map((account) =>
      `0x${account.account.toString("hex")}`.toLowerCase()
    );

    if (addresses.length === 0) {
      return ctx.json({ success: true, message: "No expired subscribers" });
    }

    const accessToken = await getBuilderAccessToken();

    const { data } = await apolloClient().mutate({
      mutation: RemoveGroupMembersDocument,
      variables: {
        request: { ban: false, group: SUBSCRIPTION_GROUP, accounts: addresses }
      },
      context: { headers: { authorization: `Bearer ${accessToken}` } }
    });

    const hash = await sendEip712Transaction(signer, {
      account: signer.account,
      ...sponsoredTransactionData(data.removeGroupMembers.raw)
    });

    return ctx.json({ success: true, addresses, hash });
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default removeExpiredSubscribers;
