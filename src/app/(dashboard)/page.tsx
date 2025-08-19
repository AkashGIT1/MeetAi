import { auth } from "@/lib/auth";
import { HomeView } from "@/app/modules/home/home-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if(!session){
    redirect("/sign-in");
  }

  return (
    <HomeView />
  );
};

export default Page;
