import { getStayDetail } from "@/lib/data";
import { StayCrmWorkspace } from "@/components/stay-crm-workspace";

export default async function StayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getStayDetail(id);
  return <StayCrmWorkspace detail={detail} />;
}
