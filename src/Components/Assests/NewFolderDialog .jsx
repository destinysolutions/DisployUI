import React,{ useState , useEffect }  from 'react'
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { RiDeleteBin5Line, RiGalleryFill } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import { FiDownload, FiUpload } from 'react-icons/fi';
import { MdPlaylistPlay } from 'react-icons/md';
import axios from "axios";
import {ALL_FILES_UPLOAD,GET_ALL_FILES} from "../../Pages/Api";
import { useSearchParams } from 'react-router-dom';
const NewFolderDialog = ({ folderId, onClose, onCreate, selectedData }) => {
  const [folderName, setFolderName] = useState('New Folder');
  const [searchParams] = useSearchParams();
  
  const getScheduleId = searchParams.get("folderId");
  console.log(getScheduleId,'getScheduleId');
  const handleCreateFolder = () => {
    // Perform folder creation logic here
    onCreate(folderName);
    onClose();
  };
  console.log("selectedData:", selectedData);
 
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


    /*API */

  // Check if selectedData is defined and not an empty array
  if (!selectedData || selectedData.length === 0) {
    return (
      <div>
        <div className="">
          <div className="lg:px-5 md:px-5 sm:px-3 xs:px-2 py-7 rounded-2xl">
            <div className="dialog">
              <h2>Create New Folder</h2>
              <p>No data selected.</p>
              <button onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div>
      <div className="">
        <div className=" lg:px-5 md:px-5 sm:px-3 xs:px-2 py-7 rounded-2xl">
          <div className="dialog text-white">
          
          {folderId}
            <div>
              <ul className="page-content grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-8 mb-5 assets-section">
              {selectedData.map((item, index) => (
                <li key={index} className='bg-white py-5 px-4 rounded-3xl assetsbox relative list-none'>
                {item.categorieType === "Image" && (
                  <img src={item.fileType} alt={item.name} className='mx-auto mb-2'/>
                )}

                {item.categorieType === "OnlineImage" && (
                  <img
                    src={item.fileType}
                    alt={item.name}
                    className={`imagebox relative ${
                      selectedItems.includes(item)
                        ? "active opacity-1 w-full rounded-2xl"
                        : "opacity-1 w-full rounded-2xl"
                    }`}
                  />
                )}

                {item.categorieType === "OnlineVideo" && (
                  <video
                    controls
                    className="w-full rounded-2xl relative "
                  >
                    <source src={item.fileType} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}

                {item.categorieType === "Video" && (
                  <video
                    controls
                    className="w-full rounded-2xl relative "
                  >
                    <source src={item.fileType} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}

                <div
                className="tabicon text-center absolute left-2/4 bottom-[0px] z-10"
                onMouseEnter={() => setHoveredTabIcon(item)}
                onMouseLeave={() => setHoveredTabIcon(null)}
                onClick={() => handleIconClick(item)}
              >
                {item.categorieType === "Image" && (
                  <RiGalleryFill className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                )}

                {item.categorieType === "Video" && (
                  <HiOutlineVideoCamera className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                )}

                {item.categorieType === "OnlineImage" && (
                  <RiGalleryFill className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                )}
        
                {item.categorieType === "OnlineVideo" && (
                  <HiOutlineVideoCamera className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                )}
              </div>

                {hoveredTabIcon === item && (
                  <div className="vdetails left-0 top-0">
                    <div className="flex justify-end">
                      <div className="storage mb-1">
                        {/* <span className="bg-white text-primary rounded-sm p-1 text-sm">
                          {item.fileSize}
                        </span> */}
                      </div>
                    </div>
                    <div className="text-center clickdetail">
                      <h3 className="lg:text-base md:text-sm sm:text-sm xs:text-xs  mb-1">
                        {item.name}
                      </h3>
                      {/*<p className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                        {item.details}
                      </p> */}
                      <h6 className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light">
                        {item.createdDate}
                      </h6>
                      <span className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                        {item.categorieType}
                      </span>
                      <span>,</span>
                      <h6 className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                        {item.fileSize}
                      </h6>

                      <span className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                        {item.resolutions}
                      </span>
                    </div>
                  </div>
                )}

                <div className="checkbox flex justify-between absolute top-5 px-2 left-0 w-full">
                <input
                  type="checkbox"
                  className="w-[20px] h-[20px]"
                  checked={selectAll || selectedItems.includes(item)}
                  onChange={() => handleCheckboxChange(item)}
                />
                <button onClick={() => updateassetsdw(item)}>
                  <BsThreeDots className="text-2xl text-SlateBlue" />
                </button>
                {assetsdw === item && selectedItems.includes(item) && (
                  <div className="assetsdw text-primary">
                    <ul>
                      <li className="flex text-sm items-center">
                        <FiUpload className="mr-2 text-lg" />
                        Set to Screen
                      </li>
                      <li className="flex text-sm items-center">
                        <MdPlaylistPlay className="mr-2 text-lg" />
                        Add to Playlist
                      </li>
                      {item.categorieType === "Image" && (
                        <li className="flex text-sm items-center">
                          <FiDownload className="mr-2 text-lg" />
                          <a href={item.fileType} download>
                            Download
                          </a>
                        </li>
                      )}

                      {item.categorieType === "Video" && (
                        <li className="flex text-sm items-center">
                          <FiDownload className="mr-2 text-lg" />
                          <a href={item.fileType} download>
                            Download
                          </a>
                        </li>
                      )}
                      {item.categorieType === "OnlineImage" && (
                        <li className="flex text-sm items-center">
                          <FiDownload className="mr-2 text-lg" />
                          <a href={item.fileType} download>
                            Download
                          </a>
                        </li>
                      )}

                      {item.categorieType === "OnlineVideo" && (
                        <li className="flex text-sm items-center">
                          <FiDownload className="mr-2 text-lg" />
                          <a href={item.fileType} download>
                            Download
                          </a>
                        </li>
                      )}
                      {item.categorieType === "DOC" && (
                        <li className="flex text-sm items-center">
                          <FiDownload className="mr-2 text-lg" />
                          <a href={item.fileType} download>
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
                 
                </li>
              ))}
            </ul>
            </div>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFolderDialog;
