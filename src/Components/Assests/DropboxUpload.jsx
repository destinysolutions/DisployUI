import React from 'react';
import DropboxChooser from 'react-dropbox-chooser';
import { AiOutlineDropbox } from "react-icons/ai";
import { Tooltip } from "@material-tailwind/react";
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
                <Tooltip content="Dropbox" placement="bottom-end" className=" bg-SlateBlue text-white z-10 ml-3" animate={{
                    mount: { scale: 1, y: 0 }, unmount: { scale: 1, y: 10 },
                }}>
                    <button className="fileUploadIcon dropbox-button"> <AiOutlineDropbox size={35} className="text-[#007de4] border-[#007de4]" /></button>
                </Tooltip>
            </DropboxChooser>
        </>
    )
}

export default DropboxUpload