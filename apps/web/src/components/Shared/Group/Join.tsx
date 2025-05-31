import { Button } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useApolloClient } from "@apollo/client";
import {
  type GroupFragment,
  type LoggedInGroupOperationsFragment,
  useJoinGroupMutation,
  useRequestGroupMembershipMutation
} from "@hey/indexer";
import { useState } from "react";
import { toast } from "sonner";

interface JoinProps {
  group: GroupFragment;
  small: boolean;
  shouldRequestMembership?: boolean;
  className?: string;
  title?: string;
  onSuccess?: () => void;
}

const Join = ({
  group,
  small,
  shouldRequestMembership = false,
  className = "",
  title = "Join",
  onSuccess
}: JoinProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();
  const updateCache = () => {
    cache.modify({
      fields: {
        isMember: () => !shouldRequestMembership,
        hasRequestedMembership: () => shouldRequestMembership
      },
      id: cache.identify(group.operations as LoggedInGroupOperationsFragment)
    });
  };

  const onCompleted = () => {
    updateCache();
    setIsSubmitting(false);
    onSuccess?.();
    toast.success(shouldRequestMembership ? "Request sent" : "Joined group");
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [joinGroup] = useJoinGroupMutation({
    onCompleted: async ({ joinGroup }) => {
      if (joinGroup.__typename === "JoinGroupResponse") {
        return onCompleted();
      }

      if (joinGroup.__typename === "GroupOperationValidationFailed") {
        return onError({ message: joinGroup.reason });
      }

      return await handleTransactionLifecycle({
        transactionData: joinGroup,
        onCompleted,
        onError
      });
    },
    onError
  });

  const [requestGroupMembership] = useRequestGroupMembershipMutation({
    onCompleted: async ({ requestGroupMembership }) => {
      if (
        requestGroupMembership.__typename === "RequestGroupMembershipResponse"
      ) {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: joinGroup,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleJoin = async () => {
    setIsSubmitting(true);

    if (shouldRequestMembership) {
      return await requestGroupMembership({
        variables: { request: { group: group.address } }
      });
    }

    return await joinGroup({
      variables: { request: { group: group.address } }
    });
  };

  return (
    <Button
      aria-label="Join"
      className={className}
      disabled={isSubmitting}
      loading={isSubmitting}
      onClick={handleJoin}
      outline
      size={small ? "sm" : "md"}
    >
      {title}
    </Button>
  );
};

export default Join;
