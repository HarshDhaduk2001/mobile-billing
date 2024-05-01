import { ContainedButton, OutlineButton } from '@/components/common/Button';
import { callAPI } from '@/utils/common/ApiCall';
import { TextField } from '@mui/material';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { toast } from 'react-toastify';

export interface PermissionContentRef {
  clearData: () => void;
}

const SettingPermissionDrawer = forwardRef<
PermissionContentRef,
{
  editId: number;
  onClose: () => void;
  onChangeLoader: any;
  onDataFetch: any;
}
>(({ editId, onClose, onChangeLoader, onDataFetch }, ref) => {
    const [roleName, setRoleName] = useState("");
    const [roleNameError, setRoleNameError] = useState(false);
  
    const clearData = () => {
      setRoleName("");
      setRoleNameError(false);
      onClose();
    };
  
    useImperativeHandle(ref, () => ({
      clearData,
    }));
  
    const getRoleById = () => {
      const params = {};
      const url = `${process.env.Base_URL}/role/${editId}`;
      const successCallback = (
        ResponseData: {
          id: number;
          name: string;
          type: string;
          colorCode: string;
        },
        Message: string,
        error: boolean,
        ResponseRole: string
      ) => {
        if (ResponseRole === "success" && error === false) {
          setRoleName(ResponseData.name);
        } else {
        }
      };
      callAPI(url, params, successCallback, "GET");
    };
  
    useEffect(() => {
      editId > 0 && getRoleById();
    }, [editId]);
  
    const handleSubmit = (e: { preventDefault: () => void }) => {
      e.preventDefault();
      setRoleNameError(roleName.length < 3 || roleName.length > 50);
  
      if (
        roleName.length >= 3 &&
        roleName.length <= 50 &&
        !roleNameError
      ) {
        onChangeLoader(true);
        const params = {
          name: roleName,
        };
        const url =
          editId > 0
            ? `${process.env.Base_URL}/role/${editId}`
            : `${process.env.Base_URL}/role`;
        const successCallback = (
          ResponseData: string | null,
          Message: string,
          error: boolean,
          ResponseRole: string
        ) => {
          if (ResponseRole === "success" && error === false) {
            toast.success(Message || "Role created successfully.");
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
            label="Role Name"
            placeholder="admin"
            fullWidth
            value={roleName?.trim().length <= 0 ? "" : roleName}
            onChange={(e) => {
              setRoleName(e.target.value);
              setRoleNameError(false);
            }}
            onBlur={(e: any) => {
              if (
                e.target.value.trim().length < 3 ||
                e.target.value.trim().length > 50
              ) {
                setRoleNameError(true);
              }
            }}
            error={roleNameError}
            helperText={
              roleNameError &&
              roleName?.trim().length > 0 &&
              roleName?.trim().length < 3
                ? "Minimum 3 characters required."
                : roleNameError && roleName?.trim().length > 50
                ? "Maximum 50 characters allowed."
                : roleNameError
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
            {editId > 0 ? "Save" : "Create Role"}
          </ContainedButton>
        </div>
      </form>
    );
  });

export default SettingPermissionDrawer