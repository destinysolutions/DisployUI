import React from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { AiOutlineClose } from "react-icons/ai";
import { GoPencil } from "react-icons/go";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useEffect } from "react";
import {
  SCROLLDATA_BY_ID,
  SCROLL_ADD_TEXT,
  SCROLL_TYPE_OPTION,
} from "../../Pages/Api";
import axios from "axios";
import { useState } from "react";
import moment from "moment";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdSave } from "react-icons/md";
import toast from "react-hot-toast";

const TextScrollDetailById = ({ sidebarOpen, setSidebarOpen }) => {
  const { token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [scrollType, setScrollType] = useState([]);
  const [selectedScrollType, setSelectedScrollType] = useState(1);
  const [text, setText] = useState("");
  const [edited, setEdited] = useState(false);
  const [instanceName, setInstanceName] = useState();
  const [saveLoading, setSaveLoading] = useState(false);

  const history = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(SCROLL_TYPE_OPTION, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response) => {
        setScrollType(response.data.data);
      });
  }, []);

  const handleUpdateScrollText = () => {
    if (instanceName === "" || text === "") {
      toast.remove();
      return toast.error("Please fill all the fields.");
    }
    let data = JSON.stringify({
      instanceName: instanceName,
      textScroll_Id: id,
      text: text,
      scrollType: selectedScrollType,
      userID: JSON.parse(window.localStorage.getItem("userID"))?.userID,
      operation: "Update",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: SCROLL_ADD_TEXT,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      data: data,
    };

    setSaveLoading(true);

    axios
      .request(config)
      .then((response) => {
        if (response.data.status === 200) {
          history("/text-scroll");
        }
        setSaveLoading(false);
      })
      .catch((error) => {
        setSaveLoading(false);
        console.log(error);
      });
  };

  const handleFetchTextScrollById = () => {
    let config = {
      method: "get",
      url: `${SCROLLDATA_BY_ID}?ID=${id}`,
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        const data = response?.data?.data[0];
        setText(data?.text);
        setSelectedScrollType(data?.scrollType);
        setInstanceName(data?.instanceName);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    handleFetchTextScrollById();
  }, []);

  const handleOnSavetextScroll = () => {
    if (!instanceName.replace(/\s/g, "").length) {
      toast.remove();
      return toast.error("please enter a character.");
    }
    setEdited(false);
  };

  return (
    <>
      <div className="flex border-b border-gray bg-white">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-24 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block  items-center">
            <div className="flex items-center">
              {edited ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="w-full border border-primary rounded-md px-2 py-1"
                    placeholder="Enter schedule name"
                    value={instanceName}
                    onChange={(e) => setInstanceName(e.target.value)}
                  />
                  <MdSave
                    onClick={() => handleOnSavetextScroll(false)}
                    className="min-w-[1.5rem] min-h-[1.5rem] cursor-pointer"
                  />
                </div>
              ) : (
                <>
                  <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
                    {instanceName}
                  </h1>
                  <button onClick={() => setEdited(true)}>
                    <GoPencil className="ml-4 text-lg" />
                  </button>
                </>
              )}
            </div>
            <div className="flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap youtubebtnpopup">
              {/* <button className=" flex align-middle border-primary items-center border-2 rounded-full py-1 px-4 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
              Preview
            </button> */}
              <button
                onClick={handleUpdateScrollText}
                className="sm:ml-2 xs:ml-1 flex align-middle bg-primary text-white items-center rounded-full py-1 px-4 text-base hover:shadow-lg hover:shadow-primary-500/50"
                disabled={saveLoading}
              >
                {saveLoading ? "Saving..." : "Save"}
              </button>
              {/* <div className="relative">
              <button className="sm:ml-2 xs:ml-1 flex align-middle border-primary items-center border-2 rounded-full py-[10px] px-[11px] text-xl  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <BiDotsHorizontalRounded />
              </button>
            </div> */}
              <button className="sm:ml-2 xs:ml-1 flex align-middle border-primary items-center border-2 rounded-full px-[10px] text-xl  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <Link to="/text-scroll">
                  <AiOutlineClose />
                </Link>
              </button>
            </div>
          </div>
          <div className="mt-5 mb-5">
            <div className="grid grid-cols-12 gap-6 mt-5">
              <div className="lg:col-span-6 md:col-span-6 sm:col-span-10 flex flex-col ">
                <div className="shadow-md bg-white rounded-lg p-5">
                  <div className="mb-3 relative inline-flex items-center w-full">
                    <label className="w-2/5 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Text :
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Write your thoughts here..."
                      onChange={(e) => setText(e.target.value)}
                      value={text}
                    ></textarea>
                  </div>
                  <div className="mb-3 relative inline-flex items-center w-full">
                    <label className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Scroll Type :
                    </label>
                    <select
                      onChange={(e) => setSelectedScrollType(e.target.value)}
                      value={selectedScrollType}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      {scrollType.map((scrolltype) => (
                        <option
                          key={scrolltype.scrollType_Id}
                          value={scrolltype.scrollType_Id}
                        >
                          {scrolltype.scrollTypeName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 sm:col-span-10 flex">
                <div className="shadow-md bg-white rounded-lg p-5 w-full">
                  <div
                    className="w-full p-12 flex items-center justify-center"
                    style={{
                      borderRadius: "0.625rem",
                      border: "2px solid #FFF",
                      background: "#017B83",
                      boxShadow: "0px 10px 15px 0px rgba(0, 0, 0, 0.25)",
                      height: "100%",
                    }}
                  >
                    {selectedScrollType == 1 && (
                      <marquee direction="left">{text}</marquee>
                    )}

                    {selectedScrollType == 2 && (
                      <marquee direction="right">{text}</marquee>
                    )}
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

export default TextScrollDetailById;
