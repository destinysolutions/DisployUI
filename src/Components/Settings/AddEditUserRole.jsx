import React from "react";
import { useForm } from "react-hook-form";
import { AiOutlineCloseCircle } from "react-icons/ai";
import {
  DynamicDesignComponent,
  mapModuleTitlesToUserAccess,
} from "../Common/Common";
import { ADD_UPDATE_ORGANIZATION_USER_ROLE } from "../../Pages/Api";
import toast from "react-hot-toast";
import { handleAddNewUserRole } from "../../Redux/SettingUserSlice";
import { useDispatch } from "react-redux";
import { getMenuAll } from "../../Redux/SidebarSlice";
const AddEditUserRole = ({
  toggleModal,
  userRoleData,
  heading,
  nextbutton,
  setNextButton,
  allUserRoleData,
  roleuserList,
  moduleTitle,
  fetchUserRole,
  setShowModal,
  authToken,
  setUserDisable,
  userDisable,
  setUserRoleData,
}) => {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: userRoleData });
  const dispatch = useDispatch();
  const searchDataLength = allUserRoleData?.SearchData?.length;
  const maxLength = 5;
  const adjustedSearchDataLength =
    heading === "Add" ? searchDataLength : searchDataLength - 1;
  const length =
    adjustedSearchDataLength > maxLength ? maxLength : adjustedSearchDataLength;
  const LevelApproval = Array.from({ length }, (_, index) => ({
    id: index + 1,
  }));

  const onSubmit = (data) => {
    let Parmas = {
      orgUserRoleID: userRoleData?.orgUserRoleID || 0,
      orgUserRole: data?.userRole,
      isActive: 1,
      userID: 0,
      mode: "Save",
      userCount: 0,
      useraccess: mapModuleTitlesToUserAccess(moduleTitle, watch),
    };

    toast.loading("saving..");
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${ADD_UPDATE_ORGANIZATION_USER_ROLE}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      data: Parmas,
    };

    dispatch(handleAddNewUserRole({ config }))
      .then((res) => {
        if (res?.payload?.status === 200) {
          toast.remove();
          fetchUserRole();
          dispatch(getMenuAll())
          setShowModal(false);
          setUserDisable();
          setUserRoleData();
        }
      })
      .catch((error) => console.log("error", error));
  };
  return (
    <>
      <div
        id="default-modal"
        tabIndex="-1"
        aria-hidden="true"
        className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
      >
        <div className="relative p-4 w-full max-w-3xl max-h-full">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* Modal header */}
            <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {heading} User Role
              </h3>
              <AiOutlineCloseCircle
                className="text-4xl text-primary cursor-pointer"
                onClick={() => {
                  toggleModal();
                }}
              />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-4 md:p-5">
                <div className="grid gap-4 mb-2 grid-cols-2">
                  <div className="col-span-2 sm:col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Role Name
                    </label>
                    <input
                      type="text"
                      {...register("userRole", {
                        required: "User Role is required",
                      })}
                      name="userRole"
                      id="userRole"
                      className="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Enter Role Name"
                      required=""
                    />
                    {errors.userRole && (
                      <span className="error">{errors.userRole.message}</span>
                    )}
                  </div>

                  {!nextbutton && (
                    <div className="relative max-h-96 vertical-scroll-inner sm:rounded-lg col-span-2 sm:col-span-2 max-h-325">
                      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 table-head-bg">
                          <tr>
                            <th scope="col" className="px-6 py-3"></th>
                            <th scope="col" className="px-6 py-3 text-center">
                              View
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Create & Edit
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Delete
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {moduleTitle?.length > 0 &&
                            moduleTitle?.map((item, index) => {
                              return (
                                <tr
                                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                  key={index}
                                >
                                  <td
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                  >
                                    {item?.pageName}
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <input
                                      id={`${item?.alt}_View`}
                                      {...register(`${item?.alt}_View`)}
                                      className="border border-primary text-center rounded h-4 w-4 cursor-pointer"
                                      type="checkbox"
                                    />
                                  </td>
                                  {item?.moduleID !== 1 && (
                                    <>
                                      <td className="px-6 py-4 text-center">
                                        <input
                                          id={`${item?.alt}_Edit`}
                                          {...register(`${item?.alt}_Edit`)}
                                          onChange={() => {
                                            // setValue(`${item?.alt}_View`, true);
                                            if (
                                              watch(`${item?.alt}_Edit`) ===
                                              true
                                            ) {
                                              setValue(
                                                `${item?.alt}_Delete`,
                                                false
                                              );
                                            }else{
                                              setValue(`${item?.alt}_View`, true);
                                            }
                                          }}
                                          className="border border-primary text-center rounded h-4 w-4 cursor-pointer"
                                          type="checkbox"
                                        />
                                      </td>
                                      <td className="px-6 py-4 text-center">
                                        <input
                                          id={`${item?.alt}_Delete`}
                                          {...register(`${item?.alt}_Delete`)}
                                          className="border border-primary text-center rounded h-4 w-4 cursor-pointer"
                                          type="checkbox"
                                        />
                                      </td>
                                    </>
                                  )}
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {nextbutton && (
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg col-span-2 sm:col-span-2 max-h-325">
                      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 table-head-bg">
                          <tr>
                            <th scope="col" className="px-6 py-3"></th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Set Approval
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Level of Approval
                            </th>
                            <th scope="col" className="px-6 py-3"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {moduleTitle?.length > 0 &&
                            moduleTitle?.map((item, index) => {
                              if (item?.isForApproval) {
                                const isApproveChecked = watch(
                                  `${item?.alt}_Approve`
                                );
                                const disableList =
                                  userRoleData?.[`${item?.alt}_Approve`];
                                return (
                                  <tr
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                    key={index}
                                  >
                                    <td
                                      scope="row"
                                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                      {item?.pageName}
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                      <input
                                        id={`${item?.alt}_Approve`}
                                        {...register(`${item?.alt}_Approve`)}
                                      onChange={()=>{
                                        if(isApproveChecked){
                                          setValue(`${item?.alt}_Approve`,false);
                                          setValue(`${item?.alt}_LevelApprove`,"")
                                        }else{
                                          setValue(`${item?.alt}_Approve`,true)
                                        }
                                      }}
                                        className="border border-primary text-center rounded h-4 w-4 cursor-pointer"
                                        type="checkbox"
                                      />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                      <select
                                        id={`${item?.alt}_LevelApprove`}
                                        disabled={
                                          !isApproveChecked || disableList
                                        } // disable if the checkbox is not checked
                                        {...register(
                                          `${item?.alt}_LevelApprove`
                                        )}
                                        className="border text-black border-primary text-center rounded h-8 w-20 cursor-pointer"
                                      ><option value="" label="Select..."/>
                                        {LevelApproval?.map((level) => (
                                          <option
                                            key={level?.id}
                                            value={level?.id}
                                          >
                                            {level?.id}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    {isApproveChecked && (
                                      <td className="px-6 py-4 text-center">
                                        <DynamicDesignComponent
                                          length={watch(
                                            `${item?.alt}_LevelApprove`
                                          )}
                                          name={`${item?.alt}`}
                                          watch={watch}
                                          register={register}
                                          getValues={getValues}
                                          errors={errors}
                                          roleuserList={roleuserList}
                                          setValue={setValue}
                                          userRoleData={userRoleData}
                                          setUserDisable={setUserDisable}
                                          userDisable={userDisable}
                                        />
                                      </td>
                                    )}
                                  </tr>
                                );
                              }
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center p-2 md:p-2 border-t border-gray-200 rounded-b dark:border-gray-600 gap-2">
                  <button
                    className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                    type="button"
                    onClick={toggleModal}
                  >
                    Cancel
                  </button>
                  {!nextbutton && (
                    <button
                      className="bg-primary text-white text-base px-8 py-3 border border-primary shadow-md rounded-full "
                      type="button"
                      onClick={() => setNextButton(true)}
                    >
                      Next
                    </button>
                  )}
                  {nextbutton && (
                    <button
                      className="bg-primary text-white text-base px-8 py-3 border border-primary shadow-md rounded-full "
                      type="submit"
                      disabled={!nextbutton}
                    >
                      {heading === "Add" ? "Save" : "Update"}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEditUserRole;
