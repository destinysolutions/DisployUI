import { after } from "lodash";
import moment from "moment";

export const DynamicDesignComponent = ({
  length,
  name,
  watch,
  setValue,
  register,
  getValues,
  errors,
  roleuserList,
  userRoleData,
  setUserDisable,
  userDisable,
}) => {
  const array = Array.from({ length }, (_, index) => index + 1);
  const handleSelectChange = (index, selectedValue) => {
    setValue(`${name}_${index}`, selectedValue);
    const data = userDisable?.[`${name}`];
    if (data) {
      data.splice((index - 1), 0, Number(selectedValue));
      data.splice(index, 1);
      setUserDisable({
        ...userDisable,
        [`${name}`]: [...data],
      });
    } else {
      setUserDisable({
        ...userDisable,
        [`${name}`]: [Number(selectedValue)],
      });
    }
    // const updatedDisable = name === 'Screen' ? [...screenDisable] :
    //     name === 'Schdeule' ? [...scheduleDisable] :
    //         [...appDisable];
    // updatedDisable[index - 1] = selectedValue;
    // if (name === 'Screen') setScreenDisable(updatedDisable);
    // else if (name === 'Schdeule') setScheduleDisable(updatedDisable);
    // else if (name === 'App') setAppDisable(updatedDisable);
  };

  return (
    <tr>
      <td className="flex items-center text-center">
        {array.map((item, index) => {
          let disableList = userRoleData?.[`${name}_Approve`];
          return (
            <div key={item} className="flex flex-col gap-1">
              <select
                className="ml-2 border border-primary rounded-lg px-2 py-1 lg:w-48 md:w-48 sm:w-32 cursor-pointer"
                {...register(`${name}_${index + 1}`, {
                  required: `This Field is required`,
                })}
                onChange={(e) => handleSelectChange(index + 1, e.target.value)}
                disabled={disableList}
                value={getValues(`${name}_${index + 1}`)}
              >
                <option value="" label="Select User Role"></option>
                {roleuserList?.map((item, index) => (
                  <option
                    key={index}
                    disabled={userDisable?.[`${name}`]?.includes(item?.value)}
                    value={item?.value}
                  >
                    {item?.text}
                  </option>
                ))}
              </select>
              {errors?.[`${name}_${index + 1}`] && (
                <span className="error">
                  {errors?.[`${name}_${index + 1}`].message}
                </span>
              )}
            </div>
          );
        })}
      </td>
    </tr>
  );
};

export function mapModuleTitlesToUserAccess(moduleTitle, watch) {
  const UserAccess = [];

  moduleTitle?.map((item) => {
    let View = watch(`${item?.alt}_View`) ? watch(`${item?.alt}_View`) : false;
    let Save = watch(`${item?.alt}_Edit`) ? watch(`${item?.alt}_Edit`) : false;
    let Delete = watch(`${item?.alt}_Delete`) ? watch(`${item?.alt}_Delete`) : false;
    let Approve = watch(`${item?.alt}_Approve`);
    let LevelApprove = watch(`${item?.alt}_LevelApprove`);
    let Total_Approve = LevelApprove ? Number(LevelApprove) : 0;
    const array = Array.from(
      { length: Total_Approve },
      (_, index) => index + 1
    );
    let List_Approve = [];

    if (Approve && array?.length > 0) {
      array?.map((item1, index) => {
        let User_ID = watch(`${item?.alt}_${index + 1}`);
        let obj1 = {
          appoverId: 0,
          userId: Number(User_ID),
          levelNo: item1,
        };
        List_Approve?.push(obj1);
      });
    }

    let obj = {
      moduleID: item?.moduleID,
      isView: View,
      isSave: Save,
      isDelete: Delete,
      isApprove: Approve ? Approve : false,
      noofApproval: Total_Approve,
      listApproverDetails: List_Approve,
    };

    UserAccess?.push(obj);
  });

  return UserAccess;
}

