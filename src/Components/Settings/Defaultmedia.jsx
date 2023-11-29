import { Option } from "@material-tailwind/react";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  AiOutlineCloseCircle,
  AiOutlineCloudUpload,
  AiOutlineSearch,
} from "react-icons/ai";
import { GET_ALL_FILES } from "../../Pages/Api";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";

const Defaultmedia = () => {
  const [mediaTabs, setMediaTabs] = useState(1);
  function updateMediaTab(id) {
    setMediaTabs(id);
  }
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [assetData, setAssetData] = useState([]);
  const [assetAllData, setAssetAllData] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState({ assetName: "" });
  const [assetName, setAssetName] = useState("");
  const [filePath, setFilePath] = useState("");

  useEffect(() => {
    axios
      .get(GET_ALL_FILES, { headers: { Authorization: authToken } })
      .then((response) => {
        const fetchedData = response.data;
        const allAssets = [
          ...(fetchedData.image ? fetchedData.image : []),
          ...(fetchedData.video ? fetchedData.video : []),
          ...(fetchedData.doc ? fetchedData.doc : []),
          ...(fetchedData.onlineimages ? fetchedData.onlineimages : []),
          ...(fetchedData.onlinevideo ? fetchedData.onlinevideo : []),
        ];
        setAssetData(allAssets);
        setAssetAllData(allAssets);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const handleAssetAdd = (asset) => {
    setSelectedAsset(asset);
  };
  const [searchAsset, setSearchAsset] = useState("");
  const handleFilter = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchAsset(searchQuery);

    if (searchQuery === "") {
      setAssetData(assetAllData);
    } else {
      const filteredData = assetData.filter((item) => {
        const itemName = item.assetName ? item.assetName.toLowerCase() : "";
        return itemName.includes(searchQuery);
      });
      setAssetData(filteredData);
    }
  };
  const handleGetAsset = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://disployapi.thedestinysolutions.com/api/UserMaster/GetDefaultAsset",
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setAssetName(response.data.data.assetName);
        setFilePath(response.data.data.assetFolderPath);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    handleGetAsset();
  }, []);

  const handleChangeMedia = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://disployapi.thedestinysolutions.com/api/UserMaster/SaveDefaultAsset?AssetID=${selectedAsset.assetID}`,
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data.data);
        handleGetAsset();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const isVideo = filePath && /\.(mp4|webm|ogg)$/i.test(filePath);
  return (
    <>
      <div>
        <div className="Tabbutton">
          <ul className="flex items-center w-full">
            {/* <li
              className="lg:text-lg md:text-lg sm:text-sm xs:text-sm font-medium  w-1/2 text-center"
              onClick={() => updateMediaTab(1)}
            >
              <button
                className={
                  mediaTabs === 1
                    ? "Mediatabshow mediatabactive rounded-tl-xl "
                    : "Mediatab"
                }
              >
                Default Media
              </button>
            </li> */}
            {/* <li
              className="lg:text-lg md:text-lg sm:text-sm xs:text-sm font-medium   w-1/2 text-center"
              onClick={() => updateMediaTab(2)}
            >
              <button
                className={
                  mediaTabs === 2
                    ? "Mediatabshow mediatabactive rounded-tr-xl"
                    : "Mediatab"
                }
              >
                Emergency Media
              </button>
            </li> */}
          </ul>
        </div>
        {mediaTabs === 1 && (
          <>
            <div>
              <div className="grid grid-cols-12 items-center">
                <div className=" lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12 p-3">
                  <div className="flex items-center justify-center mb-5 flex-wrap">
                    <label className="mr-3 text-primary lg:text-lg md:text-lg sm:text-base xs:text-base font-medium py-2">
                      Asset / Playing:
                    </label>
                    <button
                      onClick={(e) => {
                        setShowAssetModal(true);
                        setSelectedAsset({
                          ...selectedAsset,
                          assetName: e.target.value,
                        });
                      }}
                      className="flex  items-center border-primary border rounded-full lg:pr-3 sm:px-5  py-2  text-sm   hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                    >
                      {assetName}
                      <AiOutlineCloudUpload className="ml-2 text-lg" />
                    </button>
                    {showAssetModal && (
                      <>
                        <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none myplaylist-popup">
                          <div className="relative w-auto my-6 mx-auto myplaylist-popup-details">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none addmediapopup">
                              <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
                                <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium">
                                  Set Content to Add Media
                                </h3>
                                <button
                                  className="p-1 text-xl"
                                  onClick={() => setShowAssetModal(false)}
                                >
                                  <AiOutlineCloseCircle className="text-2xl" />
                                </button>
                              </div>

                              <div className="relative lg:p-6 md:p-6 sm:p-2 xs:p-1 flex-auto">
                                <div className="bg-white rounded-[30px]">
                                  <div>
                                    <div className="lg:flex lg:flex-wrap lg:items-center md:flex md:flex-wrap md:items-center sm:block xs:block">
                                      <div className="lg:p-10 md:p-10 sm:p-1 xs:mt-3 sm:mt-3 drop-shadow-2xl bg-white rounded-3xl">
                                        <div>
                                          <div className="flex border-b border-lightgray flex-wrap items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center">
                                            <div className="mb-5 relative searchbox">
                                              <AiOutlineSearch className="absolute top-[13px] left-[12px] z-10 text-gray" />
                                              <input
                                                type="text"
                                                placeholder=" Search by Name"
                                                className="border border-primary rounded-full px-7 py-2 search-user"
                                                value={searchAsset}
                                                onChange={handleFilter}
                                              />
                                            </div>
                                            <Link to="/fileupload">
                                              <button className="flex align-middle border-SlateBlue bg-SlateBlue text-white items-center border rounded-full px-4 py-2 text-sm  hover:text-white hover:bg-primary hover:shadow-lg hover:shadow-primary-500/50 hover:border-white">
                                                Upload
                                              </button>
                                            </Link>
                                          </div>
                                          <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto min-h-[300px] max-h-[300px] object-cover">
                                            <table
                                              className="AddMedia-table"
                                              style={{
                                                borderCollapse: "separate",
                                                borderSpacing: " 0 10px",
                                              }}
                                            >
                                              <thead className="sticky top-0">
                                                <tr className="bg-lightgray">
                                                  <th className="p-3 w-80 text-left">
                                                    Media Name
                                                  </th>
                                                  <th>Date Added</th>
                                                  <th className="p-3">Size</th>
                                                  <th className="p-3">Type</th>
                                                </tr>
                                              </thead>
                                              {assetData.map((asset) => (
                                                <tbody key={asset.assetID}>
                                                  <tr
                                                    className={`${
                                                      selectedAsset === asset
                                                        ? "bg-[#f3c953]"
                                                        : ""
                                                    } border-b border-[#eee] `}
                                                    onClick={() => {
                                                      handleAssetAdd(asset);
                                                    }}
                                                  >
                                                    <td className="p-3">
                                                      {asset.assetName}
                                                    </td>
                                                    <td className="p-3">
                                                      {moment(
                                                        asset.createdDate
                                                      ).format(
                                                        "YYYY-MM-DD hh:mm"
                                                      )}
                                                    </td>
                                                    <td className="p-3">
                                                      {asset.fileSize}
                                                    </td>
                                                    <td className="p-3">
                                                      {asset.assetType}
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              ))}
                                            </table>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-between items-center p-5">
                                <p className="text-black">
                                  Content will always be playing Confirm
                                </p>
                                <button
                                  className="bg-SlateBlue text-white rounded-full px-5 py-2 hover:bg-primary text-sm"
                                  onClick={() => {
                                    setShowAssetModal(false);
                                    handleChangeMedia();
                                  }}
                                >
                                  Confirm
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="text-center">
                    <button className="bg-white text-primary lg:text-base md:text-base sm:text-sm xs:text-sm lg:px-6 md:px-6 sm:px-4 xs:px-4 lg:py-3 md:py-3 sm:py-2 xs:py-2 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2">
                      Cancel
                    </button>
                    <button className="bg-primary text-white lg:text-base md:text-base sm:text-sm xs:text-sm lg:px-8 md:px-8 sm:px-6 xs:px-6 lg:py-3 md:py-3 sm:py-2 xs:py-2 border border-primary  shadow-md rounded-full hover:bg-white hover:text-primary">
                      Save
                    </button>
                  </div>
                </div>
                <div className=" lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                  {filePath && isVideo ? (
                    // Render video player
                    <ReactPlayer
                      url={filePath}
                      className="max-w-full max-h-full reactplayer min-w-full"
                      controls={true} // Add controls for video
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    // Render image
                    <img
                      src={filePath}
                      alt="Media"
                      className="max-w-full max-h-full"
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* {mediaTabs === 2 && (
          <>
            <div>
              <div className="grid grid-cols-12 items-center">
                <div className=" lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12 p-3">
                  <div className="flex items-center  mb-5 flex-wrap">
                    <label className="mr-3 text-primary lg:text-lg md:text-lg sm:text-base xs:text-base font-medium py-2">
                      Asset / Playing:
                    </label>
                    <button className="flex  items-center border-primary border rounded-full lg:pr-3 sm:px-5  py-2  text-sm   hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                      Asset Name
                      <AiOutlineCloudUpload className="ml-2 text-lg" />
                    </button>
                  </div>

                  <div className="flex items-center  mb-5 flex-wrap">
                    <label className="mr-3 text-primary lg:text-lg md:text-lg sm:text-base xs:text-base font-medium py-2">
                      Condition:
                    </label>
                    <label className="border border-[#D5E3FF] rounded-lg  text-base text-[#515151] p-3">
                      sunny, rainy, windy, stormy
                    </label>
                  </div>

                  <div className="flex items-center  mb-5 flex-wrap">
                    <label className="mr-3 text-primary lg:text-lg md:text-lg sm:text-base xs:text-base font-medium py-2">
                      Play When temp goes above:
                    </label>
                    <div className="formgroup border-[#D5E3FF]">
                      <select className="formInput">
                        <option>40C</option>
                        <option>45C</option>
                        <option>50C</option>
                        <option>55C</option>
                        <option>60C</option>
                        <option>Custom</option>
                      </select>
                    </div>
                  </div>

                  <div className="">
                    <button className="bg-white text-primary lg:text-base md:text-base sm:text-sm xs:text-sm lg:px-6 md:px-6 sm:px-4 xs:px-4 lg:py-3 md:py-3 sm:py-2 xs:py-2 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2">
                      Cancel
                    </button>
                    <button className="bg-primary text-white lg:text-base md:text-base sm:text-sm xs:text-sm lg:px-8 md:px-8 sm:px-6 xs:px-6 lg:py-3 md:py-3 sm:py-2 xs:py-2 border border-primary  shadow-md rounded-full hover:bg-white hover:text-primary">
                      Save
                    </button>
                  </div>
                </div>
                <div className=" lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                  <img src="../../../Settings/media2.png" className="w-full" />
                </div>
              </div>
            </div>
          </>
        )} */}
      </div>
    </>
  );
};

export default Defaultmedia;
