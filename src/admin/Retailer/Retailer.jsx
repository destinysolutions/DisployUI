import React, { useEffect, useState } from "react";
import AdminSidebar from "../AdminSidebar";
import AdminNavbar from "../AdminNavbar";
import { BiUserPlus } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import AddEditRetailer from "./AddEditRetailer";
import * as Yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { ADD_REGISTER_URL, GETALLRETAILER } from "../../Pages/Api";

const Retailer = ({ sidebarOpen, setSidebarOpen }) => {
  const [showModal, setShowModal] = useState(false);
  const [heading, setHeading] = useState("Add");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [retailerData, setRetailerData] = useState([]);
  const [originalRetailerData, setOriginalRetailerData] = useState([]);
  const [allRetailerData, setAllRetailerData] = useState({
    userData: [],
    SearchData: []
  })
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  //using for validation and register api calling
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required("Company Name is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
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

  const formik = useFormik({
    initialValues: {
      companyName: "",
      password: "",
      firstName: "",
      emailID: "",
      googleLocation: "",
      phoneNumber: "",
      lastName: "",
      captcha: "",
      // terms: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("OrganizationName", values.companyName);
      formData.append("Password", values.password);
      formData.append("FirstName", values.firstName);
      formData.append("LastName", values.lastName);
      formData.append("Email", values.emailID);
      formData.append("GoogleLocation", values.googleLocation);
      formData.append("Phone", values.phoneNumber);
      formData.append("IsRetailer", true);
      formData.append("Operation", "Insert");
      setLoading(true);

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: ADD_REGISTER_URL,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      };

      const response = await axios.request(config);
      if (response?.data?.status === 200) {
        formik.resetForm();
        toast.success("Retailer Details saved successfully!");
        setShowModal(false);
      } else {
        // toast.error(response?.data?.message);
      }
    },
  });

  const fetchData = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: GETALLRETAILER,
      headers: {},
    };
    axios
      .request(config)
      .then((response) => {
        setRetailerData(response.data.data);
        setOriginalRetailerData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    if (searchQuery === "") {
      setAllUserData({ ...allUserData, SearchData: allUserData?.userData });
    } else {
      const filterData = allUserData?.userData?.filter((item) =>
        item?.name?.toLowerCase().includes(searchQuery)
      );
      setAllUserData({ ...allUserData, SearchData: filterData });
      setCurrentPage(1);
    }
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
            <h1 className="not-italic font-medium text-2xl sm:text-xl text-[#001737] sm:mb-4 ">
              Retailer
            </h1>
            <div className="flex gap-3">
              <div className="text-right mb-5 mr-5 relative sm:mr-0">
                <div>
                  <AiOutlineSearch className="absolute top-[13px] right-[232px] z-10 text-gray searchicon" />
                  <input
                    type="text"
                    placeholder=" Search Retailers "
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
                  Add New Retailer
                </button>
              </div>
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
        />
      )}
    </>
  );
};

export default Retailer;