export function combineUserroleObjects(selectedRole) {
  let arr = [];

  selectedRole?.useraccess?.forEach((item) => {
    let obj1 = {
      [`${item?.name}_View`]: item?.isView,
      [`${item?.name}_Edit`]: item?.isSave,
      [`${item?.name}_Delete`]: item?.isDelete,
      [`${item?.name}_Approve`]: item?.isApprove,
      [`${item?.name}_LevelApprove`]: item?.noofApproval,
    };
    arr.push(obj1);
    if (item?.listApproverDetails?.length > 0) {
      item?.listApproverDetails?.map((user, index) => {
        let userObj = {
          [`${item?.name}_${index + 1}`]: user?.userId,
        };
        arr?.push(userObj);
      });
    }
  });

  let obj = {
    userRole: selectedRole?.orgUserRole,
    orgUserRoleID: selectedRole?.orgUserRoleID,
  };
  let mergedObject = {};
  arr.forEach((obj) => {
    mergedObject = { ...mergedObject, ...obj };
  });
  let combinedObj = { ...mergedObject, ...obj };
  return combinedObj;
}

export const Pagination = (page, length) => {
  if (page === 1) {
    return 1;
  } else {
    return ((page - 1) * length)
  }
};

export const buttons = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const DisployScreens = [
  "Event Signage",
  "Menu Boards",
  "Emergency Messaging",
  "Brand Promotion",
  "Health & Safety Compliance",
  "Others",
];

export function multiOptions(arr) {
  return arr.map(screen => ({
    label: screen.referralScreen,
    value: screen.screenID.toString(),
    Price: screen?.screenRatePerSec,
    screenOrientation: screen?.screenOrientation,
    output: `${screen?.screenID}_${screen?.organizationID}`,
    isReferral: screen?.isReferral,
    currency: screen?.currency,
    macid: screen?.macid,
    screenID:screen?.screenID
  }));
}

export const IncludeExclude = [
  { label: "km", value: "km" },
  { label: "mi", value: 'mi' },
]



export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getCurrentTime = () => {
  const now = new Date();
  // Get hours and minutes
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  // Format time as HH:MM
  return `${hours}:${minutes}`;
};

export const getCurrentTimewithSecound = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

export function secondsToDDHHMMSS(totalSeconds) {
  totalSeconds = Number(totalSeconds);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  // Format as DD:HH:MM:SS
  return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}


