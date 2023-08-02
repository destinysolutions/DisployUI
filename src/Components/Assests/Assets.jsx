import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { TiFolderOpen } from "react-icons/ti";
import { AiOutlineCloudUpload, AiOutlineUnorderedList } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";

import { BsThreeDots } from "react-icons/bs";
import "../../Styles/assest.css";
import { FiUpload } from "react-icons/fi";
import { MdPlaylistPlay } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CgMoveRight } from "react-icons/cg";
import { BsThreeDotsVertical } from "react-icons/bs";
import { SlFolderAlt } from "react-icons/sl";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Footer from "../Footer";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { RiGalleryFill } from "react-icons/ri";
import { HiDocumentDuplicate } from "react-icons/hi";
import { GET_ALL_FILES } from "../../Pages/Api";
const Assets = ({ sidebarOpen, setSidebarOpen }) => {
  Assets.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  {
    /* video btn */
  }
  const [asstab, setTogglebtn] = useState(1);
  const [vbtn, setVbtnclick] = useState(null);
  const updatetoggle = (id) => {
    setTogglebtn(id);
  };

  const [hoveredTabIcon, setHoveredTabIcon] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const updatevbtntoggle = (id) => {
    if (vbtn === id) {
      setVbtnclick(null);
      setHoveredTabIcon(null); // Reset the hoveredTabIcon state when the same tabicon is clicked again
    } else {
      setVbtnclick(id);
    }
  };
  const handleIconClick = (item) => {
    // Toggle the visibility of the details for the clicked item
    if (clickedTabIcon === item) {
      setClickedTabIcon(null); // If the same item is clicked again, hide its details
    } else {
      setClickedTabIcon(item); // Otherwise, show the details of the clicked item
      setassetsdw(null);
    }
  };
  const handleMouseOver = () => {
    setIsHovering(true);
  };
  const handleMouseOut = () => {
    setIsHovering(false);
  };

  {
    /* tab1 threedot dwopdown */
  }
  const [assetsdw, setassetsdw] = useState(null);

  const updateassetsdw = (id) => {
    if (assetsdw === id) {
      setassetsdw(null);
    } else {
      setassetsdw(id);
    }
  };
  {
    /* tab2 threedot dwopdown */
  }
  const [assetsdw2, setassetsdw2] = useState(null);
  const updateassetsdw2 = (id) => {
    if (assetsdw2 === id) {
      setassetsdw2(null);
    } else {
      setassetsdw2(id);
    }
  };

  {
    /*New Folder */
  }
  const [newFolderName, setNewFolderName] = useState("");
  const [tableRows, setTableRows] = useState([]);

  const handleNewFolder = () => {
    const newFolder = {
      id: tableRows.length + 1,
      name: newFolderName,
    };
    setTableRows([...tableRows, newFolder]);
    setNewFolderName("");
  };
  {
    /*newfolder threedot dwopdown */
  }
  const [assetsdw3, setassetsdw3] = useState(null);
  const updateassetsdw3 = (id) => {
    if (assetsdw3 === id) {
      setassetsdw3(null);
    } else {
      setassetsdw3(id);
    }
  };
  {
    /*checkedbox */
  }
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };
  /*API */

  const [activetab, setActivetab] = useState(1);
  const [tabitems, setTabitems] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchData();
    handleActiveBtnClick(1);
  }, []);

  const fetchData = () => {
    axios
      .get(GET_ALL_FILES)
      .then((response) => {
        const fetchedData = response.data;
        console.log(fetchedData);
        setOriginalData(fetchedData);
        const allAssets = [
          ...(fetchedData.image ? fetchedData.image : []),
          ...(fetchedData.video ? fetchedData.video : []),
          ...(fetchedData.doc ? fetchedData.doc : []),
        ];
        setTabitems(allAssets);
        setGridData(allAssets);
        setTableData(allAssets);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleActiveBtnClick = (btnNumber) => {
    setActivetab(btnNumber);

    // Ensure that originalData is available before updating tabitems
    if (btnNumber === 1) {
      // Merge all types of assets into a single array
      const allAssets = [
        ...(originalData.image ? originalData.image : []),
        ...(originalData.video ? originalData.video : []),
        ...(originalData.doc ? originalData.doc : []),
      ];
      setTabitems(allAssets);
      setGridData(allAssets);
      setTableData(allAssets);
    } else if (btnNumber === 2) {
      setTabitems(originalData.image ? originalData.image : []);
      setGridData(originalData.image ? originalData.image : []);
      setTableData([]);
    } else if (btnNumber === 3) {
      setTabitems(originalData.video ? originalData.video : []);
      setGridData(originalData.video ? originalData.video : []);
      setTableData([]);
    } else if (btnNumber === 4) {
      setTabitems(originalData.doc ? originalData.doc : []);
      setGridData(originalData.doc ? originalData.doc : []);
      setTableData([]);
    } else if (btnNumber === 5) {
      // Handle other tab buttons (e.g., Apps) if needed
      // setTabitems([...]); // Set data for other buttons
      // setGridData([...]); // Set data for other buttons for grid view
      // setTableData([...]); // Set data for other buttons for table view
    }
  };
  return (
    <>
      <div className="flex border-b border-gray py-3">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      {
        <div className="pt-6 px-5 page-contain">
          <div className={`${sidebarOpen ? "ml-52" : "ml-0"}`}>
            <div className="lg:flex lg:justify-between sm:block items-center">
              <h1 className="not-italic font-medium text-2xl sm:text-xl text-[#001737] sm:mb-4 ml-">
                Assets
              </h1>
              <div className=" flex-wrap flex  lg:mt-0 md:mt-0 sm:mt-3">
                <button
                  className=" dashboard-btn  flex align-middle border-primary items-center border rounded-full lg:px-6 sm:px-2 py-2 xs:px-1 text-base sm:text-sm xs:mr-1 mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                  onClick={handleNewFolder}
                >
                  <TiFolderOpen className="text-2xl rounded-full mr-1 bg-primary text-white p-1" />
                  New Folder
                </button>

                <button className=" dashboard-btn flex align-middle items-center text-primary rounded-full  text-base border border-primary lg:px-9 sm:px-2   xs:px-1 xs:mr-1 mr-3  py-2 sm:text-sm hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                  <AiOutlineCloudUpload className="text-2xl rounded-full mr-1 bg-primary text-white p-1" />
                  <Link to={"/FileUpload"}> Upload </Link>
                </button>

                <ul className="flex items-center xs:mt-2 sm:mt-0 md:mt-0  lg:mt-0  xs:mr-1  mr-3  rounded-full  border border-primary">
                  <li className="flex items-center ">
                    <button
                      className={
                        asstab === 1 ? "tabshow tabassactive " : "asstab "
                      }
                      onClick={() => updatetoggle(1)}
                    >
                      <RxDashboard className="text-primary text-lg" />
                    </button>
                  </li>
                  <li className="flex items-center ">
                    <button
                      className={
                        asstab === 2 ? "tabshow tabassactive right " : "asstab "
                      }
                      onClick={() => updatetoggle(2)}
                    >
                      <AiOutlineUnorderedList />
                    </button>
                  </li>
                </ul>
                <button>
                  <input type="checkbox" className=" mx-1 w-6 h-5 mt-2" />
                </button>
              </div>
            </div>

            <div className="tabs lg:mt-5 md:mt-5  sm:mt-5 xs:mt-0 ">
              <button
                className={activetab === 1 ? "tabactivebtn " : "tabbtn"}
                onClick={() => handleActiveBtnClick(1)}
              >
                All
              </button>
              <button
                className={activetab === 2 ? "tabactivebtn " : "tabbtn"}
                onClick={() => handleActiveBtnClick(2)}
              >
                Images
              </button>
              <button
                className={activetab === 3 ? "tabactivebtn " : "tabbtn"}
                onClick={() => handleActiveBtnClick(3)}
              >
                Video
              </button>
              <button
                className={activetab === 4 ? "tabactivebtn " : "tabbtn"}
                onClick={() => handleActiveBtnClick(4)}
              >
                Doc
              </button>
              <button
                className={activetab === 5 ? "tabactivebtn " : "tabbtn"}
                // onClick={() => handleActiveBtnClick(5)}
              >
                App
              </button>
            </div>

            {/*start grid view */}

            <div
              className={
                asstab === 1
                  ? "show-togglecontent active w-full tab-details mt-10"
                  : "togglecontent"
              }
            >
              <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-8 mb-5 assets-section">
                {gridData.length > 0 ? (
                  gridData.map((item, index) => (
                    <li
                      key={`tabitem-grid-${item.id}-${index}`}
                      className="relative list-none assetsbox"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className={`imagebox relative ${
                            selectedItems.includes(item)
                              ? "active opacity-1 w-full rounded-2xl"
                              : "opacity-50 w-full rounded-2xl"
                          }`}
                        />
                      )}

                      {item.video && (
                        <video
                          controls
                          className="w-full rounded-2xl relative h-56"
                        >
                          <source src={item.video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}

                      <div
                        className="tabicon text-center absolute left-2/4 bottom-[0px] z-10"
                        onMouseEnter={() => setHoveredTabIcon(item)}
                        onMouseLeave={() => setHoveredTabIcon(null)}
                        onClick={() => handleIconClick(item)}
                      >
                        {item.image && (
                          <RiGalleryFill className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                        )}
                        {item.video && (
                          <HiOutlineVideoCamera className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                        )}
                      </div>

                      {/*start hover icon details */}
                      {hoveredTabIcon === item && (
                        <div className="vdetails">
                          <div className="flex justify-end">
                            <div className="storage mb-1">
                              <span className="bg-white text-primary rounded-sm p-1 text-sm">
                                {item.fileSize}
                              </span>
                            </div>
                          </div>
                          <div className="text-center clickdetail">
                            <h3 className="lg:text-base md:text-sm sm:text-sm xs:text-xs  mb-1">
                              {item.name}
                            </h3>
                            <p className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light">
                              {item.details}
                            </p>
                          </div>
                        </div>
                      )}

                      {/*End hover icon details */}

                      {/*start checkbox*/}

                      <div className="checkbox flex justify-between absolute top-5 px-4 w-full">
                        <input
                          type="checkbox"
                          className="w-[20px] h-[20px]"
                          checked={selectedItems.includes(item)}
                          onChange={() => handleCheckboxChange(item)}
                        />
                        <button onClick={() => updateassetsdw(item)}>
                          <BsThreeDots className="text-2xl" />
                        </button>
                        {assetsdw === item && selectedItems.includes(item) && (
                          <div className="assetsdw">
                            <ul>
                              <li className="flex text-sm items-center">
                                <FiUpload className="mr-2 text-lg" />
                                Set to Screen
                              </li>
                              <li className="flex text-sm items-center">
                                <MdPlaylistPlay className="mr-2 text-lg" />
                                Add to Playlist
                              </li>
                              <li className="flex text-sm items-center">
                                {item.image && (
                                  <li className="flex text-sm items-center">
                                    <FiDownload className="mr-2 text-lg" />
                                    <a href={item.image} download>
                                      Download
                                    </a>
                                  </li>
                                )}
                                {item.video && (
                                  <li className="flex text-sm items-center">
                                    <FiDownload className="mr-2 text-lg" />
                                    <a href={item.video} download>
                                      Download
                                    </a>
                                  </li>
                                )}
                                {item.video && (
                                  <li className="flex text-sm items-center">
                                    <FiDownload className="mr-2 text-lg" />
                                    <a href={item.video} download>
                                      Download
                                    </a>
                                  </li>
                                )}
                              </li>
                              <li className="flex text-sm items-center">
                                <CgMoveRight className="mr-2 text-lg" />
                                Move to
                              </li>
                              <li className="flex text-sm items-center">
                                <RiDeleteBin5Line className="mr-2 text-lg" />
                                Move to Trast
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/*end of checkbox*/}
                      {item.doc && (
                        <div className="bg-white px-4 py-5 rounded-lg shadow-lg h-full">
                          {item.doc && (
                            <HiDocumentDuplicate className=" text-primary text-4xl mt-10" />
                          )}
                          {item.doc && (
                            <a
                              href={item.doc}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.name}
                            </a>
                          )}
                          {item.doc && <p>{item.details}</p>}
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <p>Loading data...</p>
                )}
              </div>
            </div>

            {/*End of grid view */}

            {/*start List View */}
            <div
              className={
                asstab === 2
                  ? "show-togglecontent active w-full tab-details mt-10"
                  : "togglecontent"
              }
            >
              <div className="assetstable">
                <table className="w-full text-left" cellPadding={15}>
                  <thead>
                    <tr className="bg-white rounded-xl">
                      <th className="text-[#8E94A9] font-normal">Recent</th>
                      <th className="text-[#8E94A9] font-normal">Duration</th>
                      <th className="text-[#8E94A9] font-normal">Resolution</th>
                      <th className="text-[#8E94A9] font-normal">Type</th>
                      <th className="text-[#8E94A9] font-normal">Size</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((folder, id) => (
                      <React.Fragment key={folder.id}>
                        <tr className="bg-white rounded-lg font-normal text-[14px] text-[#5E5E5E] shadow-sm newfolder">
                          <td className="flex items-center relative">
                            <div>
                              <SlFolderAlt className=" text-5xl font-medium text-primary " />
                            </div>
                            <div className="ml-3">
                              <h1 className="font-medium text-base">
                                New Folder
                              </h1>
                              <p className="max-w-[250px]">Item 1</p>
                            </div>
                          </td>
                          <td></td>
                          <td></td>
                          <td>Video</td>
                          <td>155KB</td>
                          <td>
                            <input
                              type="checkbox"
                              className="w-[20px] h-[20px]"
                            />
                          </td>
                          <td className="relative w-[40px]">
                            <button onClick={() => updateassetsdw3(id)}>
                              <BsThreeDotsVertical className="text-2xl relative" />
                            </button>
                            {assetsdw3 === id && (
                              <div className="assetsdw">
                                <ul>
                                  <li className="flex text-sm items-center">
                                    <FiUpload className="mr-2 text-lg" />
                                    Set to Screen
                                  </li>
                                  <li className="flex text-sm items-center">
                                    <MdPlaylistPlay className="mr-2 text-lg" />
                                    Add to Playlist
                                  </li>
                                  <li className="flex text-sm items-center">
                                    <FiDownload className="mr-2 text-lg" />
                                    Download
                                  </li>
                                  <li className="flex text-sm items-center">
                                    <CgMoveRight className="mr-2 text-lg" />
                                    Move to
                                  </li>
                                  <li className="flex text-sm items-center">
                                    <RiDeleteBin5Line className="mr-2 text-lg" />
                                    Move to Trast
                                  </li>
                                </ul>
                              </div>
                            )}
                          </td>
                        </tr>

                        <tr>
                          <div className="mb-2"></div>
                        </tr>
                      </React.Fragment>
                    ))}

                    {tableData.length > 0 ? (
                      tableData.map((item, index) => (
                        <tr
                          key={`tabitem-table-${item.id}-${index}`}
                          className=" mt-2 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] shadow-sm border-b border-[#cccccca6]"
                        >
                          {" "}
                          <>
                            <td className="flex items-center relative">
                              {item.image && (
                                <div className="imagebox">
                                  <img
                                    src={item.image}
                                    className=" rounded-2xl"
                                  />
                                  <div className="tabicon text-center absolute left-10 top-3">
                                    {item.image && (
                                      <RiGalleryFill className="bg-primary text-white p-2 text-3xl rounded-full shadow-lg" />
                                    )}
                                  </div>
                                </div>
                              )}

                              {item.video && (
                                <div className="relative videobox">
                                  <video
                                    controls
                                    className="w-full rounded-2xl relative"
                                  >
                                    <source src={item.video} type="video/mp4" />
                                    Your browser does not support the video tag.
                                  </video>
                                  <div className="tabicon text-center absolute left-10 top-3">
                                    {item.video && (
                                      <HiOutlineVideoCamera className="bg-primary text-white p-2 text-3xl rounded-full shadow-lg" />
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="ml-2">
                                <h1 className="font-medium lg:text-base md:text-sm sm:text-sm xs:text-xs">
                                  {item.name}
                                </h1>
                                <p className="max-w-[250px] lg:text-base md:text-sm sm:text-sm xs:text-xs">
                                  {item.details}
                                </p>
                              </div>
                            </td>

                            <td>0.40min</td>
                            <td>1200*50</td>
                            <td>{item.contentType}</td>
                            <td>{item.fileSize}</td>

                            <td>
                              <input
                                type="checkbox"
                                className="w-[20px] h-[20px]"
                              />
                            </td>
                            <td className="relative w-[40px]">
                              <button onClick={() => updateassetsdw2(item)}>
                                <BsThreeDotsVertical className="text-2xl relative" />
                              </button>
                              {assetsdw2 === item && (
                                <div className="assetsdw">
                                  <ul>
                                    <li className="flex text-sm items-center">
                                      <FiUpload className="mr-2 text-lg" />
                                      Set to Screen
                                    </li>
                                    <li className="flex text-sm items-center">
                                      <MdPlaylistPlay className="mr-2 text-lg" />
                                      Add to Playlist
                                    </li>
                                    <li className="flex text-sm items-center">
                                      <FiDownload className="mr-2 text-lg" />
                                      Download
                                    </li>
                                    <li className="flex text-sm items-center">
                                      <CgMoveRight className="mr-2 text-lg" />
                                      Move to
                                    </li>
                                    <li className="flex text-sm items-center">
                                      <RiDeleteBin5Line className="mr-2 text-lg" />
                                      Move to Trast
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </td>

                            <tr>
                              <div className="my-2"></div>
                            </tr>
                          </>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>Loading data...</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/*End of List View */}
          </div>
        </div>
      }
      <Footer />
    </>
  );
};

export default Assets;
