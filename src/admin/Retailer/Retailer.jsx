import React, { useEffect, useState } from "react";
import AdminSidebar from "../AdminSidebar";
import AdminNavbar from "../AdminNavbar";
import { BiUserPlus } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import AddEditRetailer from "./AddEditRetailer";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  addRetailerData,
  getRetailerData,
  resetStatus,
  updateRetailerData,
} from "../../Redux/admin/RetailerSlice";
import { MdOutlineModeEdit } from "react-icons/md";

const Retailer = ({ sidebarOpen, setSidebarOpen }) => {
  const store = useSelector((state) => state.root.retailerData);

  const dispatch = useDispatch();

  const [loadFist, setLoadFist] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [heading, setHeading] = useState("Add");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [orgUserID, setOrgUserID] = useState(null);
  const [editData, setEditData] = useState({
    companyName: "",
    Password: "",
    firstName: "",
    lastName: "",
    email: "",
    googleLocation: "",
    phoneNumber: "",
  });

  // Filter data based on search term
  const filteredData = Array.isArray(store.data)
    ? store.data.filter((item) =>
        Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(search.toLowerCase())
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

  const toggleModal = () => {
    setShowModal(!showModal);
    setEditId(null);
    setOrgUserID(null);
    setEditData({});
  };

  //using for validation and register api calling
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required("Company Name is required"),
    password: Yup.string().when("editId", {
      is: false,
      then: Yup.string()
        .required("Password is required")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number, and one special case Character"
        ),
    }),
    firstName: Yup.string().required("First Name is required").max(50),
    lastName: Yup.string().required("Last Name is required").max(50),
    emailID: Yup.string()
      .required("Email is required")
      .email("E-mail must be a valid e-mail!"),
    phoneNumber: Yup.string()
      .required("Phone Number is required")
      .matches(phoneRegExp, "Phone number is not valid"),
    googleLocation: Yup.string().required("Google Location is required"),
  });

  const editValidationSchema = Yup.object().shape({
    companyName: Yup.string().required("Company Name is required"),
    firstName: Yup.string().required("First Name is required").max(50),
    lastName: Yup.string().required("Last Name is required").max(50),
    emailID: Yup.string()
      .required("Email is required")
      .email("E-mail must be a valid e-mail!"),
    phoneNumber: Yup.string()
      .required("Phone Number is required")
      .matches(phoneRegExp, "Phone number is not valid"),
    googleLocation: Yup.string().required("Google Location is required"),
  });

  useEffect(() => {
    if (loadFist) {
      dispatch(getRetailerData());
      setLoadFist(false);
    }

    if (store && store.status === "failed") {
      toast.error(store.error);
    }

    if (store && store.status === "succeeded") {
      toast.success(store.message);
      setLoadFist(true);
    }

    if (store && store.status) {
      dispatch(resetStatus());
    }
  }, [loadFist, store]);

  const formik = useFormik({
    initialValues: editData,
    enableReinitialize: editData,
    validationSchema: editId ? editValidationSchema : validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("OrganizationName", values.companyName);
      formData.append("Password", values.password || ""); // Set a default value if null
      formData.append("FirstName", values.firstName);
      formData.append("LastName", values.lastName);
      formData.append("Email", values.emailID);
      formData.append("GoogleLocation", values.googleLocation);
      formData.append("Phone", values.phoneNumber);
      formData.append("IsRetailer", true);

      if (editId) {
        formData.append("OrgUserSpecificID", editId);
        formData.append("orgUserID", orgUserID);
        dispatch(updateRetailerData(formData));
      } else {
        formData.append("Operation", "Insert");
        dispatch(addRetailerData(formData));
      }

      formik.resetForm();
      setShowModal(false);
    },
  });

  const handleChange = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearch(searchQuery);
  };

  const handleEdit = (value) => {
    setHeading("Update");
    setEditId(value.orgSingupID);
    setOrgUserID(value.orgUserID);
    setShowModal(true);
    const data = {
      companyName: value.organizationName,
      googleLocation: value.googleLocation,
      firstName: value.firstName,
      lastName: value.lastName,
      phoneNumber: value.phone,
      emailID: value.email,
      password: null,
    };
    setEditData(data);
  };

  return (
    <>
      <div>
        <div className="flex border-b border-gray">
          <AdminSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <AdminNavbar />
        </div>
        <div className="pt-6 px-5 page-contain">
          <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
            <div className="lg:flex lg:justify-between sm:block items-center">
              <h1 className="not-italic font-medium text-2xl sm:text-xl text-[#001737] sm:mb-4 ml-">
                Retailer
              </h1>
              <div className="m-5 flex gap-4 items-center">
                <div className="flex gap-3">
                  <div className="text-right mb-5 mr-5 relative sm:mr-0">
                    <div className="relative md:mr-2 lg:mr-2 lg:mb-0 md:mb-0 mb-3">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                        <AiOutlineSearch className="w-5 h-5 text-gray " />
                      </span>

                      <input
                        type="text"
                        placeholder=" Search Retailers"
                        className="border border-gray rounded-full px-7 py-2 search-user"
                        value={search}
                        onChange={handleChange}
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
                      Add New Retailer
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md overflow-y-auto relative">
              <div className="overflow-x-scroll sc-scrollbar rounded-lg">
                <table
                  className="screeen-table w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  cellPadding={15}
                >
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-left table-head-bg capitalize">
                      <th className=" sticky top-0th-bg-100 text-md font-semibold flex items-center justify-left">
                        UserName
                        <svg
                          className="w-3 h-3 ms-1.5 cursor-pointer"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          onClick={() => handleSort("firstName")}
                        >
                          <path
                            strokeWidth="2"
                            strokeLinecap="round"
                            d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"
                          />
                        </svg>
                      </th>

                      <th scope="col" className="px-6 py-3">
                        OrganizationName
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3">
                        GoogleLocation
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Phone
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.data?.length > 0 &&
                      sortedAndPaginatedData.map((item) => {
                        return (
                          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th
                              scope="col"
                              className="px-3.5 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              {item.firstName + " " + item.lastName}
                            </th>
                            <td className="px-6 py-4 capitalize">
                              {item.organizationName}
                            </td>
                            <td className="px-6 py-4">{item.email}</td>
                            <td className="px-6 py-4">{item.googleLocation}</td>
                            <td className="px-6 py-4">{item.phone}</td>
                            <td className="px-6 py-4">
                              <div className="cursor-pointer text-xl flex gap-4 ">
                                <button
                                  type="button"
                                  className="rounded-full px-2 py-2 text-white text-center bg-[#414efa] mr-3"
                                  onClick={() => handleEdit(item)}
                                >
                                  <MdOutlineModeEdit />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    {sortedAndPaginatedData?.length === 0 && (
                      <tr>
                        <td colSpan={6}>
                          <div className="flex text-center justify-center">
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
              <nav
                className="flex items-center flex-column flex-wrap md:flex-row justify-end p-5"
                aria-label="Table navigation"
              >
                <ul className="-space-x-px rtl:space-x-reverse text-sm h-8 flex justify-end">
                  <li className="">
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
                      {sidebarOpen ? "Previous" : ""}
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex hover:bg-white hover:text-primary cursor-pointer items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <AddEditRetailer
          heading={heading}
          toggleModal={toggleModal}
          loading={loading}
          formik={formik}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          editId={editId}
        />
      )}
    </>
  );
};

export default Retailer;
