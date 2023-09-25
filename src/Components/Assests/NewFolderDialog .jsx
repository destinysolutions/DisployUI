import React, { useState, useEffect, useRef } from "react";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { RiDeleteBin5Line, RiGalleryFill } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import { FiDownload, FiUpload } from "react-icons/fi";
import { MdPlaylistPlay } from "react-icons/md";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import PropTypes from "prop-types";
import { MdArrowBackIosNew } from "react-icons/md";
import { HiDocumentDuplicate } from "react-icons/hi";
import { GET_ALL_FILES, FetchdataFormFolder } from "../../Pages/Api";
const NewFolderDialog = ({ sidebarOpen, setSidebarOpen }) => {
  NewFolderDialog.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const [folderName, setFolderName] = useState("New Folder");
  const [searchParams] = useSearchParams();
  // const folderId = searchParams.get("folderId");
  const location = useLocation();
  const folderId = location.pathname.split("/").pop();
  const selectedData = location.state?.selectedData;

  const loadEventsForSchedule = (folderId) => {
    axios.get(`${FetchdataFormFolder}?ID=${folderId}`).then((response) => {
      const fetchedData = response.data;
      console.log(response.data, "fetchedData");
    });
  };

  useEffect(() => {
    if (folderId) {
      loadEventsForSchedule(folderId);
    }
  });
  useEffect(() => {
    fetchData();
  }, []);

  const [data, setData] = useState({ images: [], videos: [], documents: [] });

  const fetchData = () => {
    axios
      .get(GET_ALL_FILES)
      .then((response) => {
        const fetchedData = response.data;

        // Categorize data into separate arrays
        const categorizedData = {
          images: fetchedData.image || [],
          videos: fetchedData.video || [],
          documents: fetchedData.doc || [],
        };

        // Update state with categorized data
        setData(categorizedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [hoveredTabIcon, setHoveredTabIcon] = useState(null);
  const handleIconClick = (item) => {
    // Toggle the visibility of the details for the clicked item
    if (clickedTabIcon === item) {
      setClickedTabIcon(null); // If the same item is clicked again, hide its details
    } else {
      setClickedTabIcon(item); // Otherwise, show the details of the clicked item
      setassetsdw(null);
    }
  };
  const [assetsdw, setassetsdw] = useState(null);

  const updateassetsdw = (id) => {
    if (assetsdw === id) {
      setassetsdw(null);
    } else {
      setassetsdw(id);
    }
  };

  const handleClickInside = (event) => {
    // Prevent clicks inside the assetsdw from closing it
    event.stopPropagation();
  };

  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem !== item)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  const [selectAll, setSelectAll] = useState(false);

  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      {
        <div className="pt-6 px-5 page-contain">
          <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
            <div className="lg:flex lg:justify-between sm:block items-center">
              <div className=" ">
                <Link to={"/assets"}>
                  <MdArrowBackIosNew className="text-4xl rounded-full p-2 border border-gray mb-2 hover:bg-SlateBlue hover:text-white" />
                </Link>
                <hr className="border-b border-lightgray" />
                <div className=" mt-4 page-content grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-8 mb-10 assets-section">
                  {data.images.map((image) => (
                    <>
                      <div
                        key={image.id}
                        className="relative list-none assetsbox"
                      >
                        <img
                          src={image.fileType}
                          alt={image.name}
                          className="relative imagebox w-full rounded-2xl"
                        />

                        <div
                          className="tabicon text-center absolute left-[50%] bottom-[0px]"
                          onMouseEnter={() => setHoveredTabIcon(image)}
                          onMouseLeave={() => setHoveredTabIcon(null)}
                          onClick={() => handleIconClick(image)}
                        >
                          <RiGalleryFill className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer z-50 " />
                        </div>

                        <div className="checkbox flex justify-between absolute top-5 px-4 w-full">
                          <input
                            type="checkbox"
                            className="w-[20px] h-[20px]"
                            checked={selectAll || selectedItems.includes(image)}
                            onChange={() => handleCheckboxChange(image)}
                          />
                          <button onClick={() => updateassetsdw(image)}>
                            <BsThreeDots className="text-2xl" />
                          </button>

                          {assetsdw === image &&
                            selectedItems.includes(image) && (
                              <div
                                className="assetsdw"
                                onClick={handleClickInside}
                              >
                                <ul>
                                  <li className="flex text-sm items-center">
                                    <FiUpload className="mr-2 text-lg" />
                                    Set to Screen
                                  </li>
                                  <li className="flex text-sm items-center">
                                    <MdPlaylistPlay className="mr-2 text-lg" />
                                    Add to Playlist
                                  </li>
                                  {image.categorieType === "Image" && (
                                    <li className="flex text-sm items-center">
                                      <FiDownload className="mr-2 text-lg" />
                                      <a href={image.fileType} download>
                                        Download
                                      </a>
                                    </li>
                                  )}

                                  {image.categorieType === "Video" && (
                                    <li className="flex text-sm items-center">
                                      <FiDownload className="mr-2 text-lg" />
                                      <a href={image.fileType} download>
                                        Download
                                      </a>
                                    </li>
                                  )}
                                  {image.categorieType === "OnlineImage" && (
                                    <li className="flex text-sm items-center">
                                      <FiDownload className="mr-2 text-lg" />
                                      <a href={image.fileType} download>
                                        Download
                                      </a>
                                    </li>
                                  )}

                                  {image.categorieType === "OnlineVideo" && (
                                    <li className="flex text-sm items-center">
                                      <FiDownload className="mr-2 text-lg" />
                                      <a href={image.fileType} download>
                                        Download
                                      </a>
                                    </li>
                                  )}
                                  {image.categorieType === "DOC" && (
                                    <li className="flex text-sm items-center">
                                      <FiDownload className="mr-2 text-lg" />
                                      <a href={image.fileType} download>
                                        Download
                                      </a>
                                    </li>
                                  )}

                                  <li>
                                    <button
                                      onClick={() => handelDeletedata(item.id)}
                                      className="flex text-sm items-center"
                                    >
                                      <RiDeleteBin5Line className="mr-2 text-lg" />
                                      Move to Trash
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )}
                        </div>

                        {hoveredTabIcon === image && (
                          <div className="vdetails z-[1]">
                            <div className="text-center clickdetail">
                              <h3 className="lg:text-base md:text-sm sm:text-sm xs:text-xs  mb-1">
                                {image.name}
                              </h3>

                              <h6 className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light">
                                {image.createdDate}
                              </h6>
                              <span className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                                {image.categorieType}
                              </span>
                              <span>,</span>
                              <h6 className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                                {image.fileSize}
                              </h6>

                              <span className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                                {image.resolutions}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ))}

                  {data.videos.map((video) => (
                    <div
                      key={video.id}
                      className="relative list-none assetsbox"
                    >
                      {/* Render video player or video details as needed */}
                      <video controls className="relative">
                        <source src={video.fileType} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>

                      <div
                        className="tabicon text-center absolute left-[50%] bottom-[0px]"
                        onMouseEnter={() => setHoveredTabIcon(video)}
                        onMouseLeave={() => setHoveredTabIcon(null)}
                        onClick={() => handleIconClick(video)}
                      >
                        <HiOutlineVideoCamera className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                      </div>

                      <div className="checkbox flex justify-between absolute top-5 px-4 w-full">
                        <input
                          type="checkbox"
                          className="w-[20px] h-[20px]"
                          checked={selectAll || selectedItems.includes(video)}
                          onChange={() => handleCheckboxChange(video)}
                        />
                        <button onClick={() => updateassetsdw(video)}>
                          <BsThreeDots className="text-2xl" />
                        </button>
                        {assetsdw === video &&
                          selectedItems.includes(video) && (
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
                                {video.categorieType === "Image" && (
                                  <li className="flex text-sm items-center">
                                    <FiDownload className="mr-2 text-lg" />
                                    <a href={video.fileType} download>
                                      Download
                                    </a>
                                  </li>
                                )}

                                {video.categorieType === "Video" && (
                                  <li className="flex text-sm items-center">
                                    <FiDownload className="mr-2 text-lg" />
                                    <a href={video.fileType} download>
                                      Download
                                    </a>
                                  </li>
                                )}
                                {video.categorieType === "OnlineImage" && (
                                  <li className="flex text-sm items-center">
                                    <FiDownload className="mr-2 text-lg" />
                                    <a href={video.fileType} download>
                                      Download
                                    </a>
                                  </li>
                                )}

                                {video.categorieType === "OnlineVideo" && (
                                  <li className="flex text-sm items-center">
                                    <FiDownload className="mr-2 text-lg" />
                                    <a href={video.fileType} download>
                                      Download
                                    </a>
                                  </li>
                                )}
                                {video.categorieType === "DOC" && (
                                  <li className="flex text-sm items-center">
                                    <FiDownload className="mr-2 text-lg" />
                                    <a href={video.fileType} download>
                                      Download
                                    </a>
                                  </li>
                                )}

                                <li>
                                  <button
                                    onClick={() => handelDeletedata(item.id)}
                                    className="flex text-sm items-center"
                                  >
                                    <RiDeleteBin5Line className="mr-2 text-lg" />
                                    Move to Trash
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                      </div>
                      {hoveredTabIcon === video && (
                        <div className="vdetails">
                          <div className="text-center clickdetail">
                            <h3 className="lg:text-base md:text-sm sm:text-sm xs:text-xs  mb-1">
                              {video.name}
                            </h3>

                            <h6 className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light">
                              {video.createdDate}
                            </h6>
                            <span className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                              {video.categorieType}
                            </span>
                            <span>,</span>
                            <h6 className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                              {video.fileSize}
                            </h6>

                            <span className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                              {video.resolutions}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {data.documents.map((document) => (
                    <>
                      <div
                        key={document.id}
                        className="bg-white px-4 py-5 rounded-lg shadow-lg h-full relative"
                      >
                        <HiDocumentDuplicate className=" text-primary text-4xl " />
                        <p>Name: {document.name}</p>
                        <p>Details: {document.details}</p>

                        <div className="checkbox flex justify-between absolute top-5 px-4 w-full">
                          <input
                            type="checkbox"
                            className="w-[20px] h-[20px]"
                            checked={
                              selectAll || selectedItems.includes(document)
                            }
                            onChange={() => handleCheckboxChange(document)}
                          />
                          <button onClick={() => updateassetsdw(document)}>
                            <BsThreeDots className="text-2xl" />
                          </button>
                          {assetsdw === document &&
                            selectedItems.includes(document) && (
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
                                  {document.categorieType === "Image" && (
                                    <li className="flex text-sm items-center">
                                      <FiDownload className="mr-2 text-lg" />
                                      <a href={document.fileType} download>
                                        Download
                                      </a>
                                    </li>
                                  )}

                                  {document.categorieType === "Video" && (
                                    <li className="flex text-sm items-center">
                                      <FiDownload className="mr-2 text-lg" />
                                      <a href={document.fileType} download>
                                        Download
                                      </a>
                                    </li>
                                  )}
                                  {document.categorieType === "OnlineImage" && (
                                    <li className="flex text-sm items-center">
                                      <FiDownload className="mr-2 text-lg" />
                                      <a href={document.fileType} download>
                                        Download
                                      </a>
                                    </li>
                                  )}

                                  {document.categorieType === "OnlineVideo" && (
                                    <li className="flex text-sm items-center">
                                      <FiDownload className="mr-2 text-lg" />
                                      <a href={document.fileType} download>
                                        Download
                                      </a>
                                    </li>
                                  )}
                                  {document.categorieType === "DOC" && (
                                    <li className="flex text-sm items-center">
                                      <FiDownload className="mr-2 text-lg" />
                                      <a href={document.fileType} download>
                                        Download
                                      </a>
                                    </li>
                                  )}

                                  <li>
                                    <button
                                      onClick={() => handelDeletedata(item.id)}
                                      className="flex text-sm items-center"
                                    >
                                      <RiDeleteBin5Line className="mr-2 text-lg" />
                                      Move to Trash
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )}
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default NewFolderDialog;
