import React, { Suspense, useEffect, useRef } from "react";
import { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import PropTypes from "prop-types";
import { FaCertificate, FaDownload, FaFileInvoiceDollar, FaUserShield } from "react-icons/fa";
import { HiOutlineUsers } from "react-icons/hi";
import { MdOutlineStorage } from "react-icons/md";
import { SiMediamarkt } from "react-icons/si";
import { RiEyeLine } from "react-icons/ri";
import { AiOutlineSearch } from "react-icons/ai";
import Userrole from "./Userrole";
import Storagelimit from "./Storagelimit";
import Defaultmedia from "./Defaultmedia";
import Billing from "./Billing/Billing";
import Myplan from "./Myplan";
import "../../Styles/Settings.css";
import Footer from "../Footer";
import Users from "./Users";
import { getMenuAll, getMenuPermission } from "../../Redux/SidebarSlice";
import { useDispatch, useSelector } from "react-redux";
import Invoice from "./Invoice";
import { BsFillPrinterFill, BsFillSendFill } from "react-icons/bs";
import html2pdf from "html2pdf.js";
import ReactToPrint from "react-to-print";
import { HiClipboardDocumentList } from "react-icons/hi2";
import Loading from "../Loading";
import ScreenAuthorize from "./ScreenAuthorize";
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
  const storedTab = localStorage.getItem("STabs");
  const initialTab = storedTab ? parseInt(storedTab) : 1;
  const [STabs, setSTabs] = useState(initialTab);
  const [records, setRecords] = useState(data);
  const [searchValue, setSearchValue] = useState("");
  const { token, user } = useSelector((state) => state.root.auth);
  const [showInvoice, setShowInvoice] = useState(false);
  const InvoiceRef = useRef(null);
  const dispatch = useDispatch();
  const [sidebarload, setSidebarLoad] = useState(true);
  const [permissions, setPermissions] = useState({
    isDelete: false,
    isSave: false,
    isView: false,
  });

  useEffect(() => {
    dispatch(getMenuAll()).then((item) => {
      const findData = item.payload.data.bottummenu.find(
        (e) => e.pageName === "Settings"
      );
      if (findData) {
        const ItemID = findData.moduleID;
        const payload = { UserRoleID: user.userRole, ModuleID: ItemID };
        dispatch(getMenuPermission(payload)).then((permissionItem) => {
          if (
            Array.isArray(permissionItem.payload.data) &&
            permissionItem.payload.data.length > 0
          ) {
            setPermissions(permissionItem.payload.data[0]);
          }
        });
      }
      setSidebarLoad(false);
    });
  }, []);

  function updateTab(id) {
    setSTabs(id);
    localStorage.setItem("STabs", id.toString());
  }

  const DownloadInvoice = () => {
    const InvoiceNode = InvoiceRef.current;
    if (InvoiceNode) {
      html2pdf(InvoiceNode, {
        margin: 10,
        filename: "Invoice.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      });
    }
  };

  return (
    <>
      {sidebarload && <Loading />}
      {!sidebarload && (
        <Suspense fallback={<Loading />}>
          <>
            <div className="flex border-b border-gray">
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
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
                  <div
                    className={
                      STabs === 2 ? "" : "hidden" && STabs === 1 ? "" : "hidden"
                    }
                  >
                    <div className="text-right flex items-end justify-end relative">
                      <AiOutlineSearch className="absolute top-[13px] lg:right-[234px] md:right-[234px] sm:right-[234px] xs:right-auto xs:left-3 z-10 text-[#6e6e6e]" />
                      <input
                        type="text"
                        placeholder={
                          STabs === 2 ? "Search User Role" : "Search User Name"
                        }
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="border border-gray rounded-full px-7 py-2 setting-searchbtn w-full"
                      />
                    </div>
                  </div>

                  {showInvoice && STabs === 6 && (
                    <div className="flex">
                      {/* <button
                        type="button"
                        className="px-5 bg-primary flex items-center gap-2 text-white rounded-full py-2 border border-primary me-3 "
                      >
                        <BsFillSendFill />
                        Send Invoice
                  </button>*/}
                      <button
                        className="bg-white text-primary text-base px-5 flex items-center gap-2 py-2 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                        type="button"
                        onClick={() => DownloadInvoice()}
                      >
                        <FaDownload />
                        Download
                      </button>
                      <ReactToPrint
                        trigger={() => (
                          <button
                            className="bg-white text-primary text-base px-5 flex items-center gap-2 py-2 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                            type="button"
                          >
                            <BsFillPrinterFill />
                            Print
                          </button>
                        )}
                        content={() => InvoiceRef.current}
                      />
                    </div>
                  )}
                </div>

                <div className="grid w-full lg:grid-cols-4 md:grid-cols-1 sm:grid-cols-1">
                  {/*Tab*/}
                  <div className="mainsettingtab col-span-1 w-full p-0">
                    <ul className="w-full">
                      <li>
                        <button
                          className={
                            STabs === 1
                              ? "stabshow settingtabactive"
                              : "settingtab"
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
                            STabs === 2
                              ? "stabshow settingtabactive"
                              : "settingtab"
                          }
                          onClick={() => updateTab(2)}
                        >
                          <FaCertificate className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />
                          <span className="text-base text-primary">
                            User Role
                          </span>
                        </button>
                      </li>
                      <li>
                        <button
                          className={
                            STabs === 8 ? "stabshow settingtabactive" : "settingtab"
                          }
                          onClick={() => updateTab(8)}
                        >
                          <FaUserShield className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />
                          <span className="text-base text-primary">
                            Screen Authorize
                          </span>
                        </button>
                      </li>
                      {!user?.userDetails?.isRetailer && (
                        <li>
                          <button
                            className={
                              STabs === 7 ? "stabshow settingtabactive" : "settingtab"
                            }
                            onClick={() => updateTab(7)}
                          >
                            <HiClipboardDocumentList className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />
                            <span className="text-base text-primary">My Plan</span>
                          </button>
                        </li>
                      )}
                      <li>
                        <button
                          className={
                            STabs === 6 ? "stabshow settingtabactive" : "settingtab"
                          }
                          onClick={() => updateTab(6)}
                        >
                          <FaFileInvoiceDollar className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />
                          <span className="text-base text-primary">
                            Invoice
                          </span>
                        </button>
                        </li>

                      <li>
                        <button
                          className={
                            STabs === 3
                              ? "stabshow settingtabactive"
                              : "settingtab"
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
                            STabs === 4
                              ? "stabshow settingtabactive"
                              : "settingtab"
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
                  <div className="col-span-3 w-full bg-white  tabdetails rounded-md relative">
                    {STabs === 1 && (
                      <div>
                        <Users
                          searchValue={searchValue}
                          permissions={permissions}
                          sidebarOpen={sidebarOpen}
                        />
                      </div>
                    )}
                    {STabs === 2 && (
                      <div>
                        <Userrole
                          searchValue={searchValue}
                          permissions={permissions}
                          sidebarOpen={sidebarOpen}
                        />
                      </div>
                    )}
                    {STabs === 3 && (
                      <div>
                        <Storagelimit permissions={permissions} />
                      </div>
                    )}
                    {/*Storage Limits*/}
                    {STabs === 4 && (
                      <div>
                        <Defaultmedia permissions={permissions} />
                      </div>
                    )}

                    <div className={`${STabs === 6 ? "block" : "hidden"}`}>
                      <Invoice
                        permissions={permissions}
                        showInvoice={showInvoice}
                        setShowInvoice={setShowInvoice}
                        InvoiceRef={InvoiceRef}
                        DownloadInvoice={DownloadInvoice}
                        sidebarOpen={sidebarOpen}
                      />
                    </div>

                    {STabs === 8 && (
                      <div className="h-full w-full">
                        <ScreenAuthorize />
                      </div>
                    )}

                    {STabs === 7 && (
                      <div>
                        <Myplan />
                      </div>
                    )}

                    {/*Default Media*/}
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </>
        </Suspense>
      )}
    </>
  );
};

export default Settings;
