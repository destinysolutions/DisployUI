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


  // folder wise show asset
  const [folderData, setFolderData] = useState('');
  const [folderAsset, setFolderAsset] = useState([]);
  const loadEventsForSchedule = (folderId) => {
    axios.get(`${FetchdataFormFolder}?ID=${folderId}`).then((response) => {
      const fetchedData = response.data.data;
const assetList = fetchedData.map((item)=>item.asset)
      setFolderData(assetList);
      console.log(assetList, "fetchedData");
    });
  };

  useEffect(() => {
    if (folderId) {
      loadEventsForSchedule(folderId);
    }
  });


  const [assetData, setAssetData] = useState([]);

  const fetchData = () => {
    axios
      .get(GET_ALL_FILES)
      .then((response) => {
        const fetchedData = response.data;

        // Categorize data into separate arrays
        const allAssets = [
          ...(fetchedData.image ? fetchedData.image : []),
          ...(fetchedData.video ? fetchedData.video : []),
          ...(fetchedData.doc ? fetchedData.doc : []),
          ...(fetchedData.onlineimages ? fetchedData.onlineimages : []),
          ...(fetchedData.onlinevideo ? fetchedData.onlinevideo : []),
        ];

        // Update state with categorized data
        setAssetData(allAssets);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);
console.log(assetData,'assetData');
useEffect(() => {
  if (folderData.length > 0) {
    const matchingAssets = folderData.map((id) =>
      assetData.find((item) => item.id === id)
    );
    setFolderAsset(matchingAssets);
  } else {
    setFolderAsset([]); // Clear folderAssets if folderData is empty
  }
}, [folderData, assetData]);

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
                {folderAsset.map((folderAsset) => (
                  <div key={folderAsset.id}>
                  {folderAsset.categorieType === "OnlineImage" && (
                    <img
                      src={folderAsset.fileType}
                      alt={folderAsset.name}
                      className="imagebox relative"
                    />
                  )}
                  {folderAsset.categorieType === "OnlineVideo" && (
                    <video
                      controls
                      className="w-full rounded-2xl relative h-56"
                    >
                      <source
                        src={folderAsset.fileType}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {folderAsset.categorieType === "Image" && (
                    <img
                      src={folderAsset.fileType}
                      alt={folderAsset.name}
                      className="imagebox relative"
                    />
                  )}
                  {folderAsset.categorieType === "Video" && (
                    <video
                      controls
                      className="w-full rounded-2xl relative h-56"
                    >
                      <source
                        src={folderAsset.fileType}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {folderAsset.categorieType === "DOC" && (
                    <a
                      href={folderAsset.fileType}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {folderAsset.name}
                    </a>
                  )}
                  </div>
                ))}
           
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default NewFolderDialog;
