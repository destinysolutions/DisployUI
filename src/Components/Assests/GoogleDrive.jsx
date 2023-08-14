import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import useDrivePicker from "react-google-drive-picker";
import Googledrive from '../../../public/Assets/google-drive.png';
import { Tooltip } from "@material-tailwind/react";
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


    const handleOpenPicker = (accessToken) => {
        openPicker({
            clientId: "1020941750014-qfinh8b437r6lvvt3rb7m24phf3v6vdi.apps.googleusercontent.com", // Your client ID
            developerKey: "AIzaSyCbWICmzquQqKHgCDNEFCBUgpH8VGe2ezo", // Your developer key
            viewId: "DOCS",
            token: "ya29.a0AfB_byA8Laaw9Ht1HFI4WZfNM4Fzg-ymtEtXB4UFfVHOCw-BxqrzokrD8PFuV6ZKpFTQBYfFiooOegqhIDFTCFeH4fOu3pEhMg5fae0fUnAOWFTR1oPu7o8aonA8kjIoZ2Aceh5i7q5Ww0f2w2p6uhViVCosaCgYKAUkSARESFQHsvYlskNLFlLORK1Wr_-H-5V5XbQ0163",
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
            callbackFunction: (data) => {
                if (data.action === "cancel") {
                    console.log("User clicked cancel/close button");
                } else if (data.action === "picked") {
                    console.log("Selected Files:", data.docs);
                    setSelectedFiles(data.docs);
                    handleImageUpload(data.docs, accessToken); // Pass the selected files and access token
                }
            }

        });
    };

    const handleImageUpload = async (selectedFiles, accessToken) => {
        const uploadPromises = selectedFiles.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file.id); // Assuming you need to pass the file ID

            const response = await axios.post(
                `https://www.googleapis.com/upload/drive/v3/files/${file.id}?uploadType=media`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log("File uploaded:", response.data);
        });

        try {
            await Promise.all(uploadPromises);
            console.log("All files uploaded successfully.");
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };









    return (
        <>
            <Tooltip content="Google Drive" placement="bottom-end" className=" bg-SlateBlue text-white z-10 ml-5" animate={{
                mount: { scale: 1, y: 0 }, unmount: { scale: 1, y: 10 },
            }}>
                <button className="fileUploadIcon" onClick={() => googleDriveLogin().then(handleLoginSuccess).catch(handleLoginFailure)}>
                    <img src={Googledrive} className='w-9' alt="Google Drive Icon" />
                </button>
            </Tooltip>

        </>
    );
};

export default GoogleDrive;
