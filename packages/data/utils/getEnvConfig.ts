import { LENS_NETWORK } from "../constants";
import { MainnetContracts, TestnetContracts } from "../contracts";
import LensEndpoint from "../lens-endpoints";

const getEnvConfig = (): {
  lensApiEndpoint: string;
  defaultCollectToken: `0x${string}`;
  appAddress: `0x${string}`;
} => {
  const testnetContracts = {
    defaultCollectToken: TestnetContracts.DefaultToken,
    appAddress: TestnetContracts.App
  };

  switch (LENS_NETWORK) {
    case "testnet":
      return {
        lensApiEndpoint: LensEndpoint.Testnet,
        ...testnetContracts
      };
    case "staging":
      return {
        lensApiEndpoint: LensEndpoint.Staging,
        ...testnetContracts
      };
    default:
      return {
        lensApiEndpoint: LensEndpoint.Mainnet,
        defaultCollectToken: MainnetContracts.DefaultToken,
        appAddress: MainnetContracts.App
      };
  }
};

export default getEnvConfig;
