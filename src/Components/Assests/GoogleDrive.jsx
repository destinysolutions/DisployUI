import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import useDrivePicker from "react-google-drive-picker";
import Googledrive from "../../images/Assets/google-drive.png";
import { ALL_FILES_UPLOAD, GOOGLE_DRIVE } from "../../Pages/Api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";

const GoogleDrive = () => {
  const { user } = useSelector((state) => state.root.auth);

  const [openPicker] = useDrivePicker();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileUpload = async (data) => {
    if (data.action === "picked") {
      const selectedImages = data.docs;
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

  const handleOpenPicker = async (token) => {
    console.log(token);
    openPicker({
      clientId: process.env.REACT_APP_GOOGLE_DRIVE_CLIENTID, // Your client ID
      developerKey: process.env.REACT_APP_GOOGLE_DEVELOPER_KEY, // Your developer key
      viewId: "DOCS",
      token,
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
        const googleAuthURL = response.data.Data[0].URL;
        if (response.data?.Success == "False") {
          window.location.href = googleAuthURL;
          // window.open(googleAuthURL)
          // setGoogleAuthURL(googleAuthURL)
        } else {
          console.log("hanget-->", response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");
    console.log("run");
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
          handleOpenPicker(response.data.Data[0].AuthToken);
          // setAuthToken(response.data.Data[0].AuthToken);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("Authorization code not found in the URL.");
    }
  });
  // console.log(googleAuthURL);
  // console.log(selectedFiles, "dfsdf");
  return (
    <>
      <button
        className="fileUploadIcon"
        onClick={handleGet}
        data-tip
        data-for="Google Drive"
      >
        <img src={Googledrive} className="w-9" alt="Google Drive Icon" />
        <ReactTooltip
          id="Google Drive"
          place="bottom"
          type="warning"
          effect="solid"
        >
          <span>Google Drive</span>
        </ReactTooltip>
      </button>

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
