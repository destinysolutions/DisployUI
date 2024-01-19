import axios from "axios";

export const baseUrl = "https://disployapi.thedestinysolutions.com/";

export const postUrl = axios.create({
  baseURL: "https://disployapi.thedestinysolutions.com/api/",
  method: "post",
});

export const deleteUrl = axios.create({
  baseURL: "https://disployapi.thedestinysolutions.com/api/",
  method: "delete",
});

export const getUrl = axios.create({
  baseURL: "https://disployapi.thedestinysolutions.com/api/",
  method: "get",
});

export const LOGIN_URL = `${baseUrl}api/Register/Login`;
export const UPDATE_USER = `${baseUrl}api/UserMaster/AddOrgUserMaster`;
export const ADD_REGISTER_URL = `${baseUrl}api/UserMaster/AddOrganizationSignups`;
export const All_REGISTER_URL = `${baseUrl}api/Register/GetAllRegister`;
export const GET_ALL_CURRENCIES = `${baseUrl}api/Register/GetAllCurrency`;
export const GET_ALL_LANGUAGES = `${baseUrl}api/Register/GetAllLanguage`;
export const SELECT_BY_ID_USERDETAIL = `${baseUrl}api/Register/SelectByID`;
export const ALL_SCREEN_URL = `${baseUrl}api/Screen/GetAllScreen`;
export const ALL_MAPSTORE_GET = `${baseUrl}api/Cascading/SelectByStore`;
export const GET_ALL_COUNTRY = `${baseUrl}api/Cascading/GetAllCountry`;
export const GET_SELECT_BY_STATE = `${baseUrl}api/Cascading/SelectByState`;
export const GET_SELECT_BY_CITY = `${baseUrl}api/Cascading/SelectByCity`;
export const DELETE_USER = `${baseUrl}api/Register/DeleteUser`;
export const SCREEN_GROUP = `${baseUrl}api/GroupScreen/AddGroupScreen`;
export const SELECT_ALL_SCREENGROUP = `${baseUrl}api/GroupScreen/SelectAll`;
export const UPDATE_NEW_SCREEN = `${baseUrl}api/NewScreen/UpdateNewScreen`;
export const GET_SCREEN_TYPE = `${baseUrl}api/NewScreen/GetAllScreenType`;
export const SELECT_BY_USER_SCREENDETAIL = `${baseUrl}api/NewScreen/SelectByUserScreen`;
export const SELECT_BY_SCREENID_SCREENDETAIL = `${baseUrl}api/NewScreen/SelectByScreen`;
export const GET_ALL_SCREEN_RESOLUTION = `${baseUrl}api/NewScreen/GetAllScreenResolution`;
export const GET_ALL_SCREEN_ORIENTATION = `${baseUrl}api/NewScreen/GetAllScreenOrientation`;
export const GET_SCREEN_TIMEZONE = `${baseUrl}api/NewScreen/GetAllTimeZone`;
export const GET_SCEDULE_TIMEZONE =
  "https://disployapi.thedestinysolutions.com​/api/EventMaster/GetAllTimeZone";
export const GET_TIMEZONE = `${baseUrl}api/EventMaster/GetAllTimeZone`;

export const GET_ALL_FILES = `${baseUrl}api/AssetMaster/GetAll`;
export const ALL_FILES_UPLOAD = `${baseUrl}api/AssetMaster/AssetUpload`;

export const GOOGLE_DRIVE = `${baseUrl}api/GoogleDrive/GoogleDrive`;
export const OTP_VERIFY = `${baseUrl}api/NewScreen/NewScreenVerify`;
export const GET_ALL_EVENTS = `${baseUrl}api/EventMaster/GetAllEvent`;
export const ADD_EVENT = `${baseUrl}api/EventMaster/AddEvent`;
export const GET_ALL_SCHEDULE = `${baseUrl}api/ScheduleMaster/GetAllSchedule`;
export const ADD_SCHEDULE = `${baseUrl}api/ScheduleMaster/AddSchedule`;
export const DELETE_SCHEDULE = `${baseUrl}api/ScheduleMaster/DeleteSchedule`;

