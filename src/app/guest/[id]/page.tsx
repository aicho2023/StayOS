import { getStayDetail } from "@/lib/data";
import { GuestMobileApp } from "@/components/guest-mobile-app";

export default async function GuestPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getStayDetail(id);
  return <GuestMobileApp detail={detail} />;
}
