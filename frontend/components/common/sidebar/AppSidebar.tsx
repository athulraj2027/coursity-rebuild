import { Sidebar } from "@/components/ui/sidebar";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

export function AppSidebar() {
  return (
    <Sidebar>
      <Header />
      <Body />
      <Footer />
    </Sidebar>
  );
}
