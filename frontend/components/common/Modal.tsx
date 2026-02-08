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
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4"
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          setModal(false);
        }
      }}
    >
      <div className="relative w-full max-w-2xl my-8">
        {/* Close Button - Fixed at top right */}
        <Button
          onClick={() => setModal(false)}
          size="icon"
          className="absolute -top-4 -right-4 z-10 bg-red-600 hover:bg-red-700 rounded-full shadow-lg"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Card Content */}
        <div className="bg-background rounded-lg shadow-xl">{Card}</div>
      </div>
    </div>
  );
};

export default Modal;
