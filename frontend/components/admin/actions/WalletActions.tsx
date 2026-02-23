import React, { useState } from "react";
import { Eye, Wallet, History } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PayoutCard from "../PayoutCard";
import Modal from "@/components/common/Modal";

type ModalType = "VIEW" | "PAY" | "ADD_LECTURE";

const WalletActions = ({ userId }: { userId: string }) => {
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const openModal = (type: ModalType) => {
    setModalType(type);
    setModal(true);
  };

  const renderModalCard = () => {
    switch (modalType) {
      case "PAY":
        return (
          <PayoutCard userId={userId} onClose={() => setModalType(null)} />
        );
      default:
        return null;
    }
  };
  return (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-1">
        {/* VIEW WALLET */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              disabled
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-black/10 bg-white text-neutral-500 hover:text-black hover:border-black/25 hover:bg-neutral-50 transition-all duration-150"
            >
              <Eye className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>
          </TooltipTrigger>
          <TooltipContent className="text-xs">
            View wallet details
          </TooltipContent>
        </Tooltip>

        {/* PAY NOW */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => openModal("PAY")}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-emerald-200 bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all duration-150"
            >
              <Wallet className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>
          </TooltipTrigger>
          <TooltipContent className="text-xs">Pay user</TooltipContent>
        </Tooltip>

        {/* PAYOUT HISTORY */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              disabled
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-black/10 bg-white text-neutral-500 hover:text-black hover:border-black/25 hover:bg-neutral-50 transition-all duration-150"
            >
              <History className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>
          </TooltipTrigger>
          <TooltipContent className="text-xs">
            View payout history
          </TooltipContent>
        </Tooltip>
      </div>
      {modal && modalType && renderModalCard()}
    </TooltipProvider>
  );
};

export default WalletActions;
