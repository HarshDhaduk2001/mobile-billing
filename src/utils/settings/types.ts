export interface SettingProps {
  filteredData: any;
  searchValue: string;
  onHandleExport: (arg1: boolean) => void;
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

export interface OrgList {
  orgId: number;
  name: string;
  deletedAt: string | null;
}
