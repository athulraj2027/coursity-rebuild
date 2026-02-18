/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "lucide-react";
import React from "react";

const Participants = ({ users }: { users: object[] }) => {
  console.log("users in the participants component : ", users);
  return (
    <div className="w-72 border-l border-gray-700 p-4 overflow-y-auto">
      <h2 className="mb-4 font-medium">Participants</h2>
      <hr />

      <div className="space-y-3 mt-3">
        {users.map((user: any) => (
          <div key={user.userId} className="flex gap-2 items-center">
            <User size={16} /> {user.username}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Participants;
