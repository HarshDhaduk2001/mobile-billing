import { CircularProgress } from "@mui/material";
import React from "react";

const OverLay = ({ className }: any) => {
  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 bg-black opacity-40 ${className}`}
      style={{ zIndex: "99" }}
    >
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    </div>
  );
};

export default OverLay;
