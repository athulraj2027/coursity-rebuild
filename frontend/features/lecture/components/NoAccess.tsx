import React from "react";
import { Lock } from "lucide-react";

const NoAccess = ({ error }: { error: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center border">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <Lock className="text-red-600 w-8 h-8" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Access Restricted
        </h1>

        <p className="text-gray-600 mb-6">
          {error}
          <br />
        </p>

        <button
          onClick={() => window.history.back()}
          className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NoAccess;
