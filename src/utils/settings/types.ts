export interface SettingProps {
  filteredData: any;
  searchValue: string;
  onHandleExport: (arg1: boolean) => void;
  onDataFetch: (getData: () => void) => void;
  editId: (id: number) => void;
}

export interface FieldsType {
  loaded: boolean;
  data: any[];
  dataCount: number;
}

export interface StatusList {
  statusId: number;
  name: string;
  type: string;
  colorCode: string;
  deletedAt: string | null;
}

export interface ActionList {
  isChecked: number;
  actionName: string;
  permissionActionId: number;
  permissionActionMappingId: number;
}

export interface PermissionList {
  permissionId: number;
  name: string;
  parentId: number | null;
  ActionList: ActionList[];
  children: PermissionList[];
}

export interface OrgList {
  orgId: number;
  name: string;
  deletedAt: string | null;
}

export interface SettingTableProps {
  onDataFetch: (getData: () => void) => void;
  editId: (id: number) => void;
}
