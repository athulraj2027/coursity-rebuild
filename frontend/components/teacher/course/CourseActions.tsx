"use client";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Modal from "../../common/Modal";
import CreateLectureCard from "../lecture/CreateLectureCard";
import Link from "next/link";
import { actions } from "@/constants/teacher";

type Props = {
  courseId: string;
  isEnrollmentOpen: boolean | null;
  isDisabled: boolean | null;
};

type ModalType = "VIEW" | "EDIT" | "ADD_LECTURE";

const CourseActions = ({ courseId, isEnrollmentOpen, isDisabled }: Props) => {
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const openModal = (type: ModalType) => {
    setModalType(type);
    setModal(true);
  };

  const renderModalCard = () => {
    switch (modalType) {
      case "ADD_LECTURE":
        return <CreateLectureCard courseId={courseId} setModal={setModal} />;
      default:
        return null;
    }
  };

  const courseActions = actions(
    courseId,
    openModal,
    isEnrollmentOpen,
    isDisabled,
  );

  return (
    <>
      <TooltipProvider>
        <div className="flex items-center justify-center gap-1">
          {courseActions.map((action) => {
            const Icon = action.icon;

            const button = (
              <button
                onClick={action.onClick}
                disabled={action.disabled || undefined}
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-150
                ${
                  action.color === "primary"
                    ? "border-black bg-blue-500 text-white hover:bg-blue-600"
                    : "border-black/10 bg-white text-neutral-400 hover:text-black hover:border-black/25 hover:bg-neutral-50"
                }
                disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
              </button>
            );

            return (
              <Tooltip key={action.key}>
                <TooltipTrigger asChild>
                  {action.href ? (
                    <Link href={action.href}>{button}</Link>
                  ) : (
                    button
                  )}
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  {action.tooltip}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>

      {modal && modalType && (
        <Modal Card={renderModalCard()} setModal={setModal} />
      )}
    </>
  );
};

export default CourseActions;
