import React, { useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import "../Styles/Acsettings.css";
import { useState } from "react";
import { useRef } from "react";
import {
  ADD_REGISTER_URL,
  GET_ALL_COUNTRY,
  GET_ALL_CURRENCIES,
  GET_ALL_LANGUAGES,
  GET_SELECT_BY_CITY,
  GET_SELECT_BY_STATE,
  GET_TIMEZONE,
} from "./Api";
import axios from "axios";
import { MdOutlinePhotoCamera } from "react-icons/md";

const ViewUserProfile = ({ sidebarOpen, setSidebarOpen }) => {
  const [file, setFile] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [organization, setOrganization] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [language, setLanguage] = useState("");
  const [timezone, setTimezone] = useState("");
  const [currency, setCurrency] = useState("");
  const hiddenFileInput = useRef(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const handleChange = (e) => {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  const handleClick = (e) => {
    hiddenFileInput.current.click();
  };
  const [loginUserID, setLoginUserID] = useState("");
  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem("user");
    if (userFromLocalStorage) {
      const user = JSON.parse(userFromLocalStorage);
      setLoginUserID(user.userID);
    }
  }, []);
  console.log(loginUserID, "id");
  console.log(file, "file");
  console.log(firstName, "firstName");
  console.log(lastName, "lastName");
  console.log(email, "email");
  console.log(phoneNumber, "phoneNumber");
  console.log(address, "addressid");
  console.log(organization, "organization");
  console.log(zipCode, "zipCode");
  useEffect(() => {
    // Define an array of axios requests
    const axiosRequests = [
      axios.get(GET_ALL_CURRENCIES),
      axios.get(GET_ALL_LANGUAGES),
      axios.get(GET_ALL_COUNTRY),
      // axios.get(GET_ALL_SCREEN_RESOLUTION),
      axios.get(GET_TIMEZONE),
      // axios.get(GET_ALL_SCHEDULE),
    ];

    // Use Promise.all to send all requests concurrently
    Promise.all(axiosRequests)
      .then((responses) => {
        const [currenciesResponse, languageResponse, countriesResponse] =
          responses;

        console.log(countriesResponse.data);
        setCountries(countriesResponse.data.data);
        // setGetSelectedScreenTypeOption(screenTypeResponse.data.data);
        // setScreenOrientation(screenOrientationResponse.data.data);
        // setScreenResolution(screenResolutionResponse.data.data);
        // setTimezone(timezoneResponse.data.data);
        // setScheduleData(scheduleResponse.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  // Fetch states based on the selected country
  useEffect(() => {
    if (selectedCountry) {
      fetch(`${GET_SELECT_BY_STATE}?CountryID=${selectedCountry}`)
        .then((response) => response.json())
        .then((data) => {
          setStates(data.data);
        })
        .catch((error) => {
          console.log("Error fetching states data:", error);
        });
    }
  }, [selectedCountry]);

  const updateUser = () => {
    // e.preventdefault();
    const FormData = require("form-data");
    let data = new FormData();
    data.append("UserID", loginUserID);

    data.append("GoogleLocation", address);
    data.append("FirstName", firstName);
    data.append("LastName", lastName);
    data.append("PhoneNumber", phoneNumber);
    data.append("EmailID", email);

    data.append("Organization", organization);
    //data.append("State", state);
    //data.append("Country", country);
    data.append("ZipCode", zipCode);
    //data.append("Language", language);
    //data.append("Currency", currency);
    //data.append("TimeZone", timezone);
    data.append("Mode", "Update");
    data.append("Operation", "Update");
    //data.append("File", file);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: ADD_REGISTER_URL,
      headers: {
        ...data.getHeaders(),
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div className="flex bg-white py-3 border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block xs:block  items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
              Account Settings
            </h1>
          </div>

          <div className="w-full mt-6">
            <nav className="flex space-x-2" aria-label="Tabs" role="tablist">
              <button
                type="button"
                className="rounded-full hs-tab-active:font-semibold hs-tab-active:bg-blue-600 hs-tab-active:text-blue-600 py-4 px-5 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 active"
                id="tabs-with-icons-item-1"
                data-hs-tab="#tabs-with-icons-1"
                aria-controls="tabs-with-icons-1"
                role="tab"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="14"
                  viewBox="0 0 11 14"
                  fill="none"
                >
                  <path
                    d="M0.5 13.75C0.5 10.9886 2.73857 8.75 5.5 8.75C8.26144 8.75 10.5 10.9886 10.5 13.75H9.25C9.25 11.6789 7.57106 10 5.5 10C3.42893 10 1.75 11.6789 1.75 13.75H0.5ZM5.5 8.125C3.42812 8.125 1.75 6.44688 1.75 4.375C1.75 2.30312 3.42812 0.625 5.5 0.625C7.57188 0.625 9.25 2.30312 9.25 4.375C9.25 6.44688 7.57188 8.125 5.5 8.125ZM5.5 6.875C6.88125 6.875 8 5.75625 8 4.375C8 2.99375 6.88125 1.875 5.5 1.875C4.11875 1.875 3 2.99375 3 4.375C3 5.75625 4.11875 6.875 5.5 6.875Z"
                    fill="white"
                  />
                </svg>
                Account
              </button>
              <button
                type="button"
                className="rounded-full hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-5 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600"
                id="tabs-with-icons-item-2"
                data-hs-tab="#tabs-with-icons-2"
                aria-controls="tabs-with-icons-2"
                role="tab"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="17"
                  viewBox="0 0 13 17"
                  fill="none"
                >
                  <path
                    d="M2.06482 6.57935H2.41809V5.51379C2.41809 4.27612 2.90479 3.14954 3.68909 2.33154C4.47644 1.50989 5.56372 1 6.7605 1C7.9574 1 9.04456 1.50989 9.83215 2.33142C10.6163 3.14941 11.103 4.27612 11.103 5.51367V6.57922H11.4563C11.7494 6.57922 12.0157 6.69885 12.2085 6.89172C12.4012 7.08459 12.521 7.35083 12.521 7.64392V14.9352C12.521 15.2283 12.4014 15.4946 12.2085 15.6874C12.0156 15.8801 11.7494 15.9999 11.4563 15.9999H2.06482C1.77161 15.9999 1.50537 15.8802 1.3125 15.6874C1.11963 15.4945 1 15.2285 1 14.9353V7.64404C1 7.35095 1.11975 7.08459 1.3125 6.89185C1.50537 6.6991 1.77161 6.57935 2.06482 6.57935ZM6.37109 11.6569L5.85962 12.9971H7.66162L7.1875 11.6384C7.4884 11.4834 7.69409 11.1697 7.69409 10.808C7.69409 10.2925 7.276 9.87451 6.76062 9.87451C6.24512 9.87451 5.82703 10.2926 5.82703 10.808C5.8269 11.1846 6.04993 11.5092 6.37109 11.6569ZM3.16711 6.57935H10.354V5.51379C10.354 4.47485 9.948 3.53186 9.2937 2.84949C8.64282 2.17053 7.74622 1.74915 6.7605 1.74915C5.77478 1.74915 4.87817 2.17053 4.22729 2.84937C3.57312 3.53174 3.16699 4.47473 3.16699 5.51367L3.16711 6.57935ZM11.4563 7.32849H2.06482C1.97839 7.32849 1.89966 7.36414 1.84229 7.42151C1.78491 7.47888 1.74927 7.55774 1.74927 7.64404V14.9353C1.74927 15.0216 1.78491 15.1005 1.84229 15.1577C1.89966 15.2152 1.97852 15.2507 2.06482 15.2507H11.4564C11.5428 15.2507 11.6217 15.2152 11.679 15.1577C11.7363 15.1003 11.772 15.0216 11.772 14.9353V7.64404C11.772 7.55774 11.7363 7.47888 11.679 7.42151C11.6215 7.36414 11.5427 7.32849 11.4563 7.32849Z"
                    fill="#7D87A9"
                    stroke="#7D87A9"
                    strokeWidth="0.5"
                  />
                </svg>
                Security
              </button>
              <button
                type="button"
                className="rounded-full hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-5 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600"
                id="tabs-with-icons-item-3"
                data-hs-tab="#tabs-with-icons-3"
                aria-controls="tabs-with-icons-3"
                role="tab"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="15"
                  viewBox="0 0 12 15"
                  fill="none"
                >
                  <path
                    d="M8.32153 0.0805664C8.26782 0.0317383 8.19214 0 8.11768 0C8.10181 0 8.08594 0 8.06885 0.00488281H0.67627C0.494385 0.00488281 0.322266 0.0805664 0.198975 0.203857C0.0756836 0.327148 0 0.493164 0 0.681152V14.3237C0 14.5117 0.0756836 14.6777 0.198975 14.801C0.322266 14.9243 0.488281 15 0.67627 15C4.12109 15 7.83936 15 11.2671 15C11.4551 15 11.6211 14.9243 11.7444 14.801C11.8677 14.6777 11.9434 14.5117 11.9434 14.3237V3.94287C11.9482 3.91602 11.9543 3.89404 11.9543 3.86719C11.9543 3.77563 11.9116 3.69507 11.8518 3.63647L8.35815 0.102539C8.34717 0.0915527 8.34229 0.0866699 8.3313 0.0805664H8.32153ZM2.5061 2.40234C2.34009 2.40234 2.20093 2.53662 2.20093 2.70874C2.20093 2.87476 2.33521 3.01392 2.5061 3.01392H4.59961C4.76562 3.01392 4.90601 2.87964 4.90601 2.70874C4.90601 2.54272 4.77173 2.40234 4.59961 2.40234H2.5061ZM4.77661 10.1746H3.69263V9.99512C3.69263 9.80347 3.6792 9.67896 3.65479 9.62036C3.63037 9.56055 3.57666 9.53125 3.49487 9.53125C3.42896 9.53125 3.37891 9.55688 3.34595 9.60693C3.31299 9.65942 3.2959 9.73511 3.2959 9.83765C3.2959 10.0073 3.33008 10.127 3.39722 10.1941C3.46313 10.2625 3.65845 10.3943 3.98193 10.5908C4.25659 10.7581 4.44458 10.885 4.54468 10.9729C4.64478 11.062 4.729 11.1865 4.79736 11.3489C4.86572 11.5112 4.90112 11.7126 4.90112 11.9543C4.90112 12.3401 4.80835 12.644 4.6228 12.8638C4.43726 13.0835 4.15649 13.219 3.7854 13.2715V13.678H3.28491V13.2605C2.99561 13.2324 2.7417 13.1201 2.52563 12.926C2.30957 12.7332 2.20093 12.3938 2.20093 11.9104V11.698H3.28491V11.9629C3.28491 12.2546 3.2959 12.4353 3.31909 12.5061C3.34106 12.5769 3.39478 12.6111 3.48022 12.6111C3.55347 12.6111 3.6084 12.5867 3.6438 12.5378C3.6792 12.4878 3.69751 12.4146 3.69751 12.3181C3.69751 12.0752 3.68042 11.9006 3.64624 11.7969C3.61206 11.6919 3.49731 11.5771 3.29834 11.4551C2.96753 11.2476 2.74292 11.095 2.62329 10.9973C2.50488 10.8997 2.40112 10.7629 2.31567 10.5847C2.229 10.4077 2.18506 10.2075 2.18506 9.98413C2.18506 9.66064 2.27661 9.40674 2.45972 9.22241C2.64282 9.03809 2.9187 8.92456 3.28491 8.88184V8.53516H3.7854V8.88184C4.11987 8.92456 4.37012 9.03687 4.53735 9.21875C4.70337 9.40063 4.78638 9.6521 4.78638 9.97192C4.7876 10.0159 4.78394 10.0842 4.77661 10.1746ZM7.81128 0.611572V3.25684C7.81128 3.50952 7.91382 3.74023 8.07983 3.90625C8.24585 4.07227 8.47656 4.1748 8.72925 4.1748H11.3257V14.325C11.3257 14.3408 11.3208 14.3628 11.3037 14.3738C11.2927 14.3848 11.2769 14.3958 11.2549 14.3958C8.52783 14.3958 3.32275 14.3958 0.670166 14.3958C0.654297 14.3958 0.632324 14.3909 0.621338 14.3738C0.610352 14.3628 0.599365 14.342 0.599365 14.325V0.681152C0.599365 0.65918 0.604248 0.643311 0.621338 0.632324C0.632324 0.621338 0.648193 0.610352 0.670166 0.610352H7.80518H7.81128V0.611572ZM8.41797 3.25684V1.04126L10.9131 3.56812H8.72925C8.6438 3.56812 8.56812 3.53027 8.50952 3.47656C8.45459 3.42285 8.41797 3.34229 8.41797 3.25684ZM2.50488 4.51172C2.33887 4.51172 2.19971 4.646 2.19971 4.81812C2.19971 4.98413 2.33398 5.12451 2.50488 5.12451H7.85889C8.0249 5.12451 8.16528 4.99023 8.16528 4.81812C8.16528 4.6521 8.03101 4.51172 7.85889 4.51172H2.50488ZM5.98145 8.58887C5.81543 8.58887 5.67627 8.72314 5.67627 8.89526C5.67627 9.06128 5.81055 9.20166 5.98145 9.20166H9.42627C9.59229 9.20166 9.73267 9.06738 9.73267 8.89526C9.73267 8.72925 9.59839 8.58887 9.42627 8.58887H5.98145ZM2.50488 6.55029C2.33887 6.55029 2.19971 6.68457 2.19971 6.85669C2.19971 7.02271 2.33398 7.16309 2.50488 7.16309H9.42505C9.59106 7.16309 9.73145 7.02881 9.73145 6.85669C9.73145 6.69067 9.59717 6.55029 9.42505 6.55029H2.50488Z"
                    fill="#7D87A9"
                  />
                </svg>
                Billing & Plans
              </button>

              <button
                type="button"
                className="rounded-full hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-5 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600"
                id="tabs-with-icons-item-3"
                data-hs-tab="#tabs-with-icons-3"
                aria-controls="tabs-with-icons-3"
                role="tab"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                >
                  <g clipPath="url(#clip0_3495_5982)">
                    <path
                      d="M13.9732 12.2611C12.3791 11.5413 12.3185 8.45131 12.3173 8.37335V6.30035C12.3173 4.3052 11.0982 2.58959 9.36569 1.8591C9.36196 0.833335 8.52652 0 7.5 0C6.47345 0 5.63803 0.833384 5.63428 1.85905C3.90188 2.58954 2.68268 4.30515 2.68268 6.3003V8.3733C2.68156 8.45126 2.62087 11.5412 1.02677 12.2611C0.84518 12.3431 0.745375 12.5408 0.787361 12.7356C0.829297 12.9304 1.00158 13.0696 1.20087 13.0696H5.24205C5.32489 13.5253 5.54038 13.9493 5.86997 14.2927C6.30771 14.7488 6.88661 15 7.49992 15C8.11328 15 8.69218 14.7488 9.12988 14.2927C9.45951 13.9493 9.675 13.5253 9.75779 13.0696H13.799C13.9983 13.0696 14.1705 12.9305 14.2125 12.7356C14.2545 12.5408 14.1548 12.3432 13.9732 12.2611ZM11.8734 10.7809C12.0409 11.2889 12.2782 11.7991 12.6147 12.2237H2.38526C2.72168 11.7992 2.95896 11.289 3.12653 10.7809H11.8734ZM7.5 0.845957C7.96433 0.845957 8.35693 1.15797 8.47978 1.58326C8.16331 1.51763 7.83561 1.48302 7.5 1.48302C7.16438 1.48302 6.83669 1.5176 6.52021 1.58326C6.64308 1.15799 7.03568 0.845957 7.5 0.845957ZM3.52864 8.3759V6.30028C3.52864 4.1105 5.31016 2.32897 7.5 2.32897C9.68983 2.32897 11.4714 4.1105 11.4714 6.30028V8.37935C11.4719 8.44298 11.4818 9.11168 11.6503 9.93487H3.34955C3.51817 9.1109 3.52813 8.44102 3.52864 8.3759ZM7.5 14.1541C6.85438 14.1541 6.29092 13.6886 6.11007 13.0696H8.88988C8.70902 13.6886 8.14566 14.1541 7.5 14.1541Z"
                      fill="#7D87A9"
                    />
                    <path
                      d="M7.50001 2.92236C5.68015 2.92236 4.19958 4.40288 4.19958 6.22271C4.19958 6.45632 4.38897 6.6457 4.62258 6.6457C4.85618 6.6457 5.04557 6.45632 5.04557 6.22271C5.04557 4.86935 6.14662 3.76832 7.50003 3.76832C7.73364 3.76832 7.92302 3.57893 7.92302 3.34533C7.923 3.1117 7.73361 2.92236 7.50001 2.92236Z"
                      fill="#7D87A9"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3495_5982">
                      <rect width="15" height="15" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Notifications
              </button>

              <button
                type="button"
                className="rounded-full hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-5 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600"
                id="tabs-with-icons-item-3"
                data-hs-tab="#tabs-with-icons-3"
                aria-controls="tabs-with-icons-3"
                role="tab"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                >
                  <path
                    d="M6.92682 5.77264C6.81005 5.8894 6.65168 5.955 6.48655 5.955C6.32142 5.955 6.16305 5.8894 6.04629 5.77264C5.92952 5.65587 5.86392 5.4975 5.86392 5.33237C5.86392 5.16724 5.92952 5.00887 6.04629 4.89211L7.10423 3.83824C7.64377 3.30138 8.37393 3 9.13506 3C9.89619 3 10.6264 3.30138 11.1659 3.83824L11.1716 3.84475C11.7059 4.38466 12.0051 5.11389 12.0041 5.8735C12.003 6.63311 11.7017 7.3615 11.1659 7.89991L10.108 8.95378C9.99119 9.07055 9.83282 9.13614 9.66769 9.13614C9.50256 9.13614 9.34419 9.07055 9.22743 8.95378C9.11066 8.83701 9.04506 8.67865 9.04506 8.51351C9.04506 8.34838 9.11066 8.19001 9.22743 8.07325L10.2854 7.01531C10.5877 6.70942 10.7572 6.2967 10.7572 5.86663C10.7572 5.43657 10.5877 5.02384 10.2854 4.71795L10.2764 4.709C9.96989 4.40819 9.55726 4.24014 9.12779 4.24121C8.69832 4.24227 8.28653 4.41237 7.9815 4.7147L6.92763 5.77264H6.92682ZM8.06614 6.0298C8.18523 5.926 8.33934 5.87136 8.49722 5.87695C8.6551 5.88255 8.80496 5.94796 8.91641 6.05993C9.02786 6.1719 9.09257 6.32205 9.09744 6.47996C9.1023 6.63786 9.04695 6.79171 8.9426 6.91033L5.91038 9.94254C5.79271 10.0543 5.63605 10.1157 5.47378 10.1136C5.31152 10.1116 5.15647 10.0462 5.04166 9.93154C4.92686 9.81684 4.86138 9.66185 4.85917 9.49958C4.85697 9.33732 4.91821 9.1806 5.02985 9.06283L8.06288 6.0298H8.06614ZM7.05377 10.2469C7.17155 10.1353 7.32826 10.074 7.49053 10.0762C7.65279 10.0784 7.80778 10.1439 7.92248 10.2587C8.03717 10.3735 8.10251 10.5286 8.10457 10.6908C8.10662 10.8531 8.04524 11.0098 7.93349 11.1274L6.89996 12.1618C6.36254 12.6966 5.63579 12.9979 4.87757 13C4.11935 13.0021 3.39092 12.705 2.8505 12.1732L2.82771 12.1512C2.29547 11.6107 1.99803 10.882 2.00001 10.1235C2.00199 9.36493 2.30324 8.6378 2.83829 8.1001L3.87181 7.06902C3.92827 7.00629 3.99688 6.95569 4.0735 6.92029C4.15011 6.8849 4.23312 6.86545 4.31748 6.86313C4.40184 6.86081 4.48579 6.87567 4.56423 6.9068C4.64267 6.93793 4.71397 6.98469 4.77378 7.04422C4.83359 7.10376 4.88068 7.17484 4.91217 7.25313C4.94366 7.33143 4.95891 7.41531 4.95698 7.49968C4.95505 7.58405 4.93599 7.66715 4.90095 7.74393C4.86591 7.8207 4.81563 7.88955 4.75316 7.94629L3.71882 8.98063C3.41621 9.28669 3.2465 9.69973 3.2465 10.1301C3.2465 10.5605 3.41621 10.9736 3.71882 11.2796C4.02474 11.5831 4.4382 11.7534 4.86913 11.7534C5.30005 11.7534 5.71351 11.5831 6.01943 11.2796L7.05377 10.2469Z"
                    fill="#7D87A9"
                  />
                </svg>
                Connections
              </button>
            </nav>
          </div>

          <div className="rounded-xl mt-8 shadow bg-white">
            <h4 className="text-xl font-bold p-5">Profile Details</h4>
            <div className="flex items-center border-b border-b-[#E4E6FF] p-5">
              <div className="layout-img me-5">
                {file ? (
                  <img src={file} alt="Uploaded" className="w-32 rounded-lg" />
                ) : (
                  <MdOutlinePhotoCamera className="w-32 h-32 text-gray" />
                )}
              </div>
              <div className="layout-detaills">
                <div className="flex">
                  <button
                    className="px-5 bg-primary text-white rounded-full py-2 border border-primary me-3"
                    onClick={handleClick}
                  >
                    Upload new photo
                  </button>
                  <input
                    type="file"
                    id="upload-button"
                    style={{ display: "none" }}
                    ref={hiddenFileInput}
                    onChange={handleChange}
                  />

                  <button className=" px-5 py-2 border border-primary rounded-full text-primary">
                    Reset
                  </button>
                </div>
                <p className="text-lg block mt-3 ml-2">
                  Display content from your connected accounts on your site
                </p>
              </div>
            </div>

            <form>
              <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="label_top text-xs">First Name*</label>
                    <input
                      className="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                      id="company"
                      type="text"
                      placeholder="Harry"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <div></div>
                  </div>
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="label_top text-xs">Last Name*</label>
                    <input
                      className="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                      id="company"
                      type="text"
                      placeholder="McCall"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    <div></div>
                  </div>
                  <div className="md:w-1/2 px-3">
                    <label className="label_top text-xs">Email*</label>
                    <input
                      className="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                      id="title"
                      type="email"
                      placeholder="harrymc.call@gmail.com"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="label_top text-xs">Phone Number*</label>
                    <input
                      className="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                      id="application-link"
                      type="text"
                      placeholder="(397) 294-5153"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  <div className="md:w-1/2 px-3">
                    <label className="label_top text-xs">Address*</label>
                    <input
                      className="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                      id="application-link"
                      type="text"
                      placeholder="132, My Street, Kingston, New York 12401."
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="md:w-1/2 px-3">
                    <label className="label_top text-xs">Organization*</label>
                    <input
                      className="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                      id="title"
                      type="text"
                      placeholder="Manager"
                      onChange={(e) => setOrganization(e.target.value)}
                    />
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-2">
                  <div className="md:w-1/2 px-3">
                    <label className="label_top text-xs">Zip Code*</label>
                    <input
                      className="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                      id="application-link"
                      type="text"
                      placeholder="10001"
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                  <div className="md:w-1/2 px-3">
                    <label className="label_top text-xs">Country*</label>
                    <div>
                      <select
                        className="w-full bg-gray-200 border input-bor-color text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                        id="job-type"
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        value={selectedCountry}
                      >
                        {countries.map((country) => (
                          <option
                            key={country.countryID}
                            value={country.countryID}
                          >
                            {country.countryName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="md:w-1/2 px-3">
                    <label className="label_top text-xs">State*</label>
                    <div>
                      <select
                        className="w-full bg-gray-200 border input-bor-color text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                        id="location"
                        onChange={(e) => setSelectedState(e.target.value)}
                        value={selectedState}
                      >
                        {selectedCountry &&
                          states.map((state) => (
                            <option key={state.stateId} value={state.stateId}>
                              {state.stateName}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-2">
                  <div className="md:w-1/2 px-3">
                    <label className="label_top text-xs">Language*</label>
                    <div>
                      <select
                        className="w-full bg-gray-200 border input-bor-color text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                        id="department"
                      >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Customer Support</option>
                      </select>
                    </div>
                  </div>
                  <div className="md:w-1/2 px-3">
                    <label className="label_top text-xs">Timezone*</label>
                    <div>
                      <select
                        className="w-full bg-gray-200 border input-bor-color text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                        id="job-type"
                      >
                        <option>
                          (GMT-11:00) International Date Line West
                        </option>
                        <option>India</option>
                        <option>UK</option>
                      </select>
                    </div>
                  </div>
                  <div className="md:w-1/2 px-3">
                    <label className="label_top text-xs">Currency*</label>
                    <div>
                      <select
                        className="w-full bg-gray-200 border input-bor-color text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                        id="job-type"
                      >
                        <option>USA</option>
                        <option>India</option>
                        <option>UK</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="-mx-3 md:flex mt-2">
                  <div className="md:w-full px-3 flex">
                    <button
                      className="px-5 bg-primary text-white rounded-full py-2 border border-primary me-3"
                      onClick={() => updateUser()}
                    >
                      Save Changes
                    </button>
                    <button className=" px-5 py-2 border border-primary rounded-full text-primary">
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="rounded-xl mt-8 shadow bg-white p-5">
            <h4 className="text-xl font-bold ">Delete Account</h4>
            <div className="flex items-start space-x-3 py-6">
              <input
                type="checkbox"
                className="border-gray-300 rounded h-5 w-5"
              />
              <div className="flex flex-col">
                <h1 className="text-gray-700 font-medium leading-none">
                  I confirm my account deactivation
                </h1>
              </div>
            </div>
            <button className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewUserProfile;
