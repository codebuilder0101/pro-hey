import stopEventPropagation from "@/helpers/stopEventPropagation";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import type { GroupFragment } from "@hey/indexer";
import {} from "react";
import JoinWithRulesCheck from "./JoinWithRulesCheck";
import Leave from "./Leave";

interface JoinLeaveButtonProps {
  hideJoinButton?: boolean;
  hideLeaveButton?: boolean;
  group: GroupFragment;
  small?: boolean;
}

const JoinLeaveButton = ({
  hideJoinButton = false,
  hideLeaveButton = false,
  group,
  small = false
}: JoinLeaveButtonProps) => {
  const { currentAccount } = useAccountStore();

  if (currentAccount?.address === group.owner) {
    return null;
  }

  return (
    <div className="contents" onClick={stopEventPropagation}>
      {!hideJoinButton &&
        (group.operations?.isMember ? null : (
          <JoinWithRulesCheck group={group} small={small} />
        ))}
      {!hideLeaveButton &&
        (group.operations?.isMember ? (
          <Leave group={group} small={small} />
        ) : null)}
    </div>
  );
};

export default JoinLeaveButton;
