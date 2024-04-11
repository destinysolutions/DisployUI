import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

export const baseUrl = "https://disployapi.thedestinysolutions.com/api/";

export const stripePromise = loadStripe("pk_test_51JIxSzLmxyI3WVNYq18V5tZgnJ3kAeWqwobpP2JLyax9zkwjdOFKyHp85ch29mKeqhqyHTr4uIgTvsKkYPxTcEWQ00EyadI8qy");

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

export const LOGIN_URL = `${baseUrl}Register/Login`;
export const UPDATE_USER = `${baseUrl}UserMaster/AddOrgUserMaster`;
export const UPDATE_USER_ORG = `${baseUrl}UserMaster/UpdateOrgUserMaster`;
export const ADD_REGISTER_URL = `${baseUrl}UserMaster/AddOrganizationSignups`;
export const All_REGISTER_URL = `${baseUrl}Register/GetAllRegister`;
export const GET_ALL_CURRENCIES = `${baseUrl}Register/GetAllCurrency`;
export const GET_ALL_LANGUAGES = `${baseUrl}Register/GetAllLanguage`;
export const SELECT_BY_ID_USERDETAIL = `${baseUrl}Register/SelectByID`;
export const ALL_SCREEN_URL = `${baseUrl}Screen/GetAllScreen`;
export const ALL_MAPSTORE_GET = `${baseUrl}Cascading/SelectByStore`;
export const GET_ALL_COUNTRY = `${baseUrl}Cascading/GetAllCountry`;
export const GET_SELECT_BY_STATE = `${baseUrl}Cascading/SelectByState`;
export const GET_SELECT_BY_CITY = `${baseUrl}Cascading/SelectByCity`;
export const DELETE_USER = `${baseUrl}Register/DeleteUser`;
export const SCREEN_GROUP = `${baseUrl}GroupScreen/AddGroupScreen`;
export const SELECT_ALL_SCREENGROUP = `${baseUrl}GroupScreen/SelectAll`;
export const UPDATE_NEW_SCREEN = `${baseUrl}NewScreen/UpdateNewScreen`;
export const GET_SCREEN_TYPE = `${baseUrl}NewScreen/GetAllScreenType`;
export const SELECT_BY_USER_SCREENDETAIL = `${baseUrl}NewScreen/SelectByUserScreen`;
export const SELECT_BY_SCREENID_SCREENDETAIL = `${baseUrl}NewScreen/SelectByScreen`;
export const GET_ALL_SCREEN_RESOLUTION = `${baseUrl}NewScreen/GetAllScreenResolution`;
export const GET_ALL_SCREEN_ORIENTATION = `${baseUrl}NewScreen/GetAllScreenOrientation`;
export const GET_SCREEN_TIMEZONE = `${baseUrl}NewScreen/GetAllTimeZone`;
export const GET_SCEDULE_TIMEZONE = `${baseUrl}EventMaster/GetAllTimeZone`;
export const GET_TIMEZONE = `${baseUrl}EventMaster/GetAllTimeZone`;
export const GET_ALL_FILES = `${baseUrl}AssetMaster/GetAll`;
export const ALL_FILES_UPLOAD = `${baseUrl}AssetMaster/AssetUpload`;
export const GOOGLE_DRIVE = `${baseUrl}GoogleDrive/GoogleDrive`;
export const OTP_VERIFY = `${baseUrl}NewScreen/NewScreenVerify`;
export const GET_ALL_EVENTS = `${baseUrl}EventMaster/GetAllEvent`;
export const ADD_EVENT = `${baseUrl}EventMaster/AddEvent`;
export const GET_ALL_SCHEDULE = `${baseUrl}ScheduleMaster/GetAllSchedule`;
export const ADD_SCHEDULE = `${baseUrl}ScheduleMaster/AddSchedule`;
export const DELETE_SCHEDULE = `${baseUrl}ScheduleMaster/DeleteSchedule`;
export const UPDATE_SCREEN_ASSIGN = `${baseUrl}ScheduleMaster/UpdateAssignScreen`;
export const SCHEDULE_EVENT_SELECT_BY_ID = `${baseUrl}EventMaster/SelectByID`;
export const SCHEDULE_SELECT_BY_ID = `${baseUrl}ScheduleMaster/SelectByID`;
export const UPDATED_SCHEDULE_DATA = `${baseUrl}EventMaster/SelectAllGetScheduleList`;
export const UPDATE_TIMEZONE = `${baseUrl}ScheduleMaster/UpdateTimeZone`;
export const SIGNAL_R = `https://disployapi.thedestinysolutions.com/chatHub`;
export const GET_ALL_TRASHDATA = `${baseUrl}Trash/GetAllTrash`;
export const ADD_TRASH = `${baseUrl}Trash/AddTrash`;
export const SINGL_DELETED_TRASH = `${baseUrl}Trash/singlDeletedTrash`;
export const All_DELETED_TRASH = `${baseUrl}Trash/AllDeletedTrash`;
export const RESTORE_TRASH = `${baseUrl}Trash/restoreTrash`;
export const CREATE_NEW_FOLDER = `${baseUrl}AssetMaster/FolderMaster`;
export const GET_ALL_NEW_FOLDER = `${baseUrl}ImageVideoDoc/GetAllFolder`;
export const MOVE_TO_FOLDER = `${baseUrl}AssetMaster/Move`;
export const FetchdataFormFolder = `${baseUrl}ImageVideoDoc/SelectByFolder`;
export const DeleteAllData = `${baseUrl}ImageVideoDoc/DeleteAll`;
export const GET_ALL_APPS = `${baseUrl}YoutubeApp/GetAllApps`;
export const YOUTUBE_INSTANCE_ADD_URL = `${baseUrl}YoutubeApp/AddYoutubeApp`;
export const GET_ALL_YOUTUBEDATA = `${baseUrl}YoutubeApp/GetAllYoutubeApp`;
export const GET_YOUTUBEDATA_BY_ID = `${baseUrl}YoutubeApp/SelectByYouTubeId`;
export const YOUTUBEDATA_ALL_DELETE = `${baseUrl}YoutubeApp/DeleteAllYoutubeApp`;
export const SELECT_BY_LIST = `${baseUrl}LayoutMaster/SelectByList`;
export const UPDATE_TRIAL_DAY = `${baseUrl}Register/UpdateTrialDay`;
export const SCROLL_TYPE_OPTION = `${baseUrl}YoutubeApp/AllScrollType`;
export const SCROLL_ADD_TEXT = `${baseUrl}YoutubeApp/AddTextScroll`;
export const SCROLLDATA_BY_ID = `${baseUrl}YoutubeApp/SelectByTextScrollId`;
export const GET_ALL_TEXT_SCROLL_INSTANCE = `${baseUrl}YoutubeApp/GetAlltextScroll`;
export const DELETE_ALL_TEXT_SCROLL = `${baseUrl}YoutubeApp/DeleteAllTextScroll`;
export const SELECT_BY_ASSET_ID = `${baseUrl}AssetMaster/SelectByAssetID`;
export const ADDPLAYLIST = `${baseUrl}CompositionMaster/AddCompositionMaster`;
export const ADDSUBPLAYLIST = `${baseUrl}CompositionMaster/AddSubCompositionMaster`;
export const GET_ALL_COMPOSITIONS = `${baseUrl}CompositionMaster/GetAllCompositionMaster`;
export const DELETE_COMPOSITION_BY_ID = `${baseUrl}CompositionMaster/DeleteCompositionByID`;
export const DELETE_ALL_COMPOSITIONS = `${baseUrl}CompositionMaster/DeleteAllComposition`;
export const DELETE_COMPOSITION = `${baseUrl}CompositionMaster/DeleteComposition`;
export const GET_ALL_TAGS = `${baseUrl}CompositionMaster/GetAllTag`;
export const GET_CURRENT_ASSET = `${baseUrl}EventMaster/GetCurrentAsset`;
export const COMPOSITION_BY_ID = `${baseUrl}CompositionMaster/SelectCompositionByID`;
export const SCREEN_PREVIEW = `${baseUrl}NewScreen/GetRegisterOtp`;
export const FORGOTPASSWORD = `${baseUrl}UserMaster/ForgotPassword`;
export const CHNAGE_PASSWORD = `${baseUrl}UserMaster/ResetPassword?`;
export const UPDATE_PASSWORD = `${baseUrl}UserMaster/UpdatePassword?`;
export const GET_USER_BY_USERROLE = `${baseUrl}OrganizationUsersRole/GetUserbyUserRole`;
export const ASSIGN_TEXTSCROLL_TO_SCREEN = `${baseUrl}YoutubeApp/AssignTextScrollToScreen`;
export const ADD_TEXTSCROLL_TAGS = `${baseUrl}YoutubeApp/AddTextScrollTags`;
export const SELECT_BY_TEXTSCROLL_ID = `${baseUrl}YoutubeApp/SelectByTextScrollId`;
export const ASSIGN_YOUTUBE_TO_SCREEN = `${baseUrl}YoutubeApp/AssignYoutubeToScreen`;
export const ADD_YOUTUBE_TAGS = `${baseUrl}YoutubeApp/AddYoutubeTags`;
export const ASSIGN_ASSET_TO_SCREEN = `${baseUrl}AssetMaster/AssignAssetToScreen`;
export const GET_ASSET_DETAILS = `${baseUrl}AssetMaster/GetAssetDetails`;
export const DELETE_ALL_ASSET = `${baseUrl}AssetMaster/DeleteAllAsset`;
export const ASSIGN_COMPOSITION_TO_SCREEN = `${baseUrl}CompositionMaster/AssignCompoitiontoScreen`;
export const GET_DEFAULT_ASSET = `${baseUrl}UserMaster/GetDefaultAsset`;
export const GET_EMERGENCY_ASSET = `${baseUrl}UserMaster/GetEmergencyAsset`;

