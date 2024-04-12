import React, { useEffect, useState } from "react";
import { RiAddFill } from "react-icons/ri";
import { BsEyeFill } from "react-icons/bs";
import ReactTooltip from "react-tooltip";
import { AiOutlineSearch } from "react-icons/ai";
import AssetsPreview from "../../Components/Common/AssetsPreview";
import AddPriceForAds from "../../Components/Common/AddPriceForAds";
import { useDispatch, useSelector } from "react-redux";
import {
  UpdateAdsRate,
  getNotificationData,
  resetStatus,
} from "../../Redux/admin/AdvertisementSlice";
import moment from "moment/moment";
import toast from "react-hot-toast";
import AddUserAdsForPrice from "../../Components/Common/AddUserAdsForPrice";

const AdNotifications = ({ sidebarOpen }) => {
  const store = useSelector((state) => state.root.advertisementData);
  const dispatch = useDispatch();

  // pagination Start
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const filteredData = store?.getNotification?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  // pagination End

  const [open, setOpen] = useState(false);
  const [openPriceAds, setOpenPriceAds] = useState(false);
  const [openPreview, setOpenPreview] = useState();
  const [loadFirst, setloadFirst] = useState(true);
  const [label, setLabel] = useState("");
  const [editIdAds, setEditAdsId] = useState("");

  useEffect(() => {
    if (loadFirst) {
      dispatch(getNotificationData());
      setloadFirst(false);
    }

    if (store && store.status === "succeeded") {
      toast.success(store.message);
      setloadFirst(true);
      dispatch(resetStatus());
    }
  }, [loadFirst, store]);

  const toggleModal = () => {
    setOpenPriceAds(!openPriceAds)
  }

  return (
    <>
      <div className="lg:py-5 md:py-5 sm:py-2 xs:py-2">
        <div className="flex md:justify-end sm:justify-center lg:mb-5 mb-2">
          <div className="flex justify-end">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <AiOutlineSearch className="w-5 h-5 text-gray" />
              </span>
              <input
                type="text"
                placeholder="Searching.."
                className="border border-primary rounded-full pl-10 py-1.5 search-user"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <div className="clear-both">
          <div className="screen-section">
            <div className="mt-5 overflow-x-scroll sc-scrollbar">
              <table
                className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                cellPadding={15}
              >
                <thead>
                  <tr className="items-center table-head-bg">
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Name
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      GoogleLocation
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Required Screen
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Start Date
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      End Date
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr className="border-b border-b-[#E4E6FF]" key={index}>
                      <td className="text-[#5E5E5E] ">
                        <div className="text-base text-center font-medium capitalize">
                          {item.name}
                        </div>
                      </td>
                      <td className="text-[#5E5E5E]">
                        <div className="text-base text-center font-medium">
                          {item.googleLocation}
                        </div>
                      </td>
                      <td className="text-[#5E5E5E]">
                        <div className="text-base text-center font-medium">
                          {item.screen}
                        </div>
                      </td>
                      <td className="text-[#5E5E5E] text-center">
                        <div className="text-base text-center font-medium">
                          {moment(item?.startDate).format(
                            "DD-MM-YYYY" + " - " + "HH:mm:ss"
                          )}
                        </div>
                      </td>
                      <td className="text-[#5E5E5E] text-center">
                        <div className="text-base text-center font-medium">
                          {moment(item?.endDate).format(
                            "DD-MM-YYYY" + " - " + "HH:mm:ss"
                          )}
                        </div>
                      </td>
                      <td className="text-[#5E5E5E] text-center">
                        <div className="flex justify-center gap-4">
                          <div
                            data-tip
                            data-for="View"
                            className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-xl p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            <BsEyeFill
                              onClick={() => {
                                setOpenPreview(item);
                                setOpen(true);
                              }}
                            />
                            <ReactTooltip
                              id="View"
                              place="bottom"
                              type="warning"
                              effect="solid"
                            >
                              <span>View</span>
                            </ReactTooltip>
                          </div>
                          <div
                            data-tip
                            data-for="Add Price"
                            className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-xl p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={() => {
                              setOpenPriceAds(true);
                              setLabel("Add Price");
                              setEditAdsId(item);
                            }}
                          >
                            <RiAddFill
                            />
                            <ReactTooltip
                              id="Add Price"
                              place="bottom"
                              type="warning"
                              effect="solid"
                            >
                              <span>Add Price</span>
                            </ReactTooltip>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="text-[#5E5E5E] font-semibold text-center text-2xl"
                      colSpan={6}
                    >
                      Data Not found !
                    </td>
                  </tr>
                )}
              </table>
            </div>

            {/* Pagination start */}
            {filteredData.length > 0 && (
              <div className="flex justify-end p-5">
                <div className="flex justify-end mar-btm-15">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
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
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={
                      currentPage ===
                      Math.ceil(filteredData.length / itemsPerPage)
                    }
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
              </div>
            )}
            {/* Pagination End */}
          </div>
        </div>
      </div>

      {open && (
        <AssetsPreview
          open={open}
          setOpen={setOpen}
          openPreview={openPreview}
        />
      )}

      {/* {openPriceAds && (
        <AddPriceForAds
          openPriceAds={openPriceAds}
          setOpenPriceAds={setOpenPriceAds}
          label={label}
          AddPriceAds={AddPriceAds}
        />
     )}*/}
      {openPriceAds && (
        <AddUserAdsForPrice toggleModal={toggleModal} sidebarOpen={sidebarOpen} editIdAds={editIdAds} setloadFirst={setloadFirst} />
      )}
    </>
  );
};

export default AdNotifications;
