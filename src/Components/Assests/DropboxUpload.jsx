import React from 'react';
import DropboxChooser from 'react-dropbox-chooser';
import { AiOutlineDropbox } from "react-icons/ai";

const DropboxUpload = () => {
    const handleSuccess = (files, data) => {
        // Handle the selected files here
        console.log('Files chosen:', files);
        // Now you can upload the selected file to your server or process it as needed.
        const accessToken = data[0].token.access_token; // Extract the access token from the data

        console.log('Access Token:', accessToken);
    };

    const handleCancel = () => {
        console.log('User cancelled the action.');
    };
    return (
        <>
            <DropboxChooser
                appKey="63hbbudlhzm3uqu"
                success={handleSuccess}
                cancel={handleCancel}
                multiselect={true}
                extensions={['.pdf', '.docx', '.jpg', '.png']}
                linkType="direct"
            >
                <button className="fileUploadIcon dropbox-button"> <AiOutlineDropbox size={30} className="text-[#007de4] border-[#007de4]" /></button>
            </DropboxChooser>
        </>
    )
}

export default DropboxUpload