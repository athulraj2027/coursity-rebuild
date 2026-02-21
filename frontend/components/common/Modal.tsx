import React from "react";
import { Button } from "../ui/button";
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
      className="fixed inset-0 z-50 flex items-start justify-center 
             bg-black/60 backdrop-blur-sm
             overflow-y-auto p-6
             animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setModal(false);
        }
      }}
    >
      <div
        className="relative w-full max-w-2xl my-12
               animate-in slide-in-from-bottom-6 fade-in zoom-in-95
               duration-300 ease-out"
      >
        {/* Close Button */}
        <Button
          onClick={() => setModal(false)}
          size="icon"
          className="absolute -top-5 -right-5 z-20
                 bg-background border shadow-lg
                 hover:scale-105 transition-all duration-200
                 rounded-full"
        >
          <X className="h-4 w-4 text-red-500 font-extrabold hover:text-white" />
        </Button>

        {/* Modal Card */}
        <div className="bg-background rounded-3xl shadow-2xl overflow-hidden">
          {Card}
        </div>
      </div>
    </div>
  );
};

export default Modal;
