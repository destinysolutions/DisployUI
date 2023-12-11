import React, { useEffect } from "react";
import "../../Styles/Acsettings.css";
import { useState } from "react";
import { useRef } from "react";
import {
  ADD_REGISTER_URL,
  GET_ALL_COUNTRY,
  GET_ALL_CURRENCIES,
  GET_ALL_LANGUAGES,
  GET_SELECT_BY_STATE,
  GET_TIMEZONE,
} from "../Api";
import axios from "axios";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";

const Account = () => {
  const [file, setFile] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [organization, setOrganization] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [language, setLanguage] = useState([]);
  const [timezone, setTimezone] = useState([]);
  const [selectedTimezoneName, setSelectedTimezoneName] = useState("");
  const [selectedCurrencyName, setSelectedCurrencyName] = useState("");
  const [selectedLanguageName, setSelectedLanguageName] = useState("");
  const [currency, setCurrency] = useState([]);
  const hiddenFileInput = useRef(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const { token ,user} = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  console.log("selectedTimezoneName", selectedTimezoneName);
  console.log("selectedCurrencyName", selectedCurrencyName);
  console.log("selectedLanguageName", selectedLanguageName);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setIsImageUploaded(true);
  };

  const handleImageReset = () => {
    setFile(null); // Reset the file state
    setIsImageUploaded(false); // Set the image uploaded state to false
  };
  const handleClick = (e) => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    const axiosRequests = [
      axios.get(GET_ALL_CURRENCIES),
      axios.get(GET_ALL_LANGUAGES),
      axios.get(GET_ALL_COUNTRY),
      axios.get(GET_TIMEZONE),
    ];

    // Use Promise.all to send all requests concurrently
    Promise.all(axiosRequests)
      .then((responses) => {
        const [
          currenciesResponse,
          languageResponse,
          countriesResponse,
          timezoneResponse,
        ] = responses;

        setCurrency(currenciesResponse.data.data);
        setLanguage(languageResponse.data.data);
        setCountries(countriesResponse.data.data);
        setTimezone(timezoneResponse.data.data);
        console.log("timezoneResponse", timezoneResponse);
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

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address"),
    phoneNumber: Yup.string().matches(phoneRegExp, "Phone number is not valid"),
    zipCode: Yup.string().matches(/^\d{6}$/, "Invalid zip code"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      phoneNumber: "",
      zipCode: "",
      terms: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      updateUser(values, setSubmitting);
    },
  });

  useEffect(() => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://disployapi.thedestinysolutions.com/api/UserMaster/GetOrgUsers?OrgUserSpecificID=${user?.userID}`,
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const updateUser = async (values, setSubmitting) => {
    let data = new FormData();
    data.append("orgUserSpecificID", user?.userID);
    data.append("firstName", firstName);
    data.append("lastName", lastName);
    data.append("email", "hetal.prajapati@thedestinysolutions.com");
    data.append("phone", values.phoneNumber);
    data.append("isActive", "1");
    data.append("orgUserID", user?.userID);
    data.append("userRole", "1");
    data.append("countryID", selectedCountry);
    data.append("company", "Admin");
    data.append("operation", "Save");
    data.append("address", address);
    data.append("stateId", selectedState);
    data.append("zipCode", values.zipCode);
    data.append("languageId", selectedLanguageName);
    data.append("timeZoneId", selectedTimezoneName);
    data.append("currencyId", selectedCurrencyName);
    data.append("File", file);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://disployapi.thedestinysolutions.com/api/UserMaster/AddOrgUserMaster",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        Authorization: authToken,
      },
      data: data,
    };

    try {
      setSubmitting(true);

      const response = await axios.request(config);
      setSubmitting(false);
    } catch (error) {
      console.log(error);
      // setErrorMessge("Registration failed.");
      setSubmitting(false);
    }
  };

  const resetFormData = () => {
    formik.resetForm();
    setFile(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setAddress("");
    setOrganization("");
    setZipCode("");
    setSelectedLanguageName("");
    setSelectedTimezoneName("");
    setCurrency("");
    setSelectedCountry("");
    setSelectedState("");
    setIsImageUploaded(false);
  };

  
  return (
    <>
      <div className="rounded-xl mt-8 shadow bg-white">
        <h4 className="text-xl font-bold p-5">Profile Details</h4>
        <div className="flex items-center border-b border-b-[#E4E6FF] p-5">
          <div className="layout-img me-5">
            {isImageUploaded ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Uploaded"
                className="w-32 rounded-lg"
              />
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
                onChange={(e) => handleFileChange(e)}
              />
              {isImageUploaded ? (
                <button
                  className=" px-5 py-2 border border-primary rounded-full text-primary"
                  onClick={handleImageReset}
                >
                  Remove
                </button>
              ) : (
                ""
              )}
            </div>
            <p className="text-lg block mt-3 ml-2">
              Display content from your connected accounts on your site
            </p>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
            <div className="-mx-3 md:flex mb-6">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="label_top text-xs">First Name*</label>
                <input
                  className="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                  type="text"
                  placeholder="Harry"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <div></div>
              </div>
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="label_top text-xs">Last Name*</label>
                <input
                  className="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                  type="text"
                  placeholder="McCall"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <div></div>
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Email*</label>
                <input
                  readOnly
                  className="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                  type="email"
                  name="email"
                  placeholder="harrymc.call@gmail.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.errors.email && formik.touched.email && (
                  <div className="error">{formik.errors.email}</div>
                )}
              </div>
            </div>
            <div className="-mx-3 md:flex mb-6">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="label_top text-xs">Phone Number*</label>
                <input
                  className="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                  type="text"
                  placeholder="(397) 294-5153"
                  name="phoneNumber"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phoneNumber}
                />
                {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                  <div className="error">{formik.errors.phoneNumber}</div>
                )}
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Address*</label>
                <input
                  className="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                  type="text"
                  placeholder="132, My Street, Kingston, New York 12401."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Roles*</label>
                <input
                  readOnly
                  className="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                  type="text"
                  placeholder="Manager"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
              </div>
            </div>
            <div className="-mx-3 md:flex mb-2">
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Zip Code*</label>
                <input
                  className="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                  type="text"
                  name="zipCode"
                  placeholder="10001"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.zipCode}
                />
                {formik.errors.zipCode && formik.touched.zipCode && (
                  <div className="error">{formik.errors.zipCode}</div>
                )}
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Country*</label>
                <div>
                  <select
                    className="w-full bg-gray-200 border input-bor-color text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    value={selectedCountry}
                  >
                    {countries.map((country) => (
                      <option key={country.countryID} value={country.countryID}>
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
                    name="selectedState"
                    onChange={(e) => setSelectedState(e.target.value)}
                    value={selectedState}
                  >
                    {selectedCountry &&
                      Array.isArray(states) &&
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
                    value={selectedLanguageName}
                    onChange={(e) => setSelectedLanguageName(e.target.value)}
                  >
                    {language.map((language) => (
                      <option
                        value={language.languageId}
                        key={language.languageId}
                      >
                        {language.languageName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Timezone*</label>
                <div>
                  <select
                    className="w-full bg-gray-200 border input-bor-color text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                    value={selectedTimezoneName}
                    onChange={(e) => setSelectedTimezoneName(e.target.value)}
                  >
                    {timezone.map((timezone) => (
                      <option
                        value={timezone.timeZoneID}
                        key={timezone.timeZoneID}
                      >
                        {timezone.timeZoneName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Currency*</label>
                <div>
                  <select
                    className="w-full bg-gray-200 border input-bor-color text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                    value={selectedCurrencyName}
                    onChange={(e) => setSelectedCurrencyName(e.target.value)}
                  >
                    {currency && currency.length > 0 && currency?.map((currency) => (
                      <option
                        value={currency.currencyId}
                        key={currency.currencyId}
                      >
                        {currency.currencyName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="-mx-3 md:flex mt-2">
              <div className="md:w-full px-3 flex">
                <button
                  type="submit"
                  className="px-5 bg-primary text-white rounded-full py-2 border border-primary me-3"
                  onClick={() => updateUser()}
                >
                  Save Changes
                </button>
                <button
                  className=" px-5 py-2 border border-primary rounded-full text-primary"
                  onClick={resetFormData}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      {/* <div className="rounded-xl mt-8 shadow bg-white p-5">
        <h4 className="text-xl font-bold ">Delete Account</h4>
        <div className="flex items-start space-x-3 py-6">
          <input type="checkbox" className="border-gray-300 rounded h-5 w-5" />
          <div className="flex flex-col">
            <h1 className="text-gray-700 font-medium leading-none">
              I confirm my account deactivation
            </h1>
          </div>
        </div>
        <button className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
          Deactivate Account
        </button>
      </div> */}
    </>
  );
};

export default Account;
