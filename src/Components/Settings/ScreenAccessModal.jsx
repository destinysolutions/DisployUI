import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { SELECT_BY_USER_SCREENDETAIL } from "../../Pages/Api";
import { handleGetScreen } from "../../Redux/Screenslice";
import moment from "moment";

const ScreenAccessModal = ({
  setAddScreenModal,
  setSelectScreenModal,
  handleUpdateScreenAssign,
  selectedScreens,
  setSelectedScreens,
}) => {
  const dispatch = useDispatch();

  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [screenCheckboxes, setScreenCheckboxes] = useState({});
  const [screenData, setScreenData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [screenMacID, setScreenMacID] = useState("");

  const selectScreenRef = useRef(null);

  const selectedScreenMacIdsString = Array.isArray(screenMacID)
    ? screenMacID.join(",")
    : "";

  const handleSelectAllCheckboxChange = (e) => {
    const checked = e.target.checked;
    setSelectAllChecked(checked);
    // Set the state of all individual screen checkboxes
    const updatedCheckboxes = {};
    for (const screenID in screenCheckboxes) {
      updatedCheckboxes[screenID] = checked;
    }
    setScreenCheckboxes(updatedCheckboxes);
    // Update the selected screens state based on whether "All Select" is checked
    if (checked) {
      const allScreenIds = screenData.map((screen) => screen.screenID);
      const allScreenmacIds = screenData.map((screen) => screen.macid);
      setSelectedScreens(allScreenIds);
      setScreenMacID(allScreenmacIds);
    } else {
      setSelectedScreens([]);
    }
  };

  const handleScreenCheckboxChange = (screenID) => {
    const updatedCheckboxes = { ...screenCheckboxes };
    updatedCheckboxes[screenID] = !updatedCheckboxes[screenID];
    setScreenCheckboxes(updatedCheckboxes);

    // Create a copy of the selected screens array
    const updatedSelectedScreens = [...selectedScreens];

    // If the screenID is already in the array, remove it; otherwise, add it
    if (updatedSelectedScreens.includes(screenID)) {
      const index = updatedSelectedScreens.indexOf(screenID);
      updatedSelectedScreens.splice(index, 1);
    } else {
      updatedSelectedScreens.push(screenID);
    }
    const screenAssigned = screenData.filter((item) =>
      updatedSelectedScreens.includes(item?.screenID)
    );
    setScreenMacID(screenAssigned.map((i) => i.macid));

    // Update the selected screens state
    setSelectedScreens(updatedSelectedScreens);

    // Check if any individual screen checkbox is unchecked
    const allChecked = Object.values(updatedCheckboxes).every(
      (isChecked) => isChecked
    );

    setSelectAllChecked(allChecked);
  };

  // get all assets files
  useEffect(() => {
    const screenAssigned = screenData.filter((item) =>
      selectedScreens.includes(item?.screenID)
    );
    const foundMacID = screenAssigned.map((i) => i.macid);
    setScreenMacID(foundMacID);

    if (user?.userID) {
      setLoading(true);
      axios
        .get(`${SELECT_BY_USER_SCREENDETAIL}?ID=${user?.userID}`, {
          headers: {
            Authorization: authToken,
          },
        })
        .then((response) => {
          const fetchedData = response.data.data;
          setScreenData(fetchedData);
          setLoading(false);
          const initialCheckboxes = {};
          if (Array.isArray(fetchedData)) {
            fetchedData.forEach((screen) => {
              initialCheckboxes[screen.screenID] = selectedScreens?.includes(
                screen.screenID
              )
                ? true
                : false;
            });
            setScreenCheckboxes(initialCheckboxes);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectScreenRef.current &&
        !selectScreenRef.current.contains(event?.target)
      ) {
        setSelectScreenModal(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setSelectScreenModal(false);
  }

  useEffect(() => {
    dispatch(handleGetScreen({ token }));
    window.addEventListener("keydown", function (event, characterCode) {
      if (typeof characterCode == "undefined") {
        characterCode = -1;
      }
      if (event?.keyCode == 27) {
        setSelectScreenModal(false);
        setAddScreenModal(false);
      }
    });
    return () => {
      window.removeEventListener("keydown", () => null);
    };
  }, []);

  return (
    <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
      <div
        ref={selectScreenRef}
        className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs"
      >
        <div className="border-0 rounded-lg min-w-[40vw] overflow-y-auto shadow-lg relative flex flex-col bg-white outline-none focus:outline-none min-h-[350px] max-h-[550px]">
          <div className="flex sticky top-0 bg-white z-10 items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
            <div className="flex items-center">
              <div className=" mt-1.5">
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  onChange={handleSelectAllCheckboxChange}
                  checked={
                    selectAllChecked ||
                    (Object.values(screenCheckboxes)?.length > 0 &&
                      Object.values(screenCheckboxes).every((e) => {
                        return e == true;
                      }))
                  }
                />
              </div>
              <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium ml-3">
                All Select 
             </h3>
            </div>
            <button
              className="p-1 text-xl"
              onClick={() => {
                setSelectScreenModal(false);
                setAddScreenModal(false);
                setSelectedScreens([]);
              }}
            >
              <AiOutlineCloseCircle className="text-3xl" />
            </button>
          </div>
          <div className="schedual-table bg-white rounded-xl mt-8 shadow p-3 w-full overflow-x-auto min-h-[350px] max-h-[550px]">
            <table className="w-full" cellPadding={15}>
              <thead>
                <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg">
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-left">
                    Screen
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Status
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Google Location
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Associated Schedule
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                    
                    >
                    <div className="flex text-center m-5 justify-center">
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-10 h-10 me-3 text-gray-200 animate-spin dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="#1C64F2"
                      />
                    </svg>

                  </div>
                    </td>
                  </tr>
                ) : !loading && screenData?.length > 0 ? (
                  screenData.map((screen) => (
                    <tr
                      key={screen.screenID}
                      className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                    >
                      <td className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3"
                          onChange={() =>
                            handleScreenCheckboxChange(screen.screenID)
                          }
                          checked={screenCheckboxes[screen.screenID]}
                        />

                        {screen.screenName}
                      </td>

                      <td className="text-center">
                        <span
                          id={`changetvstatus${screen.macid}`}
                          className={`rounded-full px-6 py-2 text-white text-center ${
                            screen.screenStatus == 1
                              ? "bg-[#3AB700]"
                              : "bg-[#FF0000]"
                          }`}
                        >
                          {screen.screenStatus == 1 ? "Live" : "offline"}
                        </span>
                        {/* <button className="rounded-full px-6 py-1 text-white bg-[#3AB700]">
                          Live
                        </button> */}
                      </td>
                      <td className="text-center break-words">
                        {screen.googleLocation}
                      </td>

                      <td className="text-center break-words">
                        {screen.scheduleName == ""
                          ? ""
                          : `${screen.scheduleName} Till
                  ${moment(screen.endDate).format("YYYY-MM-DD hh:mm")}`}
                      </td>
                      <td className="text-center break-words">
                        {screen?.tags !== null
                          ? screen?.tags
                              .split(",")
                              .slice(
                                0,
                                screen?.tags.split(",").length > 2
                                  ? 3
                                  : screen?.tags.split(",").length
                              )
                              .map((text) => {
                                if (text.toString().length > 10) {
                                  return text
                                    .split("")
                                    .slice(0, 10)
                                    .concat("...")
                                    .join("");
                                }
                                return text;
                              })
                              .join(",")
                          : ""}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                    <div className="flex text-center m-5 justify-center">
                    <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2 text-black">
                      No Data Available
                    </span>
                  </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="py-4 flex justify-center sticky bottom-0 z-10 bg-white">
            <button
              className={`border-2 border-primary px-5 py-2 rounded-full ml-3 `}
              onClick={() => {
                handleUpdateScreenAssign(
                  screenCheckboxes,
                  screenMacID.join(",").replace(/^\s+/g, "")
                );
                setSelectedScreens([]);
              }}
              // disabled={selectedScreens?.length === 0}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenAccessModal;
