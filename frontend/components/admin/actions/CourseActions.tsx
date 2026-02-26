import { Eye } from "lucide-react";
import Link from "next/link";
import React from "react";

const CourseActions = ({ id }: { id: string }) => {
  return (
    <div className="flex justify-around items-center">
      <Link
        href={`/admin/courses/${id}`}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-50 border border-violet-200 text-violet-700 text-[11px] font-semibold hover:bg-violet-100 transition-colors"
      >
        <Eye className="w-3 h-3" strokeWidth={2} />
      </Link>
    </div>
  );
};

export default CourseActions;
