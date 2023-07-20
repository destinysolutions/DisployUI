import { IoBarChartSharp } from "react-icons/io5";
import { RiPlayListFill } from "react-icons/ri";
import { BiAnchor } from "react-icons/bi";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const AssetModal = ({ setShowAssetModal }) => {
  AssetModal.propTypes = {
    setShowAssetModal: PropTypes.func.isRequired,
  };
  const [popupActiveTab, setPopupActiveTab] = useState(1);
  return (
    <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none myplaylist-popup">
      <div className="relative w-auto my-6 mx-auto myplaylist-popup-details">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none addmediapopup">
          <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
            <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium">
              Set Content to Add Media
            </h3>
            <button
              className="p-1 text-xl"
              onClick={() => setShowAssetModal(false)}
            >
              <AiOutlineCloseCircle className="text-2xl" />
            </button>
          </div>

          <div className="relative lg:p-6 md:p-6 sm:p-2 xs:p-1 flex-auto">
            <div className="bg-white rounded-[30px]">
              <div className="">
                <div className="lg:flex lg:flex-wrap lg:items-center md:flex md:flex-wrap md:items-center sm:block xs:block">
                  <div>
                    <nav
                      className="flex flex-col space-y-2 "
                      aria-label="Tabs"
                      role="tablist"
                      data-hs-tabs-vertical="true"
                    >
                      <button
                        type="button"
                        className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                          popupActiveTab === 1 ? "active" : ""
                        }`}
                        // onClick={() => handleTabClick(1)}
                      >
                        <span
                          className={`p-1 rounded ${
                            popupActiveTab === 1
                              ? "bg-primary text-white"
                              : "bg-[#D5E3FF]"
                          } `}
                        >
                          <IoBarChartSharp size={15} />
                        </span>
                        Assets
                      </button>
                      <button
                        type="button"
                        className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                          popupActiveTab === 2 ? "active" : ""
                        }`}
                        //onClick={() => handleTabClick(2)}
                      >
                        <span
                          className={`p-1 rounded ${
                            popupActiveTab === 2
                              ? "bg-primary text-white"
                              : "bg-[#D5E3FF]"
                          } `}
                        >
                          <RiPlayListFill size={15} />
                        </span>
                        Playlist
                      </button>
                      <button
                        type="button"
                        className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                          popupActiveTab === 3 ? "active" : ""
                        }`}
                        // onClick={() => handleTabClick(3)}
                      >
                        <span
                          className={`p-1 rounded ${
                            popupActiveTab === 3
                              ? "bg-primary text-white"
                              : "bg-[#D5E3FF]"
                          } `}
                        >
                          <BiAnchor size={15} />
                        </span>
                        Disploy Studio
                      </button>
                      <button
                        type="button"
                        className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                          popupActiveTab === 4 ? "active" : ""
                        }`}
                        // onClick={() => handleTabClick(4)}
                      >
                        <span
                          className={`p-1 rounded ${
                            popupActiveTab === 4
                              ? "bg-primary text-white"
                              : "bg-[#D5E3FF]"
                          } `}
                        >
                          <AiOutlineAppstoreAdd size={15} />
                        </span>
                        Apps
                      </button>
                    </nav>
                  </div>

                  <div className="lg:p-10 md:p-10 sm:p-1 xs:mt-3 sm:mt-3 drop-shadow-2xl bg-white rounded-3xl">
                    <div className={popupActiveTab === 1 ? "" : "hidden"}>
                      <div className="flex flex-wrap items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center">
                        <div className="text-right mb-5 mr-5 flex items-end justify-end relative sm:mr-0">
                          <AiOutlineSearch className="absolute top-[13px] right-[207px] z-10 text-gray searchicon" />
                          <input
                            type="text"
                            placeholder=" Search Users "
                            className="border border-primary rounded-full px-7 py-2 search-user"
                          />
                        </div>
                        <Link to="/fileupload">
                          <button className="flex align-middle border-primary items-center border rounded-full px-8 py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                            Upload
                          </button>
                        </Link>
                      </div>
                      <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto">
                        <table
                          style={{
                            borderCollapse: "separate",
                            borderSpacing: " 0 10px",
                          }}
                        >
                          <thead>
                            <tr className="bg-[#E4E6FF]">
                              <th className="p-3 w-80 text-left">Media Name</th>
                              <th className="">Date Added</th>
                              <th className="p-3">Size</th>
                              <th className="p-3">Type</th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr className="bg-[#F8F8F8]">
                              <td className="p-3">Name</td>
                              <td className="p-3">25 May 2023</td>
                              <td className="p-3">25 kb</td>
                              <td className="p-3">Image</td>
                            </tr>
                            <tr className="bg-[#F8F8F8]">
                              <td className="p-3">Name</td>
                              <td className="p-3">25 May 2023</td>
                              <td className="p-3">25 kb</td>
                              <td className="p-3">Image</td>
                            </tr>
                            <tr className="bg-[#F8F8F8]">
                              <td className="p-3">Name</td>
                              <td className="p-3">25 May 2023</td>
                              <td className="p-3">25 kb</td>
                              <td className="p-3">Image</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center p-5">
            <p className="text-black">Content will always be playing Confirm</p>
            <button
              className="bg-primary text-white rounded-full px-5 py-2"
              onClick={() => setShowAssetModal(false)}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetModal;
