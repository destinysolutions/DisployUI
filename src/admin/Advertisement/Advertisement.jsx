import React, { useRef, useState } from 'react'
import AdminSidebar from '../AdminSidebar'
import AdminNavbar from '../AdminNavbar'
import { BiUserPlus } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { debounce } from 'lodash';
import * as Yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import AddEditAdvertisement from './AddEditAdvertisement';
import CustomerScreen from './CustomerScreen';
import { GET_ALL_ORGANIZATION_MASTER } from '../AdminAPI';
import { useEffect } from 'react';

const Advertisement = ({ sidebarOpen, setSidebarOpen }) => {
  const hiddenFileInput = useRef(null);
  const TodayDate = new Date();
  const [showModal, setShowModal] = useState(false);
  const [showSelectScreenModal, setShowSelectScreenModal] = useState(false);
  const [customerList, setCustomerList] = useState({
    allCustomer: [],
    searchCustomer: []
  })
  const [heading, setHeading] = useState("Add");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [allAdvertisement, setAllAdvertisement] = useState({
    advertisementData: [],
    SearchData: []
  })
  //   Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]); // Multipal check
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectcheck, setSelectCheck] = useState(false);


  const toggleModal = () => {
    setShowModal(!showModal);
    formik.resetForm();
  };

  const handleClose = () => {
    setShowSelectScreenModal(!showSelectScreenModal)
  }

  const filteredData = Array.isArray(customerList?.allCustomer)
    ? customerList?.allCustomer?.filter((item) =>
      Object.values(item).some(
        (value) =>
          value 
          // &&
          // value.toString().toLowerCase().includes(searchScreen.toLowerCase())
      )
    )
    : [];

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

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
    const hours = String(date.getHours()).padStart(2, '0'); // Ensure two digits
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure two digits
    const time = `${hours}:${minutes}`;
    return time;
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const currentTime = getTimeFromDate(TodayDate)
  const currentDate = formatDate(TodayDate)

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
      PhoneNumber:"",
      Email:""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
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
      formData.append("AssetType", file?.type?.split("/")?.[0])
      setLoading(true);
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        // url: ADD_REGISTER_URL,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      };

      const response = await axios.request(config);
      if (response?.data?.status === 200) {
        formik.resetForm();
        toast.success("Advertisement Details saved successfully!");
        setShowModal(false);
      } else {
        // toast.error(response?.data?.message);
      }
    },
  });

  const fetchUserData = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: GET_ALL_ORGANIZATION_MASTER,
      headers: {},
    };
    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setCustomerList({
          allCustomer: response.data.data,
          searchCustomer: response.data.data
        })
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, [])

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
      const allIds = customerList?.allCustomer.map((item) => item.organizationID);
      setSelectedItems(allIds);
    }
  };

  const handleChange = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    if (searchQuery === "") {
      setAllAdvertisement({ ...allAdvertisement, SearchData: allAdvertisement?.advertisementData });
    } else {
      const filterData = allAdvertisement?.advertisementData?.filter((item) =>
        item?.Name?.toLowerCase().includes(searchQuery)
      );
      setAllAdvertisement({ ...allAdvertisement, SearchData: filterData });
    }
  }

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

  const debouncedOnChange = debounce(handleChange, 500);

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
            <h1 className="not-italic font-medium text-2xl sm:text-xl text-[#001737] sm:mb-4 "
              onClick={() => {
                setShowSelectScreenModal(true)
              }}>
              Advertisement
            </h1>
            <div className="flex gap-3">
              <div className="text-right mb-5 mr-5 relative sm:mr-0">
                <div>
                  <AiOutlineSearch className="absolute top-[13px] right-[232px] z-10 text-gray searchicon" />
                  <input
                    type="text"
                    placeholder=" Search Advertisements "
                    className="border border-gray rounded-full px-7 py-2 search-user"
                    onChange={(e) => debouncedOnChange(e)}
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
        </div>
      </div>
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
          selectedItems={selectedItems}
          handleScreenCheckboxChange={handleScreenCheckboxChange}/>
      )}
    </>
  )
}

export default Advertisement
