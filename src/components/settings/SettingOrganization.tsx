import { callAPI } from "@/utils/Common/ApiCall";
import { generateCustomHeaderName } from "@/utils/Common/ColsCommonFunction";
import { generateCustomColumn } from "@/utils/Common/ColsGenerateFunctions";
import { getMuiTheme } from "@/utils/Common/CommonStyle";
import SwitchModal from "@/utils/Common/SwitchModal";
import { settingOrgColConfig } from "@/utils/settings/DatatableColumns";
import { options } from "@/utils/settings/TableOption";
import { FieldsType, OrgList } from "@/utils/settings/types";
import { CircularProgress, Switch, ThemeProvider } from "@mui/material";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SettingOrganization = () => {
  const [orgFields, setOrgFields] = useState<FieldsType>({
    loaded: false,
    data: [],
    dataCount: 0,
  });
  const [isOpenSwitchModal, setIsOpenSwitchModal] = useState(false);
  const [switchId, setSwitchId] = useState(0);
  const [switchActive, setSwitchActive] = useState(false);

  const closeSwitchModal = async () => {
    await setIsOpenSwitchModal(false);
  };

  const handleToggleOrganization = async () => {
    const params = {};
    const url = `${process.env.Base_URL}/organization/toggle/${switchId}`;
    const successCallback = (
      ResponseData: null,
      Message: string | null,
      error: boolean,
      ResponseStatus: string
    ) => {
      if (ResponseStatus === "success" && error === false) {
        toast.success(Message || "Status Updated Successfully.");
        setIsOpenSwitchModal(false);
        setSwitchId(0);
        getData();
      } else {
        setIsOpenSwitchModal(false);
        setSwitchId(0);
        getData();
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  const getData = async () => {
    setOrgFields({
      ...orgFields,
      loaded: false,
    });

    const params = {};
    const url = `${process.env.Base_URL}/organization`;

    const successCallback = (
      ResponseData: OrgList[],
      Message: string | null,
      error: boolean,
      ResponseStatus: string
    ) => {
      if (ResponseStatus === "success" && error === false) {
        setOrgFields({
          ...orgFields,
          loaded: true,
          data: ResponseData,
        });
      } else {
        setOrgFields({
          ...orgFields,
          data: [],
          dataCount: 0,
          loaded: true,
        });
      }
    };

    callAPI(url, params, successCallback, "get");
  };

  useEffect(() => {
    getData();
  }, []);

  const generateConditionalColumn = (column: {
    name: string;
    label: string;
    bodyRenderer: (arg0: any) => any;
  }) => {
    if (column.name === "deletedAt") {
      return {
        name: "deletedAt",
        options: {
          filter: true,
          sort: true,
          customHeadLabelRender: () => generateCustomHeaderName("Status"),
          customBodyRender: (value: string | null, tableMeta: any) => {
            const activeUser = async () => {
              await setIsOpenSwitchModal(true);
              await setSwitchId(tableMeta.rowData[0]);
              await setSwitchActive(value === null ? false : true);
            };
            return (
              <div>
                <Switch
                  defaultChecked={value === null}
                  onChange={() => activeUser()}
                />
              </div>
            );
          },
        },
      };
    } else {
      return generateCustomColumn(
        column.name,
        column.label,
        column.bodyRenderer
      );
    }
  };

  const orgColumns = settingOrgColConfig.map((col: any) => {
    return generateConditionalColumn(col);
  });
  return (
    <>
      {orgFields.loaded ? (
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            columns={orgColumns}
            data={orgFields.data}
            title={undefined}
            options={options}
          />
        </ThemeProvider>
      ) : (
        <div className="flex items-center justify-center h-full">
          <CircularProgress />
        </div>
      )}

      {isOpenSwitchModal && (
        <SwitchModal
          isOpen={isOpenSwitchModal}
          onClose={closeSwitchModal}
          title={`${
            switchActive === true ? "Active" : "InActive"
          } Organization`}
          onActionClick={handleToggleOrganization}
          firstContent={`Are you sure you want to ${
            switchActive === true ? "Active" : "InActive"
          } Organization?`}
        />
      )}
    </>
  );
};

export default SettingOrganization;
