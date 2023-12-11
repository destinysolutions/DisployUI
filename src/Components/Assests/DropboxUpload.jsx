import React from "react";
import DropboxChooser from "react-dropbox-chooser";
import { AiOutlineDropbox } from "react-icons/ai";
import { Tooltip } from "@material-tailwind/react";
import { ALL_FILES_UPLOAD } from "../../Pages/Api";
import axios from "axios";
import { useSelector } from "react-redux";

const DropboxUpload = () => {
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;
  const handleSuccess = (files) => {
    files.forEach((image) => {
      const formData = new FormData();
      if (
        image.link_type === "direct" &&
        image.is_dir === false &&
        image.name.match(/\.(mp4|mov|avi|mkv)$/i)
      ) {
        formData.append("File", image.link);
        formData.append("Operation", "Insert");
        formData.append("AssetType", "OnlineImage");
        formData.append("IsActive", "true");
        formData.append("IsDelete", "false");
        formData.append("FolderID", "0");
        formData.append("AssetName", image.name);

        axios
          .post(ALL_FILES_UPLOAD, formData, {
            headers: {
              Authorization: authToken,
              "Content-Type": "multipart/form-data",
            },
          })
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
