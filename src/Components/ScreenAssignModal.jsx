import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { SELECT_BY_USER_SCREENDETAIL } from "../Pages/Api";
import ShowAssetModal from "./ShowAssetModal";
import { handleGetAllAssets } from "../Redux/Assetslice";

const ScreenAssignModal = ({
  setAddScreenModal,
  setSelectScreenModal,
  type,
}) => {
  const dispatch = useDispatch();

  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [screenCheckboxes, setScreenCheckboxes] = useState({});
  const [screenData, setScreenData] = useState([]);
  const [popupActiveTab, setPopupActiveTab] = useState(1);
  const [selectedTextScroll, setSelectedTextScroll] = useState();
  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);
  const [assetPreview, setAssetPreview] = useState("");

  const [assetScreenID, setAssetScreenID] = useState(null);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState({ assetName: "" });

  const [screenName, setScreenName] = useState("");
  const [validationError, setValidationError] = useState("");
  const [selectedScreens, setSelectedScreens] = useState([]);

  const selectedScreenIdsString = Array.isArray(selectedScreens)
    ? selectedScreens.join(",")
    : "";

  const selectScreenRef = useRef(null);

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

  // get all assets files
  useEffect(() => {
    dispatch(handleGetAllAssets({ token }));
  }, []);

  useEffect(() => {
    if (user?.userID) {
      axios
        .get(`${SELECT_BY_USER_SCREENDETAIL}?ID=${user?.userID}`, {
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

  const handleAssetAdd = (asset) => {
    setSelectedAsset(asset);
    setAssetPreview(asset);
  };

  function handleClickOutside() {
    setSelectScreenModal(false);
  }

  const handleAssetUpdate = () => {
    console.log( "--------- MergedScreens ------ handleAssetUpdate ---- ", selectedAsset);
  };

  const handleScreenNameChange = (event) => {
    const inputValue = event.target.value;
    // Your validation logic goes here
    if (inputValue.trim() === "") {
      setValidationError("Screen Name cannot be empty");
    } else {
      setValidationError("");
    }

    setScreenName(inputValue);
  };

  const handleUpdateScreenAssign = () => {
    // Validation check
    if (screenName.trim() === "") {
      setValidationError("Screen Name cannot be empty");
      return; // Do not proceed with the update if validation fails
    } else {
      setValidationError("");
    }

    // Perform your screen assignment logic here
    setSelectScreenModal(false);
    setAddScreenModal(false);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      // url: `https://disployapi.thedestinysolutions.com/api/AssetMaster/AssignAssetToScreen?AssetId=${screenAssetID}&ScreenID=${selectedScreenIdsString}`,
      // headers: {
      //   Authorization: authToken,
      // },
    };

    // Add your logic for updating screen assignment

    const paylod = {
      name: screenName,
      assetID: selectedAsset?.assetID,
      selectedScreens: selectedScreenIdsString,
    };

    console.log(" Merged Screens ---- ", { paylod });
    // ...

    // Clear screenName and validationError after updating
    setScreenName("");
    setValidationError("");
  };

  return (
    <div>
      <div className="bg-black bg-opacity-50 justify-center items-center flex h-screen w-screen overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div
          ref={selectScreenRef}
          className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs"
        >
          <div className="border-0 rounded-lg shadow-lg relative h-[80vh] flex flex-col w-full bg-white outline-none focus:outline-none">
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

            {type === "merged_screens" && (
              <div className="relative p-3">
                <div className="grid gap-4 grid-cols-2">
                  <div className="">
                    <input
                      type="text"
                      name="screen_name"
                      id="screen_name"
                      placeholder="Enter Screen Name"
                      className={`bg-gray-200 border ${
                        validationError
                          ? "border-red-500 error"
                          : "input-bor-color"
                      } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      value={screenName}
                      onChange={handleScreenNameChange}
                    />
                  </div>

                  <div>
                    <div
                      onClick={(e) => {
                        // setAssetScreenID(screen.screenID);
                        setShowAssetModal(true);
                        setSelectedAsset({
                          ...selectedAsset,
                          assetName: e.target.value,
                        });
                        setSelectedAsset(selectedAsset?.userName);
                      }}
                      title={selectedAsset?.userName}
                      className="flex items-center justify-between gap-2 border-gray bg-lightgray border  py-2 px-3 lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto"
                    >
                      <p className="line-clamp-3">
                        {selectedAsset?.userName || "Upload Media"}
                      </p>
                      <AiOutlineCloudUpload className="min-h-[1rem] min-w-[1rem]" />
                    </div>

                    {showAssetModal && (
                      <ShowAssetModal
                        handleAssetAdd={handleAssetAdd}
                        handleAssetUpdate={handleAssetUpdate}
                        // setSelectedComposition={setSelectedComposition}
                        // handleAppsAdd={handleAppsAdd}
                        popupActiveTab={popupActiveTab}
                        setAssetPreviewPopup={setAssetPreviewPopup}
                        setPopupActiveTab={setPopupActiveTab}
                        setShowAssetModal={setShowAssetModal}
                        assetPreviewPopup={assetPreviewPopup}
                        assetPreview={assetPreview}
                        // selectedComposition={selectedComposition}
                        selectedTextScroll={selectedTextScroll}
                        // selectedYoutube={selectedYoutube}
                        selectedAsset={selectedAsset}
                        type={type}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="schedual-table h-[80%] overflow-y-scroll bg-white rounded-xl mt-8 shadow p-3">
              <table
                className="w-full h-full overflow-y-scroll"
                cellPadding={20}
              >
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