export const SAVE_DEFAULT_ASSET = `${baseUrl}UserMaster/SaveDefaultAsset`;
export const SAVE_EMERGENCY_ASSET = `${baseUrl}UserMaster/SaveEmergencyAsset`;

export const ADD_STORAGE = `${baseUrl}Storage/AddStorage`;
export const ADD_UPDATE_ORGANIZATION_USER_ROLE = `${baseUrl}OrganizationUsersRole/AddUpdateOrganizationUsersRole`;
export const GET_ORG_USERS = `${baseUrl}UserMaster/GetOrgUsers`;
export const GET_USER_SCREEN_DETAILS = `${baseUrl}UserMaster/GetUsetScreenDetails`;
export const DELETE_ORG_USER = `${baseUrl}UserMaster/DeleteOrgUser`;
export const GET_TIME_ZONE = `${baseUrl}ScheduleMaster/GetTimeZoneCurrentTime`
// Weather App Api
export const WEATHER_APP = `${baseUrl}WeatherApp/AddWeatherApp`;
export const GET_All_WEATHER = `${baseUrl}WeatherApp/GetWeatherApp`;
export const GET_WEATHER_BY_ID = `${baseUrl}WeatherApp/GetWeatherApp?`;
export const WEATHER_ASSIGN_SECREEN = `${baseUrl}WeatherApp/AssignWeatherToScreen?`;
export const WEATHER_ADD_TAG = `${baseUrl}WeatherApp/AddWeatherTags?`;
export const USER_ROLE_GET = `${baseUrl}OrganizationUsersRole/ListOfModule`;
export const USER_ROLE_COMBINE = `${baseUrl}OrganizationUsersRole/GetUserRolesCombine`;
export const SCREEN_DELETE_ALL = `${baseUrl}NewScreen/DeleteAllScreenByIds`;

