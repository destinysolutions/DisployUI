import React from "react";
import DropboxChooser from "react-dropbox-chooser";
import { AiOutlineDropbox } from "react-icons/ai";
import { Tooltip } from "@material-tailwind/react";
import { ALL_FILES_UPLOAD } from "../../Pages/Api";
import axios from "axios";

const DropboxUpload = () => {
  const handleSuccess = (files) => {
    files.forEach((image) => {
      const formData = new FormData();
      const details = "Dropbox file upload";

      // You can check the file type here to make sure it's a video before uploading
      if (
        image.link_type === "direct" &&
        image.is_dir === false &&
        image.name.match(/\.(mp4|mov|avi|mkv)$/i)
      ) {
        formData.append("FileType", image.link);
        formData.append("operation", "Insert");
        formData.append("CategorieType", "OnlineImage");
        formData.append("details", details);
        formData.append("name", image.name);

        axios
          .post(ALL_FILES_UPLOAD, formData)
          .then((response) => {
            console.log("Upload Success:", response.data);
          })
          .catch((error) => {
            console.error("Upload Error:", error);
          });
      }
    });
  };

  const handleCancel = () => {
    console.log("User cancelled the action.");
  };

  return (
    <>
      <DropboxChooser
        appKey="63hbbudlhzm3uqu"
        success={handleSuccess}
        cancel={handleCancel}
        multiselect={true}
        extensions={[
          ".pdf",
          ".docx",
          ".jpg",
          ".png",
          ".mp4",
          ".mov",
          ".avi",
          ".mkv",
        ]}
        linkType="direct"
      >
        <Tooltip
          content="Dropbox"
          placement="bottom-end"
          className=" bg-SlateBlue text-white z-10 ml-3"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 1, y: 10 },
          }}
        >
          <button className="fileUploadIcon dropbox-button">
            <AiOutlineDropbox
              size={35}
              className="text-[#007de4] border-[#007de4]"
            />
          </button>
        </Tooltip>
      </DropboxChooser>
    </>
  );
};

export default DropboxUpload;
