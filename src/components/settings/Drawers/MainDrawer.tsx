import { Close } from "@mui/icons-material";
import React, { useRef, useState } from "react";
import SettingUserDrawer, { UserContentRef } from "./SettingUserDrawer";
import OverLay from "@/components/common/OverLay";
import SettingStatusDrawer, { StatusContentRef } from "./SettingStatusDrawer";
import SettingOrgDrawer, { OrganizationContentRef } from "./SettingOrgDrawer";
import SettingPermissionDrawer, { PermissionContentRef } from "./SettingPermissionDrawer";

interface Tabs {
  label: string;
  value: number;
  name: string;
}

const allTabs = [
  { label: "user", value: 1, name: "User" },
  { label: "status", value: 2, name: "Status" },
  { label: "permission", value: 3, name: "Permission" },
  { label: "organization", value: 4, name: "Organization" },
];

const MainDrawer = ({ editId, activeTab, onOpen, onClose, onDataFetch }: any) => {
  const [drawerOverlay, setDrawerOverlay] = useState(false);
  const childRefUser = useRef<UserContentRef>(null);
  const childRefStatus = useRef<StatusContentRef>(null);
  const childRefPermission = useRef<PermissionContentRef>(null);
  const childRefOrg = useRef<OrganizationContentRef>(null);

  const handleClose = () => {
    onClose();

    if (childRefUser.current) {
      childRefUser.current.clearData();
    }
    if (childRefStatus.current) {
      childRefStatus.current.clearData();
    }
    if (childRefPermission.current) {
      childRefPermission.current.clearData();
    }
    if (childRefOrg.current) {
      childRefOrg.current.clearData();
    }
  };

  return (
    <>
      <div
        className={`fixed right-0 top-0 z-30 h-screen overflow-y-auto w-[40%] border border-lightSilver bg-pureWhite transform  ${
          onOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex p-[20px] justify-between items-center bg-whiteSmoke border-b border-lightSilver">
          <span className="text-pureBlack text-lg font-medium">
            {editId > 0 ? "Edit" : "Create"}&nbsp;
            {
              allTabs
                .map((i: Tabs) => (i.value === activeTab ? i.name : false))
                .filter((j: string | boolean) => j !== false)[0]
            }
          </span>
          <span onClick={handleClose} className="cursor-pointer">
            <Close />
          </span>
        </div>

        {activeTab === 1 && (
          <SettingUserDrawer
            editId={editId}
            onClose={onClose}
            onChangeLoader={(e: boolean) => setDrawerOverlay(e)}
            ref={childRefUser}
            onDataFetch={onDataFetch}
          />
        )}

        {activeTab === 2 && (
          <SettingStatusDrawer
            editId={editId}
            onClose={onClose}
            onChangeLoader={(e: boolean) => setDrawerOverlay(e)}
            ref={childRefStatus}
            onDataFetch={onDataFetch}
          />
        )}

        {activeTab === 3 && (
          <SettingPermissionDrawer
            editId={editId}
            onClose={onClose}
            onChangeLoader={(e: boolean) => setDrawerOverlay(e)}
            ref={childRefOrg}
            onDataFetch={onDataFetch}
          />
        )}

        {activeTab === 4 && (
          <SettingOrgDrawer
            editId={editId}
            onClose={onClose}
            onChangeLoader={(e: boolean) => setDrawerOverlay(e)}
            ref={childRefOrg}
            onDataFetch={onDataFetch}
          />
        )}
      </div>

      {drawerOverlay && <OverLay />}
    </>
  );
};

export default MainDrawer;
