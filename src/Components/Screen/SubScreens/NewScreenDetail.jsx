import { useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import "../../../Styles/screen.css";
import { FiUploadCloud } from "react-icons/fi";
import { GrScheduleNew } from "react-icons/gr";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import AssetModal from "../../Assests/AssetModal";

const NewScreenDetail = ({ sidebarOpen, setSidebarOpen }) => {
  NewScreenDetail.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const [selectedValue, setSelectedValue] = useState("");

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const [showTagBox, setShowTagBox] = useState(false);

  const handleTagBoxClick = () => {
    setShowTagBox(!showTagBox);
  };

  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // Trigger the file input click event programmatically
  const handleIconClick = () => {
    document.getElementById("file-input").click();
  };

  const [showAssetModal, setShowAssetModal] = useState(false);

  return (
    <>
      <div className="flex border-b border-gray py-3">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5">
        <div className={`${sidebarOpen ? "ml-52" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4">
              New Screens Details
            </h1>
            <div className="lg:flex md:flex sm:block">
              <button className="flex align-middle border-primary items-center border rounded-full px-8 py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                Edit
              </button>
            </div>
          </div>
          <div className="shadow-md lg:p-5  md:p-5 sm:p:2 rounded-md bg-white flex items-center justify-between mt-7">
            <form className="">
              <table className="screen-details" cellPadding={10}>
                <tbody>
                  <tr>
                    <td>
                      <label className="text-[#001737] lg:text-lg md:text-lg font-medium sm:font-base xs:font-base mb-1 md:mb-0">
                        Screen Name:
                      </label>
                    </td>
                    <td>
                      <input
                        className="bg-gray-200 appearance-none border border-[#D5E3FF] rounded w-full py-2 px-3"
                        type="text"
                        placeholder="Screen Name"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                        Google Location:
                      </label>
                    </td>
                    <td>
                      <input
                        className="bg-gray-200 appearance-none border border-[#D5E3FF] rounded w-full py-2 px-3"
                        type="text"
                        placeholder="132, My Street, Kingston, New York 12401."
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                        Time Zone:
                      </label>
                    </td>
                    <td>
                      <select className=" px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option
                          value="-12:00"
                          className="text-base  font-normal"
                        >
                          (GMT -12:00) Eniwetok, Kwajalein
                        </option>
                        <option
                          value="-11:00"
                          className="text-base  font-normal"
                        >
                          (GMT -11:00) Midway Island, Samoa
                        </option>
                        <option
                          value="-10:00"
                          className="text-base  font-normal"
                        >
                          (GMT -10:00) Hawaii
                        </option>
                        <option
                          value="-09:50"
                          className="text-base  font-normal"
                        >
                          (GMT -9:30) Taiohae
                        </option>
                        <option
                          value="-09:00"
                          className="text-base  font-normal"
                        >
                          (GMT -9:00) Alaska
                        </option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                        Screen Orientation:
                      </label>
                    </td>
                    <td>
                      <div className="border border-[#D5E3FF] rounded w-full px-3 py-2">
                        <input
                          type="radio"
                          value="0"
                          checked={selectedValue === "0"}
                          onChange={handleRadioChange}
                        />
                        <label className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">
                          0
                        </label>

                        <input
                          type="radio"
                          value="90"
                          checked={selectedValue === "90"}
                          onChange={handleRadioChange}
                          className="ml-4"
                        />
                        <label className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">
                          90
                        </label>

                        <input
                          type="radio"
                          value="180"
                          checked={selectedValue === "180"}
                          onChange={handleRadioChange}
                          className="ml-4"
                        />
                        <label className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">
                          180
                        </label>

                        <input
                          type="radio"
                          value="270"
                          checked={selectedValue === "270"}
                          onChange={handleRadioChange}
                          className="ml-4"
                        />
                        <label className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">
                          270
                        </label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                        Screen Resolution:
                      </label>
                    </td>
                    <td>
                      <div className="border border-[#D5E3FF] rounded w-full px-3 py-2 ">
                        <input
                          type="radio"
                          value="Fit to Screen"
                          checked={selectedValue === "Fit to Screen"}
                          onChange={handleRadioChange}
                        />
                        <label className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs  font-normal">
                          Fit to Screen
                        </label>

                        <input
                          type="radio"
                          value="Actual Size"
                          checked={selectedValue === "Actual Size"}
                          onChange={handleRadioChange}
                          className="ml-4"
                        />
                        <label className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs font-normal">
                          Actual Size
                        </label>

                        <input
                          type="radio"
                          value="Zoom Screen"
                          checked={selectedValue === "Zoom Screen"}
                          onChange={handleRadioChange}
                          className="ml-4"
                        />
                        <label className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs  font-normal">
                          Zoom Screen
                        </label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                        Type:
                      </label>
                    </td>
                    <td>
                      <select
                        className="px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={selectedOption}
                        onChange={handleOptionChange}
                      >
                        <option value="">Select Type</option>
                        <option value="Assets">Assets</option>
                        <option value="Playlist">Playlist</option>
                        <option value="Schedule">Schedule</option>
                      </select>
                    </td>
                  </tr>

                  {selectedOption === "Assets" && (
                    <>
                      <tr>
                        <td></td>
                        <td className="relative">
                          <div className="flex">
                            <div className=" px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                              Assets
                            </div>
                            <div className="flex items-center ml-5">
                              <span
                                className="bg-[#D5E3FF] p-2 rounded"
                                onClick={handleIconClick}
                              >
                                <FiUploadCloud size={20} />
                              </span>
                              <input
                                id="file-input"
                                type="file"
                                style={{ display: "none" }}
                              />
                            </div>
                          </div>

                          <div className="absolute left-[10%] bottom-[-3px]  text-[35px]  z-20">
                            <img
                              src="/DisployImg/Polygon.svg"
                              alt="notification"
                              className="cursor-pointer assestPopup"
                            />
                          </div>
                          <div className="absolute left-[2%] bottom-[-74px] bg-white rounded-lg border border-[#635b5b] shadow-lg z-10  pr-16">
                            <div
                              className="text-sm mb-1 mt-2 ml-3 cursor-pointer"
                              onClick={() => setShowAssetModal(true)}
                            >
                              Browse
                            </div>

                            <div className="text-sm mb-3 mt-3 ml-3 cursor-pointer">
                              Default Assets
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                      </tr>
                    </>
                  )}
                  <tr>
                    <td>
                      {showAssetModal ? (
                        <>
                          <AssetModal setShowAssetModal={setShowAssetModal} />
                        </>
                      ) : null}
                    </td>
                  </tr>
                  {selectedOption === "Playlist" && (
                    <>
                      <tr>
                        <td></td>
                        <td>
                          <div className="flex">
                            <span
                              className="px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              onClick={handleIconClick}
                            >
                              Set a Playlist
                            </span>
                            <input
                              id="file-input"
                              type="file"
                              style={{ display: "none" }}
                            />
                            <Link to="/myplaylist">
                              <div className="flex items-center ml-5">
                                <span className="bg-[#D5E3FF] p-2 rounded">
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M0.961295 0.0665965C0.610654 0.137625 0.274179 0.398062 0.0970872 0.736291L0.015625 0.89526V3.29669C0.015625 5.69136 0.015625 5.69812 0.0935454 5.85709C0.206884 6.09724 0.458355 6.334 0.716909 6.44561C1.02151 6.5809 1.41111 6.58429 1.698 6.45576C1.99905 6.32047 5.27879 4.22006 5.40984 4.078C5.81715 3.63492 5.82424 2.98552 5.43109 2.53567C5.32484 2.41729 1.91405 0.228947 1.68029 0.13086C1.50674 0.0564494 1.16318 0.0260091 0.961295 0.0665965Z"
                                      fill="#41479B"
                                    />
                                    <path
                                      d="M7.25131 0.0883092C7.08502 0.17676 6.95765 0.417348 6.97888 0.601327C7.00011 0.767615 7.08148 0.891447 7.22654 0.979898C7.33622 1.04712 7.43529 1.05066 11.0087 1.05066H14.6741L14.7874 0.95867C15.0846 0.70393 15.0669 0.289978 14.7449 0.0953853C14.6317 0.0246242 14.5574 0.0246242 11.0016 0.0246242C7.55912 0.0246242 7.36806 0.0281622 7.25131 0.0883092Z"
                                      fill="#41479B"
                                    />
                                    <path
                                      d="M7.25126 2.87848C7.08851 2.95985 6.9576 3.20398 6.97883 3.39149C7.00006 3.55778 7.08143 3.68161 7.22649 3.7736C7.33617 3.84083 7.42108 3.84083 11.0264 3.83375L14.7095 3.82314L14.805 3.73468C15.0845 3.47287 15.0562 3.07661 14.7448 2.88555C14.6316 2.81479 14.5573 2.81479 11.0016 2.81479C7.61921 2.81479 7.36801 2.81833 7.25126 2.87848Z"
                                      fill="#41479B"
                                    />
                                    <path
                                      d="M7.23694 5.669C6.89729 5.8742 6.9079 6.3943 7.25463 6.57474C7.34308 6.62073 7.84548 6.62781 10.9943 6.62781C14.5607 6.62781 14.635 6.62781 14.7482 6.55705C15.0843 6.35184 15.0843 5.87774 14.7482 5.67253C14.635 5.60177 14.5607 5.60177 10.9873 5.60177C7.49875 5.60177 7.33954 5.60531 7.23694 5.669Z"
                                      fill="#41479B"
                                    />
                                    <path
                                      d="M0.255992 8.46306C-0.0801225 8.66827 -0.0801225 9.14237 0.255992 9.34757C0.372748 9.41833 0.450585 9.41833 7.50192 9.41833C14.5533 9.41833 14.6311 9.41833 14.7479 9.34757C15.084 9.14237 15.084 8.66827 14.7479 8.46306C14.6311 8.3923 14.5533 8.3923 7.50192 8.3923C0.450585 8.3923 0.372748 8.3923 0.255992 8.46306Z"
                                      fill="#41479B"
                                    />
                                    <path
                                      d="M0.319748 11.2081C0.291443 11.2187 0.227758 11.2612 0.185302 11.3036C-0.0835903 11.5477 -0.0482098 11.9511 0.256063 12.1386C0.36928 12.2094 0.44358 12.2094 4.70693 12.2094C8.97028 12.2094 9.04458 12.2094 9.1578 12.1386C9.34178 12.0254 9.41962 11.8697 9.40193 11.6468C9.39131 11.477 9.37362 11.4416 9.24271 11.3178L9.09765 11.1833L4.73524 11.1869C2.33644 11.1869 0.348052 11.1975 0.319748 11.2081Z"
                                      fill="#41479B"
                                    />
                                    <path
                                      d="M12.758 11.3597C12.5549 11.494 12.5205 11.6111 12.5205 12.1483V12.6235H12.0489C11.6668 12.6235 11.5497 12.6338 11.4534 12.6854C11.0781 12.8714 11.085 13.4189 11.4637 13.5876C11.5807 13.6427 11.6909 13.6565 12.0661 13.6565H12.5205V14.1317C12.5205 14.6482 12.5549 14.7722 12.7339 14.9065C12.9542 15.0683 13.3122 14.9994 13.4568 14.7618C13.5291 14.6517 13.536 14.5862 13.5463 14.1489L13.5601 13.6634L14.0454 13.6496C14.4826 13.6393 14.548 13.6324 14.6582 13.5601C14.8957 13.4155 14.9645 13.0573 14.8027 12.837C14.6685 12.6579 14.5446 12.6235 14.0282 12.6235H13.5532V12.1655C13.5532 11.6386 13.4981 11.4699 13.3053 11.3494C13.147 11.253 12.9095 11.2564 12.758 11.3597Z"
                                      fill="#41479B"
                                    />
                                    <path
                                      d="M0.211504 14.0658C-0.0856924 14.3206 -0.0680021 14.7345 0.253961 14.9291C0.367178 14.9999 0.441477 14.9999 4.70483 14.9999C8.96818 14.9999 9.04248 14.9999 9.1557 14.9291C9.4812 14.731 9.49535 14.2392 9.18046 14.0446C9.06725 13.9738 9.01417 13.9738 4.69421 13.9738H0.324722L0.211504 14.0658Z"
                                      fill="#41479B"
                                    />
                                  </svg>
                                </span>
                              </div>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                  {selectedOption === "Schedule" && (
                    <>
                      <tr>
                        <td></td>
                        <td>
                          <div className="flex">
                            <span className="px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                              Set a schedule
                            </span>
                            <div className="flex items-center ml-5">
                              <span className="bg-[#D5E3FF] p-2 rounded">
                                <GrScheduleNew size={20} />
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </>
                  )}

                  <tr>
                    <td>
                      <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                        Tags:
                      </label>
                    </td>
                    <td>
                      <div className="md:w-full">
                        <div className="border border-[#D5E3FF] rounded w-full px-2 py-2 relative flex justify-end">
                          <button type="button" onClick={handleTagBoxClick}>
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.34315 4.34315C5.84344 2.84285 7.87827 2 10 2C12.1217 2 14.1566 2.84285 15.6569 4.34315C17.1571 5.84344 18 7.87827 18 10C18 12.1217 17.1571 14.1566 15.6569 15.6569C14.1566 17.1571 12.1217 18 10 18C7.87827 18 5.84344 17.1571 4.34315 15.6569C2.84285 14.1566 2 12.1217 2 10C2 7.87827 2.84285 5.84344 4.34315 4.34315ZM10 0C7.34784 0 4.8043 1.05357 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 12.6522 1.05357 15.1957 2.92893 17.0711C4.8043 18.9464 7.34784 20 10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10C20 7.34784 18.9464 4.8043 17.0711 2.92893C15.1957 1.05357 12.6522 0 10 0ZM11 11C11 10.4477 10.5523 10 10 10C9.44771 10 9 10.4477 9 11V14C9 14.5523 9.44771 15 10 15C10.5523 15 11 14.5523 11 14V11ZM9.94922 4.75C9.25886 4.75 8.69922 5.30964 8.69922 6C8.69922 6.69036 9.25886 7.25 9.94922 7.25H10.0492C10.7396 7.25 11.2992 6.69036 11.2992 6C11.2992 5.30964 10.7396 4.75 10.0492 4.75H9.94922Z"
                                fill="#515151"
                              />
                            </svg>
                          </button>
                          {showTagBox && (
                            <>
                              <div className=" tagname absolute top-[42px] lg:right-[0px] md:right-[0px] sm:lg:right-[0px] xs:lg:right-[0px] bg-white rounded-lg border border-[#635b5b] shadow-lg z-10 max-w-[250px]">
                                <div className="lg:flex md:flex sm:block">
                                  <div className="p-2">
                                    <h6 className="text-center text-sm mb-1">
                                      Give a Tag Name Such
                                    </h6>
                                    <div className="flex flex-wrap">
                                      <div className="p-1 rounded bg-[#EFF5FF] m-1 text-sm font-light">
                                        Corporate
                                      </div>
                                      <div className="p-1 rounded bg-[#EFF5FF] m-1 text-sm  font-light">
                                        DMB
                                      </div>
                                      <div className="p-1 rounded bg-[#EFF5FF] m-1 text-sm font-light">
                                        Marketing
                                      </div>
                                      <div className="p-1 rounded bg-[#EFF5FF] m-1 text-sm font-light">
                                        Lobby
                                      </div>
                                      <div className="p-1 rounded bg-[#EFF5FF] m-1 text-sm font-light">
                                        Conference Room
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className=" lg:block md:block sm:hidden"></td>
                    <td>
                      <Link to="/screens">
                        <button
                          className="shadow bg-primary focus:shadow-outline focus:outline-none text-white font-medium py-2 px-9 rounded-full hover:bg-SlateBlue"
                          type="button"
                        >
                          Save
                        </button>
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewScreenDetail;
