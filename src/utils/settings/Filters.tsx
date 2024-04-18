export const user_InitialFilter = {
  pageNumber: 1,
  pageSize: 10,
  globalSearch: "",
};

export const status_InitialFilter = {};

export const org_InitialFilter = {};

export const getCurrentTabDetails = (activeTab: number, getBody?: boolean) => {
  if (activeTab === 1) {
    return getBody ? user_InitialFilter : "user";
  }
  if (activeTab === 2) {
    return getBody ? status_InitialFilter : "status";
  }
  if (activeTab === 3) {
    return getBody ? org_InitialFilter : "organization";
  }
};
