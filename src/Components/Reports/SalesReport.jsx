import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import PropTypes from "prop-types";
import Footer from "../Footer";
import { LuDownload } from "react-icons/lu";
import { AiOutlineSearch } from "react-icons/ai";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";

const SalesReport = ({ sidebarOpen, setSidebarOpen }) => {
  SalesReport.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-52" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block xs:block  items-center">
            <div className="flex items-center lg:mb-0 md:mb-0 sm:mb-4">
              <Link to={"/reports"}>
                <MdKeyboardArrowLeft className="text-4xl text-primary" />
              </Link>
              <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl xs:text-xs text-[#001737]  ">
                Sales Report
              </h1>
            </div>

            <div className="rightbtn flex items-center flex-wrap">
              <ul className="p-0 m-0 lg:flex md:flex sm:block xs:block items-center border rounded-md border-primary  lg:mr-3 md:mr-3 sm:mr-2 xs:mr-0 lg:w-auto md:w-auto sm:w-auto xs:w-full">
                <li className="bg-primary text-white py-1 px-4 font-light-[26px] rounded-tl-md rounded-tb-md">
                  <label className=" leading-8">Daily</label>
                </li>
                <li>
                  <input
                    type="date"
                    className="date-formate px-2 py-1 bg-[transparent] text-base lg:w-auto md:w-auto sm:w-full xs:w-full"
                  />
                </li>
              </ul>

              <div className=" flex items-end justify-end relative sm:mr-0">
                <AiOutlineSearch className="absolute top-[13px] left-[15px] z-10 text-primary searchicon" />
                <input
                  type="text"
                  placeholder=" Search "
                  className="border border-primary rounded-full bg-[transparent] pl-7 py-2 search-user placeholder:text-primary"
                />
              </div>

              <div className="ml-2">
                <button className="border rounded-full  hover:shadow-xl hover:bg-SlateBlue border-primary ">
                  <LuDownload className="p-2 text-4xl text-primary hover:text-white " />
                </button>
              </div>
            </div>
          </div>

          <div className="sectiondetails mt-5 bg-white p-5 rounded-md drop-shadow-sm overflow-x-auto">
            <table className="w-full text-[#5E5E5E]" cellPadding={20}>
              <thead>
                <tr className="bg-lightgray rounded-md text-left">
                  <th className=" font-medium p-3">Date</th>
                  <th className=" font-medium p-3">Plan</th>
                  <th className=" font-medium  p-3">Total Screens</th>
                  <th className=" font-medium  p-3">Customer</th>
                  <th className=" font-medium  p-3">Location</th>
                </tr>
              </thead>
              <tbody>
                <tr className=" border-b border-[#E4E6FF]">
                  <td>
                    <p>06 July 2023 </p>
                  </td>
                  <td>
                    <p>Basic </p>
                  </td>
                  <td>
                    <p>15 </p>
                  </td>
                  <td>
                    <p>Donald Gardner</p>
                  </td>
                  <td className="p-2 break-words  w-[200px]">
                    132, My Street, Kingston, New York 12401.
                  </td>
                </tr>
                <tr className=" border-b border-[#E4E6FF]">
                  <td>
                    <p>06 July 2023 </p>
                  </td>
                  <td>
                    <p>Basic </p>
                  </td>
                  <td>
                    <p>15 </p>
                  </td>
                  <td>
                    <p>Donald Gardner</p>
                  </td>
                  <td className="p-2 break-words  w-[200px]">
                    132, My Street, Kingston, New York 12401.
                  </td>
                </tr>
                <tr className=" border-b border-[#E4E6FF]">
                  <td>
                    <p>06 July 2023 </p>
                  </td>
                  <td>
                    <p>Basic </p>
                  </td>
                  <td>
                    <p>15 </p>
                  </td>
                  <td>
                    <p>Donald Gardner</p>
                  </td>
                  <td className="p-2 break-words  w-[200px]">
                    132, My Street, Kingston, New York 12401.
                  </td>
                </tr>
                <tr className=" border-b border-[#E4E6FF]">
                  <td>
                    <p>06 July 2023 </p>
                  </td>
                  <td>
                    <p>Basic </p>
                  </td>
                  <td>
                    <p>15 </p>
                  </td>
                  <td>
                    <p>Donald Gardner</p>
                  </td>
                  <td className="p-2 break-words  w-[200px]">
                    132, My Street, Kingston, New York 12401.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SalesReport;