// Function to convert time string (HH:MM:SS) to seconds
function timeToSeconds(time) {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

// Calculate the difference between two times in seconds
export function timeDifferenceInSeconds(start, end) {
  const startTimeInSeconds = timeToSeconds(start);
  let endTimeInSeconds = timeToSeconds(end);
  return endTimeInSeconds - startTimeInSeconds;
}

export function timeDifferenceInSequence(startTime, endTime, duration, sequence, aftereventType, afterHrMin, dayDifference) {
  let sequenceDuration = 0
  const extraDays = dayDifference * 24
  const [startHours, startMinutes, startSeconds] = startTime?.split(':').map(Number);

  const totalEndSeconds = startHours + startMinutes + startSeconds;
  const durationDayMin = (((24 - startHours) + extraDays) * 3600)

  if (sequence?.includes("In every hour")) {
    const totalSumSec = (duration + (1 * 3600))
    const totalSumSecLoop = (durationDayMin / totalSumSec)
    const finalDuraionSec = totalSumSecLoop * duration
    sequenceDuration = finalDuraionSec
    return sequenceDuration;
  }
  if (sequence?.includes("In every minute")) {
    // const durationDayMin = (((24 - startHours) + extraDays) * 3600)
    const totalSumSec = (duration + (1 * 60))
    const totalSumSecLoop = durationDayMin / totalSumSec
    const finalDuraionSec = totalSumSecLoop * duration
    sequenceDuration = finalDuraionSec
    return sequenceDuration;
  }
  if (aftereventType?.includes("Minutes")) {
    // const durationDayMin = (((24 - startHours) + extraDays) * 3600)
    const totalSumSec = (duration + (afterHrMin * 60))
    const totalSumSecLoop = durationDayMin / totalSumSec
    const finalDuraionSec = totalSumSecLoop * duration
    sequenceDuration = finalDuraionSec
    return sequenceDuration;
  }
  if (aftereventType?.includes("Hours")) {
    // const durationDayMin = (((24 - startHours) + extraDays) * 3600)
    const totalSumSec = (duration + (afterHrMin * 3600))
    const totalSumSecLoop = (durationDayMin / totalSumSec)
    const finalDuraionSec = totalSumSecLoop * duration
    sequenceDuration = finalDuraionSec
    return sequenceDuration;
  }
}


export function secondsToHMS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// export const greenOptions = {
//   color: "blue",
//   fillColor: "blue",
// };

export const greenOptions = {
  color: "blue",
  fillColor: "blue",
  fillOpacity: 0.30,
  strokeColor: "blue",
  strokeOpacity: 0,
  strokeWeight: 0,
};

export function removeDuplicates(arr) {
  // Create a map to store unique combinations of 'let', 'lon', and 'dis'
  let uniqueMap = new Map();

  // Filter out duplicates
  let uniqueArr = arr.filter(obj => {
    const key = obj.let + obj.lon + obj.dis;
    const isNew = !uniqueMap.has(key);
    if (isNew) {
      uniqueMap.set(key, obj);
    }
    return isNew;
  });

  return uniqueArr;
}

export function kilometersToMeters(kilometers) {
  return kilometers * 1000; // 1 kilometer = 1000 meters
}

export const kilometersMilesToMeters = (dis, unit) => {
  const MILES_TO_METERS = 1609.34; // 1 mile = 1609.34 meters
  const KILOMETERS_TO_METERS = 1000; // 1 kilometer = 1000 meters
  if (unit === 'mi') {
    return dis * MILES_TO_METERS;
  } else {
    return dis * KILOMETERS_TO_METERS;
  }
};

export function constructTimeObjects(getallTime, startDate, endDate, repeat, day, selectedTimeZone, allTimeZone, allSlateDetails) {
  let arr1 = [];
  getallTime?.map((item) => {
    let data = {
      startDate: `${startDate} 00:00:00`,
      endDate: `${endDate} 00:00:00`,
      startTime: `${item?.startTime}`,
      endTime: `${item?.endTime}`,
      isRepeat: repeat,
      repeatDays: repeat
        ? (day?.length > 0 ? day.join(", ") : moment().format('dddd'))
        : null,
      systemTimeZone: getTimeZoneName(allTimeZone, selectedTimeZone),
      refcode: allSlateDetails ? allSlateDetails?.refVale : null,
    };
    arr1?.push(data);
  });

  return arr1;
}

export const getTimeZoneName = (allTimeZone, selectedTimeZone) => {
  const timeZoneObject = allTimeZone && allTimeZone?.find(item => item.timeZoneID === selectedTimeZone);
  return timeZoneObject?.timeZoneName;
};

export function CurrentDateFormat(dateString) {
  // Create a Date object
  var date = new Date(dateString);
  // Extract year, month, and day components
  var year = date.getUTCFullYear();
  var month = ("0" + (date.getUTCMonth() + 1)).slice(-2); // Adding 1 because getUTCMonth() returns zero-based months
  var day = ("0" + date.getUTCDate()).slice(-2);
  // Construct the desired format
  var convertedDate = year + "-" + month + "-" + day;
  return convertedDate;
}

export function formatDate(dateString) {
  let date = new Date(dateString);

  let day = date.getDate().toString().padStart(2, '0');
  let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
  let year = date.getFullYear();

  let formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}

export const Operating_hours = [{
  id: "1",
  value: "Always on"
},
{
  id: "2",
  value: "Custom"
}
];

export const Screen_Type = [{
  id: "1",
  value: "Regular"
},
{
  id: "2",
  value: "Advertisement"
}
];

export const Operating_hours_actions = [{
  id: "1",
  value: "Shut Down"
},
{
  id: "2",
  value: "Sleep"
}
];

export const TotalDay = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function getDayOfWeek(index) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return daysOfWeek[index];
}

export function getTrueDays(arr) {
  const trueDays = [];
  arr.forEach((value, index) => {
    if (value) {
      trueDays.push(getDayOfWeek(index));
    }
  });
  return trueDays;
}

