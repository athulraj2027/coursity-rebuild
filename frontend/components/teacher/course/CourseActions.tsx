"use client";

import { Eye, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Modal from "../../common/Modal";
import CourseViewCard from "./CourseViewCard";
import CourseEditCard from "./CourseEditCard";
import CreateLectureCard from "../lecture/CreateLectureCard";

type Props = {
  courseId: string;
};

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
      case "VIEW":
        return <CourseViewCard courseId={courseId} />;

      case "EDIT":
        return <CourseEditCard courseId={courseId} />;

      case "ADD_LECTURE":
        return <CreateLectureCard courseId={courseId} />;

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
            <TooltipContent>View course</TooltipContent>
          </Tooltip>

          {/* EDIT */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={() => openModal("EDIT")}
              >
                <Pencil size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit course</TooltipContent>
          </Tooltip>

          {/* CREATE LECTURE */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                onClick={() => openModal("ADD_LECTURE")}
              >
                <Plus size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create lecture</TooltipContent>
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
