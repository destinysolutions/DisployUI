import React, { useRef, useState } from "react";
import AdminSidebar from "../AdminSidebar";
import AdminNavbar from "../AdminNavbar";
import { BiUserPlus } from "react-icons/bi";
import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai";
import { debounce } from "lodash";
import * as Yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import AddEditAdvertisement from "./AddEditAdvertisement";
import CustomerScreen from "./CustomerScreen";
import { GET_ALL_ORGANIZATION_MASTER } from "../AdminAPI";
import { useEffect } from "react";
import { ADDEDITADVERTISEMENT, GETALLADS } from "../../Pages/Api";
import { MdOutlineResetTv, MdPreview } from "react-icons/md";
import moment from "moment";
import {
  assignAdvertisement,
  getAdvertisementData,
} from "../../Redux/admin/AdvertisementSlice";
import { useDispatch } from "react-redux";
import { getOnBodingData } from "../../Redux/admin/OnBodingSlice";
import AssetsPreview from "../../Components/Common/AssetsPreview";
import { BsEyeFill } from "react-icons/bs";
import AdminMarginmodel from "./AdminMarginmodel";

const Advertisement = ({ sidebarOpen, setSidebarOpen }) => {
  const hiddenFileInput = useRef(null);
  const TodayDate = new Date();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showSelectScreenModal, setShowSelectScreenModal] = useState(false);
  const [showSelectMarginModal, setShowSelectMarginModal] = useState(false);
  const [adsPreview, setAdsPreview] = useState(false);

  const [customerList, setCustomerList] = useState({
    allCustomer: [],
    searchCustomer: [],
  });
  const [heading, setHeading] = useState("Add");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [allAdvertisement, setAllAdvertisement] = useState({
    advertisementData: [],
    SearchData: [],
  });
  const [selectAds, setSelectAds] = useState("");

  //   Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]); // Multipal check
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectcheck, setSelectCheck] = useState(false);
  const [searchAds, setSearchAds] = useState("");
  const toggleModal = () => {
    setShowModal(!showModal);
    formik.resetForm();
  };

  const handleClose = () => {
    setShowSelectScreenModal(false);
    setSelectAllChecked(false);
    setSelectCheck(false);
    setSelectedItems([]);
    setSelectAds("");
  };

  const filteredData = Array.isArray(customerList?.allCustomer)
    ? customerList?.allCustomer?.filter((item) =>
      Object.values(item).some(
        (value) => value
        // &&
        // value.toString().toLowerCase().includes(searchScreen.toLowerCase())
      )
    )
    : [];

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  const fiterAds = Array.isArray(allAdvertisement?.advertisementData)
    ? allAdvertisement?.advertisementData?.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchAds.toLowerCase())
      )
    )
    : [];

  const totalAdsPages = Math.ceil(fiterAds?.length / itemsPerPage);

  // Function to sort the data based on a field and order
  const sortData = (data, field, order) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      if (order === "asc") {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
    return sortedData;
  };

  const sortedAndPaginatedData = sortData(
    filteredData,
    sortedField,
    sortOrder
  ).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const sortedAndPaginatedAdsData = sortData(
    fiterAds,
    sortedField,
    sortOrder
  ).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle sorting when a table header is clicked
  const handleSort = (field) => {
    if (sortedField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder("asc");
      setSortedField(field);
    }
  };
  // Pagination End

  function getTimeFromDate(date) {
    const hours = String(date.getHours()).padStart(2, "0"); // Ensure two digits
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensure two digits
    const time = `${hours}:${minutes}`;
    return time;
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const currentTime = getTimeFromDate(TodayDate);
  const currentDate = formatDate(TodayDate);

  //using for validation and register api calling
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const validationSchema = Yup.object().shape({
    Name: Yup.string().required("Name is required"),
    Screen: Yup.string().required("Screen is required").max(3),
    googleLocation: Yup.string().required("Google Location is required"),
    Email: Yup.string()
      .required("Email is required")
      .email("E-mail must be a valid e-mail!"),
    PhoneNumber: Yup.string()
      .required("Phone Number is required")
      .matches(phoneRegExp, "Phone number is not valid"),
  });

  const formik = useFormik({
    initialValues: {
      Name: "",
      Screen: "",
      googleLocation: "",
      startTime: currentTime,
      endTime: currentTime,
      startDate: currentDate,
      endDate: currentDate,
      PhoneNumber: "",
      Email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      toast.loading("saving...");
      const formData = new FormData();
      formData.append("Name", values.Name);
      formData.append("startTime", values.startTime);
      formData.append("endTime", values.endTime);
      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);
      formData.append("googleLocation", values.googleLocation);
      formData.append("Screen", values.Screen);
      formData.append("file", file);
      formData.append("Email", values.Email);
      formData.append("PhoneNumber", values.PhoneNumber);
      formData.append("AssetType", file?.type?.split("/")?.[0]);
      setLoading(true);
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: ADDEDITADVERTISEMENT,
        headers: { "Content-Type": "multipart/form-data", },
        data: formData,
      };
      const response = await axios.request(config);
      if (response?.data?.status === true) {
        toast?.remove();
        formik.resetForm();
        toast.success("Advertisement Details saved successfully!");
        fetchAds();
        setLoading(false);
        setShowModal(false);
      } else {
        setLoading(false);
        toast.error(response?.data?.message);
      }
    },
  });

  const fetchUserData = () => {
    dispatch(getOnBodingData())
      .then((response) => {
        setCustomerList({
          allCustomer: response.payload.data,
          searchCustomer: response.payload.data,
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const fetchAds = () => {
    dispatch(getAdvertisementData())
      .then((response) => {
        setAllAdvertisement({
          advertisementData: response?.payload?.data,
          SearchData: response?.payload?.data,
        });
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    fetchUserData();
    fetchAds();
  }, []);

  useEffect(() => {
    if (selectcheck && customerList?.allCustomer?.length > 0) {
      if (selectedItems?.length === customerList?.allCustomer?.length) {
        setSelectAllChecked(true);
      }
    }
  }, [selectcheck, selectedItems]);

  const handleSelectAllCheckboxChange = (e) => {
    setSelectAllChecked(!selectAllChecked);
    if (selectedItems.length === customerList?.allCustomer.length) {
      setSelectedItems([]);
    } else {
      const allIds = customerList?.allCustomer.map(
        (item) => item.organizationID
      );
      setSelectedItems(allIds);
    }
  };

  const handleChange = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    setSearchAds(searchQuery);
  };

  const handleScreenCheckboxChange = (screenID) => {
    setSelectAllChecked(false);
    setSelectCheck(true);
    if (selectedItems.includes(screenID)) {
      setSelectedItems(selectedItems.filter((id) => id !== screenID));
    } else {
      setSelectedItems([...selectedItems, screenID]);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const HandleSave = () => {
    toast.loading("saving...");
    let Params = {
      assignAdvertisementid: 0,
      adsCustomerMasterID: selectAds?.adsCustomerMasterID,
      organizationID: selectedItems.join(","),
      mode: "Save",
    };
    dispatch(assignAdvertisement(Params))
      .then((res) => {
        if (res?.payload?.status === 200) {
          toast?.remove();
          toast.success("saved data Successfully");
        }
      })
      .catch((error) => console.log("error", error));
    setShowSelectScreenModal(false);
    setSelectAllChecked(false);
    setSelectCheck(false);
    setSelectedItems([]);
    setSelectAds("");
  };

  const toggleMarginModal = () => {
    setShowSelectMarginModal(!showSelectMarginModal)
  }
  
  useEffect(() => {
    setCurrentPage(1)
  }, [searchAds])

  return (
    <>
      <div className="flex border-b border-gray ">
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <AdminNavbar />
      </div>
      <div className="pt-6 px-5 page-contain ">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium text-2xl sm:text-xl text-[#001737] sm:mb-4 ">
              Advertisement
            </h1>
            <div className="flex gap-3">
              <div className="text-right mb-5 mr-5 relative sm:mr-0">
                <div className="relative md:mr-2 lg:mr-2 lg:mb-0 md:mb-0 mb-3">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                    <AiOutlineSearch className="w-5 h-5 text-gray " />
                  </span>
                  <input
                    type="text"
                    placeholder="Search Advertisement"
                    className="border border-gray rounded-full px-7 py-2 search-user"
                    value={searchAds}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
              <div>
                <button
                  className="flex align-middle items-center float-right bg-SlateBlue text-white rounded-full lg:px-6 sm:px-5 mb-5 py-2 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                  onClick={() => {
                    setShowModal(true);
                    setHeading("Add");
                  }}
                >
                  <BiUserPlus className="text-2xl mr-1" />
                  Add New Advertisement
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className=" bg-white rounded-xl shadow screen-section">
              <div className="overflow-x-scroll sc-scrollbar rounded-lg">
                <table
                  className="screen-table w-full lg:table-fixed sm:table-fixed xs:table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 "
                  cellPadding={15}
                >
                  <thead className="table-head-bg screen-table-th">
                    <tr className="text-left table-head-bg ">
                      <th className="text-[#5A5881] text-base font-semibold w-200">
                        <div className="flex">
                          Name
                          <svg
                            className="w-3 h-3 ms-1.5 mt-2 cursor-pointer"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            onClick={() => handleSort("name")}
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </div>
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold mw-200">
                        Email
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold  mw-200">
                        Google Location
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold mw-200">
                        Phone Number
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold mw-200">
                        Screen
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold mw-200">
                        Start Date
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold mw-200">
                        End Date
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold mw-200">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr className="text-left">
                        <td colSpan={8}>
                          <div className="flex text-center m-5">
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
                    )}
                    {!loading &&
                      allAdvertisement?.SearchData &&
                      sortedAndPaginatedAdsData?.length === 0 && (
                        <tr className="text-left">
                          <td colSpan={8}>
                            <div className="flex text-center m-5 justify-center">
                              <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2 text-black">
                                No Data Available
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}
                    {!loading &&
                      allAdvertisement?.SearchData &&
                      sortedAndPaginatedAdsData?.length !== 0 && (
                        <>
                          {allAdvertisement?.SearchData &&
                            sortedAndPaginatedAdsData?.length > 0 &&
                            sortedAndPaginatedAdsData.map((screen, index) => {
                              return (
                                <tr key={index} className="text-left">
                                  <td className="text-[#5E5E5E] mw-200">
                                    {screen.name}
                                  </td>
                                  <td className="p-2 break-words text-[#5E5E5E] mw-200">
                                    {screen?.email}
                                  </td>
                                  <td className="p-2 mw-200 break-words text-[#5E5E5E]">
                                    {screen?.googleLocation}
                                  </td>
                                  <td className="p-2 mw-200 break-words text-[#5E5E5E]">
                                    {screen?.phoneNumber}
                                  </td>
                                  <td className="p-2 mw-200 break-words text-[#5E5E5E]">
                                    {screen?.screen}
                                  </td>
                                  <td className="p-2 mw-200 break-words text-[#5E5E5E]">
                                    {moment(screen?.startDate).format("LLL")}
                                  </td>
                                  <td className="p-2 mw-200 break-words text-[#5E5E5E]">
                                    {moment(screen?.endDate).format("LLL")}
                                  </td>

                                  <td className="p-2 mw-200">
                                    <div className="relative">
                                      {screen?.isRemove && (
                                        <button
                                          data-tip
                                          data-for="Assign"
                                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-1"
                                          onClick={() => {
                                            setShowSelectMarginModal(true);
                                            setSelectAds(screen);
                                          }}
                                        >
                                          <BsEyeFill />
                                        </button>
                                      )}
                                      <button
                                        data-tip
                                        data-for="Assign"
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-1"
                                        onClick={() => {
                                          setShowSelectScreenModal(true);
                                          setSelectAds(screen);
                                        }}
                                      >
                                        <MdOutlineResetTv />
                                      </button>
                                      <button
                                        data-tip
                                        data-for="Preview"
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-1"
                                        onClick={() => {
                                          setAdsPreview(true);
                                          setSelectAds(screen);
                                        }}
                                      >
                                        <MdPreview />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </>
                      )}
                  </tbody>
                </table>
              </div>
              <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
              <div className="flex items-center">
                <span className="text-gray-500">{`Total ${allAdvertisement?.SearchData?.length} Advertisement`}</span>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex cursor-pointer hover:bg-white hover:text-primary items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 "
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
                  {sidebarOpen ? "Previous" : ""}
                </button>
                <div className="flex items-center me-3">
                  <span className="text-gray-500">{`Page ${currentPage} of ${totalPages}`}</span>
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={(currentPage === totalPages) || (allAdvertisement?.SearchData?.length === 0)}
                  className="flex hover:bg-white hover:text-primary cursor-pointer items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 "
                >
                  {sidebarOpen ? "Next" : ""}
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
            </div>
          </div>
        </div>
      </div>

      {adsPreview && (
        <AssetsPreview
          open={adsPreview}
          setOpen={setAdsPreview}
          openPreview={selectAds}
        />
      )}
      {showModal && (
        <AddEditAdvertisement
          heading={heading}
          toggleModal={toggleModal}
          loading={loading}
          formik={formik}
          hiddenFileInput={hiddenFileInput}
          handleFileChange={handleFileChange}
        />
      )}
      {showSelectScreenModal && (
        <CustomerScreen
          handleClose={handleClose}
          customerList={customerList}
          handlePageChange={handlePageChange}
          loading={loading}
          sortedAndPaginatedData={sortedAndPaginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          handleSort={handleSort}
          handleSelectAllCheckboxChange={handleSelectAllCheckboxChange}
          selectAllChecked={selectAllChecked}
          HandleSave={HandleSave}
          selectedItems={selectedItems}
          handleScreenCheckboxChange={handleScreenCheckboxChange}
          sidebarOpen={sidebarOpen}
        />
      )}
      {showSelectMarginModal && (
        <AdminMarginmodel toggleMarginModal={toggleMarginModal} sidebarOpen={sidebarOpen} selectAds={selectAds} fetchAds={fetchAds}/>
      )}
    </>
  );
};

export default Advertisement;