export function extractTime(timeString) {
  let timeParts = timeString.split(":"); // Split the time string by colon
  let hourMinute = timeParts.slice(0, 2).join(":"); // Join the first two parts (hours and minutes)
  return hourMinute;
}

export const PageArray = [
  { page: "auto" },
  { page: 1 },
  { page: 2 },
  { page: 3 },
  { page: 4 },
  { page: 5 },
  { page: 6 },
  { page: 7 },
  { page: 8 }
];

export const ImageLayout = [
  { layout: "When I attach an image" },
  { layout: "Always" },
  { layout: "Never" },
];

export const Currency = [
  { currency: "USD" },
  { currency: "GBP" },
  { currency: "EUR" },
];

export const FontSize = [
  { size: "Small" },
  { size: "Medium" },
  { size: "Large" },
  { size: "Extra Large" },
];

export const Theme = [
  { theme: "Light Theme" },
  { theme: "Dark Theme" },
];

export function generateAllCategory(addCategory) {
  const allCategory = addCategory.map(category => {
    const items = category.allItem.map(item => ({
      itemID: item?.itemID ? item?.itemID : 0,
      digitalMenuAppId: item?.digitalMenuAppId ? item?.digitalMenuAppId : 0,
      categoryID: item?.categoryID ? item?.categoryID : 0,
      itemName: item.name,
      description: item.description,
      price: item.price,
      calories: item.calories,
      image: item?.image?.assetFolderPath,
      isFeatured: item.features,
      isSoldout: item.soldOut,
      itemSort: 0
    }));

    return {
      categoryID: category?.categoryID ? category?.categoryID : 0,
      digitalMenuAppId: category?.digitalMenuAppId ? category?.digitalMenuAppId : 0,
      categoryName: category.categoryname,
      isShow: category.show,
      categorySort: 0,
      items: items
    };
  });

  return allCategory;
}

export function generateCategorybyID(data) {
  const allcategory = data?.category?.map(cate => {
    const allitem = cate?.items?.map(item => ({
      name: item.itemName,
      description: item.description,
      price: item.price,
      calories: item.calories,
      image: item.image ? item.image : "",
      features: item.isFeatured,
      soldOut: item.isSoldout,
      itemID: item?.itemID,
      categoryID: item?.categoryID,
      digitalMenuAppId: item?.digitalMenuAppId
    }));

    return {
      categoryname: cate.categoryName,
      show: cate.isShow,
      digitalMenuAppId: cate?.digitalMenuAppId,
      categoryID: cate?.categoryID,
      allItem: allitem
    };
  });

  return allcategory;
}

export function getTimeFromDate(date) {
  const hours = String(date.getHours()).padStart(2, "0"); // Ensure two digits
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensure two digits
  const time = `${hours}:${minutes}`;
  return time;
}

export const SegmentArr = [
  {
    id: 1,
    value: "Customer Who Haven't Purchased"
  },
  {
    id: 2,
    value: "Customer Who Have Purchased More Than Once"
  },
  {
    id: 3,
    value: "Abandoned Checkouts In The Last 30 Days"
  },
  // {
  //   id: 4,
  //   value: "Email Subscribers"
  // }
]

export function chunkArray(array, size) {
  const chunkedArray = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArray.push(array.slice(i, i + size));
  }
  return chunkedArray;
}

export function multiOptionsFeature(arr) {
  return arr.map(feature => ({
    label: feature.name,
    value: feature.name,
  }));
}

