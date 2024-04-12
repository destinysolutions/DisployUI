import React, { useRef, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import PropTypes from "prop-types";
import { SiMediamarkt } from "react-icons/si";
import {
  FaDownload,
  FaFileInvoiceDollar,
  FaRegCalendarPlus,
} from "react-icons/fa";
import { HiClipboardDocumentList } from "react-icons/hi2";
import Invoice from "../Components/Settings/Invoice";
import Myplan from "../Components/Settings/Myplan";
import { BsFillPrinterFill, BsFillSendFill } from "react-icons/bs";
import ReactToPrint from "react-to-print";
import { AiOutlineSearch } from "react-icons/ai";
import html2pdf from "html2pdf.js";
import CreateAPI from "./CreateAPI";
import Discount from "./Discount";
import { MdDiscount } from "react-icons/md";
import { FiCodesandbox } from "react-icons/fi";
import SupplierPlan from "./SupplierPlan";
import Footer from "../Components/Footer";
import Billing from "../Components/Settings/Billing/Billing";
import { useDispatch } from "react-redux";
import { handleSendInvoice } from "../Redux/PaymentSlice";
import { SEND_INVOICE } from "../Pages/Api";
import { useSelector } from "react-redux";

const AdminSetting = ({ sidebarOpen, setSidebarOpen }) => {
  AdminSetting.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const dispatch = useDispatch()
  const { token } = useSelector((s) => s.root.auth);
  const authToken = `Bearer ${token}`;
  const [STabs, setSTabs] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [InvoiceID, setInvoiceID] = useState("");

  const InvoiceRef = useRef(null);
  const [permissions, setPermissions] = useState({
    isDelete: false,
    isSave: false,
    isView: false,
  });

  function updateTab(id) {
    setSTabs(id);
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

  const SendInvoice = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${SEND_INVOICE}}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken
      },
    }
    dispatch(handleSendInvoice({ config })).then((res) => {
      if (res?.payload?.status) {

      }
    }).catch((error) => console.log('error', error))
  }

  return (
    <>
      <div className="flex border-b border-gray">
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <AdminNavbar />
      </div>
      <div className="pt-6 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex justify-between sm:flex xs:block  items-center mb-5 ">
            <div className=" lg:mb-0 md:mb-0 sm:mb-4">
              <h1 className="not-italic font-medium lg:text-2xl  md:text-2xl sm:text-xl xs:text-xs text-[#001737]  ">
                Settings
              </h1>
            </div>
            {showInvoice && STabs === 6 && (
              <div className="flex">
                <button
                  type="button"
                  className="px-5 bg-primary flex items-center gap-2 text-white rounded-full py-2 border border-primary me-3 "
                  onClick={() => SendInvoice()}
                >
                  <BsFillSendFill />
                  Send Invoice
                </button>
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
                      STabs === 5 ? "stabshow settingtabactive" : "settingtab"
                    }
                    onClick={() => updateTab(5)}
                  >
                    <SiMediamarkt className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />
                    <span className="text-base text-primary">Billing</span>
                  </button>
                </li>

                <li>
                  <button
                    className={
                      STabs === 6 ? "stabshow settingtabactive" : "settingtab"
                    }
                    onClick={() => updateTab(6)}
                  >
                    <FaFileInvoiceDollar className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />
                    <span className="text-base text-primary">Invoice</span>
                  </button>
                </li>
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

                <li>
                  <button
                    className={
                      STabs === 8 ? "stabshow settingtabactive" : "settingtab"
                    }
                    onClick={() => updateTab(8)}
                  >
                    <FaRegCalendarPlus className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />
                    <span className="text-base text-primary">Create API</span>
                  </button>
                </li>
                <li>
                  <button
                    className={
                      STabs === 9 ? "stabshow settingtabactive" : "settingtab"
                    }
                    onClick={() => updateTab(9)}
                  >
                    <MdDiscount className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />
                    <span className="text-base text-primary">Discount</span>
                  </button>
                </li>
                {/*<li>
                  <button
                    className={
                      STabs === 10 ? "stabshow settingtabactive" : "settingtab"
                    }
                    onClick={() => updateTab(10)}
                  >
                    <FiCodesandbox className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />
                    <span className="text-base text-primary">
                      Supplier Plan
                    </span>
                  </button>
                  </li>*/}
              </ul>
            </div>

            {/*Tab details*/}
            <div className="col-span-3 w-full bg-white  tabdetails rounded-md relative">
              {STabs === 5 && (
                <div>
                  <Billing permissions={permissions} />
                </div>
              )}
              {STabs === 6 && (
                <div>
                  <Invoice
                    permissions={permissions}
                    showInvoice={showInvoice}
                    setShowInvoice={setShowInvoice}
                    InvoiceRef={InvoiceRef}
                    DownloadInvoice={DownloadInvoice}
                    setInvoiceID={setInvoiceID}
                  />
                </div>
              )}
              {STabs === 7 && (
                <div className="w-full h-full">
                  <Myplan />
                </div>
              )}
              {STabs === 8 && (
                <div>
                  <CreateAPI />
                </div>
              )}

              {STabs === 9 && (
                <div>
                  <Discount sidebarOpen={sidebarOpen} />
                </div>
              )}
              {STabs === 10 && (
                <div>
                  <SupplierPlan />
                </div>
              )}

              {/*Default Media*/}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminSetting;
