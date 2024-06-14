import { baseUrl } from "../Pages/Api";

// export const BackURL = `https://disploystage.disploy.com/api/`
// export const BackURL = `https://back.disploy.com/api/`

export const ADD_USER_TYPE_MASTER =
  `${baseUrl}UserMaster/AddUserTypeMaster`;
export const GET_ALL_USER_TYPE_MASTER =
  `${baseUrl}UserMaster/GetAllUserTypeMaster`;
export const GET_ALL_ORGANIZATION_MASTER =
  `${baseUrl}UserMaster/GetAllOrganizationMaster`;
export const ADD_ORGANIZATION_MASTER =
  `${baseUrl}UserMaster/AddOrganizationMaster`;
export const GET_ALL_ORGANIZATION_SIGNUPS =
  `${baseUrl}UserMaster/GetAllOrganizationSignups`;
export const SELECT_BY_ORGANIZATION_SIGNUPS_ID =
  `${baseUrl}UserMaster/SelectByOrganizationSignupsID`;
export const ADD_USER_MASTER =
  `${baseUrl}UserMaster/AddUserMaster`;
export const GET_ALL_USER_MASTER =
  `${baseUrl}UserMaster/GetAllUserMaster`;
export const GET_ALL_STORAGE =
  `${baseUrl}Storage/GetAllStorage`;
export const INCREASE_STORAGE =
  `${baseUrl}Storage/IncreaseStorage`;

  export const CUSTOMER_DETAILS_ALL =
  `${baseUrl}Common/GetAllOrganizationDetails`;