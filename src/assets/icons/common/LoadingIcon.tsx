import React from "react";

const LoadingIcon = () => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <svg
          version="1.1"
          viewBox="0 0 64 64"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "1.25em" }}
        >
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="url(#sGD)"
            strokeWidth="8"
          />
          <path
            d="M 32,4 A 28 28,0,0,0,32,60"
            fill="none"
            stroke="#6E6D7A67"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient
              id="sGD"
              gradientUnits="userSpaceOnUse"
              x1="32"
              y1="0"
              x2="32"
              y2="64"
            >
              <stop stopColor="#6E6D7A67" offset="0.1" stopOpacity="0"></stop>
              <stop stopColor="#6E6D7A67" offset=".9" stopOpacity="1"></stop>
            </linearGradient>
          </defs>
          <animateTransform
            values="0,0,0;360,0,0"
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="750ms"
          ></animateTransform>
        </svg>
      </div>
    </div>
  );
};

export default LoadingIcon;
