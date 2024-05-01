import { ContainedButton, OutlineButton } from "@/components/common/Button";
import { callAPI } from "@/utils/common/ApiCall";
import { TextField } from "@mui/material";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { toast } from "react-toastify";

export interface OrganizationContentRef {
  clearData: () => void;
}

const SettingOrgDrawer = forwardRef<
  OrganizationContentRef,
  {
    editId: number;
    onClose: () => void;
    onChangeLoader: any;
    onDataFetch: any;
  }
>(({ editId, onClose, onChangeLoader, onDataFetch }, ref) => {
  const [orgName, setOrgName] = useState("");
  const [orgNameError, setOrgNameError] = useState(false);

  const clearData = () => {
    setOrgName("");
    setOrgNameError(false);
    onClose();
  };

  useImperativeHandle(ref, () => ({
    clearData,
  }));

  const getOrganizationById = () => {
    const params = {};
    const url = `${process.env.Base_URL}/organization/${editId}`;
    const successCallback = (
      ResponseData: { id: number; name: string },
      Message: string,
      error: boolean,
      ResponseStatus: string
    ) => {
      if (ResponseStatus === "success" && error === false) {
        setOrgName(ResponseData.name);
      } else {
      }
    };
    callAPI(url, params, successCallback, "GET");
  };

  useEffect(() => {
    editId > 0 && getOrganizationById();
  }, [editId]);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setOrgNameError(orgName.length < 3 || orgName.length > 50);

    if (orgName.length >= 3 && orgName.length <= 50 && !orgNameError) {
      onChangeLoader(true);
      const params = { name: orgName };
      const url =
        editId > 0
          ? `${process.env.Base_URL}/organization/${editId}`
          : `${process.env.Base_URL}/organization`;
      const successCallback = (
        ResponseData: string | null,
        Message: string,
        error: boolean,
        ResponseStatus: string
      ) => {
        if (ResponseStatus === "success" && error === false) {
          toast.success(Message || "Organization created successfully.");
          onChangeLoader(false);
          clearData();
          onDataFetch();
        } else {
          onChangeLoader(false);
          clearData();
        }
      };
      callAPI(url, params, successCallback, "POST");
    } else {
      onChangeLoader(false);
    }
  };

  return (
    <form className="max-h-[78vh] overflow-y-auto" onSubmit={handleSubmit}>
      <div className="flex gap-[20px] flex-col p-[20px]">
        <TextField
          label="Organization Name"
          placeholder="Organization"
          fullWidth
          value={orgName?.trim().length <= 0 ? "" : orgName}
          onChange={(e) => {
            setOrgName(e.target.value);
            setOrgNameError(false);
          }}
          onBlur={(e: any) => {
            if (
              e.target.value.trim().length < 3 ||
              e.target.value.trim().length > 50
            ) {
              setOrgNameError(true);
            }
          }}
          error={orgNameError}
          helperText={
            orgNameError &&
            orgName?.trim().length > 0 &&
            orgName?.trim().length < 3
              ? "Minimum 3 characters required."
              : orgNameError && orgName?.trim().length > 50
              ? "Maximum 50 characters allowed."
              : orgNameError
              ? "This is a required field."
              : ""
          }
          margin="normal"
          variant="standard"
          sx={{ mx: 0.75 }}
        />
      </div>

      <div className="flex justify-end fixed w-full bottom-0 gap-[20px] px-[20px] py-[15px] bg-pureWhite border-t border-lightSilver">
        <OutlineButton type="button" fullWidth={false} onClick={clearData}>
          Cancel
        </OutlineButton>
        <ContainedButton type="submit" fullWidth={false}>
          {editId > 0 ? "Save" : "Create Organization"}
        </ContainedButton>
      </div>
    </form>
  );
});

export default SettingOrgDrawer;
