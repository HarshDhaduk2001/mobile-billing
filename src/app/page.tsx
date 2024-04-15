"use client";
import { callAPI } from "@/utils/Common/ApiCall";
import { hasNoToken } from "@/utils/Common/Functions";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
  const router = useRouter();

  useEffect(() => {
    hasNoToken(router);
  }, [router]);

  useEffect(() => {
    const params = {};
    const url = `${process.env.Base_URL}/auth/getUserDetails`;
    const successCallback = (
      ResponseData: {
        userId: number;
        orgId: number;
        userType: number;
      },
      Message: string,
      error: boolean,
      ResponseStatus: string
    ) => {
      if (ResponseStatus === "success" && error === false) {
        localStorage.setItem("userId", ResponseData.userId.toString());
        localStorage.setItem("orgId", ResponseData.orgId.toString());
        localStorage.setItem("userType", ResponseData.userType.toString());
      }
    };
    callAPI(url, params, successCallback, "GET");
  });
  return <div>Home</div>;
};

export default page;
