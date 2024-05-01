import { ContainedButton, OutlineButton } from "@/components/common/Button";
import { callAPI } from "@/utils/common/ApiCall";
import { LabelValue } from "@/utils/common/Types";
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { toast } from "react-toastify";

export interface UserContentRef {
  clearData: () => void;
}

const SettingUserDrawer = forwardRef<
  UserContentRef,
  {
    editId: number;
    onClose: () => void;
    onChangeLoader: any;
    onDataFetch: any;
  }
>(({ editId, onClose, onChangeLoader, onDataFetch }, ref) => {
  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [contactNo, setContactNo] = useState("");
  const [contactNoError, setContactNoError] = useState(false);
  const [orgId, setOrgId] = useState(0);
  const [orgIdError, setOrgIdError] = useState(false);
  const [shopName, setShopName] = useState("");
  const [shopNameError, setShopNameError] = useState(false);
  const [shopAddress, setShopAddress] = useState("");
  const [shopAddressError, setShopAddressError] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orgDropdownData, setOrgDropdownData] = useState<LabelValue[]>([]);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const clearData = () => {
    setFullName("");
    setFullNameError(false);
    setEmail("");
    setEmailError(false);
    setContactNo("");
    setContactNoError(false);
    setOrgId(0);
    setOrgIdError(false);
    setShopName("");
    setShopNameError(false);
    setShopAddress("");
    setShopAddressError(false);
    setIsAdmin(false);
    onClose();
  };

  useImperativeHandle(ref, () => ({
    clearData,
  }));

  const getUserById = () => {
    const params = {};
    const url = `${process.env.Base_URL}/auth/getUserById/${editId}`;
    const successCallback = (
      ResponseData: {
        id: number;
        orgId: number;
        name: string;
        email: string;
        contactNo: string;
        shopName: string;
        shopAddress: string;
        userType: number;
      },
      Message: string,
      error: boolean,
      ResponseStatus: string
    ) => {
      if (ResponseStatus === "success" && error === false) {
        setFullName(ResponseData.name);
        setEmail(ResponseData.email);
        setContactNo(ResponseData.contactNo);
        setOrgId(ResponseData.orgId);
        setShopName(ResponseData.shopName);
        setShopAddress(ResponseData.shopAddress);
        setIsAdmin(ResponseData.userType === 2 ? true : false);
      } else {
      }
    };
    callAPI(url, params, successCallback, "GET");
  };

  useEffect(() => {
    editId > 0 && getUserById();
  }, [editId]);

  const getOrganizationList = () => {
    const params = {};
    const url = `${process.env.Base_URL}/organization/organizationlist`;
    const successCallback = (
      ResponseData: LabelValue[],
      Message: string,
      error: boolean,
      ResponseStatus: string
    ) => {
      if (ResponseStatus === "success" && error === false) {
        setOrgDropdownData(ResponseData);
      } else {
      }
    };
    callAPI(url, params, successCallback, "GET");
  };

  useEffect(() => {
    orgDropdownData.length <= 0 && getOrganizationList();
  }, []);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setFullNameError(fullName.length < 3 || fullName.length > 50);
    setEmailError(
      email.length < 3 || email.length > 50 || !emailRegex.test(email)
    );
    setContactNoError(contactNo.length < 10 || contactNo.length > 10);
    setOrgIdError(orgId <= 0);
    setShopNameError(shopName.length < 3 || shopName.length > 50);
    setShopAddressError(shopAddress.length < 3 || shopAddress.length > 250);

    if (
      fullName.length >= 3 &&
      fullName.length <= 50 &&
      !fullNameError &&
      email.length >= 3 &&
      email.length <= 50 &&
      emailRegex.test(email) &&
      !emailError &&
      contactNo.length >= 3 &&
      contactNo.length <= 50 &&
      !contactNoError &&
      shopName.length >= 3 &&
      shopName.length <= 50 &&
      !shopNameError &&
      shopAddress.length >= 3 &&
      shopAddress.length <= 50 &&
      !shopAddressError
    ) {
      onChangeLoader(true);
      const params = {
        name: fullName,
        email: email,
        contactNo: contactNo,
        orgId: orgId,
        shopName: shopName,
        shopAddress: shopAddress,
        userType: isAdmin === true ? 2 : 3,
      };
      const url =
        editId > 0
          ? `${process.env.Base_URL}/auth/updateUser/${editId}`
          : `${process.env.Base_URL}/auth/createUser`;
      const successCallback = (
        ResponseData: string | null,
        Message: string,
        error: boolean,
        ResponseStatus: string
      ) => {
        if (ResponseStatus === "success" && error === false) {
          toast.success(Message || "User created successfully.");
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
          label="Full Name"
          fullWidth
          value={fullName?.trim().length <= 0 ? "" : fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            setFullNameError(false);
          }}
          onBlur={(e: any) => {
            if (
              e.target.value.trim().length < 3 ||
              e.target.value.trim().length > 50
            ) {
              setFullNameError(true);
            }
          }}
          error={fullNameError}
          helperText={
            fullNameError &&
            fullName?.trim().length > 0 &&
            fullName?.trim().length < 3
              ? "Minimum 3 characters required."
              : fullNameError && fullName?.trim().length > 50
              ? "Maximum 50 characters allowed."
              : fullNameError
              ? "This is a required field."
              : ""
          }
          margin="normal"
          variant="standard"
          sx={{ mx: 0.75 }}
        />

        <TextField
          label="Email"
          fullWidth
          value={email?.trim().length <= 0 ? "" : email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(false);
          }}
          onBlur={(e: any) => {
            if (
              e.target.value.trim().length < 3 ||
              e.target.value.trim().length > 50 ||
              !emailRegex.test(e.target.value.trim())
            ) {
              setEmailError(true);
            }
          }}
          error={emailError}
          helperText={
            emailError && email?.trim().length > 0 && !emailRegex.test(email)
              ? "Please provide correct email."
              : emailError &&
                email?.trim().length > 0 &&
                email?.trim().length < 3
              ? "Minimum 3 characters required."
              : emailError && email?.trim().length > 50
              ? "Maximum 50 characters allowed."
              : emailError
              ? "This is a required field."
              : ""
          }
          margin="normal"
          variant="standard"
          sx={{ mx: 0.75 }}
        />

        <TextField
          label="Contact Number"
          type="number"
          fullWidth
          value={contactNo?.trim().length <= 0 ? "" : contactNo}
          onChange={(e) => {
            setContactNo(e.target.value);
            setContactNoError(false);
          }}
          onBlur={(e: any) => {
            if (
              e.target.value.trim().length < 10 ||
              e.target.value.trim().length > 10
            ) {
              setContactNoError(true);
            }
          }}
          error={contactNoError}
          helperText={
            contactNoError && contactNo?.trim().length > 10
              ? "Please provide correct contact number."
              : contactNoError &&
                contactNo?.trim().length > 0 &&
                contactNo?.trim().length < 10
              ? "Please provide correct contact number."
              : contactNoError
              ? "This is a required field."
              : ""
          }
          margin="normal"
          variant="standard"
          sx={{ mx: 0.75 }}
        />

        <Autocomplete
          id="combo-box-demo"
          options={orgDropdownData}
          value={orgDropdownData.find((i: any) => i.value === orgId) || null}
          onChange={(e, value: any) => {
            value && setOrgId(value.value);
          }}
          sx={{ mx: 0.75, mt: 2 }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={
                <span>
                  Organization
                  <span className="text-defaultRed">&nbsp;*</span>
                </span>
              }
              error={orgIdError}
              onBlur={(e) => {
                if (orgId > 0) {
                  setOrgIdError(false);
                }
              }}
              helperText={orgIdError ? "This is a required field." : ""}
            />
          )}
        />

        <TextField
          label="Shop Name"
          fullWidth
          value={shopName?.trim().length <= 0 ? "" : shopName}
          onChange={(e) => {
            setShopName(e.target.value);
            setShopNameError(false);
          }}
          onBlur={(e: any) => {
            if (
              e.target.value.trim().length < 3 ||
              e.target.value.trim().length > 50
            ) {
              setShopNameError(true);
            }
          }}
          error={shopNameError}
          helperText={
            shopNameError &&
            shopName?.trim().length > 0 &&
            shopName?.trim().length < 3
              ? "Minimum 3 characters required."
              : shopNameError && shopName?.trim().length > 50
              ? "Maximum 50 characters allowed."
              : shopNameError
              ? "This is a required field."
              : ""
          }
          margin="normal"
          variant="standard"
          sx={{ mx: 0.75 }}
        />

        <TextField
          label="Shop Address"
          fullWidth
          value={shopAddress?.trim().length <= 0 ? "" : shopAddress}
          onChange={(e) => {
            setShopAddress(e.target.value);
            setShopAddressError(false);
          }}
          onBlur={(e: any) => {
            if (
              e.target.value.trim().length < 3 ||
              e.target.value.trim().length > 50
            ) {
              setShopAddressError(true);
            }
          }}
          error={shopAddressError}
          helperText={
            shopAddressError &&
            shopAddress?.trim().length > 0 &&
            shopAddress?.trim().length < 3
              ? "Minimum 3 characters required."
              : shopAddressError && shopAddress?.trim().length > 250
              ? "Maximum 250 characters allowed."
              : shopAddressError
              ? "This is a required field."
              : ""
          }
          margin="normal"
          variant="standard"
          sx={{ mx: 0.75 }}
        />

        <div className="flex items-center">
          {isAdmin ? (
            <Switch
              defaultChecked={false}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
          ) : (
            <Switch
              defaultChecked={true}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
          )}
          <span>IsAdmin</span>
        </div>
      </div>

      <div className="flex justify-end fixed w-full bottom-0 gap-[20px] px-[20px] py-[15px] bg-pureWhite border-t border-lightSilver">
        <OutlineButton type="button" fullWidth={false} onClick={clearData}>
          Cancel
        </OutlineButton>
        <ContainedButton type="submit" fullWidth={false}>
          {editId > 0 ? "Save" : "Create User"}
        </ContainedButton>
      </div>
    </form>
  );
});

export default SettingUserDrawer;
