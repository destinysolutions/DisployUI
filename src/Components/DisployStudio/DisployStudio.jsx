import React from "react";
import { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { GrServicePlay } from "react-icons/gr";
import "../../Styles/Studio.css";
import Footer from "../Footer";

const DisployStudio = ({ sidebarOpen, setSidebarOpen }) => {
  DisployStudio.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const [Tabs, setTabs] = useState(1);
  function updateTab(id) {
    setTabs(id);
  }
  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-16 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block xs:block  items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
              Disploy Studio
            </h1>
            <div className="flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap playlistbtn">
              <button className="studio-btn flex align-middle border-primary items-center border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <GrServicePlay className="text-lg mr-1 text-red hover:text-white" />{" "}
                New Studio
              </button>
            </div>
          </div>

          <div className="Tabbutton">
            <ul className="inline-flex items-center justify-start border-b border-gray  my-4  w-full">
              <li className="text-sm firstli pr-5">
                <button
                  className={
                    Tabs === 1 ? "tabshow studiotabactive" : "studiotab"
                  }
                  onClick={() => updateTab(1)}
                >
                  Template Gallery
                </button>
              </li>
              <li className="text-sm pr-5">
                <button
                  className={
                    Tabs === 2 ? "tabshow studiotabactive" : "studiotab"
                  }
                  onClick={() => updateTab(2)}
                >
                  My Canvases
                </button>
              </li>
              <li className="text-sm">
                <button
                  className={
                    Tabs === 3 ? "tabshow studiotabactive" : "studiotab"
                  }
                  onClick={() => updateTab(3)}
                >
                  My Templates
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default DisployStudio;
