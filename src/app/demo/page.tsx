import { DemoSplitView } from "@/components/demo-split-view";
import { getStayDetail } from "@/lib/data";

export default async function DemoPage() {
  const detail = await getStayDetail("stay-sandhill-founders");

  return <DemoSplitView detail={detail} />;
}
