import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center px-4 lg:px-6 py-3 border-b border-gray-700">
      <h1 className="text-lg font-semibold">Lecture Room</h1>
      {/* <p className="text-sm text-gray-300">ID: {lectureId}</p> */}
    </div>
  );
};

export default Header;
