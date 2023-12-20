import React, { useEffect, useState, useRef, useMemo } from "react";
import "../../Styles/Acsettings.css";
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
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { isValidPhoneNumber } from "react-phone-number-input";
import * as yup from "yup";
import PhoneInput from "react-phone-input-2";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import toast from "react-hot-toast";
import "react-phone-input-2/lib/style.css";
import { UpdateUserDetails, handleGetUserDetails } from "../../Redux/Authslice";
import { useDispatch } from "react-redux";
import { number } from "prop-types";

const Account = () => {
  const [file, setFile] = useState();
  const [languages, setLanguages] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const { token, user, userDetails, loading } = useSelector(
    (state) => state.root.auth
  );
  const authToken = `Bearer ${token}`;

  const dispatch = useDispatch();
  const hiddenFileInput = useRef(null);

  const profileSchema = yup.object({
    firstName: yup
      .string()
      .required("firstName is required")
      .trim()
      .max(60, "max character limit reached")
      .min(2, "minimum two character required")
      .typeError("only characters allowed")
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        "only contain latin letters"
      ),
    lastName: yup
      .string()
      .required("lastName is required")
      .trim()
      .max(60, "max character limit reached")
      .min(2, "minimum two character required")
      .typeError("only characters allowed")
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        "only contain latin letters"
      ),
    googleLocation: yup.string().required("address is required"),
    timeZone: yup.string().required("timezone is required"),
    state: yup
      .string()
      .required("state is required")
      .max(60, "max character limit reached")
      .min(2, "minimum two character required")
      .typeError("only characters allowed"),
    zipCode: yup
      .string()
      .matches(/^(?:[A-Z0-9]+([- ]?[A-Z0-9]+)*)?$/, "enter valid code")
      .required("zipcode is required"),
    country: yup.string().required("country is required"),
    language: yup.string().required("language is required"),
    currency: yup.string().required("currency is required"),
    phoneNumber: yup.string().required("phone is required"),
    emailID: yup.string().email().required("Email is required"),
  });

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
    if (e.target.files[0] !== undefined && e.target.files[0] !== null) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setIsImageUploaded(true);
    }
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

        setCurrencies(currenciesResponse.data.data);
        setLanguages(languageResponse.data.data);
        setCountries(countriesResponse.data.data);
        setTimezones(timezoneResponse.data.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // if (user) {
    //   axios
    //     .get(`${SELECT_BY_ID_USERDETAIL}?ID=${user?.userID}`)
    //     .then((response) => {
    //       const fetchData = response.data.data;
    //       setFirstName(fetchData.firstName);
    //       setLastName(fetchData.lastName);
    //       setEmail(fetchData.emailID);
    //       setPhoneNumber(fetchData.phoneNumber);
    //       setAddress(fetchData.googleLocation);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // }
  }, []);

  // useEffect(() => {
  //   if (user !== null) {
  //     dispatch(handleGetUserDetails({ id: user?.userID }));
  //   }
  // }, [user]);

  const updateUser = async (details) => {
    // Validate phone number
    // if (!validatePhoneNumber(details?.phoneNumber)) {
    //   setPhoneNumberError("Invalid phone number");
    //   return;
    // } else {
    //   setPhoneNumberError("");
    // }

    // // Validate zip code
    // if (!validateZipCode(details?.zipCode)) {
    //   setZipCodeError("Invalid zip code");
    //   return;
    // } else {
    //   setZipCodeError("");
    // }

    let data = new FormData();
    data.append("orgUserSpecificID", user?.userID);
    data.append("firstName", details?.firstName);
    data.append("lastName", details?.lastName);
    data.append("email", details?.emailID);
    data.append("phone", details?.phoneNumber);
    data.append("isActive", "1");
    data.append("orgUserID", user?.userID);
    data.append("userRole", "0");
    data.append("countryID", details?.selectedCountry || 0);
    data.append("company", "Admin");
    data.append("operation", "Save");
    data.append("address", details?.googleLocation);
    data.append("stateId", details?.selectedState || 0);
    data.append("zipCode", details?.zipCode || 0);
    data.append("languageId", details?.language || 0);
    data.append("timeZoneId", details?.timeZone || 0);
    data.append("currencyId", details?.currency || 0);
    data.append("File", file);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://disployapi.thedestinysolutions.com/api/UserMaster/AddOrgUserMaster",
      headers: {
        "Content-Type": `multipart/form-data`,
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

  // const resetFormData = () => {
  //   setFile(null);
  //   setFirstName("");
  //   setLastName("");
  //   setEmail("");
  //   setPhoneNumber("");
  //   setAddress("");
  //   setOrganization("");
  //   setZipCode("");
  //   setSelectedLanguageName("");
  //   setSelectedTimezoneName("");
  //   setCurrency("");
  //   setSelectedCountry("");
  //   setSelectedState("");
  //   setIsImageUploaded(false);
  // };

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    resetField,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    shouldFocusError: true,
    resolver: yupResolver(profileSchema),
    // defaultValues: useMemo(() => {
    //   const user = {
    //     firstName: userDetails?.firstName,
    //     lastName: userDetails?.lastName,
    //     phoneNumber: userDetails?.phoneNumber,
    //     address: userDetails?.googleLocation,
    //     emailID: userDetails?.emailID,
    //     organization: userDetails?.organization,
    //     country: userDetails?.shippingAddress?.country,
    //     city: userDetails?.shippingAddress?.city,
    //     zipCode: userDetails?.shippingAddress?.zipCode,
    //     timeZone: userDetails?.shippingAddress?.timeZone,
    //     country: userDetails?.shippingAddress?.country,
    //     state: userDetails?.shippingAddress?.state,
    //     language: userDetails?.shippingAddress?.language,
    //     currency: userDetails?.shippingAddress?.currency,
    //   };
    //   return user;
    // }, [userDetails]),
  });

  const onSubmit = (data) => {
    const { phoneNumber } = data;

    // if (!isDirty) return;
    if (
      !isPossiblePhoneNumber(phoneNumber) ||
      !isValidPhoneNumber(phoneNumber)
    ) {
      toast.remove();
      toast.error("phoneNumber is invalid");
      return true;
    } else if (
      (getValues("phoneNumber") !== "" &&
        !isPossiblePhoneNumber(phoneNumber)) ||
      !isValidPhoneNumber(phoneNumber)
    ) {
      toast.remove();
      toast.error("phoneNumber is invalid");
      return true;
    }
    // updateUser(data);

    // let formdata = new FormData();
    // formdata.append("orgUserSpecificID", userDetails?.userID);
    // formdata.append("firstName", firstName);
    // formdata.append("lastName", lastName);
    // formdata.append("emailID", emailID);
    // formdata.append("phoneNumber", phoneNumber);
    // formdata.append("isActive", "1");
    // formdata.append("orgUserID", user?.userID);
    // formdata.append("userRole", "0");
    // formdata.append("countryID", country || 0);
    // formdata.append("company", "Admin");
    // formdata.append("operation", "Save");
    // formdata.append("address", googleLocation);
    // formdata.append("stateId", state || 0);
    // formdata.append("zipCode", zipCode || 0);
    // formdata.append("languageId", language || 0);
    // formdata.append("timeZoneId", timeZone || 0);
    // formdata.append("currencyId", currency || 0);
    // // formdata.append("File", file);

    const response = dispatch(
      UpdateUserDetails({
        data,
        file,
        user,
        token,
      })
    );
    if (response) {
      response.then((res) => {
        if (res?.type.includes("fulfilled")) {
          toast.success("profile edited successfully.", { duration: 2000 });
        }
      });
    }
  };

  // Fetch states based on the selected country
  useEffect(() => {
    fetch(`${GET_SELECT_BY_STATE}?CountryID=${parseInt(selectedCountry)}`)
      .then((response) => response.json())
      .then((data) => {
        setStates(data.data);
        console.log(data);
        setSelectedState(getValues("state"));
      })
      .catch((error) => {
        console.log("Error fetching states data:", error);
      });
  }, [watch("country"), selectedCountry]);

  useEffect(() => {
    if (userDetails !== null) {
      for (const key in userDetails) {
        setValue(key, userDetails[key]);
      }
      if (userDetails?.countryID) {
        setSelectedCountry(userDetails?.countryID);
      } else {
        setSelectedCountry(userDetails?.country);
      }

      // if (userDetails?.stateId) {
      //   console.log("get id s");
      //   setSelectedCountry(userDetails?.stateId);
      // } else {
      //   console.log("not s ");
      //   setSelectedCountry(userDetails?.country);
      // }
    }
  }, [userDetails]);

  // console.log( getValues("country"));
  // console.log(selectedCountry, selectedState, states);
  // console.log(getValues());

  return (
    <>
      {loading ? toast.loading("Fetching details....") : toast.remove()}
      <div className="rounded-xl mt-8 shadow bg-white">
        <h4 className="text-xl font-bold p-5">Profile Details</h4>
        <div className="flex items-center border-b border-b-[#E4E6FF] p-5">
          <div className="layout-img me-5">
            {file !== undefined && file !== null ? (
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
              {file !== undefined && file !== null && (
                <button
                  className=" px-5 py-2 border border-primary rounded-full text-primary"
                  onClick={handleImageReset}
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-lg block mt-3 ml-2">
              Display content from your connected accounts on your site
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          // onSubmit={(e) => {
          //   e.preventDefault();
          //   updateUser();
          // }}
        >
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
            <div className="-mx-3 md:flex mb-6">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="label_top text-xs">First Name</label>
                <input
                  className="w-full text-black border rounded-lg py-3 px-4 mb-3"
                  type="text"
                  {...register("firstName")}
                />
                <div></div>
                <span className="error">{errors?.firstName?.message}</span>
              </div>
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="label_top text-xs">Last Name</label>
                <input
                  className="w-full  text-black border  rounded-lg py-3 px-4 mb-3"
                  type="text"
                  {...register("lastName")}
                />

                <div></div>
                <span className="error">{errors?.lastName?.message}</span>
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Email</label>
                <input
                  readOnly
                  className="w-full  text-black border  rounded-lg py-3 px-4 mb-3"
                  name="email"
                  disabled
                  type="email"
                  {...register("emailID")}
                />
                <span className="error">{errors?.emailID?.message}</span>
              </div>
            </div>
            <div className="-mx-3 md:flex mb-6">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="label_top text-xs z-10">Phone Number</label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    validate: (value) => isValidPhoneNumber(value),
                  }}
                  render={({ field: { onChange, value } }) => (
                    <PhoneInput
                      country={"in"}
                      onChange={(value) => {
                        onChange((e) => {
                          setValue("phoneNumber", "+".concat(value));
                        });
                      }}
                      value={value}
                      autocompleteSearch={true}
                      countryCodeEditable={false}
                      enableSearch={true}
                      inputStyle={{
                        width: "100%",
                        background: "white",
                        padding: "25px 0 25px 3rem",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        border: "1px solid #000",
                      }}
                      dropdownStyle={{
                        color: "#000",
                        fontWeight: "600",
                        padding: "0px 0px 0px 10px",
                      }}
                    />
                  )}
                />
                <span className="error">{errors?.phoneNumber?.message}</span>
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Address</label>
                <input
                  className="w-full  text-black border  rounded-lg py-3 px-4 mb-3"
                  type="text"
                  placeholder="132, My Street, Kingston, New York 12401."
                  {...register("googleLocation")}
                />
                <span className="error">{errors?.googleLocation?.message}</span>
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Roles</label>
                <input
                  readOnly
                  className="w-full  text-black border  rounded-lg py-3 px-4 mb-3"
                  type="text"
                  placeholder="Admin"
                  {...register("role")}
                />
                <span className="error">{errors?.role?.message}</span>
              </div>
            </div>
            <div className="-mx-3 md:flex mb-2">
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Zip Code</label>
                <input
                  className={`w-full text-black border border-black rounded-lg py-3 px-4 mb-3 `}
                  type="text"
                  name="zipCode"
                  placeholder="100010"
                  {...register("zipCode")}
                />
                <span className="error">{errors?.zipCode?.message}</span>
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Country</label>
                <div>
                  <select
                    className="w-full  border  text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                    {...register("country", {
                      onChange: (e) => {
                        setSelectedCountry(e.target.value);
                      },
                    })}
                  >
                    {countries.map((country) => (
                      <option
                        key={country.countryID}
                        selected={country?.countryName == selectedCountry}
                        value={country.countryID}
                        onChange={(e) => {}}
                      >
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                  <span className="error">{errors?.country?.message}</span>
                </div>
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">State</label>
                <div>
                  <select
                    className="w-full  border  text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                    name="state"
                    {...register("state")}
                  >
                    {Array.isArray(states) &&
                      states.map((state) => (
                        <option
                          selected={state?.countryName == getValues("state")}
                          key={state.stateId}
                          value={state.stateId}
                        >
                          {state.stateName}
                        </option>
                      ))}
                  </select>
                  <span className="error">{errors?.state?.message}</span>
                </div>
              </div>
            </div>
            <div className="-mx-3 md:flex mb-2">
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Language</label>
                <div>
                  <select
                    className="w-full  border  text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                    {...register("language")}
                  >
                    {languages.map((language) => (
                      <option
                        value={language.languageId}
                        key={language.languageId}
                      >
                        {language.languageName}
                      </option>
                    ))}
                  </select>
                  <span className="error">{errors?.language?.message}</span>
                </div>
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Timezone</label>
                <div>
                  <select
                    className="w-full  border  text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                    {...register("timeZone")}
                  >
                    {timezones.map((timezone) => (
                      <option
                        value={timezone.timeZoneID}
                        key={timezone.timeZoneID}
                      >
                        {timezone.timeZoneName}
                      </option>
                    ))}
                  </select>
                  <span className="error">{errors?.timeZone?.message}</span>
                </div>
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Currency</label>
                <div>
                  <select
                    className="w-full  border  text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                    {...register("currency")}
                  >
                    {currencies &&
                      currencies.length > 0 &&
                      currencies?.map((currency) => (
                        <option
                          value={currency.currencyId}
                          key={currency.currencyId}
                        >
                          {currency.currencyName}
                        </option>
                      ))}
                  </select>
                  <span className="error">{errors?.currency?.message}</span>
                </div>
              </div>
            </div>
            <div className="-mx-3 md:flex mt-2">
              <div className="md:w-full px-3 flex">
                <button
                  type="submit"
                  className="px-5 bg-primary text-white rounded-full py-2 border border-primary me-3"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className=" px-5 py-2 border border-primary rounded-full text-primary"
                  type="reset"
                  disabled={loading}
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