export function capitalizeFirstLetter(string) {
  if (!string) return string; // Return the string as is if it is empty or falsy
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const NotificationType = [{
  Name: "Email",
  Value: "Email"
}, {
  Name: "Phone",
  Value: "Phone"
}, {
  Name: "Both",
  Value: "Both"
}, {
  Name: "None",
  Value: "None"
}]

export function mergeNotificationData(listNotification, res) {
  return listNotification.map((listItem, index) => {
    const correspondingArrItem = res?.payload?.data.find(item => item.index === index);

    if (correspondingArrItem) {
      const updatedUser = listItem.user.map(userItem => {
        if (userItem.notificationFeatureId === correspondingArrItem.notificationFeatureID) {
          return { ...userItem, ...correspondingArrItem };
        }
        return userItem;
      });
      return { ...listItem, user: updatedUser };
    }

    return listItem;
  });
}

export function extractSubstring(str) {

  let match = str?.match(/× (.*?) \(/);
  if (match) {
    return match[1];
  } else {
    return null; // or an appropriate error message
  }

}

export function extractPrice(string) {
  let match = string?.match(/\$(\d+)\.00/);
  if (match) {
    return match[1];
  } else {
    return null;
  }
}

export function getDifferenceInDays(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Calculate the difference in milliseconds
  const differenceInTime = endDate - startDate;

  // Convert the difference from milliseconds to days
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  return differenceInDays;
}

export function getRemainingDays(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Calculate the difference in milliseconds
  const differenceInTime = endDate - startDate;

  // Convert the difference from milliseconds to days
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  return differenceInDays;
}

export function getDaysPassed(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Calculate the difference in milliseconds
  const differenceInTime = endDate - startDate;

  // Convert the difference from milliseconds to days
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

  return differenceInDays;
}

export const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function generateYearArray() {
  // Get the current year
  const currentYear = new Date().getFullYear();

  // Create an array of years from 2000 to the current year
  const years = [];
  for (let year = 2000; year <= currentYear; year++) {
    years.push(year);
  }
  return years;
}

export function getRandomTwoDigitNumber(Num, Num1) {
  return Math.floor(Math.random() * Num) + 10;
}

export const monthNames = {
  "January": 1,
  "February": 2,
  "March": 3,
  "April": 4,
  "May": 5,
  "June": 6,
  "July": 7,
  "August": 8,
  "September": 9,
  "October": 10,
  "November": 11,
  "December": 12
};

export function getTrueKeys(obj) {
  return Object.keys(obj).filter(key => obj[key] === true);
}

export function formatMonth(month) {
  return month.toString().padStart(2, '0');
}

export const PerPage = [
  "5",
  "10",
  "15",
];

export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (!src) {
      resolve(); // Resolve immediately if no src
      return;
    }
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(src); // Resolve with src for easier debugging
    img.onerror = reject;
  });
};

export const CustomLayout = [
  {
    id: 0,
    value: "Landscape 1920 x 1080"
  },
  {
    id: 1,
    value: "Portrait 1080 x 1920"
  }
]


export const ScrollList = [
  {
    id: 0,
    value: "All"
  },
  {
    id: 1,
    value: "PDF Scroll"
  },
  {
    id: 2,
    value: "DOC Scroll"
  },
  {
    id: 3,
    value: "PPT Scroll"
  },
]

export const Frequent = [
  {
    id: 0,
    value: "In every minute"
  },
  {
    id: 1,
    value: "In every hour"
  },
  {
    id: 2,
    value: "Custom"
  },

]

export const Industry = [
  { id: 0, title: "Educational" },
  { id: 1, title: "Entertainment" },
  { id: 2, title: "Healthcare" },
  { id: 3, title: "Utilities" },
  { id: 4, title: "IT Information" },
]

export const Commission = [
  { id: 0, title: "If we bring the ads" },
  { id: 1, title: "If the client brings the ads" },
]

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export const PageNumber = [5, 10, 25]

export function filterScreensDistance(allArea, screenData,) {
  const filteredScreens = screenData.filter((screen) => {

    const screenLat = parseFloat(screen.latitude);
    const screenLon = parseFloat(screen.longitude);

    return allArea.some((area) => {
      const areaLat = area.latitude;
      const areaLon = area.longitude;
      const dis = area?.area
      const distance = calculateDistance(screenLat, screenLon, areaLat, areaLon);
      return distance < dis;
    });
  });

  return filteredScreens;
}

export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonthmonday = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  return (firstDay === 0 ? 7 : firstDay) - 1;
};

export const getFirstDayOfMonthforsunday = (year, month) => {
  return new Date(year, month, 1).getDay();
};

export function formatToUSCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatINRCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2, // Ensures 2 decimal places
  }).format(amount);
}

export const getZoomLevel = (range) => {
  if (range <= 1) return 15;
  if (range <= 5) return 12;
  return 10;
};


