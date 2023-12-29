import React from "react";
import { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import PropTypes from "prop-types";
import { FaCertificate } from "react-icons/fa";
import { HiOutlineUsers } from "react-icons/hi";
import { MdOutlineStorage } from "react-icons/md";
import { SiMediamarkt } from "react-icons/si";
import { RiEyeLine } from "react-icons/ri";
import { AiOutlineSearch } from "react-icons/ai";
import Userrole from "./Userrole";
import Storagelimit from "./Storagelimit";
import Defaultmedia from "./Defaultmedia";
import "../../Styles/Settings.css";
import Footer from "../Footer";
import Users from "./Users";

const Settings = ({ sidebarOpen, setSidebarOpen }) => {
  Settings.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const data = [
    {
      id: 1,
      cname: "Company 1",
      totalscreen: (
        <label className="text-base bg-lightgray p-3 rounded-xl">15</label>
      ),
      location: "India, USA ",
      enabled: true,
      show: (
        <button>
          <RiEyeLine className="text-xl text-[#8E94A9]" />
        </button>
      ),
    },
    {
      id: 2,
      cname: "Patels",
      totalscreen: (
        <label className="text-base bg-lightgray p-3 rounded-xl">25</label>
      ),
      location: "India, USA ",
      enabled: false,
      show: (
        <button>
          <RiEyeLine className="text-xl text-[#8E94A9]" />
        </button>
      ),
    },
    {
      id: 3,
      cname: "Sundari",
      totalscreen: (
        <label className="text-base bg-lightgray p-3 rounded-xl">55</label>
      ),
      location: "India, USA ",
      enabled: false,
      show: (
        <button>
          <RiEyeLine className="text-xl text-[#8E94A9]" />
        </button>
      ),
    },
    {
      id: 4,
      cname: "Company 4",
      totalscreen: (
        <label className="text-base bg-lightgray p-3 rounded-xl">45</label>
      ),
      location: "India, USA ",
      enabled: true,
      show: (
        <button>
          <RiEyeLine className="text-xl text-[#8E94A9]" />
        </button>
      ),
    },
    {
      id: 5,
      cname: "Company 5",
      totalscreen: (
        <label className="text-base bg-lightgray p-3 rounded-xl">105</label>
      ),
      location: "India, USA ",
      enabled: false,
      show: (
        <button>
          <RiEyeLine className="text-xl text-[#8E94A9]" />
        </button>
      ),
    },
    {
      id: 6,
      cname: "Company 6",
      totalscreen: (
        <label className="text-base bg-lightgray p-3 rounded-xl">15</label>
      ),
      location: "India, USA ",
      enabled: false,
      show: (
        <button>
          <RiEyeLine className="text-xl text-[#8E94A9]" />
        </button>
      ),
    },
    {
      id: 7,
      cname: "Company 7",
      totalscreen: (
        <label className="text-base bg-lightgray p-3 rounded-xl">45</label>
      ),
      location: "India, USA ",
      enabled: true,
      show: (
        <button>
          <RiEyeLine className="text-xl text-[#8E94A9]" />
        </button>
      ),
    },
  ];

  const [STabs, setSTabs] = useState(1);
  const [records, setRecords] = useState(data);
  const [searchValue, setSearchValue] = useState("");


  function updateTab(id) {
    setSTabs(id);
  }

  {
    /* switch on off*/
  }
  function handleFilter(event) {
    const newData = data.map((row) => {
      if (row.cname.toLowerCase().includes(event.target.value.toLowerCase())) {
        return { ...row }; // Preserve the row
      } else {
        return { ...row, enabled: false }; // Set enabled to false for rows that don't match the filter
      }
    });
    setRecords(newData);
  }

  {
    /* Data Table */
  }
  const column = [
    {
      name: "Company Name",
      selector: (row) => row.cname,
      sortable: true,
    },
    {
      name: "Total Screen",
      selector: (row) => row.totalscreen,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <label className="inline-flex relative items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={row.enabled}
            onChange={() => {
              const newData = data.map((rowData) => {
                if (rowData.id === row.id) {
                  return { ...rowData, enabled: !rowData.enabled };
                }
                return rowData;
              });
              setRecords(newData);
            }}
          />
          <div
            onClick={() => {
              const newData = data.map((rowData) => {
                if (rowData.id === row.id) {
                  return { ...rowData, enabled: !rowData.enabled };
                }
                return rowData;
              });
              setRecords(newData);
            }}
            className={`w-10 h-5 bg-gray rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all ${
              row.enabled ? "peer-checked:bg-[#009618]" : ""
            }`}
          ></div>
        </label>
      ),
    },
    {
      name: "",
      selector: (row) => row.show,
      sortable: true,
    },
  ];

  function handleFilter(event) {
    const newData = data.filter((row) => {
      return row.cname.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setRecords(newData);
  }

  {
    /*User roles*/
  }

  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>

      <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex justify-between sm:flex xs:block  items-center mb-5 ">
            <div className=" lg:mb-0 md:mb-0 sm:mb-4">
              <h1 className="not-italic font-medium lg:text-2xl  md:text-2xl sm:text-xl xs:text-xs text-[#001737]  ">
                Settings
              </h1>
            </div>

            {/* User Roles search */}
            <div className={STabs === 2 ? "" : "hidden" && STabs === 1 ? "" : "hidden" }>
              <div className="text-right flex items-end justify-end relative">
                <AiOutlineSearch className="absolute top-[13px] lg:right-[234px] md:right-[234px] sm:right-[234px] xs:right-auto xs:left-3 z-10 text-[#6e6e6e]" />
                <input
                  type="text"
                  placeholder={STabs === 2 ? "Search User Role" : "Search User Name"}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value) }
                  className="border border-gray rounded-full px-7 py-2 setting-searchbtn w-full"
                />
              </div>
            </div>
          </div>

          <div className="grid w-full lg:grid-cols-5 md:grid-cols-5 sm:grid-cols-1">
            {/*Tab*/}
            <div className="mainsettingtab col-span-1 w-full p-0">
              <ul className="w-full">
                <li>
                  <button
                    className={
                      STabs === 1 ? "stabshow settingtabactive" : "settingtab"
                    }
                    onClick={() => updateTab(1)}
                  >
                    <HiOutlineUsers className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />
                    <span className="text-base text-primary">Users</span>
                  </button>
                </li>

                <li>
                  <button
                    className={
                      STabs === 2 ? "stabshow settingtabactive" : "settingtab"
                    }
                    onClick={() => updateTab(2)}
                  >
                    <FaCertificate className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />
                    <span className="text-base text-primary">User Role</span>
                  </button>
                </li>

                <li>
                  <button
                    className={
                      STabs === 3 ? "stabshow settingtabactive" : "settingtab"
                    }
                    onClick={() => updateTab(3)}
                  >
                    <MdOutlineStorage className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />
                    <span className="text-base text-primary">
                      Storage Limit
                    </span>
                  </button>
                </li>

                <li>
                  <button
                    className={
                      STabs === 4 ? "stabshow settingtabactive" : "settingtab"
                    }
                    onClick={() => updateTab(4)}
                  >
                    <SiMediamarkt className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />
                    <span className="text-base text-primary">
                      Default Media
                    </span>
                  </button>
                </li>
              </ul>
            </div>

            {/*Tab details*/}
            <div className="col-span-4 w-full bg-white  tabdetails rounded-md relative">
              <div className={STabs === 1 ? "" : "hidden"}>
                <Users searchValue={searchValue} />
              </div>
              {/*End of userrole details*/}
              <div className={STabs === 2 ? "" : "hidden"}>
                <Userrole searchValue={searchValue} />
              </div>
              {/*End of users details*/}
              <div className={STabs === 3 ? "" : "hidden"}>
                <Storagelimit />
              </div>
              {/*Storage Limits*/}
              <div className={STabs === 4 ? "" : "hidden"}>
                <Defaultmedia />
              </div>

              {/*Default Media*/}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Settings;
