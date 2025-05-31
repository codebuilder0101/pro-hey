import Custom404 from "@/components/Shared/404";
import { PageLayout } from "@/components/Shared/PageLayout";
import { Card } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";

const StaffOverview = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount || !currentAccount.isStaff) {
    return <Custom404 />;
  }

  return (
    <PageLayout title="Staff Tools">
      <Card className="p-5">WIP</Card>
    </PageLayout>
  );
};

export default StaffOverview;
