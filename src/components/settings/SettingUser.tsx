import { callAPI } from "@/utils/Common/ApiCall";
import { FieldsType, SettingProps } from "@/utils/settings/types";
import { UserFilteredData, UserResponse } from "@/utils/settings/userTypes";
import React, { useEffect, useState } from "react";
import { user_InitialFilter } from "@/utils/settings/Filters";
import { ThemeProvider } from "@mui/material";
import { CircularProgress, Switch, TablePagination } from "@mui/material";
import { getMuiTheme } from "@/utils/Common/CommonStyle";
import { options } from "@/utils/settings/TableOption";
import { settingUserColConfig } from "@/utils/settings/DatatableColumns";
import { generateCustomHeaderName } from "@/utils/Common/ColsCommonFunction";
import { generateCustomColumn } from "@/utils/Common/ColsGenerateFunctions";
import { toast } from "react-toastify";
import SwitchModal from "@/utils/Common/SwitchModal";
import MUIDataTable from "mui-datatables";

const SettingUser = ({
  searchValue,
  filteredData,
  onHandleExport,
}: SettingProps) => {
  const [userFields, setUserFields] = useState<FieldsType>({
    loaded: false,
    data: [],
    dataCount: 0,
  });
  const [userCurrentPage, setUserCurrentPage] = useState<number>(0);
  const [userRowsPerPage, setUserRowsPerPage] = useState<number>(10);
  const [isOpenSwitchModal, setIsOpenSwitchModal] = useState(false);
  const [switchId, setSwitchId] = useState(0);
  const [switchActive, setSwitchActive] = useState(false);

  const closeSwitchModal = async () => {
    await setIsOpenSwitchModal(false);
  };

  const handleToggleUser = async () => {
    const params = {};
    const url = `${process.env.Base_URL}/auth/toggle/${switchId}`;
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
        getData({
          ...user_InitialFilter,
          ...filteredData,
          globalSearch: searchValue,
        });
      } else {
        setIsOpenSwitchModal(false);
        setSwitchId(0);
        getData({
          ...user_InitialFilter,
          ...filteredData,
          globalSearch: searchValue,
        });
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  const getData = async (arg1: UserFilteredData) => {
    setUserFields({
      ...userFields,
      loaded: false,
    });

    const url = `${process.env.Base_URL}/auth`;

    const successCallback = (
      ResponseData: UserResponse,
      Message: string | null,
      error: boolean,
      ResponseStatus: string
    ) => {
      if (ResponseStatus === "success" && error === false) {
        onHandleExport(ResponseData.List.length > 0);
        setUserFields({
          ...userFields,
          loaded: true,
          data: ResponseData.List,
          dataCount: ResponseData.TotalCount,
        });
      } else {
        setUserFields({ ...userFields, data: [], dataCount: 0, loaded: true });
      }
    };

    callAPI(url, arg1, successCallback, "post");
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setUserCurrentPage(newPage);
    if (filteredData !== null) {
      getData({
        ...filteredData,
        globalSearch: searchValue,
        pageNumber: newPage + 1,
        pageSize: userRowsPerPage,
      });
    } else {
      getData({
        ...user_InitialFilter,
        globalSearch: searchValue,
        pageNumber: newPage + 1,
        pageSize: userRowsPerPage,
      });
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUserCurrentPage(0);
    setUserRowsPerPage(parseInt(event.target.value));

    if (filteredData !== null) {
      getData({
        ...filteredData,
        globalSearch: searchValue,
        pageNumber: 1,
        pageSize: Number(event.target.value),
      });
    } else {
      getData({
        ...user_InitialFilter,
        globalSearch: searchValue,
        pageNumber: 1,
        pageSize: Number(event.target.value),
      });
    }
  };

  useEffect(() => {
    if (filteredData !== null) {
      const timer = setTimeout(() => {
        getData({ ...filteredData, globalSearch: searchValue });
        setUserCurrentPage(0);
        setUserRowsPerPage(10);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        getData({ ...user_InitialFilter, globalSearch: searchValue });
        setUserCurrentPage(0);
        setUserRowsPerPage(10);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [filteredData, searchValue]);

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
              console.log(
                tableMeta.rowData[tableMeta.rowData.length - 1],
                value === null ? false : true
              );
              await setIsOpenSwitchModal(true);
              await setSwitchId(
                tableMeta.rowData[tableMeta.rowData.length - 1]
              );
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
    } else if (column.name === "id") {
      return {
        name: "id",
        options: {
          display: false,
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

  const userCols = settingUserColConfig.map((col: any) =>
    generateConditionalColumn(col)
  );

  return (
    <>
      {userFields.loaded ? (
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            columns={userCols}
            data={userFields.data}
            title={undefined}
            options={options}
          />
          <TablePagination
            component="div"
            count={userFields.dataCount}
            page={userCurrentPage}
            onPageChange={handleChangePage}
            rowsPerPage={userRowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
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
          title={`${switchActive === true ? "Active" : "InActive"} User`}
          onActionClick={handleToggleUser}
          firstContent={`Are you sure you want to ${
            switchActive === true ? "Active" : "InActive"
          } User?`}
        />
      )}
    </>
  );
};

export default SettingUser;
