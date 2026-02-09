"use client";

import { Eye, Pause, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Modal from "../../common/Modal";
import LectureViewCard from "./LectureViewCard";
import LectureEditCard from "./LectureEditCard";

type ModalType = "VIEW" | "EDIT" | "CANCEL" | "START";

const LectureActions = ({ lectureId }: { lectureId: string }) => {
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const openModal = (type: ModalType) => {
    if (type === "START") {
      window.open(`/teacher/lectures/${lectureId}/start`, "_blank");
      return;
    }

    setModalType(type);
    setModal(true);
  };

  const renderModalCard = () => {
    switch (modalType) {
      case "VIEW":
        return <LectureViewCard lectureId={lectureId} />;

      case "EDIT":
        return <LectureEditCard lectureId={lectureId} />;

      case "CANCEL":
        // Later: CancelLectureCard / confirmation dialog
        return null;

      case "START":
        return;
      default:
        return null;
    }
  };

  return (
    <>
      <TooltipProvider>
        <div className="flex gap-2 justify-center">
          {/* VIEW */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={() => openModal("VIEW")}
              >
                <Eye size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View lecture</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => openModal("START")}
              >
                <Pause size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Start lecture</TooltipContent>
          </Tooltip>

          {/* EDIT */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={() => openModal("EDIT")}
                disabled
              >
                <Pencil size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit lecture</TooltipContent>
          </Tooltip>

          {/* CANCEL */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => openModal("CANCEL")}
              >
                <X size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Cancel lecture</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {modal && modalType && (
        <Modal Card={renderModalCard()} setModal={setModal} />
      )}
    </>
  );
};

export default LectureActions;
