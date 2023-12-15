import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { MdFlipCameraAndroid } from "react-icons/md";
import { TbCameraSelfie } from "react-icons/tb";
import { BiDownload } from "react-icons/bi";
import { MdMotionPhotosOn } from "react-icons/md";
import axios from "axios";
import { ALL_FILES_UPLOAD } from "../../Pages/Api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleGetStorageDetails } from "../../Redux/SettingSlice";
import toast from "react-hot-toast";

const Camera = ({ closeModal, onImageUpload, cameraModalRef }) => {
  const { token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [savedImages, setSavedImages] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
    setImageSrc(null);
  };

  const capturePhoto = () => {
    if (!isCapturing) {
      setIsCapturing(true);
      const image = webcamRef.current.getScreenshot();
      setImageSrc(image);
      setTimeout(() => {
        setIsCapturing(false);
      }, 1000);
    }
  };

  //closeModal function
  const closeCameraModal = () => {
    if (onImageUpload) {
      onImageUpload(savedImages);
    }
    closeModal();
  };

  const savePhoto = () => {
    if (imageSrc) {
      setUploading(true);
      setUploadProgress(0); // Initialize progress to 0

      const details = "Camera image Upload";
      const byteCharacters = atob(imageSrc.split(",")[1]);
      const byteArrays = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteArrays], { type: "image/jpeg" });
      const uniqueFileName = `Image_${Date.now()}.jpg`;
      const formData = new FormData();
      formData.append("File", blob, uniqueFileName);
      formData.append("Operation", "Insert");
      formData.append("AssetType", "Image");
      formData.append("AssetName", uniqueFileName);
      formData.append("IsActive", "true");
      formData.append("IsDelete", "false");
      formData.append("FolderID", "0");

      const response = dispatch(handleGetStorageDetails({ token }));

      response.then((res) => {
        if (res?.payload?.data?.usedInPercentage == 100) {
          setUploading(false);
          setUploadProgress(0);
          return toast.error("Storage limit reached, maximum 3GB allowed.");
        } else {
          axios
            .post(ALL_FILES_UPLOAD, formData, {
              headers: {
                Authorization: authToken,
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100
                );
                setUploadProgress(progress); // Update progress as the upload progresses
              },
            })
            .then((response) => {
              setUploading(false);
              setUploadProgress(0); // Reset progress to 0 after successful upload

              if (response.data.status === 200) {
                const imageUrl = response.data.data[0];
                setSavedImages([...savedImages, imageUrl]);
                setIsSaved(true);

                setTimeout(() => {
                  setIsSaved(false);
                  navigate(-1);
                }, 1000);
              }
            })
            .catch((error) => {
              setUploading(false);
              setUploadProgress(0); // Reset progress to 0 on error
              console.error("Error uploading image:", error);
            });
        }
      });
    }
  };

  return (
    <div className="backdrop">
      <div
        ref={cameraModalRef}
        className="fixed unsplash-model bg-primary lg:px-5 md:px-5 sm:px-3 xs:px-2 pt-10 rounded-2xl lg:w-1/2 md:w-1/2 sm:w-4/5 xs:w-4/5  "
      >
        <button
          onClick={closeCameraModal}
          className="absolute right-3 top-3 text-2xl rounded-lg text-SlateBlue"
        >
          <AiOutlineCloseCircle />
        </button>
        <div className="relative">
          <div className="relative">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: isFrontCamera ? "user" : "environment",
              }}
              className="w-full"
            />
          </div>
          <div className=" absolute top-0 left-0">
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Captured"
                className="captured-image w-full"
              />
            )}
          </div>
        </div>
        <div className="relative">
          <div className="text-center relative">
            <button
              onClick={capturePhoto}
              className={`capture-button ${isCapturing ? "capturing" : ""}`}
              disabled={isCapturing}
            >
              {isCapturing ? (
                <MdMotionPhotosOn className="lg:text-6xl md:text-6xl sm:text-4xl xs:text-4xl text-red" />
              ) : (
                <MdMotionPhotosOn className="lg:text-6xl md:text-6xl sm:text-4xl xs:text-4xl text-white" />
              )}
            </button>
          </div>
          <div className="text-right absolute right-0 top-2/4 -translate-y-1/2">
            <button onClick={toggleCamera}>
              {isFrontCamera ? (
                <TbCameraSelfie className="lg:text-4xl md:text-4xl sm:text-2xl xs:text-2xl text-SlateBlue" />
              ) : (
                <MdFlipCameraAndroid className="lg:text-4xl md:text-4xl sm:text-2xl xs:text-2xl text-SlateBlue" />
              )}{" "}
            </button>
            {imageSrc && (
              <button onClick={savePhoto} className="save-button">
                <BiDownload className="lg:text-4xl md:text-4xl sm:text-2xl xs:text-2xl ml-2 text-SlateBlue" />
              </button>
            )}
            {isSaved && (
              <div className="text-center text-green-500 mt-3">
                Image uploaded successfully!
              </div>
            )}
          </div>

          {uploading && (
            <div className="progress-container">
              <div className="progress flex items-center justify-between">
                <div
                  className="progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <div className="ml-3">{uploadProgress}%</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Camera;
