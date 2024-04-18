import { generateCustomHeaderName } from "./ColsCommonFunction";

export const generateCustomColumn = (
  name: any,
  label: string,
  bodyRenderer: (arg0: any) => any
) => ({
  name,
  options: {
    filter: true,
    sort: true,
    customHeadLabelRender: () => generateCustomHeaderName(label),
    customBodyRender: (value: any) => bodyRenderer(value),
  },
});
