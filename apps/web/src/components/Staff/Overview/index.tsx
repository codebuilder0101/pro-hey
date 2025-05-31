import Custom404 from "@/components/Shared/404";
import { PageLayout } from "@/components/Shared/PageLayout";
import { Card } from "@/components/Shared/UI";
import isFeatureEnabled from "@/helpers/isFeatureEnabled";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { Features } from "@hey/data/features";

const StaffOverview = () => {
  const { currentAccount } = useAccountStore();
  const isStaff = isFeatureEnabled(Features.Staff);

  if (!currentAccount || !isStaff) {
    return <Custom404 />;
  }

  return (
    <PageLayout title="Staff Tools">
      <Card className="p-5">WIP</Card>
    </PageLayout>
  );
};

export default StaffOverview;
