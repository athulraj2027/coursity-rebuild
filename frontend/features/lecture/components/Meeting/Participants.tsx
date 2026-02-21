/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "lucide-react";
import React from "react";

const Participants = ({ users }: { users: object[] }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 py-10 text-center">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <User className="w-4 h-4 text-neutral-600" strokeWidth={1.5} />
            </div>
            <p className="text-xs text-neutral-600 font-medium">
              No participants yet
            </p>
          </div>
        ) : (
          users.map((user: any) => (
            <div
              key={user.userId}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/5 transition-colors duration-150 group"
            >
              {/* Avatar */}
              <div className="w-7 h-7 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-neutral-300 uppercase">
                  {user.username?.charAt(0) ?? "?"}
                </span>
              </div>

              {/* Name */}
              <span className="text-xs font-medium text-neutral-300 truncate flex-1">
                {user.username ?? "Unknown"}
              </span>

              {/* Online dot */}
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0 group-hover:bg-white/60 transition-colors" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Participants;
