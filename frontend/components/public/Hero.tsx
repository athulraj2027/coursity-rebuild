import React from "react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative w-full py-24 sm:py-32">
      <div className="container mx-auto max-w-5xl px-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
          Live Classes. Real Attendance. <br className="hidden sm:block" />
          Zero Guesswork.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed">
          A structured online teaching platform with real-time video, role-based
          access, and automatic attendance — built for educators who care about
          accountability, not vanity metrics.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg" className="px-8">
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="px-8">
            View Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

