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

const Account = () => {
  const [file, setFile] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  const { token, user, userDetails, loading } = useSelector(
    (state) => state.root.auth
  );
  const authToken = `Bearer ${token}`;

  const dispatch = useDispatch();
  const hiddenFileInput = useRef(null);

  const profileSchema = yup.object({
    firstName: yup.string().required("firstName is required").trim(),
    lastName: yup.string().required("lastName is required").trim(),
    zipCode: yup
      .string()
      .matches(/^(?:[A-Z0-9]+([- ]?[A-Z0-9]+)*)?$/, "enter valid code")
      .required("zipcode is required"),
    email: yup.string().email(),
  });

  const handleFileChange = (e) => {
    if (e.target.files[0] !== undefined && e.target.files[0] !== null) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };

  const handleImageReset = () => {
    setFile(null);
  };

  const handleClick = (e) => {
    hiddenFileInput.current.click();
  };

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
  });
  const PHoneNumber = watch("phone");
  const onSubmit = (data) => {
    const { phone } = data;

    // return console.log(!isPossiblePhoneNumber(phone) || !isValidPhoneNumber(phone));
    // if (!isDirty) return;
    if (!isPossiblePhoneNumber(phone) || !isValidPhoneNumber(phone)) {
      toast.remove();
      toast.error("phone is invalid");
      return true;
    } else if (
      (getValues("phone") !== "" && !isPossiblePhoneNumber(phone)) ||
      !isValidPhoneNumber(phone)
    ) {
      toast.remove();
      toast.error("phone is invalid");
      return true;
    }
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
          setFile(null);
        }
      });
    }
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
  }, []);

  // Fetch states based on the selected country
  useEffect(() => {
    fetch(`${GET_SELECT_BY_STATE}?CountryID=${parseInt(selectedCountry)}`)
      .then((response) => response.json())
      .then((data) => {
        setStates(data.data);
      })
      .catch((error) => {
        console.log("Error fetching states data:", error);
      });
  }, [watch("country"), selectedCountry]);

  useEffect(() => {
    if (userDetails !== null && !loading) {
      for (const key in userDetails) {
        setValue(key, userDetails[key]);
      }
      setSelectedCountry(userDetails?.countryID);
    }
  }, [loading]);
  // console.log(userDetails);

  return (
    <>
      {/* {loading ? toast.loading("Fetching details....") : toast.remove()} */}
      <div className="rounded-xl mt-5 shadow-lg bg-white">
        <h4 className="text-xl font-bold px-5">Profile Details</h4>
        <div className="flex items-center border-b border-b-[#E4E6FF] p-5">
          <div className="layout-img me-5">
            {file !== undefined && file !== null ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Uploaded"
                className="w-32 rounded-lg"
              />
            ) : getValues("profilePhoto") !== "" ? (
              <img
                src={getValues("profilePhoto")}
                // {...register("profil")}
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
                className="lg:px-5 px-3 lg:text-lg md:text-md sm:text-sm bg-primary text-white rounded-full py-2 border border-primary me-3"
                onClick={handleClick}
              >
                Upload new photo
              </button>
              <input
                type="file"
                id="upload-button"
                style={{ display: "none" }}
                accept="image/*"
                ref={hiddenFileInput}
                onChange={(e) => handleFileChange(e)}
              />
              {file !== undefined && file !== null && (
                <button
                  className=" lg:text-lg md:text-md sm:text-sm px-5 py-2 border border-primary rounded-full text-primary"
                  onClick={handleImageReset}
                >
                  Remove
                </button>
              )}
            </div>
            <p className="lg:text-lg md:text-md sm:text-sm block mt-3 ml-2">
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
          <div className="p-5 pt-0 mb-5 flex flex-col">
            <div className="-mx-3 md:flex">
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">First Name</label>
                <input
                  className="w-full text-black border rounded-lg py-3 px-4"
                  type="text"
                  {...register("firstName")}
                />
                <div></div>
                <span className="error">{errors?.firstName?.message}</span>
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Last Name</label>
                <input
                  className="w-full  text-black border  rounded-lg py-3 px-4"
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
                  className="w-full  text-black border  rounded-lg py-3 px-4"
                  name="email"
                  disabled
                  type="email"
                  {...register("email")}
                />
                <span className="error">{errors?.email?.message}</span>
              </div>
            </div>
            <div className="-mx-3 md:flex">
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs z-10">Phone Number</label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    validate: (value) => isValidPhoneNumber(value),
                  }}
                  render={({ field: { onChange, value } }) => (
                    <PhoneInput
                      country={"in"}
                      onChange={(phoneNumber) => {
                        onChange("+" + phoneNumber); // Update the value directly
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

                <span className="error">{errors?.phone?.message}</span>
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Address</label>
                <input
                  className="w-full  text-black border  rounded-lg py-3 px-4"
                  type="text"
                  placeholder="132, My Street, Kingston, New York 12401."
                  {...register("address")}
                />
                <span className="error">{errors?.address?.message}</span>
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Roles</label>
                <input
                  readOnly
                  className="w-full  text-black border  rounded-lg py-3 px-4"
                  type="text"
                  placeholder="Admin"
                  {...register("role")}
                />
                <span className="error">{errors?.role?.message}</span>
              </div>
            </div>
            <div className="-mx-3 md:flex ">
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Zip Code</label>
                <input
                  className="w-full  text-black border  rounded-lg py-3 px-4"
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
                    className="w-full text-black border rounded-lg py-3 px-4 bg-white"
                    {...register("countryID", {
                      onChange: (e) => {
                        setSelectedCountry(e.target.value);
                      },
                    })}
                  >
                    <option label="Select country"></option>
                    {countries.map((country) => (
                      <option
                        key={country.countryID}
                        selected={country?.countryID == getValues("countryID")}
                        value={country.countryID}
                        // onChange={(e) => {}}
                      >
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                  <span className="error">{errors?.countryID?.message}</span>
                </div>
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">State</label>
                <div>
                  <select
                    className="w-full text-black border rounded-lg py-3 px-4 bg-white"
                    name="state"
                    {...register("stateId")}
                  >
                    <option label="Select state"></option>
                    {Array.isArray(states) &&
                      states.map((state) => (
                        <option
                          selected={state?.stateId == getValues("stateId")}
                          key={state.stateId}
                          value={state.stateId}
                        >
                          {state.stateName}
                        </option>
                      ))}
                  </select>
                  <span className="error">{errors?.stateId?.message}</span>
                </div>
              </div>
            </div>
            <div className="-mx-3 md:flex ">
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Language</label>
                <div>
                  <select
                    className="w-full text-black border rounded-lg py-3 px-4 bg-white"
                    {...register("languageId")}
                  >
                    <option label="Select language"></option>

                    {languages.map((language) => (
                      <option
                        value={language.languageId}
                        key={language.languageId}
                        selected={
                          language?.languageId == getValues("languageId")
                        }
                      >
                        {language.languageName}
                      </option>
                    ))}
                  </select>
                  <span className="error">{errors?.languageId?.message}</span>
                </div>
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Timezone</label>
                <div>
                  <select
                    className="w-full text-black border rounded-lg py-3 px-4 bg-white"
                    {...register("timeZoneId")}
                  >
                    <option label="Select timezone"></option>
                    {timezones.map((timezone) => (
                      <option
                        value={timezone.timeZoneID}
                        key={timezone.timeZoneID}
                        selected={
                          timezone?.timeZoneID == getValues("timeZoneId")
                        }
                      >
                        {timezone.timeZoneName}
                      </option>
                    ))}
                  </select>
                  <span className="error">{errors?.timeZoneId?.message}</span>
                </div>
              </div>
              <div className="md:w-1/2 px-3">
                <label className="label_top text-xs">Currency</label>
                <div>
                  <select
                    className="w-full text-black border rounded-lg py-3 px-4 bg-white"
                    {...register("currencyId")}
                  >
                    <option label="Select currency"></option>
                    {currencies &&
                      currencies.length > 0 &&
                      currencies?.map((currency) => (
                        <option
                          value={currency.currencyId}
                          key={currency.currencyId}
                          selected={
                            currency?.currencyId == getValues("currencyId")
                          }
                        >
                          {currency.currencyName}
                        </option>
                      ))}
                  </select>
                  <span className="error">{errors?.currencyId?.message}</span>
                </div>
              </div>
            </div>
            <div className="-mx-3 md:flex mt-5">
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