export const UPDATE_SCREEN_ASSIGN = `${baseUrl}api/ScheduleMaster/UpdateAssignScreen`;

export const SCHEDULE_EVENT_SELECT_BY_ID = `${baseUrl}api/EventMaster/SelectByID`;
export const SCHEDULE_SELECT_BY_ID = `${baseUrl}api/ScheduleMaster/SelectByID`;
export const UPDATED_SCHEDULE_DATA = `${baseUrl}api/EventMaster/SelectAllGetScheduleList`;
export const UPDATE_TIMEZONE = `${baseUrl}api/ScheduleMaster/UpdateTimeZone`;
export const SIGNAL_R = `${baseUrl}chatHub`;

export const GET_ALL_TRASHDATA = `${baseUrl}api/Trash/GetAllTrash`;
export const ADD_TRASH = `${baseUrl}api/Trash/AddTrash`;
export const SINGL_DELETED_TRASH = `${baseUrl}api/Trash/singlDeletedTrash`;
export const All_DELETED_TRASH = `${baseUrl}api/Trash/AllDeletedTrash`;
export const RESTORE_TRASH = `${baseUrl}api/Trash/restoreTrash`;

export const CREATE_NEW_FOLDER = `${baseUrl}api/AssetMaster/FolderMaster`;

export const GET_ALL_NEW_FOLDER = `${baseUrl}api/ImageVideoDoc/GetAllFolder`;
export const MOVE_TO_FOLDER = `${baseUrl}api/AssetMaster/Move`;

export const FetchdataFormFolder = `${baseUrl}api/ImageVideoDoc/SelectByFolder`;

export const DeleteAllData = `${baseUrl}api/ImageVideoDoc/DeleteAll`;

export const GET_ALL_APPS = `${baseUrl}api/YoutubeApp/GetAllApps`;

export const YOUTUBE_INSTANCE_ADD_URL = `${baseUrl}api/YoutubeApp/AddYoutubeApp`;

export const GET_ALL_YOUTUBEDATA = `${baseUrl}api/YoutubeApp/GetAllYoutubeApp`;

export const GET_YOUTUBEDATA_BY_ID = `${baseUrl}api/YoutubeApp/SelectByYouTubeId`;

export const YOUTUBEDATA_ALL_DELETE = `${baseUrl}api/YoutubeApp/DeleteAllYoutubeApp`;

export const SELECT_BY_LIST = `${baseUrl}api/LayoutMaster/SelectByList`;

export const UPDATE_TRIAL_DAY = `${baseUrl}api/Register/UpdateTrialDay`;

export const SCROLL_TYPE_OPTION = `${baseUrl}api/YoutubeApp/AllScrollType`;

export const SCROLL_ADD_TEXT = `${baseUrl}api/YoutubeApp/AddTextScroll`;

export const SCROLLDATA_BY_ID = `${baseUrl}api/YoutubeApp/SelectByTextScrollId`;

export const GET_ALL_TEXT_SCROLL_INSTANCE = `${baseUrl}api/YoutubeApp/GetAlltextScroll`;
export const DELETE_ALL_TEXT_SCROLL = `${baseUrl}api/YoutubeApp/DeleteAllTextScroll`;
export const SELECT_BY_ASSET_ID = `${baseUrl}api/AssetMaster/SelectByAssetID`;
export const ADDPLAYLIST = `${baseUrl}api/CompositionMaster/AddCompositionMaster`;
export const ADDSUBPLAYLIST = `${baseUrl}api/CompositionMaster/AddSubCompositionMaster`;
export const GET_ALL_COMPOSITIONS = `${baseUrl}api/CompositionMaster/GetAllCompositionMaster`;

export const DELETE_COMPOSITION_BY_ID = `${baseUrl}api/CompositionMaster/DeleteCompositionByID`;
export const DELETE_ALL_COMPOSITIONS = `${baseUrl}api/CompositionMaster/DeleteAllComposition`;
export const DELETE_COMPOSITION = `${baseUrl}api/CompositionMaster/DeleteComposition`;
export const GET_ALL_TAGS = `${baseUrl}api/CompositionMaster/GetAllTag`;
export const GET_CURRENT_ASSET = `${baseUrl}api/EventMaster/GetCurrentAsset`;

