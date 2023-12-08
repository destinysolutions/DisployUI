import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import { SELECT_BY_USER_SCREENDETAIL } from "../Pages/Api";

const ScreenAssignModal = ({
  setAddScreenModal,
  setSelectScreenModal,
  handleUpdateScreenAssign,
  selectedScreens,
  setSelectedScreens,
}) => {
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [screenCheckboxes, setScreenCheckboxes] = useState({});
  const [screenData, setScreenData] = useState([]);

  const selectScreenRef = useRef(null);

  useEffect(() => {
    if (UserData.user?.userID) {
      axios
        .get(`${SELECT_BY_USER_SCREENDETAIL}?ID=${UserData.user?.userID}`, {
          headers: {
            Authorization: authToken,
          },
        })
        .then((response) => {
          const fetchedData = response.data.data;

          setScreenData(fetchedData);
          const initialCheckboxes = {};
          if (Array.isArray(fetchedData)) {
            fetchedData.forEach((screen) => {
              initialCheckboxes[screen.screenID] = false;
            });
            setScreenCheckboxes(initialCheckboxes);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [UserData.user?.userID]);

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
      setSelectedScreens(allScreenIds);
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

    // Update the selected screens state
    setSelectedScreens(updatedSelectedScreens);

    // Check if any individual screen checkbox is unchecked
    const allChecked = Object.values(updatedCheckboxes).every(
      (isChecked) => isChecked
    );

    setSelectAllChecked(allChecked);
  };

  return (
    <div>
      <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div
          ref={selectScreenRef}
          className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs"
        >
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
              <div className="flex items-center">
                <div className=" mt-1.5">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    onChange={handleSelectAllCheckboxChange}
                    checked={selectAllChecked}
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
                }}
              >
                <AiOutlineCloseCircle className="text-3xl" />
              </button>
            </div>
            <div className="schedual-table bg-white rounded-xl mt-8 shadow p-3">
              <table className="w-full" cellPadding={20}>
                <thead>
                  <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg">
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
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
                  {screenData.map((screen) => (
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
                        <button className="rounded-full px-6 py-1 text-white bg-[#3AB700]">
                          Live
                        </button>
                      </td>
                      <td className="text-center break-words">
                        {screen.googleLocation}
                      </td>

                      <td className="text-center break-words">
                        Schedule Name Till 28 June 2023
                      </td>
                      <td className="text-center break-words">{screen.tags}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="py-4 flex justify-center">
              <button
                className="border-2 border-primary px-5 py-2 rounded-full ml-3"
                onClick={() => {
                  handleUpdateScreenAssign();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenAssignModal;