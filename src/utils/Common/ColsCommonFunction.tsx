export const generateCustomHeaderName = (headerName: string) => {
  return (
    <span className="capitalize" style={{ fontWeight: 800 }}>
      {headerName}
    </span>
  );
};

export const generateCommonBodyRender = (bodyValue: any) => {
  return (
    <div className="ml-2">
      {!bodyValue ||
      bodyValue === "0" ||
      bodyValue === null ||
      bodyValue === "null"
        ? "-"
        : bodyValue}
    </div>
  );
};

export const generateDateOnly = (bodyValue: any) => {
  return (
    <div className="ml-2">
      {!bodyValue ||
      bodyValue === "0" ||
      bodyValue === null ||
      bodyValue === "null"
        ? "-"
        : bodyValue.split("T")[0]}
    </div>
  );
};
