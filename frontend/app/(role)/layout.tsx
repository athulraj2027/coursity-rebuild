import { MeLoader } from "@/components/common/MeLoader";
import { AppSidebar } from "@/components/common/sidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />

        <div className="">
          {" "}
          <MeLoader />
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
