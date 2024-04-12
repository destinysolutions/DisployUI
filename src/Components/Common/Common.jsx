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
      setUserDisable({
        ...userDisable,
        [`${name}`]: [...data, Number(selectedValue)],
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
    let View = watch(`${item?.alt}_View`);
    let Save = watch(`${item?.alt}_Edit`);
    let Delete = watch(`${item?.alt}_Delete`);
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

export function multiOptions(arr) {
  return arr.map(screen => ({
    label: screen.screenName,
    value: screen.screenID.toString(),
    Price: screen?.screenRatePerSec,
    output: `${screen?.screenID}_${screen?.organizationID}`
  }));
}

export const IncludeExclude = [
  {
    label: "Include",
    value: 1
  },
  {
    label: "Exclude",
    value: 2
  },
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


// Function to convert time string (HH:MM:SS) to seconds
function timeToSeconds(time) {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

// Calculate the difference between two times in seconds
export function timeDifferenceInSeconds(start, end) {
  const startTimeInSeconds = timeToSeconds(start);
  const endTimeInSeconds = timeToSeconds(end);
  return endTimeInSeconds - startTimeInSeconds;
}

export function secondsToHMS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}




export const greenOptions = {
  color: "blue",
  fillColor: "blue",
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

export function constructTimeObjects(getallTime, startDate, endDate, repeat, day, selectedTimeZone, allTimeZone) {
  let arr1 = [];

  getallTime?.map((item) => {
    let data = {
      startDate: `${startDate} 00:00:00`,
      endDate: `${endDate} 00:00:00`,
      startTime: `${item?.startTime}:${item?.startTimeSecond}`,
      endTime: `${item?.endTime}:${item?.endTimeSecond}`,
      isRepeat: repeat,
      repeatDays: day.join(", "),
      systemTimeZone: getTimeZoneName(allTimeZone, selectedTimeZone),
    };
    arr1?.push(data);
  });

  return arr1;
}

export const getTimeZoneName = (allTimeZone, selectedTimeZone) => {
  const timeZoneObject = allTimeZone.find(item => item.timeZoneID === selectedTimeZone);
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