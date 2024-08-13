import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import PhoneInput from 'react-phone-input-2';
import { isValidPhoneNumber } from 'react-phone-number-input';

const AddEditUser = ({
    editMode,
    setAddUserModal,
    setUserName,
    setFirstName,
    setLastName,
    setPhoneNumber,
    setEmail,
    setSelectedUserType,
    setIsActive,
    setEditMode,
    setEditUserId,
    setShowPassword,
    showPassword,
    selectedUserType,
    userName,
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
    userTypeData,
    isActive,
    handleCheckboxChange,
    handleInsertUser,
    setPassword,
    emailError,
    passError,
    usernameError,
    setPassError,
    setUsernameError,
    setEmailError,
    phoneError,
    firstError,
    lastError,
    setPhoneError,
    setLastError,
    setFirstError,
    setUserTypeError,
    userTypeError
}) => {
    const { control } = useForm();
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
                        <div className="relative p-4 lg:w-[500px] md:w-[500px] sm:w-full max-h-full">
                            {/* Modal content */}
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                {/* Modal header */}
                                <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600 ">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {editMode ? "Edit" : "Add"} User
                                    </h3>
                                    <AiOutlineCloseCircle
                                        className="text-4xl text-primary cursor-pointer"
                                        onClick={() => {
                                            setAddUserModal(false)
                                            setUserName("");
                                            setFirstName("");
                                            setLastName("");
                                            setPhoneNumber("");
                                            setEmail("");
                                            setPassword("")
                                            setSelectedUserType("");
                                            setIsActive("");
                                            setEditMode(false);
                                            setEditUserId("");
                                            setPassError(false)
                                            setEmailError(false)
                                            setUsernameError(false)
                                            setShowPassword(false)
                                            setPhoneError(false)
                                            setFirstError(false)
                                            setLastError(false)
                                            setUserTypeError(false)
                                        }}
                                    />
                                </div>
                                <div>
                                    <div className="p-4 max-h-80 vertical-scroll-inner">
                                        <input
                                            type="text"
                                            placeholder="User Name"
                                            className="formInput"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                        />
                                        {usernameError && (
                                            <span className='error'>This field is required.</span>
                                        )}

                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            className="formInput mt-4"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                        {firstError && (
                                            <span className='error'>This field is required.</span>
                                        )}
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            className="formInput mt-4"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                        {lastError && (
                                            <span className='error'>This field is required.</span>
                                        )}

                                        {/*      <input
                                            type="number"
                                            placeholder="Phone Number"
                                            className="formInput mt-4"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />*/}
                                        <div className='mt-4'>
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
                                                            setPhoneNumber(formattedNumber); // Update the state to reflect the phone number
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
                                            {phoneError && (
                                                <span className='error'>Invalid Phone Number.</span>
                                            )}
                                        </div>

                                        {!editMode && (
                                            <>
                                                <input
                                                    type="email"
                                                    placeholder="Email"
                                                    className="formInput mt-4"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                                {emailError && (
                                                    <span className='error'>Invalid Email Address.</span>
                                                )}
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Password"
                                                        className="formInput mt-4"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                    <div className="absolute right-5 bottom-5">
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
                                                {passError && (
                                                    <span className='error'>This field is required.</span>
                                                )}

                                            </>
                                        )}
                                        <select
                                            onChange={(e) => setSelectedUserType(e.target.value)}
                                            value={selectedUserType}
                                            className="formInput mt-4"
                                        >
                                            <option value="">Select User Type</option>
                                            {userTypeData.map((user) => (
                                                <option key={user.userTypeID} value={user.userTypeID}>
                                                    {user.userType}
                                                </option>
                                            ))}
                                        </select>
                                        {userTypeError && (
                                            <span className='error'>This field is required.</span>
                                        )}
                                        <div className="mt-5 flex items-center">
                                            <input
                                                className="border border-primary mr-3 ml-1 rounded h-6 w-6"
                                                type="checkbox"
                                                checked={isActive}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label>isActive </label>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center p-4 md:p-4 border-t border-gray-200 rounded-b dark:border-gray-600 gap-2">
                                        <button
                                            className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                                            type="button"
                                            onClick={() => {
                                                setAddUserModal(false)
                                                setUserName("");
                                                setFirstName("");
                                                setLastName("");
                                                setPhoneNumber("");
                                                setEmail("");
                                                setPassword("")
                                                setSelectedUserType("");
                                                setIsActive("");
                                                setEditMode(false);
                                                setEditUserId("");
                                                setPassError(false)
                                                setEmailError(false)
                                                setUsernameError(false)
                                                setShowPassword(false)
                                                setPhoneError(false)
                                                setFirstError(false)
                                                setLastError(false)
                                                setUserTypeError(false)
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="bg-primary text-white text-base px-8 py-3 border border-primary shadow-md rounded-full "
                                            type="button"
                                            onClick={handleInsertUser}
                                        >
                                            {editMode ? "Edit" : "Save"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddEditUser
