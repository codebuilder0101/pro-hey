import { AuthenticateDocument, ChallengeDocument } from "@hey/indexer";
import apolloClient from "@hey/indexer/apollo/client";
import signer from "./signer";

const getBuilderAccessToken = async (): Promise<string | null> => {
  const { data: challengeData } = await apolloClient().mutate({
    mutation: ChallengeDocument,
    variables: { request: { builder: { address: signer.account.address } } },
    context: { headers: { origin: "https://hey.xyz" } }
  });

  if (!challengeData?.challenge?.text) {
    return null;
  }

  const signature = await signer.signMessage({
    message: challengeData.challenge.text
  });

  const { data: authenticateData } = await apolloClient().mutate({
    mutation: AuthenticateDocument,
    variables: { request: { id: challengeData.challenge.id, signature } }
  });

  if (authenticateData?.authenticate.__typename !== "AuthenticationTokens") {
    return null;
  }

  return authenticateData.authenticate.accessToken;
};

export default getBuilderAccessToken;