// Group Screen
export const GET_GROUP_SCREEN = `${baseUrl}GroupScreen/GetAllGroupData`;
export const ADD_GROUP_SCREEN = `${baseUrl}GroupScreen/AddGroupScreen`;
export const DELETE_SINGLE_GROUP_SCREEN = `${baseUrl}GroupScreen/DeleteGroupByID`;
export const DELETE_GROUP_SCREEN_ALL = `${baseUrl}GroupScreen/DeleteAllGroupScreen`;
export const GROUP_IN_SCREEN_DELETE_ALL = `${baseUrl}GroupScreen/DeleteScreenByID`;
export const GROUP_IN_SCREEN_ASSETS_UPDATE_ALL = `${baseUrl}GroupScreen/UpdateGroupMedia`;
export const PRIVIEW_GROUP_SCREEN = `${baseUrl}GroupScreen/GetGroupPreview`;
export const UPDATE_GROUP_NAME = `${baseUrl}GroupScreen/UpdateGroupScreen`;

// screen Marge
export const GET_MARGE_SCREEN = `${baseUrl}MergeScreen/GetAllMergeScreen`;
export const ADD_MERGE_SCREEN = `${baseUrl}MergeScreen/AddMergeScreen`;
export const DELETE_MERGE_SCREEN_ALL = `${baseUrl}MergeScreen/DeleteAllMergeScreen`;
export const ASSETS_UPLOAD_IN_SCREEN = `${baseUrl}MergeScreen/UpdateMergeScreenMedia`;
export const UPDATE_MERGE_NAME = `${baseUrl}MergeScreen/UpdateMergeScreen`;
export const SCREEN_DEACTIVATE_ACTIVATE = `${baseUrl}NewScreen/EnableScreen`;

