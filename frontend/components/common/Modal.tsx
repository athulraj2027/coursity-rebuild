import React from "react";
import { X } from "lucide-react";

const Modal = ({
  Card,
  setModal,
}: {
  Card: React.ReactNode;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4 sm:p-8 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setModal(false);
      }}
    >
      <div className="relative w-full max-w-xl my-10 animate-in slide-in-from-bottom-4 fade-in zoom-in-95 duration-200 ease-out">
        {/* Close button */}
        <button
          onClick={() => setModal(false)}
          className="absolute -top-3 -right-3 z-20 w-7 h-7 rounded-full bg-white border border-black/10 shadow-md flex items-center justify-center hover:bg-neutral-100 hover:scale-105 transition-all duration-150"
        >
          <X className="w-3.5 h-3.5 text-neutral-500" strokeWidth={2.5} />
        </button>

        {/* Card wrapper */}
        <div className="rounded-2xl shadow-xl overflow-hidden ring-1 ring-black/8">
          {Card}
        </div>
      </div>
    </div>
  );
};

export default Modal;
