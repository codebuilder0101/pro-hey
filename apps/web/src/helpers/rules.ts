import type {
  AccountFollowRuleFragment,
  AccountFollowRules,
  GroupRuleFragment,
  GroupRules
} from "@hey/indexer";
import type { Address } from "viem";
import getAnyKeyValue from "./getAnyKeyValue";

interface AssetDetails {
  assetAddress: Address | null;
  assetSymbol: string | null;
  amount: number | null;
}

const extractPaymentDetails = (
  rules: GroupRuleFragment[] | AccountFollowRuleFragment[]
): AssetDetails => {
  for (const rule of rules) {
    if (rule.type === "SIMPLE_PAYMENT") {
      return {
        assetAddress:
          getAnyKeyValue(rule.config, "assetContract")?.address || null,
        assetSymbol: getAnyKeyValue(rule.config, "assetSymbol")?.string || null,
        amount:
          Number(getAnyKeyValue(rule.config, "amount")?.bigDecimal) || null
      };
    }
  }

  return { assetAddress: null, assetSymbol: null, amount: null };
};

export const getSimplePaymentDetails = (
  rules: GroupRules | AccountFollowRules
): AssetDetails =>
  extractPaymentDetails(rules.required) || extractPaymentDetails(rules.anyOf);
