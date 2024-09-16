import moment from 'moment';
import React, { useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import ScreenAccess from './ScreenAccess';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';

const AddEditUser = ({
    modalRef,
    labelTitle,
    firstName,
    setFirstName,
    errors,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    setShowPassword,
    showPassword,
    phone,
    setPhone,
    company,
    setCompany,
    zipCode,
    setZipCode,
    countryID,
    setCountryID,
    Countries,
    selectedState,
    setSelectedState,
    states,
    selectRoleID,
    setSelectRoleID,
    userRoleData,
    isActive,
    setIsActive,
    file,
    editProfile,
    fileEdit,
    handleClick,
    handleFileChange,
    hiddenFileInput,
    setSelectScreenModal,
    selectScreenModal,
    selectScreenRef,
    handleSelectAllCheckboxChange,
    selectAllChecked,
    screenCheckboxes,
    loading,
    screenData,
    handleScreenCheckboxChange,
    setshowuserModal,
    handleCancelPopup,
    handleAddUser,
    setSelectedScreens,
    handleUpdateUser,
    sidebarOpen,
    isActiveUser, setIsActiveUser
}) => {
    const { control } = useForm();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
    };

    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="relative p-4 lg:w-[700px] md:w-[700px] sm:w-full max-h-full">
                            {/* Modal content */}
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                {/* Modal header */}
                                <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {labelTitle}
                                    </h3>
                                    <AiOutlineCloseCircle
                                        className="text-4xl text-primary cursor-pointer"
                                        onClick={() => {
                                            handleCancelPopup();
                                        }}
                                    />
                                </div>
                                <div className="model-body lg:p-5 md:p-5 sm:p-2 xs:p-2">
                                    <div className=" lg:p-3 md:p-3 sm:p-2 xs:py-3 xs:px-1 max-h-96 vertical-scroll-inner text-left rounded-2xl">
                                        <div className="grid grid-cols-12 gap-6">
                                            <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                                                <div className="relative">
                                                    <label className="formLabel">First Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter First Name"
                                                        name="fname"
                                                        className="formInput user-Input"
                                                        value={firstName}
                                                        onChange={(e) => setFirstName(e.target.value)}
                                                    />
                                                    {!firstName && errors?.firstName && (
                                                        <p className="error">{errors?.firstName}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                                                <div className="relative">
                                                    <label className="formLabel">Last Name </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Last Name"
                                                        name="lname"
                                                        className="formInput user-Input"
                                                        value={lastName}
                                                        onChange={(e) => setLastName(e.target.value)}
                                                    />
                                                    {!lastName && errors?.lastName && (
                                                        <p className="error">{errors?.lastName}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {labelTitle !== "Update User" && (
                                                <>
                                                    <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                                                        <div className="relative">
                                                            <label className="formLabel">Email</label>
                                                            <input
                                                                type="email"
                                                                placeholder="Enter Email Address"
                                                                name="email"
                                                                className="formInput user-Input"
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                            />
                                                            {errors?.email && (email?.length <= 0 ?
                                                                <span span className='error'>Email is required.</span> :
                                                                !(emailRegex?.test(email)) && <span className='error'>Invalid Email Address.</span>
                                                                // <span className='error'>Invalid Email Address.</span>
                                                            )}

                                                        </div>
                                                    </div>

                                                    <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                                                        <div className="relative">
                                                            <label className="formLabel">Password</label>
                                                            <input
                                                                type={showPassword ? "text" : "password"}
                                                                placeholder="Enter Your Password"
                                                                name="fname"
                                                                className="formInput user-Input"
                                                                value={password}
                                                                onChange={handlePasswordChange}
                                                            />

                                                            <div className="icon">
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
                                                        </div>

                                                        {errors?.password && (password?.length <= 0 ?
                                                            <span span className='error'>This field is required.</span> :
                                                            !(validatePassword(password)) && <span className='error'>Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character</span>
                                                        )}

                                                    </div>
                                                </>
                                            )}

                                            <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                                                <div className="relative">
                                                    <label className="formLabel">Phone No</label>
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
                                                                    const formattedNumber = "+" + phoneNumber;
                                                                    onChange(formattedNumber); // Update the value directly
                                                                    setPhone(formattedNumber); // Update the state to reflect the phone number
                                                                }}
                                                                value={value || phone}
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
                                                </div>
                                            </div>
                                            <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                                                <div className="relative">
                                                    <label className="formLabel">Company</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Company Name"
                                                        name="cname"
                                                        className="formInput user-Input"
                                                        value={company}
                                                        onChange={(e) => setCompany(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                                                <div className="relative">
                                                    <label className="formLabel">Zip Code</label>
                                                    <input
                                                        type="number"
                                                        placeholder="Enter zip code"
                                                        name="zipcode"
                                                        className="formInput user-Input"
                                                        value={zipCode}
                                                        maxLength="10"
                                                        onChange={(e) => {
                                                            if (e.target.value.length <= 10) {
                                                                setZipCode(e.target.value);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                                                <div className="relative">
                                                    <label className="formLabel">Country</label>
                                                    <select
                                                        className="formInput user-Input bg-white"
                                                        value={countryID}
                                                        onChange={(e) => setCountryID(e.target.value)}
                                                    >
                                                        {countryID && labelTitle !== "Update User" && (
                                                            <option label="Select Country"></option>
                                                        )}
                                                        {!countryID && (
                                                            <option label="Select Country"></option>
                                                        )}
                                                        {Countries.map((country) => (
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
                                            <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                                                <div className="relative">
                                                    <label className="formLabel">State</label>
                                                    <select
                                                        className="formInput user-Input bg-white"
                                                        onChange={(e) => setSelectedState(e.target.value)}
                                                        value={selectedState}
                                                    >
                                                        {selectedState && labelTitle !== "Update User" && (
                                                            <option label="Select State"></option>
                                                        )}
                                                        {!selectedState && (
                                                            <option label="Select State"></option>
                                                        )}
                                                        {countryID &&
                                                            Array.isArray(states) &&
                                                            states.map((state) => (
                                                                <option key={state.stateId} value={state.stateId}>
                                                                    {state.stateName}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                                                <div className="relative">
                                                    <label className="formLabel">Roles</label>
                                                    <select
                                                        className="formInput user-Input bg-white"
                                                        value={selectRoleID}
                                                        onChange={(e) => setSelectRoleID(e.target.value)}
                                                    >
                                                        {selectRoleID && labelTitle !== "Update User" && (
                                                            <option label="Select User Role" className='hidden'></option>
                                                        )}
                                                        {!selectRoleID && (
                                                            <option label="Select User Role" className='hidden'></option>
                                                        )}
                                                        {userRoleData && userRoleData?.length > 0 ? (
                                                            userRoleData.map((userrole) => (
                                                                <option
                                                                    key={userrole?.orgUserRoleID}
                                                                    value={userrole?.orgUserRoleID}
                                                                >
                                                                    {userrole.orgUserRole}
                                                                </option>
                                                            ))
                                                        ) : (
                                                            <div>Data not here.</div>
                                                        )}
                                                    </select>
                                                    {!selectRoleID && errors?.role && <p className="error">{errors?.role}</p>}
                                                </div>
                                            </div>

                                            <div className="lg:col-span-4 md:col-span-12 sm:col-span-12 xs:col-span-12">
                                                <div className="mt-3 flex items-center">
                                                    <input
                                                        className="border border-primary mr-3 rounded h-6 w-6"
                                                        type="checkbox"
                                                        checked={isActiveUser}
                                                        onChange={(e) => setIsActiveUser(e.target.checked)}
                                                    />
                                                    <label>isActive</label>
                                                </div>
                                            </div>
                                            <div className="lg:col-span-8 md:col-span-12 sm:col-span-12 xs:col-span-12">
                                                <div className="flex items-center justify-end lg:flex-row md:flex-row sm:flex-row flex-col gap-2 ">
                                                    <div className="flex items-center justify-center">

                                                        <div className="layout-img me-3">
                                                            {file && editProfile !== 1 ? (
                                                                <img
                                                                    src={URL.createObjectURL(file)}
                                                                    alt="Uploaded"
                                                                    className="w-10 rounded-lg"
                                                                />
                                                            ) : null}
                                                            {editProfile === 1 && fileEdit !== null ? (
                                                                <img
                                                                    src={fileEdit}
                                                                    alt="Uploaded"
                                                                    className="w-10 rounded-lg"
                                                                />
                                                            ) : null}
                                                        </div>
                                                        <div className="layout-detaills me-3">
                                                            <button
                                                                className="lg:px-5 md:px-5 px-2 bg-primary text-white rounded-full py-2 border border-primary "
                                                                onClick={handleClick}
                                                            >
                                                                Profile photo
                                                            </button>
                                                            <input
                                                                type="file"
                                                                id="upload-button"
                                                                style={{ display: "none" }}
                                                                ref={hiddenFileInput}
                                                                accept="image/*"
                                                                onChange={(e) => handleFileChange(e)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectScreenModal(true)}
                                                        className="lg:px-5 md:px-5 px-2 bg-primary text-white rounded-full py-2 border border-primary me-3 "
                                                    >
                                                        Screen Access
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-12 p-5 text-center border-t border-gray">
                                    <button
                                        className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                                        onClick={() => {
                                            setshowuserModal(false);
                                            handleCancelPopup();
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    {labelTitle !== "Update User" ? (
                                        <button
                                            onClick={() => {
                                                handleAddUser();
                                                setSelectedScreens([]);
                                            }}
                                            className="bg-white text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                handleUpdateUser();
                                            }}
                                            className="bg-white text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white"
                                        >
                                            Update
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectScreenModal && (
                <ScreenAccess
                    selectScreenRef={selectScreenRef}
                    handleSelectAllCheckboxChange={handleSelectAllCheckboxChange}
                    selectAllChecked={selectAllChecked}
                    screenCheckboxes={screenCheckboxes}
                    setSelectScreenModal={setSelectScreenModal}
                    loading={loading}
                    screenData={screenData}
                    handleScreenCheckboxChange={handleScreenCheckboxChange}
                    sidebarOpen={sidebarOpen}
                />
            )}
        </>
    )
}

export default AddEditUser