// sidebar
export const GET_SIDEBAR_MENU = `${baseUrl}OrganizationUsersRole/SideBarMenu`;
export const MENU_ACCESS = `${baseUrl}OrganizationUsersRole/GetAllLevelData`;


// reports
export const AUDITREPORT = `${baseUrl}Report/GetAuditLogsReport`;
export const UPTIMEREPORT = `${baseUrl}Report/GetUptimeReport`;
export const SALESREPORT = `${baseUrl}Report/GetSalesReport`;
export const CANCELREPORT = `${baseUrl}Report/GetCancelReport`;
export const MEDIAREPORT = `${baseUrl}Report/GetAssetReport`;
export const BILLINGREPORT = `${baseUrl}Report/GetBillingReport`;

//https://disployapi.thedestinysolutions.com
//http://192.168.1.115

// Retailar
export const GETALLRETAILER = `${baseUrl}UserMaster/GetAllRetailer?IsRetailer=true`

// weatherschedule

export const ADD_OR_UPDATE_WEATHER = `${baseUrl}WeatherScheduling/AddorUpdateWeatherScheduling`;
export const GET_BY_ID_WEATHER = `${baseUrl}WeatherScheduling/GetWeatherScheduling`;
export const GET_WEATHER = `${baseUrl}WeatherScheduling/GetWeatherScheduling`;
export const DELETE_WEATHER = `${baseUrl}WeatherScheduling/DeleteWeatherScheduling`;
export const SET_TO_SCREEN_WEATHER = `${baseUrl}WeatherScheduling/AssignWeatherSchedulingToScreen`;

// Dashboard
export const USERDASHBOARD = `${baseUrl}NewScreen/GetDashboardData`
export const ADMINDASHBOARD = `${baseUrl}NewScreen/GetALLUserDashboardData`
export const ADMINUSERTOKEN = `${baseUrl}Register/GetUserToken`

// Advertisement

export const ADDEDITADVERTISEMENT = `${baseUrl}AdsCustomer/AddorUpdateAdsCustomer`
export const GETALLADS = `${baseUrl}AdsCustomer/GetAllAdsData`
export const ASSIGN_ADS = `${baseUrl}AdsCustomer/InsertAdvertisementScreen`
export const  GET_NOTIFICATIONS  = `${baseUrl}AdsCustomer/GetAdsDatabyID`
export const  UPDATE_ADS_RATE  = `${baseUrl}AdsCustomer/UpdateAdsRate`
export const  ADD_ADMIN_RATE  = `${baseUrl}AdsCustomer/AddAdminMargin`
export const  ADVERTISEMENT_SCREEN  = `${baseUrl}Common/AdvertisementScreen`
export const  ADD_USER_LIST  = `${baseUrl}AdsCustomer/GetAdsDatabyAdsID`




