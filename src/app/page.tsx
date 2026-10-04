import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import LandingPageClient from "@/components/LandingPageClient";

export default async function Page() {
  const session = await getAuthSession();
  
  if (session?.user) {
    // Instantly redirect authenticated users to the home screen
    redirect("/home");
  }
  
  return <LandingPageClient />;
}
