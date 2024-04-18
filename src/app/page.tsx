"use client";
import Wrapper from "@/components/common/Wrapper";
import MainSettings from "@/components/settings/MainSettings";
import { hasNoToken } from "@/utils/Common/Functions";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
  const router = useRouter();

  useEffect(() => {
    hasNoToken(router);
  }, [router]);
  return (
    <Wrapper>
      <MainSettings />
    </Wrapper>
  );
};

export default page;
