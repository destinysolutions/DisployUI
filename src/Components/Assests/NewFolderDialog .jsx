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
 
  // const selectedData = location.state?.selectedData;


  // folder wise show asset
  const [folderData, setFolderData] = useState([]);
  const [folderAsset, setFolderAsset] = useState([]);
  const [assetData, setAssetData] = useState([]);

  const location = useLocation();
  const folderId = location.pathname.split("/").pop();

  const fetchData = () => {
    axios
      .get(GET_ALL_FILES)
      .then((response) => {
        const fetchedData = response.data;
        console.log(fetchedData,"fetchedData");

        // const folderImageIds = folderData.map((item) => item);
        // console.log(folderImageIds,"folderImageIds");

        // const matchingAssets = fetchedData.image.filter((item) =>
        // folderImageIds.includes(item.id)
        const allAssets = [
          ...(fetchedData.image ? fetchedData.image : []),
          ...(fetchedData.video ? fetchedData.video : []),
          ...(fetchedData.doc ? fetchedData.doc : []),
          ...(fetchedData.onlineimages ? fetchedData.onlineimages : []),
          ...(fetchedData.onlinevideo ? fetchedData.onlinevideo : []),
        ];
        console.log(allAssets, "allAssets"); 
       
               const matchingAssets = folderData.map((id) =>
               allAssets.find((item) => item.id === id)
             );
               setFolderAsset(matchingAssets);
   
      console.log(matchingAssets, "matchingAssets"); 
    
        setAssetData(fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const loadEventsForSchedule = (folderId) => {
    axios.get(`${FetchdataFormFolder}?ID=${folderId}`).then((response) => {
      const fetchedData = response.data.data;
     const assetList = fetchedData.map((item)=>item.asset)
      setFolderData(assetList);
      console.log(assetList, "assetList");
    });
  };

  useEffect(() => {
    if (folderId) {
      loadEventsForSchedule(folderId);
    }
  },[folderId]);

  useEffect(() => {
    if (folderData.length > 0) {
      fetchData();
    }
  }, [folderData]);


// useEffect(() => {
//   if (folderData.length > 0) {
//     const matchingAssets = folderData.map((id) =>
//       assetData.find((item) => item.id === id)
//     );
//     setFolderAsset(matchingAssets);
//   } else {
//     setFolderAsset([]); 
//   }
// }, [folderData, assetData]);
console.log(folderAsset,'folderAsset');
console.log(assetData,'assetData');
console.log(folderData,';folderData');
// folder wise show asset end end end 


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
              <div className="">
                <Link to={"/assets"}>
                  <MdArrowBackIosNew className="text-4xl rounded-full p-2 b order border-gray mb-2 hover:bg-SlateBlue hover:text-white" />
                </Link>
                <hr className="border-b border-lightgray" />
                <div className=" page-content grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-8 mb-5 assets-section">
                {folderAsset.map((folderAsset) => (
                  <>
                  <div key={folderAsset.id} className="relative assetsbox">
                    {folderAsset.categorieType === "OnlineImage" && (
                     <img
                          src={folderAsset.fileType}
                          alt={folderAsset.name}
                          className="imagebox relative opacity-1 w-full rounded-2xl" />
                      
                    )}
                    
                    {folderAsset.categorieType === "OnlineVideo" && (
                      <video
                        controls
                        className="w-full rounded-2xl relative imagebox"
                      >
                        <source
                          src={folderAsset.fileType}
                          type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {folderAsset.categorieType === "Image" && (
                      <img
                        src={folderAsset.fileType}
                        alt={folderAsset.name}
                        className="imagebox relative opacity-1 w-full rounded-2xl" />
                    )}
                    {folderAsset.categorieType === "Video" && (
                      <video
                        controls
                        className="w-full rounded-2xl relative h-56  list-none imagebox"
                      >
                        <source
                          src={folderAsset.fileType}
                          type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {folderAsset.categorieType === "DOC" && (
                      <a
                        href={folderAsset.fileType}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="imagebox relative opacity-1 w-full rounded-2xl"
                      >
                        {folderAsset.name}
                      </a>
                    )}

                    <div
                        className="tabicon text-center absolute left-2/4 bottom-[0px] z-10"
                        onMouseEnter={() => setHoveredTabIcon(folderAsset)}
                        onMouseLeave={() => setHoveredTabIcon(null)}
                        onClick={() => handleIconClick(folderAsset)}
                      >
                        {folderAsset.categorieType === "Image" && (
                          <RiGalleryFill className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                        )}

                        {folderAsset.categorieType === "Video" && (
                          <HiOutlineVideoCamera className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                        )}

                        {folderAsset.categorieType === "OnlineImage" && (
                          <RiGalleryFill className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                        )}

                        {folderAsset.categorieType === "OnlineVideo" && (
                          <HiOutlineVideoCamera className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                        )}
                      </div>

                      {hoveredTabIcon === folderAsset && (
                        <div className="vdetails">
                          <div className="flex justify-end">
                            <div className="storage mb-1">
                              {/* <span className="bg-white text-primary rounded-sm p-1 text-sm">
                                {item.fileSize}
                              </span> */}
                            </div>
                          </div>
                          <div className="text-center clickdetail">
                            <h3 className="lg:text-base md:text-sm sm:text-sm xs:text-xs  mb-1">
                              {folderAsset.name}
                            </h3>
                            {/*<p className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                              {item.details}
                            </p> */}
                            <h6 className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light">
                              {folderAsset.createdDate}
                            </h6>
                            <span className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                              {folderAsset.categorieType}
                            </span>
                            <span>,</span>
                            <h6 className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                              {folderAsset.fileSize}
                            </h6>

                            <span className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                              {folderAsset.resolutions}
                            </span>
                          </div>
                        </div>
                      )}

                        {/*start hover icon details */}
              {hoveredTabIcon === folderAsset && (
                <div className="vdetails">
                  <div className="flex justify-end">
                    <div className="storage mb-1">
                      {/* <span className="bg-white text-primary rounded-sm p-1 text-sm">
                        {item.fileSize}
                      </span> */}
                    </div>
                  </div>
                  <div className="text-center clickdetail">
                    <h3 className="lg:text-base md:text-sm sm:text-sm xs:text-xs  mb-1">
                      {folderAsset.name}
                    </h3>
                    {/*<p className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                      {folderAsset.details}
                    </p> */}
                    <h6 className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light">
                      {folderAsset.createdDate}
                    </h6>
                    <span className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                      {folderAsset.categorieType}
                    </span>
                    <span>,</span>
                    <h6 className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                      {folderAsset.fileSize}
                    </h6>

                    <span className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                      {folderAsset.resolutions}
                    </span>
                  </div>
                </div>
              )}

              <div className="checkbox flex justify-between absolute top-5 px-4 w-full">
              <input
                type="checkbox"
                className="w-[20px] h-[20px]"
                checked={selectAll || selectedItems.includes(folderAsset)}
                onChange={() => handleCheckboxChange(folderAsset)}
              />
              <button onClick={() => updateassetsdw(folderAsset)}>
                <BsThreeDots className="text-2xl" />
              </button>
              {assetsdw === folderAsset && selectedItems.includes(folderAsset) && (
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
                    {folderAsset.categorieType === "Image" && (
                      <li className="flex text-sm items-center">
                        <FiDownload className="mr-2 text-lg" />
                        <a href={folderAsset.fileType} download>
                          Download
                        </a>
                      </li>
                    )}

                    {folderAsset.categorieType === "Video" && (
                      <li className="flex text-sm items-center">
                        <FiDownload className="mr-2 text-lg" />
                        <a href={folderAsset.fileType} download>
                          Download
                        </a>
                      </li>
                    )}
                    {folderAsset.categorieType === "OnlineImage" && (
                      <li className="flex text-sm items-center">
                        <FiDownload className="mr-2 text-lg" />
                        <a href={folderAsset.fileType} download>
                          Download
                        </a>
                      </li>
                    )}

                    {folderAsset.categorieType === "OnlineVideo" && (
                      <li className="flex text-sm items-center">
                        <FiDownload className="mr-2 text-lg" />
                        <a href={folderAsset.fileType} download>
                          Download
                        </a>
                      </li>
                    )}
                    {folderAsset.categorieType === "DOC" && (
                      <li className="flex text-sm items-center">
                        <FiDownload className="mr-2 text-lg" />
                        <a href={folderAsset.fileType} download>
                          Download
                        </a>
                      </li>
                    )}
                    
                    <li>
                      <button
                        onClick={() => handelDeletedata(folderAsset.id)}
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
