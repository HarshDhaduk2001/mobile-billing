"use client";
import { Button, TextField } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";

const page = () => {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [cPassword, setCPassword] = useState("");
  const [cPasswordError, setCPasswordError] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setPasswordError(password.trim().length < 6 || password.trim().length > 20);
    setCPasswordError(
      password.trim().length < 6 ||
        password.trim().length > 20 ||
        password.trim() !== cPassword.trim()
    );

    if (
      password.trim().length >= 6 &&
      password.trim().length <= 20 &&
      !passwordError &&
      cPassword.trim().length >= 6 &&
      cPassword.trim().length <= 20 &&
      !cPasswordError &&
      password.trim() === cPassword.trim()
    ) {
      console.log(password, cPassword);
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
            <form onSubmit={handleSubmit}>
              <p className="mb-0 mt-2 pt-1 text-lg font-semibold">Please set a password for your account
              </p>
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
              <TextField
                label={
                  <span>
                    Confirm Password
                    <span className="!text-defaultRed">&nbsp;*</span>
                  </span>
                }
                fullWidth
                className="pt-1"
                value={cPassword?.trim().length <= 0 ? "" : cPassword}
                onChange={(e) => {
                  setCPassword(e.target.value);
                  setCPasswordError(false);
                }}
                onBlur={(e: any) => {
                  if (
                    e.target.value.trim().length < 6 ||
                    e.target.value.trim().length > 20
                  ) {
                    setCPasswordError(true);
                  }
                }}
                error={cPasswordError}
                helperText={
                  cPasswordError && cPassword.trim() !== password.trim()
                    ? "Password and Confirm Password doesn't match."
                    : cPasswordError && cPassword.trim().length > 20
                    ? "Maximum 20 characters allowed."
                    : cPasswordError &&
                      cPassword.trim().length > 0 &&
                      cPassword.trim().length < 6
                    ? "Minimum 6 characters required."
                    : passwordError
                    ? "This is a required field."
                    : ""
                }
                margin="normal"
                variant="standard"
                autoComplete="off"
              />

              <Button
                variant="contained"
                type="submit"
                className="inline-block w-full mt-6 rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                fullWidth
              >
                Continue
              </Button>

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
