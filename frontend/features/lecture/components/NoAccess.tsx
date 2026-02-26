import React from "react";
import { ShieldX, ArrowLeft } from "lucide-react";

const NoAccess = ({ error }: { error: string }) => {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white border border-black/8 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-0.5 bg-rose-500 w-full" />

          <div className="p-8 flex flex-col items-center text-center gap-5">
            {/* Icon */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-100 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-200">
                  <ShieldX className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-rose-500 tracking-widest uppercase">
                Access Denied
              </p>
              <h1 className="text-xl font-bold text-black tracking-tight">
                Access Restricted
              </h1>
              <p className="text-sm text-neutral-400 font-medium leading-relaxed">
                {error}
              </p>
            </div>

            <div className="w-full h-px bg-black/5" />

            {/* Action */}
            <button
              onClick={() => window.history.back()}
              className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-black text-white text-sm font-semibold hover:bg-black/80 active:bg-black/90 transition-all duration-150"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoAccess;
