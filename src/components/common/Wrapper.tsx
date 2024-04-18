import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Wrapper = ({ children }: any) => {
  return (
    <div className="flex h-[100vh] w-[100%]">
      <div className="w-[15%]">
        <Sidebar />
      </div>
      <main className="flex flex-col w-[85%]">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default Wrapper;
