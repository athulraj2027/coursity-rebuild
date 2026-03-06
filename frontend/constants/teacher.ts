import { Eye, Pencil, Plus, UserCheck, UserX } from "lucide-react";

export const actions = (
  courseId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openModal: (data: any) => void,
  isEnrollmentOpen: boolean | null,
  isDisabled: boolean | null,
) => {
  return [
    {
      key: "view",
      icon: Eye,
      tooltip: "View course",
      href: `/teacher/my-courses/${courseId}`,
      disabled: false,
    },
    {
      key: "enrollment",
      icon: UserX,
      tooltip: isEnrollmentOpen ? "Disable enrollment" : "Enrollment disabled",
      disabled: !isEnrollmentOpen,
    },
    {
      key: "edit",
      icon: Pencil,
      tooltip: "Edit course",
      href: `/teacher/my-courses/${courseId}/edit`,
      disabled: isDisabled,
    },
    {
      key: "attendance",
      icon: UserCheck,
      tooltip: "Attendances",
      href: `/teacher/my-courses/${courseId}/attendances`,
      disabled: false,
    },
    {
      key: "addLecture",
      icon: Plus,
      tooltip: "Schedule new lecture",
      onClick: () => openModal("ADD_LECTURE"),
      color: "primary",
      disabled: isDisabled,
    },
  ];
};
