import { callAPI } from "@/utils/common/ApiCall";
import { PermissionList, SettingTableProps } from "@/utils/settings/types";
import React, { useEffect, useState } from "react";

const SettingPermission = ({ onDataFetch, editId }: SettingTableProps) => {
  const [loaded, setLoaded] = useState(false);
  const [permissionData, setPermissionData] = useState<PermissionList[]>([]);

  const getData = async () => {
    setLoaded(false);

    const params = { roleId: 1 };
    const url = `${process.env.Base_URL}/permission`;

    const successCallback = (
      ResponseData: PermissionList[],
      Message: string | null,
      error: boolean,
      ResponseStatus: string
    ) => {
      if (ResponseStatus === "success" && error === false) {
        setPermissionData(ResponseData);
        setLoaded(true);
      } else {
        setPermissionData([]);
        setLoaded(true);
      }
    };

    callAPI(url, params, successCallback, "post");
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

  return <div>SettingPermission</div>;
};

export default SettingPermission;
