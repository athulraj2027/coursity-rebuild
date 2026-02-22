import { MeLoader } from "@/components/common/MeLoader";
import { AppSidebar } from "@/components/common/sidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <MeLoader />
        <SidebarTrigger className="absolute top-3 left-3 sm:left-35 z-50" />
        {children}
      </main>
    </SidebarProvider>
  );
}
