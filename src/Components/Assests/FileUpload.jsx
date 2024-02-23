import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { FaUnsplash } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";
import "../../Styles/assest.css";
import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { BiError } from "react-icons/bi";
import PropTypes from "prop-types";
import Footer from "../Footer";
import { useRef } from "react";
import axios from "axios";
import { ALL_FILES_UPLOAD } from "../../Pages/Api";
import Unsplash from "./Unsplash";
import Pexels from "./Pexels";
import { SiPexels } from "react-icons/si";
import Camera from "./Camera";
import VideoRecorder from "./VideoRecorder";
import Pixabay from "./Pixabay";
import cameraimg from "../../images/Assets/photography.png";
import videoimg from "../../images/Assets/camera.png";
import pixabayimg from "../../images/Assets/pixabay.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import OtherOptionsForAssets from "./OtherOptionsForAssets";
import {
  handelGetSessionToken,
  handleChangeSessionToken,
  handleNavigateFromComposition,
} from "../../Redux/globalStates";
import { useDispatch } from "react-redux";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
import { handelPostImageFromDrive } from "../../Redux/Assetslice";
import { handleGetStorageDetails } from "../../Redux/SettingSlice";
import ReactTooltip from "react-tooltip";
{
  /* end of video*/
}
const FileUpload = ({ sidebarOpen, setSidebarOpen, onUpload }) => {
  FileUpload.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const [fileSuccessModal, setfileSuccessModal] = useState(false);
  const [fileErrorModal, setfileErrorModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [overallUploadProgress, setOverallUploadProgress] = useState(0);
  const [showUnsplash, setShowUnsplash] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showpexels, setShowpexels] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [savedImages, setSavedImages] = useState([]);
  const [showPexabay, setShowPexabay] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [recordedVideos, setRecordedVideos] = useState([]);

  const { user, token } = useSelector((state) => state.root.auth);
  const { session_token_apideck } = useSelector(
    (state) => state.root.globalstates
  );
  const authToken = `Bearer ${token}`;

  const wrapperRef = useRef(null);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
  };

  const cameraModalRef = useRef(null);
  const videoModalRef = useRef(null);
  const pixabayModalRef = useRef(null);
  const unsplashModalRef = useRef(null);
  const pexelsModalRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFileChange = (event) => {
    const files = event.target.files;
    const newSelectedImages = [...selectedImages];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith("video");
      const isDocument =
        file.type.startsWith("application/pdf") ||
        file.type.startsWith("application/msword") ||
        file.type.startsWith(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );

      const item = {
        file,
        name: file.name,
        size: formatFileSize(file.size),
        isVideo,
        isDocument,
        preview: isVideo ? null : URL.createObjectURL(file),
        progress: 0, // Initialize progress for each image
      };

      newSelectedImages.push(item);
    }

    // Set the selected images to the updated array
    setSelectedImages(newSelectedImages);
    setUploadProgress([]); // Initialize progress state for each image
    setUploading(true); // Start uploading
  };

  useEffect(() => {
    // Call uploadData only when there are selected images
    if (selectedImages.length > 0) {
      uploadData();
    }
  }, [selectedImages]);
  // Function to format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const uploadData = async () => {
    try {
      // Initialize an overall progress variable
      let overallProgress = 0;
      let arr = [];
      // Create an array to hold all the promises for image uploads
      const uploadPromises = selectedImages.map(async (image, index) => {
        const CategorieType = getContentType(image.file.type);

        const formData = new FormData();
        formData.append("File", image.file);
        formData.append("Operation", "Insert");
        formData.append("AssetType", CategorieType);
        formData.append("IsActive", "true");
        formData.append("IsDelete", "false");
        formData.append("FolderID", "0");

        const response = dispatch(handleGetStorageDetails({ token }));
        response.then(async (res) => {
          if (res?.payload?.data?.usedInPercentage == 100) {
            // setUploadInProgress(false);
            return;
          } else {
            try {
              const response = await axios.post(ALL_FILES_UPLOAD, formData, {
                headers: {
                  Authorization: authToken,
                  "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                  const progress = Math.round(
                    (progressEvent.loaded / progressEvent.total) * 100
                  );

                  // Update the progress of the corresponding image
                  selectedImages[index].progress = progress;

                  // Calculate overall progress
                  overallProgress =
                    ((index + 1) / selectedImages.length) * 100 +
                    progress / selectedImages.length;

                  // Update the overall progress state
                  setOverallUploadProgress(overallProgress);

                  // Update the progress state for this image
                  const updatedProgress = [...uploadProgress];
                  updatedProgress[index] = progress;
                  setUploadProgress(updatedProgress);
                },
              });
              arr.push(response);
              // if (response.status === 200) {
              //   toast.success(`File ${image.name} uploaded successfully.`);
              // } else {
              //   toast.error(`Upload failed for file ${image.name}`);
              // }
              if (
                selectedImages?.length === arr?.length &&
                response.status === 200
              ) {
                toast.success(`File uploaded successfully.`);
                if (window.history.length == 1) {
                  dispatch(handleNavigateFromComposition());
                  localStorage.setItem("isWindowClosed", "true");
                  window.close();
                } else {
                  navigate(-1);
                }
              }
            } catch (error) {
              toast.error(`Uploaded File Not Supported`);
              console.error(`Upload failed for file ${image.name}:`, error);
              handleCancel();
            }
          }
        });
      });
      // Use Promise.all to execute all uploads concurrently
      await Promise.all(uploadPromises);
      // Once all files are uploaded, navigate to the desired location
      // navigate(-1);
    } catch (error) {
      console.error("An error occurred during upload:", error);
    } finally {
      setUploading(false); // Mark the upload as finished
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
        mime ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        mime ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        mime ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      return "DOC";
    } else {
      return "file content type not found";
    }
  };
  // unsplash code

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

  const handlePexelsButtonClick = () => {
    setShowpexels((prev) => !prev);
  };

  const handleClosePexelsModal = () => {
    setShowpexels(false);
  };
  // End pexels code
  // Start pexabay code

  const handlePexabaysButtonClick = () => {
    setShowPexabay((prev) => !prev);
  };
  const handleClosePexabaysModal = () => {
    setShowPexabay(false);
  };

  // End pexabay code

  // start Camera

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

  const handleVideoRecorded = (blob) => {
    setRecordedVideos((prevVideos) => [...prevVideos, blob]);
  };

  // end video

  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (
        cameraModalRef.current &&
        !cameraModalRef.current.contains(event?.target) &&
        showCamera
      ) {
        setShowCamera(false);
      } else if (
        videoModalRef.current &&
        !videoModalRef.current.contains(event?.target) &&
        showVideo
      ) {
        setShowVideo(false);
      } else if (
        pixabayModalRef.current &&
        !pixabayModalRef.current.contains(event?.target) &&
        showPexabay
      ) {
        setShowPexabay(false);
      } else if (
        pexelsModalRef.current &&
        !pexelsModalRef.current.contains(event?.target) &&
        showpexels
      ) {
        setShowpexels(false);
      } else if (
        unsplashModalRef.current &&
        !unsplashModalRef.current.contains(event?.target) &&
        showUnsplash
      ) {
        setShowUnsplash(false);
      }
    };
    document.addEventListener("click", handleClickOutsideModal, true);
    return () => {
      document.removeEventListener("click", handleClickOutsideModal, true);
    };
  }, [handleClickOutsideModal]);

  function handleClickOutsideModal() {
    if (showCamera) {
      setShowCamera(false);
    } else if (showVideo) {
      setShowVideo(false);
    } else if (showPexabay) {
      setShowPexabay(false);
    } else if (showpexels) {
      setShowpexels(false);
    } else if (showUnsplash) {
      setShowUnsplash(false);
    }
  }

  const handleCancel = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      window.close();
    }
  };

  function checkTokenExpire() {
    if (session_token_apideck === null) {
      return dispatch(handelGetSessionToken());
    } else if (session_token_apideck !== null) {
      const decodeToken = jwtDecode(session_token_apideck);
      const currentTimestamp = moment().unix();
      const currentMoment = moment.unix(currentTimestamp);
      const givenMoment = moment.unix(decodeToken?.exp);

      // Get the difference in milliseconds
      const differenceInMilliseconds = givenMoment.diff(currentMoment);

      // Convert the difference to minutes
      const differenceInMinutes = moment
        .duration(differenceInMilliseconds)
        .asMinutes();

      let checkExpireOrNot = parseInt(differenceInMinutes).toFixed(2) > 0;
      if (checkExpireOrNot && session_token_apideck !== null) {
        return dispatch(handleChangeSessionToken(session_token_apideck));
      } else if (session_token_apideck !== null && !checkExpireOrNot) {
        console.log("expire token recall");
        return dispatch(handelGetSessionToken());
      }
    }
  }

  const handleSelect = async (
    serviceId,
    imageId,
    imageName,
    fileSizeInBytes,
    mimeType
  ) => {
    toast.loading("Uploading...");
    dispatch(
      handelPostImageFromDrive({
        serviceId,
        imageId,
        imageName,
        token,
        fileSizeInBytes,
        mimeType,
      })
    );
    if (window.history.length == 1) {
      localStorage.setItem("isWindowClosed", "true");
      window.close();
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    checkTokenExpire();
  });

  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="grid grid-cols-3 gap-2">
            <h1 className="col-span-2 not-italic font-medium text-2xl text-[#001737] sm-mb-3">
              Media Upload
            </h1>
            <div className="flex items-center justify-end">
              <Link>
                <button
                  className="flex align-middle border-primary items-center border rounded-full lg:px-5 px-3 py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                  onClick={() => handleCancel()}
                >
                  Cancel
                </button>
              </Link>
            </div>
          </div>
          <div className="flex lg:justify-between md:justify-between flex-wrap sm:justify-start xs:justify-start items-center lg:mt-7 md:mt-7 sm:mt-5 xs:mt-5 media-icon">
            {/* start Camera */}
            <span
              className="bg-white px-3 leading-none rounded-[45px]  fileUploadIcon"
              data-tip="Camera"
            >
              <button
                data-tip
                data-for="Camera"
                onClick={openCameraModal}
                className="relative"
              >
                <img src={cameraimg} className="w-9 relative" />
                <ReactTooltip
                  id="Camera"
                  place="bottom"
                  type="warning"
                  effect="solid"
                >
                  <span>Camera</span>
                </ReactTooltip>
              </button>

              {showCamera && (
                <Camera
                  cameraModalRef={cameraModalRef}
                  onImageUpload={handleImageUpload}
                  closeModal={closeCameraModal}
                />
              )}
            </span>
            {/* End Camera */}
            {/* start Video */}
            <span className="bg-white  px-3 leading-none  rounded-[45px] fileUploadIcon">
              <button
                onClick={openVideoModal}
                className="relative"
                data-tip
                data-for="Video"
              >
                <img src={videoimg} className="w-9 relative" />
                <ReactTooltip
                  id="Video"
                  place="bottom"
                  type="warning"
                  effect="solid"
                >
                  <span>Video</span>
                </ReactTooltip>
              </button>

              {showVideo && (
                <VideoRecorder
                  videoModalRef={videoModalRef}
                  closeModal={closeVideoModal}
                  onDownloadVideo={handleDownloadVideo}
                  onVideoRecorded={handleVideoRecorded}
                />
              )}
            </span>
            {/* End Video*/}
            {/* start unspalsh */}
            <span className="bg-white  px-3 leading-none  rounded-[45px] fileUploadIcon">
              <button
                data-tip
                data-for="Unsplash"
                onClick={handleUnsplashButtonClick}
                className="relative"
              >
                <FaUnsplash size={30} className="relative" />
                <ReactTooltip
                  id="Unsplash"
                  place="bottom"
                  type="warning"
                  effect="solid"
                >
                  <span>Unsplash</span>
                </ReactTooltip>
              </button>

              {showUnsplash && (
                <Unsplash
                  unsplashModalRef={unsplashModalRef}
                  closeModal={handleCloseModal}
                  onSelectedImages={handleSelectedImages}
                />
              )}
            </span>
            {/* end unspalsh */}
            {/* start pixels */}
            <span className="bg-white  px-3 leading-none  rounded-[45px] fileUploadIcon">
              <button
                data-tip
                data-for="Pexels"
                onClick={handlePexelsButtonClick}
                className="relative text-[#07a081]"
              >
                <SiPexels size={30} className="relative" />
                <ReactTooltip
                  id="Pexels"
                  place="bottom"
                  type="warning"
                  effect="solid"
                >
                  <span>Pexels</span>
                </ReactTooltip>
              </button>

              {showpexels && (
                <Pexels
                  pexelsModalRef={pexelsModalRef}
                  closeModal={handleClosePexelsModal}
                />
              )}
            </span>
            {/* end pixels */}
            {/* start pixabay */}
            <span className="bg-white text-SlateBlue px-3 leading-none  rounded-[45px] fileUploadIcon relative">
              <button
                data-tip
                data-for="Pixabay"
                onClick={handlePexabaysButtonClick}
                className="relative"
              >
                <img src={pixabayimg} className="relative w-9" />
                <ReactTooltip
                  id="Pixabay"
                  place="bottom"
                  type="warning"
                  effect="solid"
                >
                  <span>Pixabay</span>
                </ReactTooltip>
              </button>

              {showPexabay && (
                <Pixabay
                  pixabayModalRef={pixabayModalRef}
                  closeModal={handleClosePexabaysModal}
                />
              )}
              {/* end pixabay */}
            </span>
            <span className="bg-white text-SlateBlue px-3 leading-none  rounded-[45px] fileUploadIcon relative">
              <OtherOptionsForAssets handleSelect={handleSelect} />
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
              <div className=" relative flex-col flex  items-center justify-center min-h-full lg:py-16 md:py-10 sm:py-32 xs:pb-32 xs:pt-14 px-2  bg-lightgray lg:mt-14 md:mt-14 sm:mt-5 xs:mt-5  border-2 rounded-[20px] border-SlateBlue border-dashed">
                <div className=" relative text-center max-auto">
                  <FiUploadCloud className="text-SlateBlue md:mb-7 sm:mb-3 xs:mb-2 lg:text-[150px] md:text-[100px] sm:text-[80px] xs:text-[45px] mx-auto text-center" />
                  <input
                    type="file"
                    className=" absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                    name="uploadfile"
                    onChange={onFileChange}
                    multiple
                    accept="image/*, video/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  />
                  <span className="text-SlateBlue text-center">
                    Select Files to Upload
                  </span>
                  <p className="text-sm font-normal text-center">
                    Drop your video, photo or document here
                  </p>
                </div>
              </div>
            </div>
          </div>
          {selectedImages.map((image, index) => (
            <div
              key={index}
              className="shadow-inner bg-lightgray rounded-md m-5 w-100 p-2"
            >
              <h2>{image.name}</h2>
              <div className="flex justify-between items-center">
                <progress
                  value={image.progress}
                  max={100}
                  className="w-full custom-progress bg-SlateBlue rounded-sm"
                />
                <p className="ml-2">{image.progress}%</p>
              </div>
              <p className="text-sm">
                <span className="font-medium text-base">Size:</span>{" "}
                {image.size}
              </p>
            </div>
          ))}

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

          {fileSuccessModal ? (
            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
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
            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
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
