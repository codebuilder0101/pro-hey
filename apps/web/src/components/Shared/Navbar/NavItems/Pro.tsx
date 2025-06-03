import { Tooltip } from "@/components/Shared/UI";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

const Pro = () => {
  // const { setShowProModal } = useProModalStore();

  return (
    <button onClick={() => toast.info("Coming soon")} type="button">
      <Tooltip content="Pro">
        <CheckBadgeIcon className="size-6" />
      </Tooltip>
    </button>
  );
};

export default Pro;
