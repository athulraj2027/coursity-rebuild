/* eslint-disable @typescript-eslint/no-explicit-any */
import AppNavbar from "@/components/public/Navbar";

export default function PublicLayout({ children }: { children: any }) {
  return (
    <div className="min-h-screen w-full relative">
      {/* Radial Gradient Background from Top */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(150deg, #B39DDB 0%, #D1C4E9 20%, #F3E5F5 40%, #FCE4EC 60%, #FFCDD2 80%, #FFAB91 100%)`,
        }}
      />
      <div className="relative z-10">
        <AppNavbar />
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          {children}
        </div>
        {/* Top courses, top teachers, testimonials */}
      </div>
    </div>
  );
}
