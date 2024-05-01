import { generateCommonBodyRender } from "../common/ColsCommonFunction";

export const settingUserColConfig = [
  {
    name: "id",
    label: "id",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "name",
    label: "Name",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "email",
    label: "Email",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "contactNo",
    label: "Phone",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "shopName",
    label: "Shop Name",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "shopAddress",
    label: "Shop Address",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "organizationName",
    label: "Organization Name",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "deletedAt",
    label: "Status",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "action",
    label: "Action",
    bodyRenderer: generateCommonBodyRender,
  },
];

export const settingStatusColConfig = [
  {
    name: "statusId",
    label: "Id",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "name",
    label: "Name",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "colorCode",
    label: "Color Code",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "action",
    label: "Action",
    bodyRenderer: generateCommonBodyRender,
  },
];

export const settingOrgColConfig = [
  {
    name: "orgId",
    label: "Id",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "name",
    label: "Name",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "deletedAt",
    label: "Status",
    bodyRenderer: generateCommonBodyRender,
  },
  {
    name: "action",
    label: "Action",
    bodyRenderer: generateCommonBodyRender,
  },
];
