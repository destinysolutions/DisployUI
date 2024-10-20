
import React from "react";
import { useState, useEffect, useRef } from "react";
import moment from "moment";
import { GoPencil } from "react-icons/go";
import { Link, } from "react-router-dom";
import toast from "react-hot-toast";
import { AiOutlineClose, } from "react-icons/ai";
import { MdSave } from "react-icons/md";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Img from '../../../images/AppsImg/close.png'
import { countryList } from "../../Common/Common";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";

export default function AddCurrencies({ sidebarOpen, setSidebarOpen }) {
    const currentDate = new Date();
    const { user, token, userDetails } = useSelector((state) => state.root.auth);

    const [instanceName, setInstanceName] = useState(
        moment(currentDate).format("YYYY-MM-DD hh:mm")
    );
    const [currency, setCurrency] = useState({
        title: "",
        Unit: "",
        Basecurrency: "",
        Currencies: [],
        Continuous: "",
    });
    const [ShowPreview, setShowPreview] = useState(false);
    const [edited, setEdited] = useState(false);
    const [loader, setLoader] = useState(false);

    const handleMuteChange = (e) => {
        const { name, checked } = e.target;
        setCurrency((pre) => ({
            ...pre,
            [name]: checked,
        }));
    };
    const handleOnSaveInstanceName = (e) => {
        if (!instanceName.replace(/\s/g, "").length) {
            toast.remove();
            return toast.error("Please enter at least minimum 1 character.");
        }
        setEdited(false);
    };
    const validationSchema = Yup.object({
        Unit: Yup.number()
            .required("Unit is required")
            .positive("Unit must be positive"),
        Basecurrency: Yup.string().required("Base currency is required"),
        Currencies: Yup.string().required("Currencies field is required"),
    });
    const formik = useFormik({
        initialValues: {
            title: "",
            Unit: "1",
            Basecurrency: "",
            Currencies: "",
        },
        validationSchema,
        onSubmit: (values) => {
            console.log(values, "Submitted values");
        },
    });

    const valid = !!(
        formik.values.Basecurrency &&
        formik.values.Currencies &&
        formik.values.Unit
    );

    useEffect(() => {
        setCurrency({
            ...currency,
            title: formik.values.title,
            Unit: formik.values.Unit,
            Basecurrency: formik.values.Basecurrency,
        });
    }, [formik.values]);

    useEffect(() => {
        setLoader(true);

        setTimeout(() => {
            setLoader(false);
        }, 2000);
    }, [formik.values]);

    useEffect(() => {
        const convertCurrency = async () => {
            try {
                const response = await fetch(
                    `https://api.exchangerate-api.com/v4/latest/${formik?.values?.Basecurrency?.toUpperCase()}`
                );
                const data = await response.json();

                const results = formik?.values?.Currencies?.split(",")
                    .map((currency) => currency.trim())
                    .filter((currency) => currency !== "")
                    .map((currency) => {
                        const rate = data?.rates[currency?.toUpperCase()];
                        const result = rate ? formik?.values?.Unit * rate : 0;
                        return {
                            currencyname: currency,
                            total: result,
                            flagUrl: `https://flagsapi.com/${countryList[currency.toUpperCase()]
                                }/flat/64.png`,
                        };
                    });
                setCurrency((pre) => ({
                    ...pre,
                    Currencies: results,
                }));
            } catch (error) {
                console.error("Error during currency conversion:", error);

                setCurrency({
                    title: "",
                    Unit: "",
                    Basecurrency: "",
                    Currencies: [],
                    Continuous: "",
                });
            }
        };

        convertCurrency();
    }, [formik.values]);


    const onSumbit = (params) => {
        const Payload = {

            instanceName: instanceName,
            pageTitle: currency?.title,
            unit: currency?.Unit,
            baseCurrency: currency?.Basecurrency,
            convertCurrency: "string",
            isContinuous: true,

        }
    }


    return (
        <>
            <div className="flex border-b border-gray">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>
            <div
                className={
                    userDetails?.isTrial &&
                        user?.userDetails?.isRetailer === false &&
                        !userDetails?.isActivePlan
                        ? "lg:pt-32 md:pt-32 sm:pt-20 xs:pt-20 px-5 page-contain"
                        : "lg:pt-24 md:pt-24 pt-10 px-5 page-contain"
                }
            >
                <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                    <div className="px-6 page-contain">
                        <div>
                            <div className="lg:flex lg:justify-between sm:block my-4 items-center">
                                <div className="flex items-center">
                                    {edited ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                className="w-full border border-primary rounded-md px-2 py-1"
                                                placeholder="Enter schedule name"
                                                value={instanceName}
                                                onChange={(e) => {
                                                    setInstanceName(e.target.value);
                                                }}
                                            />
                                            <MdSave
                                                onClick={() => handleOnSaveInstanceName()}
                                                className="min-w-[1.5rem] min-h-[1.5rem] cursor-pointer"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex">
                                            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
                                                {instanceName}
                                            </h1>
                                            <button onClick={() => setEdited(true)}>
                                                <GoPencil className="ml-4 text-lg" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap youtubebtnpopup">
                                    <button
                                        className="flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2  text-base sm:text-sm mr-2 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                        onClick={() => {
                                            if (valid === false)
                                                return toast.error("Please Feel Details");
                                            setShowPreview(!ShowPreview);
                                        }}
                                    >
                                        {ShowPreview ? "Edit" : "Preview"}
                                    </button>
                                    <button
                                        type="button"
                                        className="flex align-middle border-white bg-SlateBlue text-white sm:mt-2  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 .  text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                        onClick={""}
                                        disabled={""}
                                    >
                                        {/* {saveLoading ? "Saving..." : "Save"} */}
                                        Save
                                    </button>

                                    <Link to="/Currency">
                                        <button className="sm:ml-2 xs:ml-1 sm:mt-2 border-primary items-center border-2  rounded-full text-xl  hover:text-white hover:bg-SlateBlue hover:border-white hover:shadow-lg hover:shadow-primary-500/50 p-2 ">
                                            <AiOutlineClose />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            {ShowPreview && (
                                <div className="w-[95%] bg-gray-50 rounded-sm  flex items-center justify-center min-h-[100px]">
                                    <div className="w-[100%]   h-[full] min-h-[500px]  border border-gray-200 shadow-md bg-black dark:border-gray-700">
                                        <header className="flex justify-center items-center w-full h-[15vh]">
                                            {loader !== true && (
                                                <h1 className="mb-3 text-3xl font-semibold text-white">
                                                    {formik.values.title === ""
                                                        ? "Exchange Rates"
                                                        : formik.values.title}
                                                </h1>
                                            )}
                                        </header>

                                        <div className="w-full h-[full] overflow-y-auto bg-gray-700 rounded-md">
                                            {loader !== true && (
                                                <div className="flex flex-wrap justify-center items-center gap-4 p-4">
                                                    {currency.Currencies.map((item, index) => (
                                                        <>
                                                            {item.total === 0 ? (
                                                                <div
                                                                    key={index}
                                                                    className="w-[250px] h-[60px] bg-slate-600 rounded-lg flex items-center justify-between p-3 shadow-md"
                                                                >
                                                                    <img
                                                                        src={Img}
                                                                        alt="Flag"
                                                                        className="w-10 h-6 rounded-md"
                                                                    />
                                                                    <div>
                                                                        <p className="text-white text-lg font-bold">
                                                                            {item.currencyname.toUpperCase()}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-white text-lg font-bold">
                                                                            {item.total}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    key={index}
                                                                    className="w-[250px] h-[60px] bg-slate-600 rounded-lg flex items-center justify-between p-3 shadow-md"
                                                                >
                                                                    <img
                                                                        src={item.flagUrl}
                                                                        alt="Flag"
                                                                        className="w-10 h-6 rounded-md"
                                                                    />
                                                                    <div>
                                                                        <p className="text-white text-lg font-bold">
                                                                            {item.currencyname.toUpperCase()}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-white text-lg font-bold">
                                                                            {item.total}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {/* <div
                                key={index}
                                className="w-[250px] h-[60px] bg-slate-600 rounded-lg flex items-center justify-between p-3 shadow-md"
                              >
                                <img
                                  src={item.flagUrl}
                                  alt="Flag"
                                  className="w-10 h-6 rounded-md"
                                />
                                <div>
                                  <p className="text-white text-lg font-bold">
                                    {item.currencyname.toUpperCase()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-white text-lg font-bold">
                                    {item.total}
                                  </p>
                                </div>
                              </div> */}
                                                        </>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-center h-[15vh]">
                                            {loader !== true && (
                                                <p className="flex items-end text-2xl font-normal text-white">
                                                    <img
                                                        className="w-10 h-6 mr-2"
                                                        src={`https://flagsapi.com/${countryList[
                                                            formik.values.Basecurrency.toUpperCase()
                                                        ] || ""
                                                            }/flat/64.png`}
                                                        alt="flag"
                                                    />
                                                    {formik.values.Unit} {formik.values.Basecurrency}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!ShowPreview && (
                                <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-lg h-full pr-3">
                                    <div className="w-full lg:w-2/5 pr-0 lg:pr-4 mb-4 lg:mb-0 p-5">
                                        <div className="mb-4 flex items-center justify-between">
                                            <label
                                                htmlFor="countries"
                                                className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Page Title
                                            </label>

                                            <input
                                                type="text"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Default is Exchenge Rates"
                                                name="title"
                                                value={formik.values.title}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        <div className="mb-4 flex items-center justify-between">
                                            <label
                                                htmlFor="countries"
                                                className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Unit*
                                            </label>

                                            <input
                                                type="text"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="1"
                                                name="Unit"
                                                value={formik.values.Unit}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        <div className="mb-4 flex items-center justify-between">
                                            <label
                                                htmlFor="countries"
                                                className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Base currency*
                                            </label>

                                            <input
                                                type="text"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="e.g.USD"
                                                name="Basecurrency"
                                                value={formik.values.Basecurrency}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        <div className="mb-4 flex items-center justify-between">
                                            <label
                                                htmlFor="countries"
                                                className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Currencies, separated by comma*
                                            </label>

                                            <input
                                                type="text"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="e.g.JYP,RUB,EUR,GBP"
                                                name="Currencies"
                                                value={formik.values.Currencies}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        <div className="mb-4 flex items-center justify-between">
                                            <label
                                                htmlFor="countries"
                                                className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Continuous
                                            </label>
                                            <div className="text-right">
                                                <label className="inline-flex relative items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        readOnly
                                                        name="Continuous"
                                                        checked={currency?.Continuous}
                                                        onChange={(e) => handleMuteChange(e)}
                                                    />
                                                    <div
                                                        className={`w-11 h-6 ${currency?.Continuous
                                                            ? "bg-SlateBlue"
                                                            : "bg-gray-300"
                                                            } rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}
                                                    ></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-r-0 lg:border-r-2 border-gray-300 h-auto mx-4 hidden lg:block"></div>

                                    <div className="w-full lg:w-3/5 h-[35rem] flex items-center justify-center mt-4 lg:mt-0 ">
                                        {!valid && (
                                            <div className="w-[85%] h-[25rem] rounded-sm shadow-xl border-4 border-black flex items-center justify-center">
                                                <div className="text-center">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-16 w-16 mx-auto text-gray-400"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M3 7V3h18v4M4 10h16v4H4v-4z"
                                                        />
                                                    </svg>
                                                    <p className="text-gray-500">App instance preview</p>
                                                    <p className="text-sm text-gray-400">
                                                        Please edit the app settings to get started
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {valid && (
                                            <div className="w-full max-w-5xl h-[25rem] p-3 border border-gray-200 shadow-md bg-black dark:border-gray-700">
                                                <div className="flex justify-center h-8">
                                                    {loader !== true && (
                                                        <h1 className="mb-3 text-lg font-semibold text-white">
                                                            {formik.values.title === ""
                                                                ? "Exchange Rates"
                                                                : formik.values.title}
                                                        </h1>
                                                    )}
                                                </div>

                                                <div className="w-full h-[18rem] overflow-y-auto bg-gray-700 rounded-md">
                                                    {loader !== true && (
                                                        <div className="flex flex-wrap justify-center items-center gap-4 p-4">
                                                            {currency.Currencies.map((item, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="w-[250px] h-[60px] bg-slate-600 rounded-lg flex items-center justify-between p-3 shadow-md"
                                                                >
                                                                    <img
                                                                        src={item.total === 0 ? Img : item.flagUrl}
                                                                        alt="Flag"
                                                                        className="w-10 h-6 rounded-md"
                                                                    />
                                                                    <div>
                                                                        <p className="text-white text-lg font-bold">
                                                                            {item.currencyname.toUpperCase()}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-white text-lg font-bold">
                                                                            {item.total}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex justify-center mt-4">
                                                    {loader !== true && (
                                                        <p className="flex items-center text-sm font-normal text-white">
                                                            <img
                                                                className="w-10 h-6 mr-2"
                                                                src={`https://flagsapi.com/${countryList[
                                                                    formik.values.Basecurrency.toUpperCase()
                                                                ] || ""
                                                                    }/flat/64.png`}
                                                                alt="flag"
                                                            />
                                                            {formik.values.Unit} {formik.values.Basecurrency}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


