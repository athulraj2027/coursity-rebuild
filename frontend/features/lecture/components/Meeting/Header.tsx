import React from "react";
import { Radio } from "lucide-react";

const Header = () => {
  return (
    <div className="flex items-center justify-between px-4 lg:px-5 py-3 border-b border-white/8 bg-neutral-900 shrink-0">
      {/* Left — branding */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0">
          <Radio className="w-3.5 h-3.5 text-black" strokeWidth={2} />
        </div>
        <span className="text-sm font-semibold text-white tracking-tight">
          Lecture Room
        </span>
      </div>

      {/* Right — live indicator */}
      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
        <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
          Live
        </span>
      </div>
    </div>
  );
};

export default Header;
