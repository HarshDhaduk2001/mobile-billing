import LineIcon from "@/assets/icons/common/LineIcon";
import SearchIcon from "@/assets/icons/common/SearchIcon";
import { Button, InputBase } from "@mui/material";
import React, { Fragment, useState } from "react";
import SettingUser from "./Tables/SettingUser";
import ExportIcon from "@/assets/icons/common/ExportIcon";
import LoadingIcon from "@/assets/icons/common/LoadingIcon";
import { toast } from "react-toastify";
import axios from "axios";
import { getCurrentTabDetails } from "@/utils/settings/Filters";
import SettingStatus from "./Tables/SettingStatus";
import SettingOrganization from "./Tables/SettingOrganization";
import { ColorToolTip } from "@/utils/common/CommonStyle";
import MainDrawer from "./Drawers/MainDrawer";
import DrawerOverlay from "../common/DrawerOverlay";
import { ContainedButton } from "../common/Button";
import SettingPermission from "./Tables/SettingPermission";

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

const MainSettings = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [canExport, setCanExport] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<any>(null);
  const [editId, setEditId] = useState<number>(0);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [dataFunction, setDataFunction] = useState<(() => void) | null>(null);

  const handleTabChange = (tabId: number) => {
    setActiveTab(tabId);
    setCanExport(false);
    setFilteredData(null);
    setSearchValue("");
    setSearch("");
  };

  const handleSearchChange = (e: string) => {
    setSearch(e);
    const timer = setTimeout(() => {
      setSearchValue(e.trim());
    }, 500);
    return () => clearTimeout(timer);
  };

  const handleCanExport = (arg1: boolean) => {
    setCanExport(arg1);
  };

  // Frontend function to handle export
  const handleExport = async () => {
    setIsExporting(true);
    const token = localStorage.getItem("Token");

    try {
      const filtered =
        filteredData === null
          ? getCurrentTabDetails(activeTab, true)
          : filteredData;

      const response = await axios.post(
        `${process.env.Base_URL}/auth/user/export`,
        {
          ...filtered,
          globalSearch: searchValue.trim().length > 0 ? searchValue : "",
          isDownload: true,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
          responseType: "arraybuffer",
        }
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${
          allTabs
            .map((i: Tabs) => (i.value === activeTab ? i.name : false))
            .filter((j: string | boolean) => j !== false)[0]
        }.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        toast.error("Failed to download, please try again later.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to download, please try again later.");
    }

    setIsExporting(false);
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
    setEditId(0);
  };

  const handleDataFetch = (getData: () => void) => {
    setDataFunction(() => getData);
  };

  const getEdidId = (id: number) => {
    setEditId(id);
    setOpenDrawer(true);
  };

  return (
    <>
      <div className="w-full py-2 pr-5 flex items-center justify-between">
        <div className="flex justify-between items-center h-full py-2">
          {allTabs.map((tab: Tabs, index: number) => (
            <Fragment key={tab.value}>
              <label
                className={`mx-4 cursor-pointer text-base ${
                  activeTab === tab.value
                    ? "text-primary font-semibold"
                    : "text-slatyGrey"
                }`}
                onClick={() => handleTabChange(tab.value)}
              >
                {tab.name}
              </label>
              {allTabs.length - 1 > index && <LineIcon />}
            </Fragment>
          ))}
        </div>

        <div className="h-full flex items-center gap-5">
          {activeTab === 1 && (
            <>
              <div className="relative">
                <InputBase
                  className="pl-1 pr-7 border-b border-b-lightSilver w-52"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                <span className="absolute top-2 right-2 text-slatyGrey">
                  <SearchIcon />
                </span>
              </div>
              <ColorToolTip title="Export" placement="top" arrow>
                <span
                  className={`${
                    isExporting ? "cursor-default" : "cursor-pointer"
                  } ${!canExport ? "opacity-50 pointer-events-none" : ""} `}
                  onClick={!canExport ? undefined : handleExport}
                >
                  {isExporting ? <LoadingIcon /> : <ExportIcon />}
                </span>
              </ColorToolTip>
            </>
          )}
          {activeTab === 3 && ("role"
          )}
          <ContainedButton
            type="button"
            onClick={handleDrawerOpen}
            fullWidth={false}
          >
            Create&nbsp;
            {
              allTabs
                .map((i: Tabs) => (i.value === activeTab ? i.name : false))
                .filter((j: string | boolean) => j !== false)[0]
            }
          </ContainedButton>
        </div>
      </div>

      <MainDrawer
        editId={editId}
        activeTab={activeTab}
        onOpen={openDrawer}
        onClose={handleDrawerClose}
        onDataFetch={dataFunction}
      />

      {/* Drawer Overlay */}
      <DrawerOverlay isOpen={openDrawer} />

      {activeTab === 1 && (
        <SettingUser
          searchValue={searchValue}
          filteredData={filteredData}
          onHandleExport={handleCanExport}
          onDataFetch={handleDataFetch}
          editId={getEdidId}
        />
      )}

      {activeTab === 2 && (
        <SettingStatus onDataFetch={handleDataFetch} editId={getEdidId} />
      )}

      {activeTab === 3 && (
        <SettingPermission onDataFetch={handleDataFetch} editId={getEdidId} />
      )}

      {activeTab === 4 && (
        <SettingOrganization onDataFetch={handleDataFetch} editId={getEdidId} />
      )}
    </>
  );
};

export default MainSettings;
