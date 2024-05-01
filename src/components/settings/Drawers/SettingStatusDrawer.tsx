import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { toast } from "react-toastify";
import { ContainedButton, OutlineButton } from "@/components/common/Button";
import { callAPI } from "@/utils/common/ApiCall";
import { TextField } from "@mui/material";
import { SketchPicker } from "react-color";

export interface StatusContentRef {
  clearData: () => void;
}

const SettingStatusDrawer = forwardRef<
  StatusContentRef,
  {
    editId: number;
    onClose: () => void;
    onChangeLoader: any;
    onDataFetch: any;
  }
>(({ editId, onClose, onChangeLoader, onDataFetch }, ref) => {
  const [statusName, setStatusName] = useState("");
  const [statusNameError, setStatusNameError] = useState(false);
  const [statusType, setStatusType] = useState("");
  const [statusTypeError, setStatusTypeError] = useState(false);
  const [colorCode, setColorCode] = useState("#000000");
  const [colorCodeError, setColorCodeError] = useState(false);

  const clearData = () => {
    setStatusName("");
    setStatusNameError(false);
    setStatusType("");
    setStatusTypeError(false);
    setColorCode("#000000");
    setColorCodeError(false);
    onClose();
  };

  useImperativeHandle(ref, () => ({
    clearData,
  }));

  const getStatusById = () => {
    const params = {};
    const url = `${process.env.Base_URL}/status/${editId}`;
    const successCallback = (
      ResponseData: {
        id: number;
        name: string;
        type: string;
        colorCode: string;
      },
      Message: string,
      error: boolean,
      ResponseStatus: string
    ) => {
      if (ResponseStatus === "success" && error === false) {
        setStatusName(ResponseData.name);
        setStatusType(ResponseData.type);
        setColorCode(ResponseData.colorCode);
      } else {
      }
    };
    callAPI(url, params, successCallback, "GET");
  };

  useEffect(() => {
    editId > 0 && getStatusById();
  }, [editId]);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setStatusNameError(statusName.length < 3 || statusName.length > 50);
    setStatusTypeError(statusType.length < 3 || statusType.length > 50);
    setColorCodeError(colorCode === "#000000");

    if (
      statusName.length >= 3 &&
      statusName.length <= 50 &&
      !statusNameError &&
      statusType.length >= 3 &&
      statusType.length <= 50 &&
      !statusTypeError &&
      colorCode !== "#000000" &&
      !colorCodeError
    ) {
      onChangeLoader(true);
      const params = {
        name: statusName,
        type: statusType,
        colorCode: colorCode,
      };
      const url =
        editId > 0
          ? `${process.env.Base_URL}/status/${editId}`
          : `${process.env.Base_URL}/status`;
      const successCallback = (
        ResponseData: string | null,
        Message: string,
        error: boolean,
        ResponseStatus: string
      ) => {
        if (ResponseStatus === "success" && error === false) {
          toast.success(Message || "Status created successfully.");
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
      <div className="flex flex-col p-[20px]">
        <TextField
          label="Status Name"
          placeholder="Status"
          fullWidth
          value={statusName?.trim().length <= 0 ? "" : statusName}
          onChange={(e) => {
            setStatusName(e.target.value);
            setStatusNameError(false);
          }}
          onBlur={(e: any) => {
            if (
              e.target.value.trim().length < 3 ||
              e.target.value.trim().length > 50
            ) {
              setStatusNameError(true);
            }
          }}
          error={statusNameError}
          helperText={
            statusNameError &&
            statusName?.trim().length > 0 &&
            statusName?.trim().length < 3
              ? "Minimum 3 characters required."
              : statusNameError && statusName?.trim().length > 50
              ? "Maximum 50 characters allowed."
              : statusNameError
              ? "This is a required field."
              : ""
          }
          margin="normal"
          variant="standard"
          sx={{ mx: 0.75 }}
        />

        <TextField
          label="Status Type"
          placeholder="status"
          fullWidth
          value={statusType?.trim().length <= 0 ? "" : statusType}
          disabled={editId > 0}
          onChange={(e) => {
            setStatusType(e.target.value.trim());
            setStatusTypeError(false);
          }}
          onBlur={(e: any) => {
            if (
              e.target.value.trim().length < 3 ||
              e.target.value.trim().length > 50
            ) {
              setStatusTypeError(true);
            }
          }}
          error={statusTypeError}
          helperText={
            statusTypeError &&
            statusType?.trim().length > 0 &&
            statusType?.trim().length < 3
              ? "Minimum 3 characters required."
              : statusTypeError && statusType?.trim().length > 50
              ? "Maximum 50 characters allowed."
              : statusTypeError
              ? "This is a required field."
              : ""
          }
          margin="normal"
          variant="standard"
          sx={{ mx: 0.75 }}
        />

        <SketchPicker
          color={colorCode}
          onChange={(newColor: { hex: React.SetStateAction<string> }) => {
            setColorCode(newColor.hex);
            setColorCodeError(false);
          }}
          width="40%"
          className="ml-4 mt-4"
        />
        {colorCodeError && (
          <span className="text-defaultRed text-[13px] font-extralight ml-4">
            This is a required field.
          </span>
        )}
      </div>

      <div className="flex justify-end fixed w-full bottom-0 gap-[20px] px-[20px] py-[15px] bg-pureWhite border-t border-lightSilver">
        <OutlineButton type="button" fullWidth={false} onClick={clearData}>
          Cancel
        </OutlineButton>
        <ContainedButton type="submit" fullWidth={false}>
          {editId > 0 ? "Save" : "Create Status"}
        </ContainedButton>
      </div>
    </form>
  );
});

export default SettingStatusDrawer;
