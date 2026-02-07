import React from "react";
import { Button } from "../ui/button";

const Modal = ({
  Card,
  setModal,
}: {
  Card: React.ReactNode;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 overflow-y-auto ">
      <div className=" p-6 max-w-xl w-250 relative mt-20">
        <Button
          onClick={() => setModal(false)}
          className="right-10 top-10  bg-red-600 absolute hover:bg-red-800"
        >
          Cancel
        </Button>
        {Card}
      </div>
    </div>
  );
};

export default Modal;
