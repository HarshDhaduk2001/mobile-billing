"use client";
import { ContainedButton } from "@/components/common/Button";
import { callAPI } from "@/utils/common/ApiCall";
import { hasToken } from "@/utils/common/Functions";
import { Button, CircularProgress, TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    hasToken(router);
  }, [router]);

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setEmailError(email.trim().length <= 0 || !emailRegex.test(email));

    if (email.trim().length > 0 && emailRegex.test(email) && !emailError) {
      setLoading(true);
      const params = {
        email: email,
      };
      const url = `${process.env.Base_URL}/auth/forgot-password`;
      const successCallback = (
        ResponseData: null,
        Message: string,
        error: boolean,
        ResponseStatus: string
      ) => {
        if (ResponseStatus === "success" && error === false) {
          toast.success(Message || "Please check your email.");
          setLoading(false);
          router.push("/login");
        } else if (ResponseStatus === "warning" && error === false) {
          toast.warning(Message);
          setEmail("");
          setEmailError(false);
          setLoading(false);
          router.push("/login");
        } else {
          setLoading(false);
        }
      };
      callAPI(url, params, successCallback, "POST");
    } else {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen">
      <div className="container h-full px-6 py-24">
        <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
            <img
              src="https://staging-tms.azurewebsites.net/assets/images/pages/forgot-password-v2.svg"
              className="w-full h-[80vh]"
              alt="Phone image"
            />
          </div>
          <div className="w-[1px] h-[70vh] bg-slate-600">&nbsp;</div>
          <div className="md:w-8/12 lg:ml-6 lg:w-5/12 pl-20 pr-40">
            <form onSubmit={handleSubmit} className="w-[300px] lg:w-[356px]">
              <h1 className="pt-14 pb-2 font-bold text-[30px]">
                Forgot Password?
              </h1>
              <p className="text-gray-500 text-[14px]">
                Enter your email and we&rsquo;ll send you
                <br />
                instructions to reset your password
              </p>
              <TextField
                label={
                  <span>
                    Email
                    <span className="!text-defaultRed">&nbsp;*</span>
                  </span>
                }
                fullWidth
                className="pt-1"
                value={email?.trim().length <= 0 ? "" : email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(false);
                }}
                onBlur={(e: any) => {
                  if (
                    e.target.value.trim().length <= 0 ||
                    !emailRegex.test(email)
                  ) {
                    setEmailError(true);
                  }
                }}
                error={emailError}
                helperText={
                  emailError &&
                  email.trim().length > 0 &&
                  !emailRegex.test(email)
                    ? "Please enter valid Email."
                    : emailError
                    ? "This is a required field."
                    : ""
                }
                margin="normal"
                variant="standard"
                autoComplete="off"
              />

              {loading ? (
                <div className="flex items-center justify-center">
                  <CircularProgress />
                </div>
              ) : (
                <ContainedButton
                  type="submit"
                  className="mt-6"
                  fullWidth={true}
                >
                  Send Email
                </ContainedButton>
              )}

              <p className="mb-0 mt-2 pt-1 text-sm font-semibold">
                If you already have an account?&nbsp;
                <Link
                  href="/login"
                  className="text-defaultRed transition duration-150 ease-in-out hover:text-defaultRed"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
