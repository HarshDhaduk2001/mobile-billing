import { Button } from "@mui/material";
import React from "react";

export const ContainedButton = ({
  type,
  children,
  fullWidth,
  onClick,
  className,
}: {
  type?: "button" | "submit" | "reset" | undefined;
  children: React.ReactNode;
  fullWidth: boolean;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <Button
      variant="contained"
      type={type}
      className={`inline-block rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] ${className}`}
      fullWidth={fullWidth}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export const ErrorContainedButton = ({
  type,
  children,
  fullWidth,
  onClick,
  className,
}: {
  type?: "button" | "submit" | "reset" | undefined;
  children: React.ReactNode;
  fullWidth: boolean;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <Button
      variant="contained"
      type={type}
      className={`inline-block rounded bg-defaultRed px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-defaultRed hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-defaultRed focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] ${className}`}
      fullWidth={fullWidth}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export const OutlineButton = ({
    type,
    children,
    fullWidth,
    onClick,
    className,
  }: {
    type?: "button" | "submit" | "reset" | undefined;
    children: React.ReactNode;
    fullWidth: boolean;
    onClick?: () => void;
    className?: string;
  }) => {
    return (
      <Button
        variant="outlined"
        type={type}
        className={`inline-block rounded bg-white px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-primary border-primary shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] ${className}`}
        fullWidth={fullWidth}
        onClick={onClick}
      >
        {children}
      </Button>
    );
};

export const ErrorOutlineButton = ({
    type,
    children,
    fullWidth,
    onClick,
    className,
  }: {
    type?: "button" | "submit" | "reset" | undefined;
    children: React.ReactNode;
    fullWidth: boolean;
    onClick?: () => void;
    className?: string;
  }) => {
    return (
      <Button
        variant="outlined"
        type={type}
        className={`inline-block rounded bg-white px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-defaultRed border-defaultRed hover:border-defaultRed shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] ${className}`}
        fullWidth={fullWidth}
        onClick={onClick}
      >
        {children}
      </Button>
    );
};
