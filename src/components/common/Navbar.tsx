"use client";
import LogoutIcon from "@/assets/icons/common/LogoutIcon";
import { callAPI } from "@/utils/common/ApiCall";
import { handleLogoutUtil } from "@/utils/common/Functions";
import { Avatar } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface User {
  userId: number;
  orgId: number;
  userType: number;
  userName: string;
}

const Navbar = () => {
  const router = useRouter();
  const selectRefNavbar = useRef<HTMLDivElement>(null);
  const [openLogoutNavbar, setOpenLogoutNavbar] = useState(false);
  const [userDataNavbar, setUserDataNavbar] = useState<User | null>(null);

  useEffect(() => {
    const params = {};
    const url = `${process.env.Base_URL}/auth/getUserDetails`;
    const successCallback = (
      ResponseData: User,
      Message: string,
      error: boolean,
      ResponseStatus: string
    ) => {
      if (ResponseStatus === "success" && error === false) {
        localStorage.setItem("userId", ResponseData.userId.toString());
        localStorage.setItem("orgId", ResponseData.orgId.toString());
        localStorage.setItem("userType", ResponseData.userType.toString());
        setUserDataNavbar(ResponseData);
      }
    };
    callAPI(url, params, successCallback, "GET");
  }, []);

  const handleLogout = () => {
    setOpenLogoutNavbar(false);
    if (typeof window !== "undefined") {
      handleLogoutUtil();
    }
    router.push("/login");
  };
  return (
    <span className="flex items-center justify-end gap-[15px] h-[10%] pr-10 border-b">
      <div className="flex flex-col">
        <span className="inline-block text-base font-semibold text-darkCharcoal">
          {userDataNavbar?.userName}
        </span>
      </div>
      <div
        ref={selectRefNavbar}
        className="flex items-center justify-center flex-col relative"
      >
        <span
          onClick={() => setOpenLogoutNavbar(!openLogoutNavbar)}
          className="cursor-pointer"
        >
          <Avatar sx={{ width: 34, height: 34, fontSize: 14 }}>
            {userDataNavbar?.userName
              .split(" ")
              .map((word: string) => word.charAt(0).toUpperCase())
              .join("")}
          </Avatar>
        </span>
        {openLogoutNavbar && (
          <div className="absolute top-[55px] rounded-md -right-2 w-50 h-12 px-5 flex items-center justify-center bg-pureWhite shadow-xl z-50">
            <span
              onClick={handleLogout}
              className="flex items-center justify-center cursor-pointer hover:text-defaultRed"
            >
              <span className="!rotate-0">
                <LogoutIcon />
              </span>
              &nbsp;Logout
            </span>
          </div>
        )}
      </div>
    </span>
  );
};

export default Navbar;