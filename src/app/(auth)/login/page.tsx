"use client";
import { callAPI } from "@/utils/Common/ApiCall";
import { hasToken } from "@/utils/Common/Functions";
import { Button, CircularProgress, TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    hasToken(router);
  }, [router]);

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setEmailError(email.trim().length <= 0 || !emailRegex.test(email));
    setPasswordError(password.trim().length < 6 || password.trim().length > 20);

    if (
      email.trim().length > 0 &&
      emailRegex.test(email) &&
      !emailError &&
      password.trim().length >= 6 &&
      password.trim().length <= 20 &&
      !passwordError
    ) {
      setLoading(true);
      const params = {
        email: email,
        password: password,
      };
      const url = `${process.env.Base_URL}/auth/login`;
      const successCallback = (
        ResponseData: string | null,
        Message: string,
        error: boolean,
        ResponseStatus: string
      ) => {
        if (ResponseStatus === "success" && error === false) {
          toast.success(Message || "You have been successfully loggedin.");
          setLoading(false);
          localStorage.setItem(
            "Token",
            ResponseData !== null ? ResponseData : ""
          );
          router.push("/");
        } else if (ResponseStatus === "warning" && error === false) {
          toast.warning(Message);
          setEmail("");
          setEmailError(false);
          setPassword("");
          setPasswordError(false);
          setLoading(false);
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
              src="https://staging-tms.azurewebsites.net/assets/images/pages/login-v2.svg"
              className="w-full h-[80vh]"
              alt="Phone image"
            />
          </div>
          <div className="w-[1px] h-[70vh] bg-slate-600">&nbsp;</div>
          <div className="md:w-8/12 lg:ml-6 lg:w-5/12 pl-20 pr-40">
            <form onSubmit={handleSubmit}>
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
              <TextField
                label={
                  <span>
                    Password
                    <span className="!text-defaultRed">&nbsp;*</span>
                  </span>
                }
                fullWidth
                className="pt-1"
                value={password?.trim().length <= 0 ? "" : password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                onBlur={(e: any) => {
                  if (
                    e.target.value.trim().length < 6 ||
                    e.target.value.trim().length > 20
                  ) {
                    setPasswordError(true);
                  }
                }}
                error={passwordError}
                helperText={
                  passwordError && password.trim().length > 20
                    ? "Maximum 20 characters allowed."
                    : passwordError &&
                      password.trim().length > 0 &&
                      password.trim().length < 6
                    ? "Minimum 6 characters required."
                    : passwordError
                    ? "This is a required field."
                    : ""
                }
                margin="normal"
                variant="standard"
                autoComplete="off"
              />

              <div className="mb-6 flex items-center justify-between">
                <div></div>

                <Link
                  href="/forgot-password"
                  className="text-primary transition duration-150 ease-in-out hover:text-primary focus:text-primary active:text-primary dark:text-primary dark:hover:text-primary dark:focus:text-primary dark:active:text-primary"
                >
                  Forgot password?
                </Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center">
                  <CircularProgress />
                </div>
              ) : (
                <Button
                  variant="contained"
                  type="submit"
                  className="inline-block w-full rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  fullWidth
                >
                  Login
                </Button>
              )}

              <p className="mb-0 mt-2 pt-1 text-sm font-semibold">
                Don't have an account?&nbsp;
                <Link
                  href="/register"
                  className="text-defaultRed transition duration-150 ease-in-out hover:text-defaultRed"
                >
                  Register
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
