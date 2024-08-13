/* eslint-disable jsx-a11y/no-distracting-elements */
import React from 'react';
import ReactPlayer from 'react-player';
import { HiDocumentDuplicate } from 'react-icons/hi';
import { FcOpenedFolder } from 'react-icons/fc';
import { FixedSizeList as List } from 'react-window';

const VideoTable = ({
  activeTab,
  assetData,
  folderData,
  openFolder,
  loading,
  navigateToFolder,
  addSeletedAsset,
  handleDragStartForDivToDiv
}) => {

  const renderVideoPlayer = (data) => {
    if ((data.assetType === "Video" ||
        data.assetType === "OnlineVideo" ||
        data.assetType === "Youtube" ||
        data.youTubeURL) &&
      (data.youTubeURL || data.assetFolderPath)) {
      return (
        <>
          {/* {console.log('Rendering ReactPlayer with URL:', data?.assetFolderPath || data?.youTubeURL)} */}
          <ReactPlayer
            url={data?.assetFolderPath || data?.youTubeURL}
            className="h-80px w-160px relative z-10"
            controls={true}
            playing={false}
            loop={true}
          />
        </>
      );
    }
    return null;
  };

  const renderRow = ({ index, style }) => {
    const data = !openFolder ? assetData[index] : folderData[index];

    if (!loading && data) {
      return (
        <div style={style} className="border-b border-b-[#E4E6FF] cursor-pointer flex items-center"
          onClick={() => {
            if (data?.assetType === "Folder") {
              navigateToFolder(data);
            } else {
              addSeletedAsset(data, index + 1);
            }
          }}
          draggable
          onDragStart={(event) => {
            if (data?.assetType !== "Folder") {
              handleDragStartForDivToDiv(event, data);
            }
          }}
        >
          <td className="w-full flex justify-center items-center">
            {data.assetType === "OnlineImage" && (
              <img
                className="imagebox relative h-80px w-160px"
                src={data?.assetFolderPath}
                alt={data?.assetName}
              />
            )}
            {data.assetType === "Image" && (
              <img
                src={data?.assetFolderPath}
                alt={data?.assetName}
                className="imagebox relative h-80px w-160px"
              />
            )}
            {data.instanceName && data?.scrollType && (
              <marquee
                className="text-lg w-full h-full flex items-center text-black"
                direction={data?.scrollType === 1 ? "right" : "left"}
                scrollamount="10"
              >
                {data?.text}
              </marquee>
            )}
            {renderVideoPlayer(data)}
            {data.assetType === "DOC" && (
              <div className="flex justify-center items-center">
                <HiDocumentDuplicate className=" text-primary text-4xl" />
              </div>
            )}
            {data.assetType === "Folder" && (
              <FcOpenedFolder className="text-8xl text-center mx-auto" />
            )}
          </td>
          <td className="p-2 w-full text-center hyphens-auto break-words">
            {data.assetName || data?.instanceName}
          </td>
          <td className="p-2 w-full text-center">
            {data?.fileExtention || data?.assetType}
            {data?.youtubeId && "Youtube video"}
            {data?.textScroll_Id && "TextScroll"}
          </td>
        </div>
      );
    }
    return null;
  };

  const filteredData = !openFolder
    ? assetData.filter((item) => {
        if (activeTab === "asset") {
          return item.hasOwnProperty("assetID");
        } else if (activeTab === "apps") {
          return !item.hasOwnProperty("assetID");
        }
        return false;
      })
    : folderData;

  return (
    <div>
      <table className="w-full bg-white overflow-x-auto lg:table-fixed md:table-auto sm:table-auto xs:table-auto border border-[#E4E6FF]" cellPadding={15}>
        <thead className="sticky -top-1 z-20">
          <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg text-left">
            <th className="text-[#5A5881] py-2.5 text-base font-semibold">
              {activeTab === "asset" ? "Asset" : "App"}
            </th>
            <th className="text-[#5A5881] py-2.5 text-base text-center font-semibold">
              {activeTab === "asset" ? "Asset Name" : "App Name"}
            </th>
            <th className="text-[#5A5881] py-2.5 text-base text-center font-semibold">
              Type
            </th>
          </tr>
        </thead>
      </table>
      <List
        height={800} // Height of the list container
        itemCount={filteredData?.length}
        itemSize={120} // Height of each item
        width={'100%'}
        className='vertical-scroll-inner min-h-[50vh] max-h-[50vh]'
      >
        {renderRow}
      </List>
    </div>
  );
};

export default VideoTable;
