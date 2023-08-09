import React from 'react'
import { useState } from 'react';

import useDrivePicker from "react-google-drive-picker";
import Googledrive from '../../../public/Assets/google-drive.png'
const GoogleDrive = () => {
    const [openPicker, authResponse] = useDrivePicker();
    const [selectedFiles, setSelectedFiles] = useState([]);
    {
        /*file selected*/
    }

    const handleOpenPicker = () => {
        openPicker({
            clientId: "1020941750014-qfinh8b437r6lvvt3rb7m24phf3v6vdi.apps.googleusercontent.com", // Your client ID
            developerKey: "AIzaSyCbWICmzquQqKHgCDNEFCBUgpH8VGe2ezo", // Your developer key
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


    const handleLoginSuccess = (response) => {
        // Access the user's access_token here
        const accessToken = response.accessToken;
        console.log("Access Token:", accessToken);
        handleOpenPicker();
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

    return (
        <>
            <button className="fileUploadIcon" onClick={() => googleDriveLogin().then(handleLoginSuccess).catch(handleLoginFailure)}>

                <img src={Googledrive} className=' w-9' />
            </button>
        </>
    )
}

export default GoogleDrive