export const COMPOSITION_BY_ID = `${baseUrl}api/CompositionMaster/SelectCompositionByID`;

export const SCREEN_PREVIEW = `${baseUrl}api/NewScreen/GetRegisterOtp`;

export const FORGOTPASSWORD = `${baseUrl}api/UserMaster/ForgotPassword`;

export const CHNAGE_PASSWORD = `${baseUrl}api/UserMaster/ResetPassword?`;
export const UPDATE_PASSWORD = `${baseUrl}api/UserMaster/UpdatePassword?`;
export const GET_USER_BY_USERROLE = `${baseUrl}api/OrganizationUsersRole/GetUserbyUserRole`;

// Weather App Api
export const WEATHER_APP = `${baseUrl}api/WeatherApp/AddWeatherApp`;
export const GET_All_WEATHER = `${baseUrl}api/WeatherApp/GetWeatherApp`;
export const GET_WEATHER_BY_ID = `${baseUrl}api/WeatherApp/GetWeatherApp?`;
export const WEATHER_ASSIGN_SECREEN = `${baseUrl}api/WeatherApp/AssignWeatherToScreen?`;
export const WEATHER_ADD_TAG = `${baseUrl}api/WeatherApp/AddWeatherTags?`;
export const USER_ROLE_GET = `${baseUrl}api/OrganizationUsersRole/ListOfModule`;
export const USER_ROLE_COMBINE = `${baseUrl}api/OrganizationUsersRole/GetUserRolesCombine`;

export const SCREEN_DELETE_ALL = `${baseUrl}api/NewScreen/DeleteAllScreenByIds`;

// Group Screen
export const GET_GROUP_SCREEN = `${baseUrl}api/GroupScreen/GetAllGroupData`;
export const ADD_GROUP_SCREEN = `${baseUrl}api/GroupScreen/AddGroupScreen`;
export const DELETE_SINGLE_GROUP_SCREEN = `${baseUrl}api/GroupScreen/DeleteGroupByID`;
export const DELETE_GROUP_SCREEN_ALL = `${baseUrl}api/GroupScreen/DeleteAllGroupScreen`;
export const GROUP_IN_SCREEN_DELETE_ALL = `${baseUrl}api/GroupScreen/DeleteScreenByID`;
export const GROUP_IN_SCREEN_ASSETS_UPDATE_ALL = `${baseUrl}api/GroupScreen/UpdateGroupMedia`;
export const PRIVIEW_GROUP_SCREEN = `${baseUrl}api/GroupScreen/GetGroupPreview`;

// screen Marge
export const GET_MARGE_SCREEN = `${baseUrl}api/MergeScreen/GetAllMergeScreen`;
export const ADD_MERGE_SCREEN = `${baseUrl}api/MergeScreen/AddMergeScreen`;
export const DELETE_MERGE_SCREEN_ALL = `${baseUrl}api/MergeScreen/DeleteAllMergeScreen`;

export const SCREEN_DEACTIVATE_ACTIVATE = `${baseUrl}api/NewScreen/EnableScreen`;

// sidebar
export const GET_SIDEBAR_MENU = `${baseUrl}api/OrganizationUsersRole/SideBarMenu`;

// reports
export const AUDITREPORT = `${baseUrl}api/Report/GetAuditLogsReport`;
export const UPTIMEREPORT = `${baseUrl}api/Report/GetUptimeReport`;
export const SALESREPORT = `${baseUrl}api/Report/GetSalesReport`;
export const CANCELREPORT = `${baseUrl}api/Report/GetCancelReport`;
export const MEDIAREPORT = `${baseUrl}api/Report/GetAssetReport`;
export const BILLINGREPORT = `${baseUrl}api/Report/GetBillingReport`;

//https://disployapi.thedestinysolutions.com
//http://192.168.1.115
