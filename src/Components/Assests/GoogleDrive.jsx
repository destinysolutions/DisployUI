import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import useDrivePicker from "react-google-drive-picker";
import Googledrive from "../../../public/Assets/google-drive.png";
import { Tooltip } from "@material-tailwind/react";
import { ALL_FILES_UPLOAD } from "../../Pages/Api";
import { useNavigate } from "react-router-dom";
const GoogleDrive = () => {
  const [openPicker, authResponse] = useDrivePicker();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleLoginSuccess = (response) => {
    const accessToken = response.accessToken;
    console.log("Access Token:", accessToken);
    handleOpenPicker(accessToken); // Pass the access token to handleOpenPicker
  };

  const handleLoginFailure = (error) => {
    console.log("Login Failed:", error);
  };

  const googleDriveLogin = () => {
    return new Promise((resolve, reject) => {
      const response = { accessToken: "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" };
      resolve(response);
    });
  };

  const handleOpenPicker = async (accessToken) => {
    const currentTime = Date.now() / 1000; // Convert to seconds
    if (accessToken.expiryTime - currentTime < 300) {
      // Check if token will expire in less than 5 minutes
      try {
        const newAccessToken = await renewAccessTokenUsingRefreshToken(
          accessToken.refreshToken
        );
        accessToken = newAccessToken; // Update the access token
      } catch (error) {
        console.error("Error renewing access token:", error);
        return;
      }
    }
    const handleFileUpload = async (data) => {
      if (data.action === "picked") {
        console.log("Selected Files:", data.docs);
        setSelectedFiles(data.docs);

        // Upload selected files to the API
        await uploadDataToAPI(data.docs);
      }
    };
    openPicker({
      clientId:
        "1020941750014-qfinh8b437r6lvvt3rb7m24phf3v6vdi.apps.googleusercontent.com", // Your client ID
      developerKey: "AIzaSyCbWICmzquQqKHgCDNEFCBUgpH8VGe2ezo", // Your developer key
      viewId: "DOCS",
      token:
        "ya29.a0AfB_byB-H3p1dg8VWZjZHxIqRdh8bEEQGFe9XUSmbzec9-b1zqb_-BMLYisFP5YIS6QRUquL1LJ9wfk2wYeseDyenmRgqmcamcb5zBtnSTdk7KPOqhD0w1Bydal46yz4K0N8yYSixsKSWXjdmqrkBRW4t5J9LeATdcx5aCgYKAcgSARESFQGOcNnCzeuIZDm6WHpU7DQ5awypLA0171",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: handleFileUpload,
    });
  };
  const renewAccessTokenUsingRefreshToken = async (refreshToken) => {
    try {
      const response = await axios.post(
        "https://oauth2.googleapis.com/token",
        new URLSearchParams({
          client_id:
            "1020941750014-qfinh8b437r6lvvt3rb7m24phf3v6vdi.apps.googleusercontent.com",
          client_secret: "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",
          refresh_token:
            "1//045RUoVpH0dcBCgYIARAAGAQSNwF-L9IrRKMlBDMVShHZXrs5g0V3TBQ3Yq6m0J82R4F-E90fP4nfCYMiz1F6clUDHUDO_NBjt9s",
          grant_type: "refresh_token",
        })
      );

      const newAccessToken = {
        accessToken: response.data.access_token,
        expiryTime: Date.now() / 1000 + response.data.expires_in,
        refreshToken: refreshToken,
      };

      return newAccessToken;
    } catch (error) {
      throw error;
    }
  };

  // API
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

  selectedFiles.forEach((files) => {
    console.log(files, "files");
  });

  // const uploadDataToAPI = async () => {
  //   try {
  //     for (const file of selectedFiles) {
  //       const formData = new FormData();
  //       const details = "drive image";
  //       const CategorieType = getContentType(file.mimeType);
  //       formData.append("FileType", file.embedUrl);
  //       formData.append("operation", "Insert");
  //       formData.append("CategorieType", "Online");
  //       formData.append("details", details);
  //       const response = await axios.post(ALL_FILES_UPLOAD, formData);
  //       console.log("Upload Success:", response.data);
  //     }
  //   } catch (error) {
  //     console.error("Upload Error:", error);
  //   }
  // };

  // const uploadDataToAPI = async () => {
  //   try {
  //     for (const file of selectedFiles) {
  //       const CategorieType = getContentType(file.mimeType);
  //       console.log("file", file);
  //       // Fetch the file data
  //       const response = await fetch(file.embedUrl);
  //       const fileData = await response.blob();

  //       const formData = new FormData();
  //       formData.append("FileType", fileData, file.name);
  //       formData.append("operation", "Insert");
  //       formData.append("CategorieType", CategorieType);
  //       formData.append("details", "drive image");

  //       await axios.post(ALL_FILES_UPLOAD, formData);
  //     }
  //     console.log("Upload Success", response.data);
  //   } catch (error) {
  //     console.error("Upload Error:", error);
  //   }
  // };
  const navigate = useNavigate();
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState({});

  const uploadDataToAPI = (data) => {
    console.log(data, "data");
    setUploadInProgress(true);
    data.forEach((image) => {
      console.log(image, "image");
      const formData = new FormData();
      const details = "Some Details about the file";
      formData.append("FileType", image.embedUrl);
      formData.append("operation", "Insert");
      formData.append("CategorieType", "OnlineVideo");
      formData.append("details", details);
      // formData.append(
      //   "resolutions",
      //   `${image.webformatHeight}*${image.webformatWidth}`
      // );
      formData.append("name", image.name);
      axios
        .post(ALL_FILES_UPLOAD, formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setImageUploadProgress((prevProgress) => ({
              ...prevProgress,
              [image.id]: progress,
            }));
          },
        })
        .then((response) => {
          console.log("Upload Success:", response.data);
          navigate("/assets");
        })
        .catch((error) => {
          console.error("Upload Error:", error);
        })
        .finally(() => {
          if (
            selectedFiles.every((img) => imageUploadProgress[img.id] === 100)
          ) {
            setUploadInProgress(false);
          }
        });
    });
  };
  useEffect(() => {
    const allImagesUploaded = selectedFiles.every(
      (img) => imageUploadProgress[img.id] === 100
    );

    if (allImagesUploaded) {
      // Introduce a delay before setting uploadInProgress to false
      setTimeout(() => {
        setUploadInProgress(false);
      }, 5000);
    }
  }, [selectedFiles, imageUploadProgress]);
  return (
    <>
      <Tooltip
        content="Google Drive"
        placement="bottom-end"
        className=" bg-SlateBlue text-white z-10 ml-5"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 1, y: 10 },
        }}
      >
        <button
          className="fileUploadIcon"
          onClick={() =>
            googleDriveLogin()
              .then(handleLoginSuccess)
              .catch(handleLoginFailure)
          }
        >
          <img src={Googledrive} className="w-9" alt="Google Drive Icon" />
        </button>
      </Tooltip>
      <div className="selected-photos">
        {selectedFiles.map((file, index) => (
          <img
            key={index}
            src={file.embedUrl} // Use the embedUrl property instead of url
            alt={`Selected File ${index}`}
          />
        ))}
      </div>
    </>
  );
};

export default GoogleDrive;
