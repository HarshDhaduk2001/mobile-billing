export interface UserFilteredData {
  pageNumber: number;
  pageSize: number;
  globalSearch: string;
}

export interface UserList {
  id: number;
  name: string;
  email: string;
  contactNo: string;
  shopName: string;
  shopAddress: string;
  deletedAt: string | null;
  organizationName: string;
  orgId: number;
}

export interface UserResponse {
  List: UserList[];
  TotalCount: number;
}