export const countryList = {
  AED: "AE",
  AFN: "AF",
  XCD: "AG",
  ALL: "AL",
  AMD: "AM",
  ANG: "AN",
  AOA: "AO",
  AQD: "AQ",
  ARS: "AR",
  AUD: "AU",
  AZN: "AZ",
  BAM: "BA",
  BBD: "BB",
  BDT: "BD",
  XOF: "BE",
  BGN: "BG",
  BHD: "BH",
  BIF: "BI",
  BMD: "BM",
  BND: "BN",
  BOB: "BO",
  BRL: "BR",
  BSD: "BS",
  NOK: "BV",
  BWP: "BW",
  BYR: "BY",
  BZD: "BZ",
  CAD: "CA",
  CDF: "CD",
  XAF: "CF",
  CHF: "CH",
  CLP: "CL",
  CNY: "CN",
  COP: "CO",
  CRC: "CR",
  CUP: "CU",
  CVE: "CV",
  CYP: "CY",
  CZK: "CZ",
  DJF: "DJ",
  DKK: "DK",
  DOP: "DO",
  DZD: "DZ",
  ECS: "EC",
  EEK: "EE",
  EGP: "EG",
  ETB: "ET",
  EUR: "FR",
  FJD: "FJ",
  FKP: "FK",
  GBP: "GB",
  GEL: "GE",
  GGP: "GG",
  GHS: "GH",
  GIP: "GI",
  GMD: "GM",
  GNF: "GN",
  GTQ: "GT",
  GYD: "GY",
  HKD: "HK",
  HNL: "HN",
  HRK: "HR",
  HTG: "HT",
  HUF: "HU",
  IDR: "ID",
  ILS: "IL",
  INR: "IN",
  IQD: "IQ",
  IRR: "IR",
  ISK: "IS",
  JMD: "JM",
  JOD: "JO",
  JPY: "JP",
  KES: "KE",
  KGS: "KG",
  KHR: "KH",
  KMF: "KM",
  KPW: "KP",
  KRW: "KR",
  KWD: "KW",
  KYD: "KY",
  KZT: "KZ",
  LAK: "LA",
  LBP: "LB",
  LKR: "LK",
  LRD: "LR",
  LSL: "LS",
  LTL: "LT",
  LVL: "LV",
  LYD: "LY",
  MAD: "MA",
  MDL: "MD",
  MGA: "MG",
  MKD: "MK",
  MMK: "MM",
  MNT: "MN",
  MOP: "MO",
  MRO: "MR",
  MTL: "MT",
  MUR: "MU",
  MVR: "MV",
  MWK: "MW",
  MXN: "MX",
  MYR: "MY",
  MZN: "MZ",
  NAD: "NA",
  XPF: "NC",
  NGN: "NG",
  NIO: "NI",
  NPR: "NP",
  NZD: "NZ",
  OMR: "OM",
  PAB: "PA",
  PEN: "PE",
  PGK: "PG",
  PHP: "PH",
  PKR: "PK",
  PLN: "PL",
  PYG: "PY",
  QAR: "QA",
  RON: "RO",
  RSD: "RS",
  RUB: "RU",
  RWF: "RW",
  SAR: "SA",
  SBD: "SB",
  SCR: "SC",
  SDG: "SD",
  SEK: "SE",
  SGD: "SG",
  SKK: "SK",
  SLL: "SL",
  SOS: "SO",
  SRD: "SR",
  STD: "ST",
  SVC: "SV",
  SYP: "SY",
  SZL: "SZ",
  THB: "TH",
  TJS: "TJ",
  TMT: "TM",
  TND: "TN",
  TOP: "TO",
  TRY: "TR",
  TTD: "TT",
  TWD: "TW",
  TZS: "TZ",
  UAH: "UA",
  UGX: "UG",
  USD: "US",
  UYU: "UY",
  UZS: "UZ",
  VEF: "VE",
  VND: "VN",
  VUV: "VU",
  YER: "YE",
  ZAR: "ZA",
  ZMK: "ZM",
  ZWD: "ZW",
};


export const AllCurrency = [{
  name: "INR",
  value: "INR"
},
{
  name: "USD",
  value: "USD"
}]