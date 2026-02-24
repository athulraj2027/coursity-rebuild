"use client";

import { Eye, Pencil, Plus, UserX } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Modal from "../../common/Modal";
import CourseEditCard from "./CourseEditCard";
import CreateLectureCard from "../lecture/CreateLectureCard";
import Link from "next/link";

type Props = { courseId: string };
type ModalType = "VIEW" | "EDIT" | "ADD_LECTURE";

const CourseActions = ({ courseId }: Props) => {
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const openModal = (type: ModalType) => {
    setModalType(type);
    setModal(true);
  };

  const renderModalCard = () => {
    switch (modalType) {
      case "EDIT":
        return <CourseEditCard courseId={courseId} />;
      case "ADD_LECTURE":
        return <CreateLectureCard courseId={courseId} setModal={setModal} />;
      default:
        return null;
    }
  };

  return (
    <>
      <TooltipProvider>
        <div className="flex items-center justify-center gap-1">
          {/* VIEW */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/teacher/my-courses/${courseId}`}>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-black/10 bg-white text-neutral-500 hover:text-black hover:border-black/25 hover:bg-neutral-50 transition-all duration-150">
                  <Eye className="w-3.5 h-3.5" strokeWidth={1.8} />
                </button>
              </Link>
            </TooltipTrigger>
            <TooltipContent className="text-xs">View course</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                disabled
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-black/10 bg-white text-neutral-400 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <UserX className="w-3.5 h-3.5" strokeWidth={1.8} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              Enrollment disabled
            </TooltipContent>
          </Tooltip>

          {/* EDIT */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => openModal("EDIT")}
                disabled
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-black/10 bg-white text-neutral-400 hover:text-black hover:border-black/25 hover:bg-neutral-50 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Pencil className="w-3.5 h-3.5" strokeWidth={1.8} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">Edit course</TooltipContent>
          </Tooltip>

          {/* ADD LECTURE */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => openModal("ADD_LECTURE")}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-black bg-blue-500 text-white hover:bg-black-700 active:bg-blue-800 transition-all duration-150"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              Schedule new lecture
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {modal && modalType && (
        <Modal Card={renderModalCard()} setModal={setModal} />
      )}
    </>
  );
};

export default CourseActions;
