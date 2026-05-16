import { getGuestDirectory, getTodayArrivals } from "@/lib/data";
import { StaffDashboard } from "@/components/staff-dashboard";

export default async function Home() {
  const [arrivals, guestDirectory] = await Promise.all([getTodayArrivals(), getGuestDirectory()]);

  return <StaffDashboard arrivals={arrivals} guestDirectory={guestDirectory} />;
}
