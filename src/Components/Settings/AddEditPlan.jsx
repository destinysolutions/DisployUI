import React, { useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { handleAddPlan } from "../../Redux/AdminSettingSlice";
import { useSelector } from "react-redux";
import { ADD_EDTT_PLAN } from "../../Pages/Api";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const AddEditPlan = ({
  showPlanModal,
  featureList,
  selectPlan,
  setSelectPlan,
  heading,
  fetchAllPlan,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.root.auth);
  const authToken = `Bearer ${token}`;
  const [formData, setFormData] = useState({
    PlanDetails: featureList,
    PlanName: "",
    totalscreen: 1,
    storage: "",
    planPrice: "",
    Status: false,
    description: "",
    notification: 1,
    isAnnually: false,
    isIndian: false,
  });
  console.log('formData :>> ', formData);
  const [errorPlanName, setErrorPlanName] = useState(false);
  const [errorStorage, setErrorStorage] = useState(false);
  const [errorCost, setErrorCost] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);
  const [errornotification, setErrorNotification] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectPlan) {

      let obj = {};
      obj.PlanName = selectPlan?.planName;
      obj.isIndian = selectPlan?.isIndian;
      obj.isAnnually = selectPlan?.isAnnually;
      obj.planPrice = selectPlan?.planPrice;
      obj.storage = parseInt(
        selectPlan?.planDetails?.[0]?.lstOfFeatures?.[2]?.value
      );
      obj.totalscreen = parseInt(
        selectPlan?.planDetails?.[3]?.lstOfFeatures?.[0]?.value
      );
      obj.PlanDetails = featureList;
      obj.Status = true;
      obj.notification = parseInt(
        selectPlan?.planDetails?.[0]?.lstOfFeatures?.[7]?.value
      );
      obj.description = selectPlan?.planDetailss;
      selectPlan?.planDetails?.map((item) => {
        return item?.lstOfFeatures?.map((list) => {
          obj[list?.name] = list?.value === "Yes" ? true : false;
        });
      });
      setFormData(obj);
    }
  }, [selectPlan]);

  const handleInputChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name, isChecked) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: isChecked,
    }));
  };

  const handleCreatePlan = () => {
    let hasError = false;
    if (!formData?.PlanName) {
      setErrorPlanName(true);
      hasError = true;
    }
    if (!formData?.storage) {
      setErrorStorage(true);
      hasError = true;
    }

    if (!formData?.planPrice) {
      setErrorCost(true);
      hasError = true;
    }
    if (!formData?.description) {
      setErrorDescription(true);
      hasError = true;
    }

    if (!formData?.notification) {
      setErrorNotification(true);
      hasError = true;
    }

    if (hasError) {
      return;
    }
    console.log('formData :>> ', formData);
    const FeatureList = formData?.PlanDetails?.map((item) => {
      if (item?.listOfFeaturesID === 32) {
        return {
          ...item,
          value: formData?.totalscreen,
        };
      }
      if (item?.listOfFeaturesID === 3) {
        return {
          ...item,
          value: `${formData?.storage} GB`,
        };
      }

      if (item?.listOfFeaturesID === 33) {
        return {
          ...item,
          value: `${formData?.notification} User`,
        };
      }

      if (formData.hasOwnProperty(item?.name)) {
        return {
          ...item,
          value: formData[item.name],
        };
      }
      console.log('item :>> ', item);
      return item;
    });
    console.log('FeatureList :>> ', FeatureList);
    setLoading(true);
    toast.loading("Saving...");

    let Params = {
      listOfPlansID: selectPlan?.listOfPlansID ? selectPlan?.listOfPlansID : 0,
      planDetailss: formData?.description,
      planName: formData?.PlanName,
      isRecomnded: true,
      planPrice: formData?.planPrice,
      isdefault: true,
      planDetails: FeatureList,
      IsActive: formData?.Status,
      isIndian: true,
      isAnnually: true,
    };


    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${ADD_EDTT_PLAN}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      data: JSON.stringify(Params),
    };
    dispatch(handleAddPlan({ config }))
      .then((res) => {
        if (res?.payload?.status) {
          fetchAllPlan();
          setLoading(false);
          setSelectPlan("");
          showPlanModal(false);
        } else {
          setSelectPlan("");
          showPlanModal(false);
          setLoading(false);
          toast.error(res?.payload?.message);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
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
                <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600 ">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {heading === "Add" ? "Add New" : heading} Custom Plan
                  </h3>
                  <AiOutlineCloseCircle
                    className="text-4xl text-primary cursor-pointer"
                    onClick={() => {
                      setSelectPlan("");
                      showPlanModal(false);
                    }}
                  />
                </div>
                <div className="model-body lg:p-5 md:p-5 sm:p-2 xs:p-2 ">
                  <div className=" lg:p-3 md:p-3 sm:p-2 xs:py-3 xs:px-1 text-left rounded-2xl max-h-80 vertical-scroll-inner">
                    <div className="grid grid-cols-12 gap-6">
                      <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                        <div className="relative">
                          <label className="formLabel">Plan Name</label>
                          <input
                            type="text"
                            placeholder="Enter Plan Name"
                            name="PlanName"
                            className="formInput"
                            value={formData?.PlanName}
                            onChange={(e) =>
                              handleInputChange(e.target.name, e.target.value)
                            }
                          />
                        </div>
                        {errorPlanName && (
                          <span className="error">Please Enter Plan Name</span>
                        )}
                      </div>
                      <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                        <div className="relative">
                          <label className="formLabel">Total Screens</label>
                          <input
                            type="number"
                            placeholder="1"
                            name="totalscreen"
                            className="formInput"
                            value={formData?.totalscreen}
                            onChange={(e) =>
                              handleInputChange(e.target.name, e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                        <div className="relative">
                          <label className="formLabel">Storage</label>
                          <input
                            type="number"
                            placeholder="Enter Storage"
                            name="storage"
                            className="formInput"
                            value={formData?.storage}
                            onChange={(e) =>
                              handleInputChange(e.target.name, e.target.value)
                            }
                          />
                        </div>
                        {errorStorage && (
                          <span className="error">Please Enter Storage</span>
                        )}
                      </div>
                      <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                        <div className="relative">
                          <label className="formLabel">Plan Price</label>
                          <input
                            type="number"
                            placeholder="Enter Plan Price"
                            name="planPrice"
                            className="formInput"
                            value={formData?.planPrice}
                            onChange={(e) =>
                              handleInputChange(e.target.name, e.target.value)
                            }
                          />
                        </div>
                        {errorCost && (
                          <span className="error">Please Enter Plan Price</span>
                        )}
                      </div>

                      <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                        <div className="relative">
                          <label className="formLabel">Description</label>
                          <input
                            type="text"
                            placeholder="Enter Plan Description"
                            name="description"
                            className="formInput"
                            value={formData?.description}
                            onChange={(e) =>
                              handleInputChange(e.target.name, e.target.value)
                            }
                          />
                        </div>
                        {errorDescription && (
                          <span className="error">
                            Please Enter Plan Description
                          </span>
                        )}
                      </div>

                      <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                        <div className="relative">
                          <label className="formLabel">Notification</label>
                          <input
                            type="number"
                            placeholder="Enter Notification User Count"
                            name="notification"
                            className="formInput"
                            value={formData?.notification}
                            onChange={(e) =>
                              handleInputChange(e.target.name, e.target.value)
                            }
                          />
                        </div>
                        {errornotification && (
                          <span className="error">
                            Please Enter Notification User Count
                          </span>
                        )}
                      </div>
                      <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12 flex items-center">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            name="Status"
                            className="w-5 h-5 inline-block mr-2 rounded-full border border-grey flex-no-shrink"
                            checked={formData?.Status}
                            onChange={(e) =>
                              handleInputChange(e.target.name, e.target.checked)
                            }
                          />
                          <label>Is Active</label>
                        </div>

                      </div>



                      {featureList?.map((item, index) => {
                        if (
                          item?.listOfFeaturesID !== 3 &&
                          item?.listOfFeaturesID !== 32 &&
                          item?.listOfFeaturesID !== 33
                        ) {
                          return (
                            <>
                              {item?.IsCheckBox && (
                                <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                                  <div className="relative">
                                    <label className="formLabel">
                                      {item?.name}
                                    </label>
                                    <input
                                      type="text"
                                      placeholder={`Enter ${item?.name}`}
                                      name={item?.name}
                                      className="formInput"
                                      value={formData[item?.name]}
                                      onChange={(e) =>
                                        handleInputChange(
                                          e.target.name,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                              {!item?.IsCheckBox && (
                                <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12 flex">
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="checkbox"
                                      placeholder={`Enter ${item?.name}`}
                                      name={item?.name}
                                      checked={formData[item?.name]}
                                      className="w-5 h-5 inline-block mr-2 rounded-full border border-grey flex-no-shrink"
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e.target.name,
                                          e.target.checked
                                        )
                                      }
                                    />
                                    <label className="">{item?.name}</label>
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        }
                      })}
                      <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12 flex items-center">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            name="Indian"
                            id="Indian"
                            className="w-5 h-5 inline-block mr-2 rounded-full border border-grey flex-no-shrink"
                            checked={formData?.isIndian}
                            onChange={(e) =>
                              handleCheckboxChange(
                                'isIndian',
                                e.target.checked
                              )
                            }
                          />
                          <label for='Indian'>Indian</label>
                        </div>
                      </div>
                      <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12 flex items-center">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            name="Annually"
                            id='Annually'
                            className="w-5 h-5 inline-block mr-2 rounded-full border border-grey flex-no-shrink"
                            checked={formData?.isAnnually}
                            onChange={(e) =>
                              handleCheckboxChange(
                                'isAnnually',
                                e.target.checked
                              )
                            }
                          />
                          <label for='Annually'>Annually</label>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="border-t border-gray-600">
                    <div className="col-span-12 text-center mt-3">
                      <button
                        className="bg-white text-primary text-base px-8 py-3 border border-primary shadow-md rounded-full hover:bg-primary hover:text-white"
                        onClick={() => handleCreatePlan()}
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEditPlan;
