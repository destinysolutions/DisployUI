import { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { AiOutlineDropbox } from "react-icons/ai";
import { RiDriveFill } from "react-icons/ri";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";
import { AiOutlineVideoCamera } from "react-icons/ai";
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
import useDrivePicker from "react-google-drive-picker";

import { useRef } from "react";
import { useEffect } from "react";
import Video from "./Video";
import Axios from "axios";
import { insert } from "formik";
import DropboxChooser from "react-dropbox-chooser";
import axios from "axios";
import { ALL_FILES_UPLOAD } from "../../Pages/Api";

{
  /* end of video*/
}
const FileUpload = ({ sidebarOpen, setSidebarOpen, props }) => {
  FileUpload.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const [browseFiles, setbrowseFiles] = useState(false);
  const [fileSuccessModal, setfileSuccessModal] = useState(false);
  const [fileErrorModal, setfileErrorModal] = useState(false);

  {
    /* google drive */
  }
  const [openPicker, authResponse] = useDrivePicker();
  const [selectedFiles, setSelectedFiles] = useState([]);
  {
    /*file selected*/
  }

  const handleOpenPicker = () => {
    openPicker({
      clientId:
        "1020941750014-qfinh8b437r6lvvt3rb7m24phf3v6vdi.apps.googleusercontent.com", // Your client ID
      developerKey: "AIzaSyD518eOQPOtFuzqw9-97zhAdDCmZcpt42U", // Your developer key
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        } else if (data.action === "picked") {
          console.log("Selected Files:", data.docs);
          setSelectedFiles(data.docs); // Update the state with the selected files
        }
      },
    });
  };

  const clientId =
    "1020941750014-qfinh8b437r6lvvt3rb7m24phf3v6vdi.apps.googleusercontent.com";

  const handleLoginSuccess = (response) => {
    // Access the user's access_token here
    const accessToken = response.accessToken;
    console.log("Access Token:", accessToken);

    // Now, you can use the accessToken to access the user's Google Drive.
    // You can use the Google Drive API or any other library to interact with the Drive.
  };

  const handleLoginFailure = (error) => {
    console.log("Login Failed:", error);
  };

  {
    /*dropbox */
  }
  const [dburl, setdburl] = useState("");
  const DbAppKey = "bsoy3tjwi8cyssi";
  function handleSuccess(files) {
    setdburl(files[0].thumbnailLink);
    console.log(url);
  }
  {
    /*camera */
  }
  const [facingMode, setFacingMode] = useState("environment"); // 'environment' refers to the back-side camera
  const [isRecording, setIsRecording] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [capturedVideo, setCapturedVideo] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // Use canvasRef to capture photos

  const getUserCamera = () => {
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      const constraints = {
        video: {
          facingMode: facingMode, // Use the selected facing mode
        },
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          let video = videoRef.current;
          video.srcObject = stream;
          video.play();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log("getUserMedia is not supported");
    }
  };

  useEffect(() => {
    getUserCamera();
    return () => {
      // Clean up the video stream when the component is unmounted
      const stream = videoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const toggleFacingMode = () => {
    // Switch between 'user' (front) and 'environment' (back) facing modes
    setFacingMode((prevFacingMode) =>
      prevFacingMode === "user" ? "environment" : "user"
    );
  };

  const startRecording = () => {
    // Handle video recording (same as in previous code)
  };

  const stopRecording = () => {
    // Handle video recording (same as in previous code)
  };

  const takePicture = () => {
    let photo = canvasRef.current;
    let video = videoRef.current;
    const width = video.videoWidth;
    const height = video.videoHeight;
    photo.width = width;
    photo.height = height;
    let ctx = photo.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = photo.toDataURL();
    setCapturedPhoto(dataUrl);
  };

  const clearImage = () => {
    setCapturedPhoto(null);
    setCapturedVideo(null);
    let photo = canvasRef.current;
    let ctx = photo.getContext("2d");
    ctx.clearRect(0, 0, photo.width, photo.height);
  };

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
  const [uploadFile, setUploadFile] = useState(null);
  const onFileChange = (e) => {
    const file = e.target.files[0];
    setUploadFile(file);
  };

  const postData = () => {
    if (!uploadFile) {
      console.log("Please select a file to upload.");
      return;
    }
    const details = "Some Details about the file";
    const CategorieType = getContentType(uploadFile.type);

    const formdata = new FormData();
    formdata.append("File", uploadFile);
    formdata.append("operation", "Insert");
    formdata.append("CategorieType", CategorieType);
    formdata.append("details", details);

    axios
      .post(ALL_FILES_UPLOAD, formdata)
      .then((res) => {
        console.log("Data uploaded successfully:", res.data);
      })
      .catch((err) => {
        console.error("Error uploading data:", err);
      });
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
  return (
    <>
      <div className="flex border-b border-gray py-3">
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
            <span
              className="fileUploadIcon dropbox-button"
              //   onClick={handleIconClick}
            >
              {
                <DropboxChooser
                  appKey={DbAppKey}
                  success={handleSuccess}
                  cancel={() => console.log("closed")}
                  multiselect={true}
                >
                  <AiOutlineDropbox size={30} />
                </DropboxChooser>
              }
            </span>
            <span className="fileUploadIcon" onClick={() => handleOpenPicker()}>
              <RiDriveFill size={30} />
            </span>
            <span
              className="fileUploadIcon"
              //   onClick={handleIconClick}
            >
              <FaCloudUploadAlt size={30} />
            </span>
            <span
              className="bg-[#D5E3FF] text-SlateBlue py-4 px-3 rounded-[45px] "
              //   onClick={handleIconClick}
            >
              <svg
                width="25"
                height="18"
                viewBox="0 0 34 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.2427 5.68909C17.067 5.68911 15.9136 6.00936 14.9061 6.61548C13.8987 7.22159 13.0754 8.09066 12.5247 9.12937C12.0869 8.30318 11.4752 7.58169 10.7318 7.01456C9.98839 6.44744 9.13091 6.04817 8.2184 5.84423C7.30588 5.64029 6.36001 5.63653 5.4459 5.83321C4.5318 6.02989 3.67117 6.42234 2.92329 6.98354V1.53076C2.91228 1.19461 2.771 0.875905 2.52932 0.642008C2.28763 0.40811 1.96448 0.277344 1.62815 0.277344C1.29181 0.277344 0.968659 0.40811 0.726976 0.642008C0.485293 0.875905 0.344017 1.19461 0.333008 1.53076V12.2696H0.335785C0.35944 13.705 0.859592 15.0917 1.75756 16.2116C2.65552 17.3316 3.90034 18.1213 5.29617 18.4564C6.69201 18.7915 8.15965 18.6531 9.4682 18.0629C10.7768 17.4726 11.852 16.4642 12.5247 15.196C13.0619 16.2081 13.8582 17.0594 14.8322 17.6629C15.8062 18.2664 16.9229 18.6006 18.0683 18.6312C19.2137 18.6619 20.3467 18.3879 21.3516 17.8372C22.3564 17.2866 23.1971 16.4791 23.7876 15.4972C24.3782 14.5153 24.6975 13.3942 24.713 12.2485C24.7284 11.1028 24.4394 9.97354 23.8755 8.97609C23.3116 7.97864 22.493 7.14877 21.5034 6.57127C20.5138 5.99377 19.3885 5.68934 18.2427 5.68909ZM6.80662 16.046C5.7767 16.046 4.78895 15.6369 4.06069 14.9086C3.33242 14.1804 2.92329 13.1926 2.92329 12.1627C2.92329 11.1328 3.33242 10.145 4.06069 9.41677C4.78895 8.68851 5.7767 8.27937 6.80662 8.27937C7.83654 8.27937 8.82428 8.68851 9.55255 9.41677C10.2808 10.145 10.69 11.1328 10.69 12.1627C10.69 13.1926 10.2808 14.1804 9.55255 14.9086C8.82428 15.6369 7.83654 16.046 6.80662 16.046ZM18.2427 16.046C17.213 16.046 16.2254 15.637 15.4973 14.9088C14.7692 14.1807 14.3601 13.1931 14.3601 12.1634C14.3601 11.1337 14.7692 10.1461 15.4973 9.41796C16.2254 8.68982 17.213 8.28076 18.2427 8.28076C19.2723 8.28076 20.2597 8.68975 20.9877 9.41776C21.7157 10.1458 22.1247 11.1331 22.1247 12.1627C22.1247 13.1923 21.7157 14.1796 20.9877 14.9077C20.2597 15.6357 19.2723 16.046 18.2427 16.046ZM33.4233 16.5988C33.611 16.8742 33.6854 17.2114 33.631 17.5402C33.5766 17.869 33.3976 18.1642 33.1311 18.3645C32.8647 18.5648 32.5314 18.6547 32.2004 18.6155C31.8694 18.5764 31.5662 18.4112 31.3538 18.1544L28.4913 14.3294L25.6302 18.1544C25.424 18.429 25.117 18.6104 24.777 18.6587C24.437 18.707 24.0916 18.6183 23.817 18.412C23.5424 18.2057 23.361 17.8988 23.3127 17.5588C23.2644 17.2187 23.3531 16.8734 23.5594 16.5988L26.8733 12.1683L23.558 7.73632C23.3517 7.46171 23.263 7.1164 23.3113 6.77636C23.3596 6.43632 23.541 6.1294 23.8156 5.92312C24.0903 5.71684 24.4356 5.6281 24.7756 5.67641C25.1156 5.72473 25.4226 5.90615 25.6288 6.18076L28.49 10.0058L31.3511 6.18076C31.5573 5.90633 31.8656 5.72509 32.2055 5.67691C32.5454 5.62872 32.8905 5.71754 33.165 5.92382C33.4394 6.13009 33.6206 6.43694 33.6688 6.77685C33.717 7.11676 33.6282 7.46189 33.4219 7.73632H33.4233L30.108 12.1669L33.4233 16.5988Z"
                  fill="#41479B"
                />
              </svg>
            </span>
            <span className="fileUploadIcon">
              <video ref={videoRef}></video>
              <FiCamera
                size={30}
                onClick={isRecording ? stopRecording : startRecording}
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />{" "}
              {/* Use hidden canvas for photo capture */}
              <button onClick={clearImage}>Clear</button>
              <button onClick={toggleFacingMode}>
                {facingMode === "user"
                  ? "Switch to Back Camera"
                  : "Switch to Front Camera"}
              </button>
              {capturedPhoto && <img src={capturedPhoto} alt="Captured" />}
              {capturedVideo && (
                <video controls>
                  <source
                    src={URL.createObjectURL(capturedVideo)}
                    type="video/mp4"
                  />
                </video>
              )}
            </span>

            <span className="fileUploadIcon">
              <Link to="/unplash">
                <FaUnsplash size={30} />
              </Link>
            </span>

            <span className="bg-[#D5E3FF] text-SlateBlue py-4 px-4 rounded-[45px]">
              <svg
                width="20"
                height="16"
                viewBox="0 0 22 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.2231 7.27754L18.9716 10.7953H22L17.5124 5.27165L21.6202 0H18.7718L16.2531 3.29611L13.9944 0H11.1259L14.9038 5.27165L10.7961 10.7953H13.7544L16.2231 7.27754ZM5.33522 0.00530449C3.82076 0.0433313 2.56243 0.567838 1.56008 1.57865C0.557742 2.58952 0.037693 3.85864 0 5.38591V15.1145H2.11978V10.7908H5.33522C6.85062 10.7517 8.11302 10.2232 9.12228 9.2054C10.1316 8.1875 10.6556 6.91443 10.6943 5.38609C10.6556 3.85876 10.1316 2.58969 9.12228 1.57883C8.11302 0.567958 6.85068 0.0433909 5.33522 0.00530449ZM2.11978 8.6527V5.38591C2.14214 4.4626 2.45472 3.697 3.0576 3.08893C3.66049 2.48092 4.41971 2.16568 5.33522 2.14315C6.2621 2.16568 7.0283 2.48092 7.63369 3.08893C8.23902 3.69694 8.55265 4.4626 8.57446 5.38591C8.55265 6.32073 8.23902 7.09336 7.63369 7.70394C7.0283 8.31451 6.2621 8.63076 5.33522 8.6527H2.11978Z"
                  fill="#41479B"
                />
              </svg>
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
            <div className=" relative flex flex-col items-center justify-center min-h-full lg:p-40 md:p-20 sm:p-10 xs:p-4 bg-[#E4E6FF] lg:mt-14 md:mt-14 sm:mt-5 xs:mt-5  border-2 rounded-[20px] border-SlateBlue border-dashed">
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
          </div>
          <button
            className="bg-SlateBlue text-white px-7 py-2 rounded mt-4"
            onClick={postData}
          >
            Browse
          </button>

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
          {/* Dropbox*/}
          <img src={dburl} />
          {/* End of  Dropbox*/}
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
// FileUpload.propTypes = {
//   onFileChange: PropTypes.func
// }
export default FileUpload;
