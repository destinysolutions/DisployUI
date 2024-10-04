import { useFormik } from "formik";
import React, { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addSalesManData, updateSalesManData } from "../../Redux/SalesMan/SalesManSlice";
import PhoneInput from "react-phone-input-2";
import { isValidPhoneNumber } from "react-phone-number-input";

const AddEditSalesMan = ({
    setShowModal,
    heading,
    toggleModal,
    showPassword,
    setShowPassword,
    editData,
    editId,
    fetchData,
    setEditId, setEditData
}) => {

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)


    //using for validation and register api calling
    const phoneRegExp =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const validationSchema = Yup.object().shape({
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
            .required('Phone number is required')
            .test('is-valid-phone', 'Invalid phone number', value => isValidPhoneNumber(value)),
        percentageRatio: Yup.number()
            .required("Percentage Ratio is required")
            .min(0, "Percentage Ratio must be at least 0")
            .max(100, "Percentage Ratio must be at most 100"),
    });


    const editValidationSchema = Yup.object().shape({
        firstName: Yup.string().required("First Name is required").max(50),
        lastName: Yup.string().required("Last Name is required").max(50),
        emailID: Yup.string()
            .required("Email is required")
            .email("E-mail must be a valid e-mail!"),
        phoneNumber: Yup.string()
            .required('Phone number is required')
            .test('is-valid-phone', 'Invalid phone number', value => isValidPhoneNumber(value)),
        percentageRatio: Yup.number()
            .required("Percentage Ratio is required")
            .min(0, "Percentage Ratio must be at least 0")
            .max(100, "Percentage Ratio must be at most 100"),

    });
    const formik = useFormik({
        initialValues: editData ? editData : '',
        enableReinitialize: !!editData,
        validationSchema: editId ? editValidationSchema : validationSchema,
        onSubmit: async (values) => {
            setLoading(true);

            const formData = new FormData();
            formData.append("Password", values.password || ""); // Set a default value if null
            formData.append("FirstName", values.firstName);
            formData.append("LastName", values.lastName);
            formData.append("Email", values.emailID);
            formData.append("PercentageRatio", values.percentageRatio);
            formData.append("Phone", values.phoneNumber);
            formData.append("GoogleLocation", "No Location");
            formData.append("OrganizationName", "No Organization");
            formData.append("IsRetailer", false);
            formData.append("IsSalesMan", true);
            formData.append("orgUserID", values.orgUserID ? values.orgUserID : 0);

            try {
                let response;

                if (editId) {
                    formData.append("OrgUserSpecificID", editId);
                    const response = await dispatch(updateSalesManData(formData));

                    if (response?.payload?.status) {
                        setEditData({});
                        formik.resetForm();
                        fetchData();
                        toast.success("Sales Man Updated Successfully.");
                    } else {
                        toast.error(response?.payload?.message);
                    }
                } else {
                    formData.append("Operation", "Insert");
                    response = await dispatch(addSalesManData(formData));

                    if (response?.payload?.status) {
                        toast.success("Sales Man Created Successfully.");
                        fetchData();
                        formik.resetForm();
                    } else {
                        toast.error(response?.payload?.message);
                    }
                }

                setEditId(null);
                setLoading(false);
                setShowModal(false);
            } catch (error) {
                console.error('error', error);
                toast.error("An error occurred. Please try again.");
                setLoading(false);
                setShowModal(false);
            }
        },
    });



    const handlePhoneChange = value => {
        formik.setFieldValue('phoneNumber', '+' + value); // Update the phoneNumber value with the correct format
    };

    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed h-full top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="relative p-4 w-full max-w-2xl max-h-full">
                            {/* Modal content */}
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                {/* Modal header */}
                                <div className="flex items-center justify-between p-3 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {heading} Sales Man
                                    </h3>
                                    <AiOutlineCloseCircle
                                        className="text-4xl text-primary cursor-pointer"
                                        onClick={() => {
                                            toggleModal();
                                            formik.resetForm();
                                        }}
                                    />
                                </div>
                                {/* Modal body */}
                                <div className="p-6">
                                    <form
                                        onSubmit={formik.handleSubmit}
                                        className="space-y-3 md:space-y-5"
                                    >
                                        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 lg:gap-4 md:gap-4 sm:gap-2 xs:gap-2">
                                            <div className="relative lg:w-64 md:w-64 sm:max-w-[376px]">
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    id="firstName"
                                                    placeholder="Enter Your First Name"
                                                    className="formInput"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.firstName}
                                                />
                                                {formik.errors.firstName && formik.touched.firstName && (
                                                    <div className="error">{formik.errors.firstName}</div>
                                                )}
                                            </div>
                                            <div className="relative lg:w-64 md:w-64 sm:max-w-[376px]">
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    id="lastName"
                                                    placeholder="Enter Your Last Name"
                                                    className="formInput"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.lastName}
                                                />
                                                {formik.errors.lastName && formik.touched.lastName && (
                                                    <div className="error">{formik.errors.lastName}</div>
                                                )}
                                            </div>
                                            <div className="relative lg:w-64 md:w-64 sm:max-w-[376px]">
                                                <PhoneInput
                                                    country={"in"}
                                                    onChange={handlePhoneChange}
                                                    value={formik?.values?.phoneNumber?.replace('+', '')} // Remove the '+' for the PhoneInput
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
                                                {formik.errors.phoneNumber &&
                                                    formik.touched.phoneNumber && (
                                                        <div className="error">
                                                            {formik.errors.phoneNumber}
                                                        </div>
                                                    )}
                                            </div>

                                            <div className="relative lg:w-64 md:w-64 sm:max-w-[376px]">
                                                <input
                                                    type="email"
                                                    name="emailID"
                                                    id="emailID"
                                                    className="formInput"
                                                    placeholder="Enter Your Email Address"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.emailID}
                                                    disabled={editId}
                                                />
                                                {formik.errors.emailID && formik.touched.emailID && (
                                                    <div className="error">{formik.errors.emailID}</div>
                                                )}
                                            </div>
                                            {!editId && (
                                                <div className="relative lg:w-64 md:w-64 sm:max-w-[376px]">
                                                    <div className="relative">
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            name="password"
                                                            id="password"
                                                            placeholder="Enter Your Password"
                                                            className="formInput"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.password}
                                                            disabled={editId}
                                                        />
                                                        {!editId && (
                                                            <div className="register-icon">
                                                                {showPassword ? (
                                                                    <BsFillEyeFill
                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                    />
                                                                ) : (
                                                                    <BsFillEyeSlashFill
                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                    />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {formik.errors.password && formik.touched.password && (
                                                        <div className="error">{formik.errors.password}</div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="relative lg:w-64 md:w-64 sm:max-w-[376px]">
                                                <input
                                                    type="number"
                                                    name="percentageRatio"
                                                    id="percentageRatio"
                                                    placeholder="Enter Your Percentage Ratio"
                                                    className="formInput"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.percentageRatio}
                                                />
                                                {formik.errors.percentageRatio && formik.touched.percentageRatio && (
                                                    <div className="error">{formik.errors.percentageRatio}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center px-4 pt-4 border-t border-gray-200 rounded-b dark:border-gray-600 gap-2">
                                            <button
                                                type="button"
                                                className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                                                onClick={() => {
                                                    toggleModal()
                                                    formik.resetForm();
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-primary text-white text-base px-8 py-3 border border-primary shadow-md rounded-full "
                                                disabled={loading}
                                            >
                                                {heading === "Add"
                                                    ? (loading ? "Saving..." : "Save")
                                                    : (loading ? "Updating..." : "Update")}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddEditSalesMan
