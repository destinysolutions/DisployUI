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
                      className="text-center font-semibold text-lg"
                    >
                      Loading...
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
                      <p className="text-center p-2">No Screen available.</p>
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
