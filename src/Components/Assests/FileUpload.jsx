import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

import { FaUnsplash } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";
import "../../Styles/assest.css";
import { AiFillFile } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { IoMdRefresh } from "react-icons/io";
import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { BiError } from "react-icons/bi";
import PropTypes from "prop-types";
import Footer from "../Footer";
import { useRef } from "react";
import axios from "axios";
import { ALL_FILES_UPLOAD } from "../../Pages/Api";
import Unsplash from "./Unsplash";
import OneDrive from "./OneDrive";
import Pexels from "./Pexels";
import { SiPexels } from "react-icons/si";
import DropboxUpload from "./DropboxUpload";
import GoogleDrive from "./GoogleDrive";
import Camera from "./Camera";
import VideoRecorder from "./VideoRecorder";

import Pixabay from "./Pixabay";
import { Tooltip } from "@material-tailwind/react";
import cameraimg from "../../../public/Assets/photography.png";
import videoimg from "../../../public/Assets/camera.png";
import pixabayimg from "../../../public/Assets/pixabay.png";
import { useNavigate } from "react-router-dom";
import { AiOutlineCloseCircle } from "react-icons/ai";
{
  /* end of video*/
}
const FileUpload = ({ sidebarOpen, setSidebarOpen, onUpload }) => {
  FileUpload.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const [browseFiles, setbrowseFiles] = useState(false);
  const [fileSuccessModal, setfileSuccessModal] = useState(false);
  const [fileErrorModal, setfileErrorModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  {
    /* google drive */
  }

  {
    /*camera */
  }

  // file drag and drop our system

  const wrapperRef = useRef(null);

  const [fileList, setFileList] = useState([]);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      const updatedList = [...fileList, newFile];
      setFileList(updatedList);
    }
  };

  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
  };
  // file upload

  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadFiles(files);
  };

  const uploadData = async () => {
    if (uploadFiles.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    setUploading(true);
    setUploadSuccess(false);
    setUploadProgress(0);

    try {
      const uploadPromises = uploadFiles.map(async (file) => {
        const CategorieType = getContentType(file.type);
        const details = "Some Details about the file";
        const formData = new FormData();
        formData.append("File", file);
        formData.append("operation", "Insert");
        formData.append("CategorieType", CategorieType);
        formData.append("details", details);

        const response = await axios.post(ALL_FILES_UPLOAD, formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
          },
        });

        if (response.status === 200) {
          console.log(`File ${file.name} uploaded successfully.`);
          navigate("/assets");
        } else {
          console.error(`Upload failed for file ${file.name}`);
        }
      });

      await Promise.all(uploadPromises);
      setUploadSuccess(true);
    } catch (error) {
      console.error("An error occurred during upload:", error);
    } finally {
      setUploading(false);
    }
  };

  const getFileType = (fileName, mimeType) => {
    const extension = fileName.split(".").pop().toLowerCase();

    if (extension === "jpg" || extension === "jpeg" || extension === "png") {
      return "Image";
    } else if (
      extension === "mp4" ||
      extension === "avi" ||
      extension === "mov"
    ) {
      return "Video";
    } else if (
      mimeType &&
      (mimeType.startsWith("application/pdf") ||
        mimeType.startsWith("text/") ||
        mimeType === "application/msword" ||
        mimeType === "application/vnd.ms-excel" ||
        mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      return "DOC";
    } else {
      return "file type not found"; // You can set a default value or handle other file types as needed
    }
  };
  // Function to extract content type from the MIME type
  const getContentType = (mime) => {
    if (mime.startsWith("image/")) {
      return "Image";
    } else if (mime.startsWith("video/")) {
      return "Video";
    } else if (
      mime &&
      (mime.startsWith("application/pdf") ||
        mime.startsWith("text/") ||
        mime === "application/msword" ||
        mime === "application/vnd.ms-excel" ||
        mime ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      return "DOC";
    } else {
      return "file content type not found";
    }
  };



  // unsplash code
  const [showUnsplash, setShowUnsplash] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  // Function to toggle the Unsplash modal
  const handleUnsplashButtonClick = () => {
    setShowUnsplash(true);
  };

  const handleSelectedImages = (selectedImages) => {
    setUploadedImages(selectedImages); // Update uploaded images
  };

  // Function to close the Unsplash modal
  const handleCloseModal = () => {
    setShowUnsplash(false);
  };

  // start pexels code
  const [showpexels, setShowpexels] = useState(false);

  const handlePexelsButtonClick = () => {
    setShowpexels((prev) => !prev);
  };
  const handleClosePexelsModal = () => {
    setShowpexels(false);
  };
  // End pexels code
  // Start pexabay code
  const [showPexabay, setShowPexabay] = useState(false);

  const handlePexabaysButtonClick = () => {
    setShowPexabay((prev) => !prev);
  };
  const handleClosePexabaysModal = () => {
    setShowPexabay(false);
  };

  // End pexabay code

  // start Camera
  const [showCamera, setShowCamera] = useState(false);
  const [savedImages, setSavedImages] = useState([]);
  const openCameraModal = () => {
    setShowCamera(true);
  };
  const closeCameraModal = () => {
    setShowCamera(false);
  };

  const handleImageUpload = (newSavedImages) => {
    setSavedImages(newSavedImages);
  };

  // End Camera
  // start video
  const [showVideo, setShowVideo] = useState(false);
  const openVideoModal = () => {
    setShowVideo(true);
  };
  const closeVideoModal = () => {
    setShowVideo(false);
  };

  const handleDownloadVideo = (videoBlob) => {
    const url = URL.createObjectURL(videoBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recorded-video.webm";
    a.click();
  };
  const [recordedVideos, setRecordedVideos] = useState([]);
  const handleVideoRecorded = (blob) => {
    setRecordedVideos((prevVideos) => [...prevVideos, blob]);
  };

  // end video

  // image upload Msg
  useEffect(() => {
    if (uploadProgress === 100) {
      setUploadSuccess(true);
      setShowPopup(true);
    }
  }, [uploadProgress]);
  const handleCancelUpload = () => {
    setUploadProgress(0);
    setUploadSuccess(false);
    setShowPopup(false);
    setUploading(false); // Reset uploading status
  };
  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5">
        <div className={`${sidebarOpen ? "ml-52" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between md:justify-between sm:justify-between sm:flex flex-wrap items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4">
              Media Upload
            </h1>
            <div className="lg:flex md:flex sm:block">
              <Link to="/assets">
                <button className="flex align-middle border-primary items-center border rounded-full lg:px-8 md:px-8 sm:px-4 xs:px-4 py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                  Cancel
                </button>
              </Link>
            </div>
          </div>
          <div className="flex lg:justify-between md:justify-between flex-wrap sm:justify-start xs:justify-start items-center lg:mt-7 md:mt-7 sm:mt-5 xs:mt-5 media-icon">
            <span>
              <DropboxUpload />

              {/*dropbox*/}
            </span>
            <span>
              <GoogleDrive />
            </span>{" "}
            {/*Google drive*/}
            <span className="fileUploadIcon">
              <OneDrive />
            </span>{" "}
            {/*onedrive*/}
            <span className="bg-white py-5 px-3 rounded-[45px] fileUploadIcon">
              <Tooltip
                content="Box Cloud"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-6"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button>
                  <svg
                    width="40px"
                    viewBox="0 0 34 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.2427 5.68909C17.067 5.68911 15.9136 6.00936 14.9061 6.61548C13.8987 7.22159 13.0754 8.09066 12.5247 9.12937C12.0869 8.30318 11.4752 7.58169 10.7318 7.01456C9.98839 6.44744 9.13091 6.04817 8.2184 5.84423C7.30588 5.64029 6.36001 5.63653 5.4459 5.83321C4.5318 6.02989 3.67117 6.42234 2.92329 6.98354V1.53076C2.91228 1.19461 2.771 0.875905 2.52932 0.642008C2.28763 0.40811 1.96448 0.277344 1.62815 0.277344C1.29181 0.277344 0.968659 0.40811 0.726976 0.642008C0.485293 0.875905 0.344017 1.19461 0.333008 1.53076V12.2696H0.335785C0.35944 13.705 0.859592 15.0917 1.75756 16.2116C2.65552 17.3316 3.90034 18.1213 5.29617 18.4564C6.69201 18.7915 8.15965 18.6531 9.4682 18.0629C10.7768 17.4726 11.852 16.4642 12.5247 15.196C13.0619 16.2081 13.8582 17.0594 14.8322 17.6629C15.8062 18.2664 16.9229 18.6006 18.0683 18.6312C19.2137 18.6619 20.3467 18.3879 21.3516 17.8372C22.3564 17.2866 23.1971 16.4791 23.7876 15.4972C24.3782 14.5153 24.6975 13.3942 24.713 12.2485C24.7284 11.1028 24.4394 9.97354 23.8755 8.97609C23.3116 7.97864 22.493 7.14877 21.5034 6.57127C20.5138 5.99377 19.3885 5.68934 18.2427 5.68909ZM6.80662 16.046C5.7767 16.046 4.78895 15.6369 4.06069 14.9086C3.33242 14.1804 2.92329 13.1926 2.92329 12.1627C2.92329 11.1328 3.33242 10.145 4.06069 9.41677C4.78895 8.68851 5.7767 8.27937 6.80662 8.27937C7.83654 8.27937 8.82428 8.68851 9.55255 9.41677C10.2808 10.145 10.69 11.1328 10.69 12.1627C10.69 13.1926 10.2808 14.1804 9.55255 14.9086C8.82428 15.6369 7.83654 16.046 6.80662 16.046ZM18.2427 16.046C17.213 16.046 16.2254 15.637 15.4973 14.9088C14.7692 14.1807 14.3601 13.1931 14.3601 12.1634C14.3601 11.1337 14.7692 10.1461 15.4973 9.41796C16.2254 8.68982 17.213 8.28076 18.2427 8.28076C19.2723 8.28076 20.2597 8.68975 20.9877 9.41776C21.7157 10.1458 22.1247 11.1331 22.1247 12.1627C22.1247 13.1923 21.7157 14.1796 20.9877 14.9077C20.2597 15.6357 19.2723 16.046 18.2427 16.046ZM33.4233 16.5988C33.611 16.8742 33.6854 17.2114 33.631 17.5402C33.5766 17.869 33.3976 18.1642 33.1311 18.3645C32.8647 18.5648 32.5314 18.6547 32.2004 18.6155C31.8694 18.5764 31.5662 18.4112 31.3538 18.1544L28.4913 14.3294L25.6302 18.1544C25.424 18.429 25.117 18.6104 24.777 18.6587C24.437 18.707 24.0916 18.6183 23.817 18.412C23.5424 18.2057 23.361 17.8988 23.3127 17.5588C23.2644 17.2187 23.3531 16.8734 23.5594 16.5988L26.8733 12.1683L23.558 7.73632C23.3517 7.46171 23.263 7.1164 23.3113 6.77636C23.3596 6.43632 23.541 6.1294 23.8156 5.92312C24.0903 5.71684 24.4356 5.6281 24.7756 5.67641C25.1156 5.72473 25.4226 5.90615 25.6288 6.18076L28.49 10.0058L31.3511 6.18076C31.5573 5.90633 31.8656 5.72509 32.2055 5.67691C32.5454 5.62872 32.8905 5.71754 33.165 5.92382C33.4394 6.13009 33.6206 6.43694 33.6688 6.77685C33.717 7.11676 33.6282 7.46189 33.4219 7.73632H33.4233L30.108 12.1669L33.4233 16.5988Z"
                      fill="#2486fc"
                    />
                  </svg>
                </button>
              </Tooltip>
            </span>
            {/* start Camera */}
            <span className="fileUploadIcon" data-tip="Camera">
              <Tooltip
                content="Camera"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button onClick={openCameraModal} className="relative">
                  <img src={cameraimg} className="w-9 relative" />
                </button>
              </Tooltip>
              {showCamera && (
                <Camera
                  onImageUpload={handleImageUpload}
                  closeModal={closeCameraModal}
                />
              )}
            </span>
            {/* End Camera */}
            {/* start Video */}
            <span className="fileUploadIcon">
              <Tooltip
                content="Video"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-3"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button onClick={openVideoModal} className="relative">
                  <img src={videoimg} className="w-9 relative" />
                </button>
              </Tooltip>

              {showVideo && (
                <VideoRecorder
                  closeModal={closeVideoModal}
                  onDownloadVideo={handleDownloadVideo}
                  onVideoRecorded={handleVideoRecorded}
                />
              )}
            </span>
            {/* End Video*/}
            {/* start unspalsh */}
            <span className="fileUploadIcon">
              <Tooltip
                content="Unsplash"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-7"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button
                  onClick={handleUnsplashButtonClick}
                  className="relative"
                >
                  <FaUnsplash size={30} className="relative" />
                </button>
              </Tooltip>
              {showUnsplash && (
                <Unsplash
                  closeModal={handleCloseModal}
                  onSelectedImages={handleSelectedImages}
                />
              )}
            </span>
            {/* end unspalsh */}
            {/* start pixels */}
            <span className="bg-white  px-3 leading-none  rounded-[45px] fileUploadIcon">
              <Tooltip
                content="Pexels"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button
                  onClick={handlePexelsButtonClick}
                  className="relative text-[#07a081]"
                >
                  <SiPexels size={30} className="relative" />
                </button>
              </Tooltip>
              {showpexels && <Pexels closeModal={handleClosePexelsModal} />}
            </span>
            {/* end pixels */}
            {/* start pixabay */}
            <span className="bg-white text-SlateBlue px-3 leading-none  rounded-[45px] fileUploadIcon relative">
              <Tooltip
                content="Pixabay"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button
                  onClick={handlePexabaysButtonClick}
                  className="relative"
                >
                  <img src={pixabayimg} className="relative w-9" />
                </button>
              </Tooltip>
              {showPexabay && <Pixabay closeModal={handleClosePexabaysModal} />}
              {/* end pixabay */}
            </span>
          </div>
          <div className="flex w-full flex-col gap-4"></div>
          <div
            ref={wrapperRef}
            className="drop-file-input"
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className="relative">
              <div className=" relative flex flex-col items-center justify-center min-h-full lg:py-40 md:py-32 sm:py-32 xs:pb-32 xs:pt-14 px-2  bg-lightgray lg:mt-14 md:mt-14 sm:mt-5 xs:mt-5  border-2 rounded-[20px] border-SlateBlue border-dashed">
                <FiUploadCloud className="text-SlateBlue md:mb-7 sm:mb-3 xs:mb-2 lg:text-[150px] md:text-[100px] sm:text-[80px] xs:text-[45px]" />
                <input
                  type="file"
                  className=" absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                  name="uploadfile"
                  onChange={onFileChange}
                />
                <span className="text-SlateBlue text-center">
                  Select Files to Upload
                </span>
                <p className="text-sm font-normal text-center">
                  Drop your first video, photo or document here
                </p>
              </div>

              <div className=" absolute bottom-20 left-1/2 -translate-x-2/4">
                <button
                  className="bg-SlateBlue text-white px-7 py-2 rounded mt-4 z-10"
                  onClick={uploadData}
                  disabled={uploading}

                >
                  Upload
                </button>
              </div>
            </div>
          </div>

          <div className="progressbar-popup  bg-white shadow-2xl">
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="flex justify-between items-center bg-white w-96 p-10">
                <div>
                  <h1>Uploading... </h1> {uploadProgress}%
                  <progress
                    value={uploadProgress}
                    max={100}
                    className="w-full custom-progress"
                  />
                </div>
                <div>
                  {uploading && (
                    <button onClick={handleCancelUpload}>
                      <AiOutlineCloseCircle />
                    </button>
                  )}
                </div>
              </div>
            )}
            {showPopup && (
              <div className="popup">
                <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                  <div className="relative w-full max-w-xl max-h-full">
                    <div className="relative bg-white rounded-lg shadow">
                      <div className="p-6 text-center">
                        <FiCheckCircle className="mx-auto mb-4 text-[#20AE5C] w-14 h-14" />
                        <h3 className="mb-5 text-2xl font-bold text-[#20AE5C]">
                          {uploadSuccess
                            ? "Upload successful!"
                            : "Upload failed!"}
                        </h3>
                        <p>Thank you for your request.</p>
                        <p>
                          We are working hard to find the best service and deals
                          for you.
                        </p>
                        <p className="mb-7 text-[#9892A6] mt-1">
                          Kindly check your media gallery for confirmation.
                        </p>
                        <Link to="/assets">
                          <button className="text-white bg-[#20AE5C] rounded text-lg font-bold px-7 py-2.5">
                            Continue
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {fileList.length > 0 ? (
            <div className="drop-file-preview">
              <p className="drop-file-preview__title">Ready to upload</p>
              {fileList.map((item, index) => (
                <div key={index} className="drop-file-preview__item">
                  <div className="drop-file-preview__item__info">
                    <p>{item.name}</p>
                    <p>{item.size}B</p>
                  </div>
                  <span
                    className="drop-file-preview__item__del"
                    onClick={() => fileRemove(item)}
                  >
                    x
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          {selectedFiles.length > 0 && (
            <div className="mt-10">
              {/* Loop through the selected files and display them */}
              {selectedFiles.map((file) => (
                <div key={file.id} className="p-3 bg-white flex items-center">
                  {/* Display the file details here */}
                  <span>{file.name}</span>
                  {/* Additional file information */}
                </div>
              ))}
            </div>
          )}

          {/* End of  Dropbox*/}
          {/* ... start camera */}

          {/* end of camera */}
          {/* ... start Video*/}
          <div>
            {recordedVideos.map((blob, index) => (
              <div key={index}>
                <video
                  controls
                  src={URL.createObjectURL(blob)}
                  className="max-w-[20%]"
                />
              </div>
            ))}
          </div>
          {/* ... end camera */}

          {browseFiles && (
            <>
              <div className="mt-10">
                <div className="p-3 bg-white flex items-center">
                  <span>
                    <AiFillFile className="text-[#AC96E4] text-4xl bg-[#E9E3F7] p-2 rounded-sm" />
                  </span>
                  <div className="flex flex-col ml-4 w-full">
                    <div className="flex justify-between">
                      <div>
                        <h6 className="text-sm">Scann_158.pdf</h6>
                        <span className="text-sm">30 MB / 74 MB</span>
                      </div>
                      <div>
                        <RxCross2 className="text-SlateBlue" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <progress
                        className="progress-continue"
                        max={100}
                        value={46}
                      />
                      <span className="ml-3 text-[#9892A6]">46%</span>
                    </div>
                  </div>
                </div>
                <div
                  className="p-3 bg-white flex items-center mt-5"
                  onClick={() => setfileSuccessModal(true)}
                >
                  <span>
                    <AiFillFile className="text-[#73B172] text-4xl bg-[#DAF2D9] p-2 rounded-sm" />
                  </span>
                  <div className="flex flex-col ml-4 w-full">
                    <h6 className="text-sm">Scann_158.pdf</h6>
                    <span className="text-sm">30 MB / 74 MB</span>
                    <div className="flex justify-between items-center mt-2">
                      <progress
                        className="progress-success"
                        max={100}
                        value={100}
                      />
                      <span className="ml-3 text-[#309B2E]">100%</span>
                    </div>
                    <button></button>
                  </div>
                </div>

                <div
                  className="p-3 bg-white flex items-center my-5"
                  onClick={() => setfileErrorModal(true)}
                >
                  <span>
                    <AiFillFile className="text-[#E36363] text-4xl bg-[#F2D9D9] p-2 rounded-sm" />
                  </span>
                  <div className="flex flex-col ml-4 w-full">
                    <div className="flex justify-between">
                      <div>
                        <h6 className="text-sm">Scann_158.pdf</h6>
                        <span className="text-sm">30 MB / 74 MB</span>
                      </div>
                      <div>
                        <IoMdRefresh className="text-SlateBlue" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <progress className="progress-error" max={100} />
                      <span className="ml-3 text-[#E36363]">error</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {fileSuccessModal ? (
            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-full max-w-xl max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                  <div className="p-6 text-center">
                    <FiCheckCircle className="mx-auto mb-4 text-[#20AE5C] w-14 h-14" />
                    <h3 className="mb-5 text-2xl font-bold text-[#20AE5C]">
                      SUCCESS!
                    </h3>
                    <p>Thank you for your request.</p>
                    <p>
                      We are working hard to find the best service and deals for
                      you.
                    </p>
                    <p className="mb-7 text-[#9892A6] mt-1">
                      Kindly check your media gallery for confirmation.
                    </p>
                    <Link to="/assets">
                      <button className="text-white bg-[#20AE5C] rounded text-lg font-bold px-7 py-2.5">
                        Continue
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {fileErrorModal ? (
            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-full max-w-xl max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                  <div className="p-6 text-center">
                    <BiError className="mx-auto mb-4 text-[#F21E1E] w-14 h-14" />
                    <h3 className="mb-5 text-2xl font-bold text-[#F21E1E]">
                      ERROR!
                    </h3>
                    <p>Thank you for your request.</p>
                    <p>We are unable to continue the process.</p>
                    <p className="mb-7 text-[#9892A6] mt-1">
                      Please try again to complete the request.
                    </p>
                    <button
                      className="text-white bg-[#F21E1E] rounded text-lg font-bold px-7 py-2.5"
                      onClick={() => setfileErrorModal(false)}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FileUpload;