// Approval

export const GETALLAPPROVAL = `${baseUrl}OrganizationUsersRole/GetApproveNotifications`
export const APPROVEDETAILBYID = `${baseUrl}OrganizationUsersRole/ApproveDetailsByID`

// Book Slot


export const SCREEN_LIST = `${baseUrl}AdsCustomer/GetAllRetaileScreen`
export const ALL_CITY = `${baseUrl}Common/GetAllCity`
export const ADDALLEVENT = `${baseUrl}AdsCustomer/AddorUpdateBookingSlotCustomerEvent`
export const ADDUPDATESLOT = `${baseUrl}AdsCustomer/AddorUpdateBookingSlotCustomer`

// Screen Authorize

export const PHONENUMBERVERIFY = `${baseUrl}UserMaster/SendOTP`
export const PHONE_OTP_VERIFY = `${baseUrl}UserMaster/SetAuthNumber`;
export const OTP_SCREEN_VERIFY = `${baseUrl}NewScreen/VerifyScreenOTP`;


// Digital Menu Board
export const POS_ITEM_LIST = `${baseUrl}DigitalMenu/GetPOSItemDetails`
export const ADD_EDIT_DIGITAL_MENU = `${baseUrl}DigitalMenu/AddORUpdateDigitalMenuApp`
export const GET_ALL_DIGITAL_MENU = `${baseUrl}DigitalMenu/GetAllDigitalMenuApp`
export const DELETE_DIGITAL_MENU = `${baseUrl}DigitalMenu/DeleteDigitalMenuApp`
export const GET_DIGITAL_MENU_BY_ID = `${baseUrl}DigitalMenu/GetDigitalMenuAppByID`
export const ADD_TAGS_DIGITAL_MENU = `${baseUrl}DigitalMenu/AddDigitalMenuAppTags`
export const ASSIGN_SCREEN_DIGITAL_MENU = `${baseUrl}DigitalMenu/AssignDigitalMenuAppToScreen`

// Billing

export const GET_ALL_PLANS = `${baseUrl}Common/GetAllPlans`
export const ADD_EDTT_PLAN = `${baseUrl}Common/AddEditPlan`
export const GET_TRIAL_PERIOD_DETAILS = `${baseUrl}Common/GetTrialPeriodDetails`
export const ADD_EDIT_TRIAL_PLAN = `${baseUrl}Common/EditTrialPeriod`
export const PAYMENT_INTENT_CREATE_REQUEST = `${baseUrl}Common/PaymentIntentCreateRequest`
export const PAYMENT_DETAILS = `${baseUrl}PaymentDetails/AddorUpdatePaymentDetails`

// Notifications

export const GET_ALL_NOTIFICATIONS = `${baseUrl}Common/GetAllNotificationMaster`
export const GET_ALL_REMOVE_NOTIFICATIONS = `${baseUrl}Common/GetRemoveAllNotificationMaster`


// Invoice

export const GET_ALL_INVOICE = `${baseUrl}Invoice/GetAllInvoiceMaster`
export const GET_INVOICE_BY_ID = `${baseUrl}Invoice/GetInvoiceById`
export const SEND_INVOICE = `${baseUrl}Invoice/GetInvoiceById`

// Discount

export const GET_ALL_DISCOUNT = `${baseUrl}DiscountMaster/GetAllDiscountMaster`
export const GET_DISCOUNT_BY_ID = `${baseUrl}DiscountMaster/GetDiscountMaster`
export const ADD_EDIT_DISCOUNT = `${baseUrl}DiscountMaster/AddorUpdateDiscountMaster`
export const GET_ALL_FEATURE_LIST = `${baseUrl}Common/GetAllPlansFeatures`
export const DELETE_DISCOUNT = `${baseUrl}DiscountMaster/DeleteDiscount`
export const GET_ALL_SEGMENT = `${baseUrl}common/GetAllSegment`
