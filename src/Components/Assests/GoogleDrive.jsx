import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import useDrivePicker from "react-google-drive-picker";
import Googledrive from "../../images/Assets/google-drive.png";
import { Tooltip } from "@material-tailwind/react";
import { ALL_FILES_UPLOAD, GOOGLE_DRIVE } from "../../Pages/Api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const GoogleDrive = () => {
  const { user } = useSelector((state) => state.root.auth);

  const [openPicker] = useDrivePicker();
  const [selectedFiles, setSelectedFiles] = useState([]);
  // const [accessToken, setAccessToken] = useState("");

  const handleFileUpload = async (data) => {
    if (data.action === "picked") {
      const selectedImages = data.docs;
      console.log(selectedImages, "selectedImages");
      const downloadURLs = selectedImages.map((file) => file.url);

      setSelectedFiles(downloadURLs);
    }
  };

  const downloadImages = () => {
    selectedFiles.forEach((url, index) => {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = `Image${index + 1}.jpg`;
      link.click();

      // Open the downloaded image in a new tab
      window.open(url, "_blank");
    });
  };

  const handleOpenPicker = async (accessToken) => {
    openPicker({
      clientId:
        "590831956653-vp5g9p3htik4i23u9a1tkd83dvigvrlv.apps.googleusercontent.com", // Your client ID
      developerKey: "AIzaSyCUW6ROiE0g71U2svkXUrVdvMriVoKKAaY", // Your developer key
      viewId: "DOCS",
      token: accessToken,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: handleFileUpload,
    });
  };

  const handleGet = () => {
    let data = JSON.stringify({
      userId: user?.userID,
      operation: "CheckExists",
      mode: "CheckAuthToken",
      type: "GoogleDrive",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: GOOGLE_DRIVE,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        const googleAuthURL = response.data.Data[0].URL;
        if (googleAuthURL) {
          // Redirect to the Google authentication URL
          window.location.href = googleAuthURL;
        } else {
          //setAccessToken(response.data.Data[0].AuthToken);
          handleOpenPicker(response.data.Data[0].AuthToken);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");
    if (authorizationCode) {
      let data = JSON.stringify({
        userId: user?.userID,
        operation: "GetAuthToken",
        mode: "Insert",
        code: authorizationCode,
        type: "GoogleDrive",
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: GOOGLE_DRIVE,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("Authorization code not found in the URL.");
    }
  });

  console.log(selectedFiles, "dfsdf");
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
        <button className="fileUploadIcon" onClick={handleGet}>
          <img src={Googledrive} className="w-9" alt="Google Drive Icon" />
        </button>
      </Tooltip>
      <div className="selected-photos">
        {selectedFiles.map((url, index) => (
          <div key={index}>
            <img src={url} alt={`Selected Public Image ${index}`} />
            <button onClick={downloadImages} className="download-button">
              Download Image {index + 1}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default GoogleDrive;
