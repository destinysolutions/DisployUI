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
  const [accessToken, setAccessToken] = useState(null);

  const handleLoginSuccess = (response) => {
    const accessToken = response.accessToken;
    console.log("Access Token:", accessToken);
    handleOpenPicker(accessToken);
    setAccessToken(accessToken);
  };

  const handleLoginFailure = (error) => {
    console.log("Login Failed:", error);
  };

  const googleDriveLogin = () => {
    return new Promise((resolve, reject) => {
      const response = {
        accessToken:
          "ya29.a0AfB_byB2xrvJ54edRebVSPBG69GMJsYeHIxiJQiZqFXW9XQVdoAxDxeyO7y47NBxYlh6o8kllVVcvy3wlJBFmpNJR4Fqfea5K_SaLCxsz8lEoB3JHlHKam6nIbARroiyZrLfUAJzKzXm7eS2mM3FY2LwRYYSENvafC1xaCgYKAdASARMSFQGOcNnCpoqYGSaQC1aLtMgbkmR8nw0171",
      };
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
        "446535573289-eojjjpbqdp5jji7kvle6umhgdb84uknl.apps.googleusercontent.com", // Your client ID
      developerKey: "AIzaSyCna-XLPlf5ouSNMndiYCajpqZpZutmG-8", // Your developer key
      viewId: "DOCS",
      token:
        "ya29.a0AfB_byB2xrvJ54edRebVSPBG69GMJsYeHIxiJQiZqFXW9XQVdoAxDxeyO7y47NBxYlh6o8kllVVcvy3wlJBFmpNJR4Fqfea5K_SaLCxsz8lEoB3JHlHKam6nIbARroiyZrLfUAJzKzXm7eS2mM3FY2LwRYYSENvafC1xaCgYKAdASARMSFQGOcNnCpoqYGSaQC1aLtMgbkmR8nw0171",
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
            "446535573289-eojjjpbqdp5jji7kvle6umhgdb84uknl.apps.googleusercontent.com",
          client_secret: "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",
          refresh_token:
            "1//04NkHr6e_wtPKCgYIARAAGAQSNwF-L9IrIbuZMjcgoM5dvCZbrum6ENsddXC3EMYtUZfbBMDxMYrmU9Sgil0-yRjuyUqHIj0aYjQ",
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
  const navigate = useNavigate();
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState({});

  const uploadDataToAPI = (data) => {
    console.log(data, "data");
    setUploadInProgress(true);

    data.forEach(async (image) => {
      console.log(image, "image");

      const currentTime = Date.now() / 1000;
      if (accessToken && accessToken.expiryTime - currentTime < 300) {
        try {
          const newAccessToken = await renewAccessTokenUsingRefreshToken(
            accessToken.refreshToken
          );
          setAccessToken(newAccessToken);
        } catch (error) {
          console.error("Error renewing access token:", error);
          return;
        }
      }
      fetchImageFromGoogleDrive(image.embedUrl)
        .then((base64Data) => {
          if (base64Data) {
            // Store the base64 data in your database or perform any other actions
            console.log("Base64 Image Data:", base64Data);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      const formData = new FormData();
      const details = "Some Details about the file";

      // Use the appropriate properties from the 'image' object
      formData.append("FileType", image.embedUrl); // This might need adjustment
      formData.append("operation", "Insert");
      formData.append("CategorieType", "OnlineImage");
      formData.append("details", details);
      formData.append("name", image.name);

      axios
        .post(ALL_FILES_UPLOAD, formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );

            // Use 'image.embedUrl' or another appropriate identifier
            setImageUploadProgress((prevProgress) => ({
              ...prevProgress,
              [image.embedUrl]: progress,
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
          const allImagesUploaded = data.every(
            (img) => imageUploadProgress[img.embedUrl] === 100
          );

          if (allImagesUploaded) {
            setUploadInProgress(false);
          }
        });
    });
  };

  const fetchImageFromGoogleDrive = async (embedUrl) => {
    console.log(embedUrl, "embedUrl");
    try {
      const response = await fetch(embedUrl);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");
        return base64Data;
      } else {
        console.error(
          "Failed to fetch image:",
          response.status,
          response.statusText
        );
        return null;
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  useEffect(() => {
    const allImagesUploaded = selectedFiles.every(
      (img) => imageUploadProgress[img.id] === 100
    );

    if (allImagesUploaded) {
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
          <img key={index} src={file.embedUrl} alt={`Selected File ${index}`} />
        ))}
      </div>
    </>
  );
};

export default GoogleDrive;
