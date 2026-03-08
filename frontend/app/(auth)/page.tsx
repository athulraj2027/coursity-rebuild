import Features from "@/components/public/landing/Features";
import Hero from "@/components/public/landing/Hero";
import Problem from "@/components/public/landing/Problem";
import Workflow from "@/components/public/landing/Workflow";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Features />
      <Workflow />
    </>
  );
}
