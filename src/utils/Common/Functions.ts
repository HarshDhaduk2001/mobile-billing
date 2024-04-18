import { toast } from "react-toastify";
import { callAPI } from "./ApiCall";

export const hasToken = (router: any) => {
  const token = localStorage.getItem("Token");
  if (token) {
    router.push("/");
  }
};

export const hasNoToken = (router: any) => {
  const token = localStorage.getItem("Token");
  if (!token) {
    router.push("/login");
  }
};

export const handleLogoutUtil = async () => {
  const params = {};
  const url = `${process.env.api_url}/auth/logout`;
  const successCallback = (
    ResponseData: any,
    Message: string | null,
    error: any,
    ResponseStatus: any
  ) => {
    if (ResponseStatus === "success" && error === false) {
      localStorage.clear();
    } else {
      toast.error("Something went wrong.");
    }
  };
  // callAPI(url, params, successCallback, "GET");
  localStorage.clear();
};
