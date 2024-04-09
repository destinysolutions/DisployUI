import React, { useEffect } from "react";
import { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import PropTypes from "prop-types";
import { TbFileReport } from "react-icons/tb";
import { AiOutlineCloseCircle } from "react-icons/ai";
import "../../Styles/Report.css";
import { useDateSelect } from "react-ymd-date-select";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import ReportDialog from "./ReportDialog";

const Report = ({ sidebarOpen, setSidebarOpen }) => {
  Report.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const [selectedReport, setSelectedReport] = useState(null);
  const [modelVisible, setModelVisible] = useState(false);
  const handleReportClick = (report) => {
    setSelectedReport(report);
    setModelVisible(true);
  };

  const toggleModal = () => {
    setModelVisible(!modelVisible);
  };

  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block xs:block  items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
              Reports
            </h1>
          </div>

          <div className="grid grid-cols-12 gap-4 mt-5">
            <div
              className="lg:col-span-4 md:col-span-4 sm:col-span-6 xs:col-span-12 text-center drop-shadow-md flex flex-col bg-white rounded-xl p-5 lg:h-56 md:h-72 h-56"
              onClick={() => handleReportClick("mediareport")}
            >
              <div className="reportbox text-center ">
                <div>
                  <TbFileReport className="lg:text-7xl md:text-7xl sm:text-6xl xs:text-7xl text-primary text-center mx-auto bg-white rounded-2xl lg:p-2 md:p-2 sm:p-2 xs:p-2 drop-shadow-xl  " />
                </div>
                <div>
                  <h3 className="text-base font-medium  lg:mt-5 md:mt-5 sm:mt-3 xs:mt-3 mb-2">
                    Asset Report
                  </h3>
                </div>
                <div>
                  <p className="text-sm font-normal max-w-[250px] mx-auto">
                    Shoes for how make time asset file is playing.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="lg:col-span-4 md:col-span-4 sm:col-span-6 xs:col-span-12 text-center drop-shadow-md flex flex-col bg-white rounded-xl p-5 lg:h-56 md:h-72 h-56"
              onClick={() => handleReportClick("uptimereport")}
            >
              <div className="reportbox text-center ">
                <div>
                  <TbFileReport className="lg:text-7xl md:text-7xl sm:text-6xl xs:text-7xl text-primary text-center mx-auto bg-white rounded-2xl lg:p-2 md:p-2 sm:p-2 xs:p-2 drop-shadow-xl" />
                </div>
                <div>
                  <h3 className="text-base font-medium  lg:mt-5 md:mt-5 sm:mt-3 xs:mt-3 mb-2">
                    Up-time Report
                  </h3>
                </div>
                <div>
                  <p className="text-sm font-normal max-w-[250px] mx-auto">
                    Shoes for how make shoes for how make time screen is
                    displaying content
                  </p>
                </div>
              </div>
            </div>

            <div
              className="lg:col-span-4 md:col-span-4 sm:col-span-6 xs:col-span-12 text-center drop-shadow-md flex flex-col bg-white rounded-xl p-5 lg:h-56 md:h-72 h-56"
              onClick={() => handleReportClick("auditlogreport")}
            >
              <div className="reportbox text-center ">
                <div>
                  <TbFileReport className="lg:text-7xl md:text-7xl sm:text-6xl xs:text-7xl text-primary text-center mx-auto bg-white rounded-2xl lg:p-2 md:p-2 sm:p-2 xs:p-2 drop-shadow-xl  " />
                </div>
                <div>
                  <h3 className="text-base font-medium  lg:mt-5 md:mt-5 sm:mt-3 xs:mt-3 mb-2">
                    Audit Logs Reports
                  </h3>
                </div>
                <div>
                  <p className="text-sm font-normal max-w-[250px] mx-auto">
                    shows data about and their Action
                  </p>
                </div>
              </div>
            </div>
            <div
              className="lg:col-span-4 md:col-span-4 sm:col-span-6 xs:col-span-12 text-center drop-shadow-md flex flex-col bg-white rounded-xl p-5 lg:h-56 md:h-72 h-56"
              onClick={() => handleReportClick("salesreport")}
            >
              <div className="reportbox text-center ">
                <div>
                  <TbFileReport className="lg:text-7xl md:text-7xl sm:text-6xl xs:text-7xl text-primary text-center mx-auto bg-white rounded-2xl lg:p-2 md:p-2 sm:p-2 xs:p-2 drop-shadow-xl  " />
                </div>
                <div>
                  <h3 className="text-base font-medium  lg:mt-5 md:mt-5 sm:mt-3 xs:mt-3 mb-2">
                    Sales Reports
                  </h3>
                </div>
                <div>
                  <p className="text-sm font-normal max-w-[250px] mx-auto">
                    shows data about and their Action
                  </p>
                </div>
              </div>
            </div>
            <div
              className="lg:col-span-4 md:col-span-4 sm:col-span-6 xs:col-span-12 text-center drop-shadow-md flex flex-col bg-white rounded-xl p-5 lg:h-56 md:h-72 h-56"
              onClick={() => handleReportClick("cancelreport")}
            >
              <div className="reportbox text-center ">
                <div>
                  <TbFileReport className="lg:text-7xl md:text-7xl sm:text-6xl xs:text-7xl text-primary text-center mx-auto bg-white rounded-2xl lg:p-2 md:p-2 sm:p-2 xs:p-2 drop-shadow-xl  " />
                </div>
                <div>
                  <h3 className="text-base font-medium  lg:mt-5 md:mt-5 sm:mt-3 xs:mt-3 mb-2">
                    Cancel Reports
                  </h3>
                </div>
                <div>
                  <p className="text-sm font-normal max-w-[250px] mx-auto">
                    shows data about and their Action
                  </p>
                </div>
              </div>
            </div>
            <div
              className="lg:col-span-4 md:col-span-4 sm:col-span-6 xs:col-span-12 text-center drop-shadow-md flex flex-col bg-white rounded-xl p-5 lg:h-56 md:h-72 h-56"
              onClick={() => handleReportClick("billingreport")}
            >
              <div className="reportbox text-center ">
                <div>
                  <TbFileReport className="lg:text-7xl md:text-7xl sm:text-6xl xs:text-7xl text-primary text-center mx-auto bg-white rounded-2xl lg:p-2 md:p-2 sm:p-2 xs:p-2 drop-shadow-xl  " />
                </div>
                <div>
                  <h3 className="text-base font-medium  lg:mt-5 md:mt-5 sm:mt-3 xs:mt-3 mb-2">
                    Billing Reports
                  </h3>
                </div>
                <div>
                  <p className="text-sm font-normal max-w-[250px] mx-auto">
                    shows data about and their Action
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render MyModel component when selectedReport is truthy */}
      {modelVisible && (
        <ReportDialog
          toggleModal={toggleModal}
          selectedReport={selectedReport}
        />
      )}
      <Footer />
    </>
  );
};

export default Report;
