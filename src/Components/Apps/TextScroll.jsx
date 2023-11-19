import React, { useEffect } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { TbAppsFilled } from "react-icons/tb";
import { Link } from "react-router-dom";
import { BsInfoLg } from "react-icons/bs";
import { RiDeleteBin5Line, RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";
import {
  DELETE_ALL_TEXT_SCROLL,
  GET_ALL_TEXT_SCROLL_INSTANCE,
  SCROLL_ADD_TEXT,
} from "../../Pages/Api";
import { useState } from "react";
import { MdPlaylistPlay } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useSelector } from "react-redux";

const TextScroll = ({ sidebarOpen, setSidebarOpen }) => {
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;

  const [instanceData, setInstanceData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  useEffect(() => {
    axios
      .get(GET_ALL_TEXT_SCROLL_INSTANCE, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response) => {
        setInstanceData(response.data.data);
        console.log(response.data.data);
      });
  }, []);

  const handelDeleteInstance = (scrollId) => {
    let data = JSON.stringify({
      textScroll_Id: scrollId,
      operation: "Delete",
    });

    let config = {
      method: "post",
      url: SCROLL_ADD_TEXT,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response, "response");
        const updatedInstanceData = instanceData.filter(
          (instanceData) => instanceData.textScroll_Id !== scrollId
        );
        setInstanceData(updatedInstanceData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCheckboxChange = (instanceId) => {
    const updatedInstance = instanceData.map((instance) =>
      instance.textScroll_Id === instanceId
        ? {
            ...instance,
            isChecked: !instance.isChecked,
          }
        : instance
    );

    setInstanceData(updatedInstance);

    const allChecked = updatedInstance.every((instance) => instance.isChecked);
    setSelectAll(allChecked);
  };

  // Function to handle the "Select All" checkbox change
  const handleSelectAll = () => {
    const updatedInstance = instanceData.map((instance) => ({
      ...instance,
      isChecked: !selectAll,
    }));
    setInstanceData(updatedInstance);
    setSelectAll(!selectAll);
  };

  const handelDeleteAllInstance = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: DELETE_ALL_TEXT_SCROLL,
      headers: { Authorization: authToken },
    };

    axios
      .request(config)
      .then(() => {
        setSelectAll(false);
        setInstanceData([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [appDropDown, setAppDropDown] = useState(null);
  const handleAppDropDownClick = (id) => {
    if (appDropDown === id) {
      setAppDropDown(null);
    } else {
      setAppDropDown(id);
    }
  };

  return (
    <>
      <div className="flex border-b border-gray bg-white">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block  items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
              Apps
            </h1>
            <Link to="/textscrolldetail">
              <button className="flex align-middle border-primary items-center border rounded-full lg:px-6 sm:px-5 py-2 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <TbAppsFilled className="text-2xl mr-2 bg-primary text-white rounded-full p-1" />
                New Instance
              </button>
            </Link>
          </div>

          <div className="mt-5 mb-5">
            <div className="shadow-md bg-white rounded-lg p-5">
              <div className="flex justify-between items-center from-blue-900 to-gray-800 text-2xl text-block">
                <h1 className="not-italic font-medium text-xl text-[#001737] ">
                  Text Scroll
                </h1>
                <div className="flex items-center">
                  <button className="w-8 h-8 ml-2 border-primary items-center border-2 rounded-full p-1 text-xl  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                    <BsInfoLg />
                  </button>
                  <button
                    onClick={handelDeleteAllInstance}
                    style={{ display: selectAll ? "block" : "none" }}
                    className="w-8 h-8 ml-2 border-primary items-center border-2 rounded-full p-1 text-xl hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                  >
                    <RiDeleteBinLine />
                  </button>
                  <button className="sm:ml-2 xs:ml-1 mt-2 ">
                    <input
                      type="checkbox"
                      className="h-7 w-7"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-10 gap-4 mt-5">
                {instanceData.map((instance) => (
                  <div
                    className="lg:col-span-2 md:col-span-5 sm:col-span-10 "
                    key={instance.textScroll_Id}
                  >
                    <div className="shadow-md bg-[#EFF3FF] rounded-lg">
                      <div className="relative flex justify-between">
                        <button className="float-right p-2">
                          <input
                            style={{ display: selectAll ? "block" : "none" }}
                            className="h-5 w-5"
                            type="checkbox"
                            checked={instance.isChecked || false}
                            onChange={() =>
                              handleCheckboxChange(instance.textScroll_Id)
                            }
                          />
                        </button>
                        <div className="relative">
                          <button className="float-right">
                            <BiDotsHorizontalRounded
                              className="text-2xl"
                              onClick={() =>
                                handleAppDropDownClick(instance.textScroll_Id)
                              }
                            />
                          </button>
                          {appDropDown === instance.textScroll_Id && (
                            <div className="appdw">
                              <ul>
                                {/* <li className="flex text-sm items-center">
                                  <FiUpload className="mr-2 text-lg" />
                                  Set to Screen
                                </li>
                                <li className="flex text-sm items-center">
                                  <MdPlaylistPlay className="mr-2 text-lg" />
                                  Add to Playlist
                                </li> */}

                                <li
                                  className="flex text-sm items-center cursor-pointer"
                                  onClick={() =>
                                    handelDeleteInstance(instance.textScroll_Id)
                                  }
                                >
                                  <RiDeleteBin5Line className="mr-2 text-lg" />
                                  Delete
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-center clear-both pb-8">
                        <img
                          src="../../../AppsImg/text-scroll-icon.svg"
                          alt="Logo"
                          className="cursor-pointer mx-auto h-30 w-30"
                        />
                        <h4 className="text-lg font-medium mt-3">
                          {instance.instanceName}
                        </h4>
                        <h4 className="text-sm font-normal ">Added </h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextScroll;
