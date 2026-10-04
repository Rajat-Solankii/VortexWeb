import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import LandingPageClient from "@/components/LandingPageClient";
import DeletedScreen from "@/components/DeletedScreen";

export default async function Page({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const params = await searchParams;
  
  if (params?.deleted === 'true') {
    return <DeletedScreen />;
  }

  const session = await getAuthSession();
  
  if (session?.user) {
    // Instantly redirect authenticated users to the home screen
    redirect("/home");
  }
  
  return <LandingPageClient />;
}
