import { getMuiTheme } from "@/utils/common/CommonStyle";
import { callAPI } from "@/utils/common/ApiCall";
import { generateCustomHeaderName } from "@/utils/common/ColsCommonFunction";
import { generateCustomColumn } from "@/utils/common/ColsGenerateFunctions";
import { settingStatusColConfig } from "@/utils/settings/DatatableColumns";
import { options } from "@/utils/settings/TableOption";
import { FieldsType, SettingTableProps, StatusList } from "@/utils/settings/types";
import { ThemeProvider } from "@mui/material";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import OverLay from "@/components/common/OverLay";
import { Edit } from "@mui/icons-material";

const SettingStatus = ({ onDataFetch, editId }: SettingTableProps) => {
  const [statusFields, setStatusFields] = useState<FieldsType>({
    loaded: false,
    data: [],
    dataCount: 0,
  });

  const getData = async () => {
    setStatusFields({
      ...statusFields,
      loaded: false,
    });

    const params = {};
    const url = `${process.env.Base_URL}/status`;

    const successCallback = (
      ResponseData: StatusList[],
      Message: string | null,
      error: boolean,
      ResponseStatus: string
    ) => {
      if (ResponseStatus === "success" && error === false) {
        setStatusFields({
          ...statusFields,
          loaded: true,
          data: ResponseData,
        });
      } else {
        setStatusFields({
          ...statusFields,
          data: [],
          dataCount: 0,
          loaded: true,
        });
      }
    };

    callAPI(url, params, successCallback, "get");
  };

  useEffect(() => {
    const fetchData = async () => {
      await getData();
      onDataFetch(() => fetchData());
    };
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const generateConditionalColumn = (column: {
    name: string;
    label: string;
    bodyRenderer: (arg0: any) => any;
  }) => {
    if (column.name === "colorCode") {
      return {
        name: "colorCode",
        options: {
          filter: true,
          viewColumns: false,
          sort: false,
          customHeadLabelRender: () => generateCustomHeaderName("Color Code"),
          customBodyRender: (value: string) => {
            return (
              <div
                style={{
                  backgroundColor: value,
                  width: "30px",
                  height: "30px",
                  border: `2px solid ${value}`,
                  borderRadius: "5px",
                  //   margin: "10px 10px 10px 10px",
                }}
              ></div>
            );
          },
        },
      };
    } else if (column.name === "action") {
      return {
        name: "action",
        options: {
          filter: true,
          sort: true,
          customHeadLabelRender: () => generateCustomHeaderName("Action"),
          customBodyRender: (value: number | null, tableMeta: any) => {
            return (
              <div
                onClick={() => editId(tableMeta.rowData[0])}
                className="cursor-pointer"
              >
                <Edit />
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

  const statusColumns = settingStatusColConfig.map((col: any) => {
    return generateConditionalColumn(col);
  });

  return (
    <>
      {statusFields.loaded ? (
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            columns={statusColumns}
            data={statusFields.data}
            title={undefined}
            options={{ ...options, tableBodyHeight: "80vh" }}
          />
        </ThemeProvider>
      ) : (
        <OverLay />
      )}
    </>
  );
};

export default SettingStatus;
