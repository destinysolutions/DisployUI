import React, { useEffect } from "react";
import "../../Styles/Acsettings.css";
import { useState } from "react";
import { useRef } from "react";
import {
  GET_ALL_COUNTRY,
  GET_ALL_CURRENCIES,
  GET_ALL_LANGUAGES,
  GET_SELECT_BY_STATE,
  GET_TIMEZONE,
  SELECT_BY_ID_USERDETAIL,
} from "../Api";
import axios from "axios";
import { MdOutlinePhotoCamera } from "react-icons/md";
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
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [zipCodeError, setZipCodeError] = useState("");

  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const validatePhoneNumber = (value) => {
    const phoneRegex =
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    if (value.trim() === "") {
      return true;
    }
    return phoneRegex.test(value);
  };

  const validateZipCode = (value) => {
    const zipCodeRegex = /^\d{6}$/;
    if (value.trim() === "") {
      return true;
    }
    return zipCodeRegex.test(value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setIsImageUploaded(true);
  };

  const handleImageReset = () => {
    setFile(null);
    setIsImageUploaded(false);
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
      })
      .catch((error) => {
        console.error(error);
      });

    if (user) {
      axios
        .get(`${SELECT_BY_ID_USERDETAIL}?ID=${user?.userID}`)
        .then((response) => {
          const fetchData = response.data.data;
          setFirstName(fetchData.firstName);
          setLastName(fetchData.lastName);
          setEmail(fetchData.emailID);
          setPhoneNumber(fetchData.phoneNumber);
          setAddress(fetchData.googleLocation);
        })
        .catch((error) => {
          console.log(error);
        });
    }
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

  const updateUser = async () => {
    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneNumberError("Invalid phone number");
      return;
    } else {
      setPhoneNumberError("");
    }

    // Validate zip code
    if (!validateZipCode(zipCode)) {
      setZipCodeError("Invalid zip code");
      return;
    } else {
      setZipCodeError("");
    }

    let data = new FormData();
    data.append("orgUserSpecificID", user?.userID);
    data.append("firstName", firstName);
    data.append("lastName", lastName);
    data.append("email", email);
    data.append("phone", phoneNumber);
    data.append("isActive", "1");
    data.append("orgUserID", user?.userID);
    data.append("userRole", "0");
    data.append("countryID", selectedCountry || 0);
    data.append("company", "Admin");
    data.append("operation", "Save");
    data.append("address", address);
    data.append("stateId", selectedState || 0);
    data.append("zipCode", zipCode || 0);
    data.append("languageId", selectedLanguageName || 0);
    data.append("timeZoneId", selectedTimezoneName || 0);
    data.append("currencyId", selectedCurrencyName || 0);
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
      const response = await axios.request(config);
      console.log("response", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const resetFormData = () => {
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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUser();
          }}
        >
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
            <div className="-mx-3 md:flex mb-6">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="label_top text-xs">First Name</label>
                <input
                  className="w-full text-black border rounded-lg py-3 px-4 mb-3"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <div></div>
              </div>
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="label_top text-xs">Last Name</label>
                <input
                  className="w-full  text-black border  rounded-lg py-3 px-4 mb-3"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <div></div>
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Email</label>
                <input
                  readOnly
                  className="w-full  text-black border  rounded-lg py-3 px-4 mb-3"
                  type="email"
                  name="email"
                  value={email}
                />
              </div>
            </div>
            <div className="-mx-3 md:flex mb-6">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="label_top text-xs">Phone Number</label>
                <input
                  className={`w-full text-black border rounded-lg py-3 px-4 mb-3 ${
                    phoneNumberError ? "border-red" : ""
                  }`}
                  type="text"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setPhoneNumberError("");
                  }}
                />
                {phoneNumberError && phoneNumber.trim() !== "" && (
                  <p className="text-red text-xs mt-1">{phoneNumberError}</p>
                )}
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Address</label>
                <input
                  className="w-full  text-black border  rounded-lg py-3 px-4 mb-3"
                  type="text"
                  placeholder="132, My Street, Kingston, New York 12401."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Roles</label>
                <input
                  readOnly
                  className="w-full  text-black border  rounded-lg py-3 px-4 mb-3"
                  type="text"
                  placeholder="Admin"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
              </div>
            </div>
            <div className="-mx-3 md:flex mb-2">
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Zip Code</label>
                <input
                  className={`w-full text-black border rounded-lg py-3 px-4 mb-3 ${
                    zipCodeError ? "border-red" : ""
                  }`}
                  type="text"
                  name="zipCode"
                  placeholder="100010"
                  value={zipCode}
                  onChange={(e) => {
                    setZipCode(e.target.value);
                    setZipCodeError("");
                  }}
                />
                {zipCodeError && zipCode.trim() !== "" && (
                  <p className="text-red text-xs mt-1">{zipCodeError}</p>
                )}
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Country</label>
                <div>
                  <select
                    className="w-full  border  text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
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
                <label className="label_top text-xs">State</label>
                <div>
                  <select
                    className="w-full  border  text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
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
                <label className="label_top text-xs">Language</label>
                <div>
                  <select
                    className="w-full  border  text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
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
                <label className="label_top text-xs">Timezone</label>
                <div>
                  <select
                    className="w-full  border  text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
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
                <label className="label_top text-xs">Currency</label>
                <div>
                  <select
                    className="w-full  border  text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                    value={selectedCurrencyName}
                    onChange={(e) => setSelectedCurrencyName(e.target.value)}
                  >
                    {currency &&
                      currency.length > 0 &&
                      currency?.map((currency) => (
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
                  // onClick={updateUser}
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
