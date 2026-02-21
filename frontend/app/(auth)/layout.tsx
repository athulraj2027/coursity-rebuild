/* eslint-disable @typescript-eslint/no-explicit-any */
import AppNavbar from "@/components/public/Navbar";

export default function PublicLayout({ children }: { children: any }) {
  return (
    <div className="flex flex-col min-h-screen">
      
      <AppNavbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
