import React, { useEffect, useState } from "react";
import { AiOutlineCloseCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { SelectByUserScreen } from "../../../../Redux/ScreenGroupSlice";
import { SELECT_BY_USER_SCREENDETAIL } from "../../../../Pages/Api";
import Modal from "react-responsive-modal";
import ReactTooltip from "react-tooltip";
import { HiUserGroup } from "react-icons/hi2";
import moment from "moment";
import toast from "react-hot-toast";

const modalStyle = {
  width: "80%", // You can adjust the width based on your preference
  height: "600px", // Set the fixed height here
};

const ScreenGroupModal = ({
  label,
  onClose,
  handleSaveNew,
  editSelectedScreen,
  updateScreen,
  isOpen,
  sidebarOpen,
}) => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.root.screenGroup.screenData);

  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [loadFirst, setLoadFirst] = useState(true);
  const [selectedItems, setSelectedItems] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust items per page as needed

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${SELECT_BY_USER_SCREENDETAIL}?ID=${user?.userID}`,
      headers: {
        Authorization: authToken,
      },
    };

    if (loadFirst) {
      dispatch(SelectByUserScreen({ config }));
      setLoadFirst(false);
    }
  }, [dispatch, loadFirst, store]);

  const totalPages = Math.ceil(store.data?.length / itemsPerPage);
  const paginatedData = store.data?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCheckboxChange = (screenID) => {
    if (selectedItems === screenID) {
      setSelectedItems(null);
    } else {
      setSelectedItems(screenID);
    }
  };

  const handleSaveScreen = async () => {
    if (selectedItems === null) {
      toast.error("Please Select Screen");
      return;
    }
    const getName = paginatedData.find(
      (item) => item.screenID === selectedItems
    );
    const payLoad = {
      screenID: selectedItems,
      screenName: getName.screenName,
      screenStatus: getName.screenStatus,
      macid: getName?.macid,
      tags: getName.tags,
    };
    await handleSaveNew(payLoad);
    setSelectedItems();
    onClose();
  };

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={onClose}
        center
        // styles={{ modal: modalStyle }}
      >
        <div class="flex items-center justify-between w-full bg-white sticky p-2">
          <h3 className="text-left font-semibold text-2xl sticky top-0 bg-white w-full">
            Select Screens{" "}
          </h3>
        </div>

        <div class="relative overflow-x-auto shadow-md sm:rounded-lg screen-section">
          <div className="schedual-table bg-white rounded-xl mt-5 px-3">
            <div className="relative overflow-x-auto sc-scrollbar rounded-lg">
              <table
                className="screen-table min-w-full leading-normal text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 lg:table-fixed"
                cellPadding={15}
              >
                <thead className="text-xs text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg screen-table-th">
                    <th
                      scope="col"
                      className="text-[#5A5881] text-sm font-semibold p-2 pl-5"
                    >
                      <div className="text-left">Screen</div>
                    </th>

                    <th
                      scope="col"
                      className="text-[#5A5881] text-sm font-semibold p-2"
                    >
                      <div className="text-center">Google Location</div>
                    </th>

                    <th
                      scope="col"
                      className="text-[#5A5881] text-sm font-semibold p-2"
                    >
                      <div className="text-center">Status</div>
                    </th>

                    <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                      Last Seen
                    </th>

                    <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                      Now Playing
                    </th>

                    <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                      Current Schedule
                    </th>

                    <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                      Tags
                    </th>

                    <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                      Group Apply
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {store && store.data?.length > 0 ? (
                    paginatedData?.map((screen) => (
                      <tr
                        key={screen.screenID}
                        onClick={() => handleCheckboxChange(screen.screenID)}
                        className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm   px-5 py-2"
                      >
                        <td className="text-left">
                          <div className="text-left">
                            <input
                              type="checkbox"
                              className="mr-3"
                              checked={selectedItems === screen.screenID}
                              onChange={() =>
                                handleCheckboxChange(screen.screenID)
                              }
                            />
                            {screen.screenName}
                          </div>
                        </td>

                        <td className="text-center break-words">
                          {screen.googleLocation}
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
                        </td>

                        <td className="p-2 text-center break-words">
                          {moment(screen?.updatedDate).format("LLL")}
                        </td>

                        <td
                          className="text-center "
                          style={{ wordBreak: "break-all" }}
                        >
                          <div className="flex items-center justify-between gap-2 border-gray bg-lightgray border rounded-full py-2 px-3 lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-aut hover:shadow-primary-500/50">
                            <p className="line-clamp-1">{screen.assetName}</p>
                            <AiOutlineCloudUpload className="min-h-[1rem] min-w-[1rem]" />
                          </div>
                        </td>

                        <td className="text-center break-words">
                          {screen.scheduleName === ""
                            ? ""
                            : `${screen.scheduleName} Till ${moment(
                                screen.endDate
                              ).format("YYYY-MM-DD hh:mm")}`}
                          
                        </td>

                        <td className="text-center break-words">
                          {screen.tags}
                        </td>

                        <td className="p-2 text-center  break-words">
                          {screen.isContainGroup === 1 && (
                            <button
                              data-tip
                              data-for="show in screen"
                              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                              <HiUserGroup />
                              <ReactTooltip
                                id="show in screen"
                                place="bottom"
                                type="warning"
                                effect="solid"
                              >
                                <span>{screen.groupName}</span>
                              </ReactTooltip>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        {store && store.data?.length === 0 ? (
                          "No data found"
                        ) : (
                          <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2">
                            No Data Available
                          </span>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end m-5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex cursor-pointer hover:bg-white hover:text-primary items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <svg
                  className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 5H1m0 0 4 4M1 5l4-4"
                  />
                </svg>
                Previous
              </button>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex hover:bg-white hover:text-primary cursor-pointer items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Next
                <svg
                  className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </button>
            </div>

            {/* Modal footer */}
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 justify-start">
              <button
                data-modal-hide="static-modal"
                type="button"
                className="border-2 border-primary  rounded-lg ml-3 text-white bg-primary  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={handleSaveScreen}
              >
                {label}
              </button>
              <button
                data-modal-hide="static-modal"
                type="button"
                className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ScreenGroupModal;
