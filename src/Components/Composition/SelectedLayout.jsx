import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Footer from "../Footer";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { AiOutlineSearch } from "react-icons/ai";
import { useFabricJSEditor } from "fabricjs-react";
import { fabric } from "fabric";
import axios from "axios";
import {
  ADDPLAYLIST,
  ADDSUBPLAYLIST,
  GET_ALL_FILES,
  SELECT_BY_LIST,
} from "../../Pages/Api";
import AssetModal from "../Assests/AssetModal";
import PreviewModal from "./PreviewModel";
import { RxCrossCircled } from "react-icons/rx";
import Carousel from "./DynamicCarousel";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
const DEFAULT_IMAGE = "";

import { useSelector } from "react-redux";
import moment from "moment";
import { GoPencil } from "react-icons/go";

const SelectLayout = ({ sidebarOpen, setSidebarOpen }) => {
  SelectLayout.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const { state } = useLocation();
  const [edited, setEdited] = useState(false);
  const currentDate = new Date();
  const [compositionName, setCompositionName] = useState(
    moment(currentDate).format("YYYY-MM-DD hh:mm")
  );
  const [assetData, setAssetData] = useState([]);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [addAsset, setAddAsset] = useState([]);
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;
  const { editor, onReady } = useFabricJSEditor();
  const [modalVisible, setModalVisible] = useState(false);
  const [compositonData, setcompositonData] = useState([]);
  const [currentSection, setcurrentSection] = useState(1);
  const [Testasset, setTestasset] = useState({});

  const navigate = useNavigate();

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const onCancel = () => navigate("/addcomposition");

  const { id } = useParams();

  const _onReady = (canvas) => {
    fabric.Image.fromURL(DEFAULT_IMAGE, (img) => {
      canvas.renderAll();
      onReady(canvas);
    });
  };

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${SELECT_BY_LIST}?LayoutID=${id}`,
      headers: { Authorization: authToken },
      data: "",
    };

    axios
      .request(config)
      .then((response) => {
        setcompositonData(response.data?.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
    setcompositonData(state);
  }, []);

  useEffect(() => {
    axios
      .get(GET_ALL_FILES, {
        headers: {
          Authorization: authToken,
        },
      })
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
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onSave = async () => {
    let data = new FormData();
    data.append("CompositionID", 0);
    data.append("CompositionName", compositionName);
    data.append("Resolution", "1920 x 1080");
    data.append("Tags", "Tags");
    data.append("LayoutID", state.layoutDtlID);
    data.append("UserID", 0);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: ADDPLAYLIST,
      headers: {
        Authorization: authToken,
        "Content-Type": "multipart/form-data",
      },
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        console.log("===========>", response.data);
        const id = response.data?.data.compositionID;
        if (id) {
          const newdata = [];
          addAsset.map((item, index) => {
            console.log("item", item[index + 1]);
            item[index + 1].map((i) =>
              newdata.push({
                compositionDetailsID: 0,
                compositionID: id,
                mediaID: i.assetID,
                duration: i.PlayDuration,
                durationType: "Second",
                layoutDetailsID:
                  compositonData?.lstLayloutModelList[index].layoutID,
                userID: 0,
                mediaTypeID: 1,
              })
            );
          });
          const datas = JSON.stringify(newdata);
          console.log("data", datas);
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: ADDSUBPLAYLIST,
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken,
            },
            data: datas,
          };

          axios
            .request(config)
            .then((response) => {
              navigate("/composition");
              console.log("datauploaded", JSON.stringify(response.data));
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          alert("something went wrong not able to upload data");
        }
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  const addSeletedAsset = (data, currSection) => {
    console.log("data", data, currSection);
    let newdatas = { ...Testasset };
    if (newdatas?.[currentSection]) {
      newdatas[currentSection].push({
        ...data,
        PlayDuration: data.durations ? data.durations : 10,
        isEdited: true,
      });
    } else {
      newdatas[currentSection] = [{ ...data, PlayDuration: 1, isEdited: true }];
    }
    const newdd = Object.entries(newdatas).map(([k, i]) => ({ [k]: i }));
    console.log(newdatas, newdd);
    setTestasset(newdatas);
    setAddAsset(newdd);
    // const num = currentSection;
    // const datanew = { 1: data };
    // console.log(datanew);
    // setAddAsset([...addAsset, { currentSection: data }]);
  };

  const deleteSeletedAsset = (id) => {
    const updated = addAsset.map((item, index) => {
      if (index + 1 == currentSection) {
        return {
          ...item,
          [currentSection]: item[currentSection].filter(
            (item, index) => index !== id
          ),
        };
      } else {
        return item;
      }
    });
    const deletedobject = { ...Testasset };
    if (deletedobject?.[currentSection]) {
      deletedobject[currentSection] = deletedobject[currentSection].filter(
        (item, index) => index !== id
      );
    }
    setTestasset(deletedobject);

    setAddAsset(updated);
  };

  const onEditSelectedAsset = (id) => {
    const CompositionData = [...addAsset];
    const updated = CompositionData.map((item, index) => {
      if (index + 1 == currentSection) {
        return {
          ...item,
          [currentSection]: item[currentSection].map((items, i) => {
            if (i == id) {
              return { ...items, isEdited: !items.isEdited };
            } else {
              return items;
            }
          }),
        };
      } else {
        return item;
      }
    });
    const ChnagedObject = { ...Testasset };
    if (ChnagedObject?.[currentSection]) {
      ChnagedObject[currentSection] = ChnagedObject[currentSection].map(
        (items, i) => {
          if (i == id) {
            return { ...items, isEdited: !items.isEdited };
          } else {
            return items;
          }
        }
      );
    }
    setTestasset(ChnagedObject);
    setAddAsset(updated);
  };

  const onChangeSelectedAsset = (e, id) => {
    const CompositionData = [...addAsset];

    const updated = CompositionData.map((item, index) => {
      if (index + 1 == currentSection) {
        return {
          ...item,
          [currentSection]: item[currentSection].map((items, i) => {
            if (i == id) {
              return { ...items, PlayDuration: e };
            } else {
              return items;
            }
          }),
        };
      } else {
        return item;
      }
    });
    const ChnagedObject = { ...Testasset };
    if (ChnagedObject?.[currentSection]) {
      ChnagedObject[currentSection] = ChnagedObject[currentSection].map(
        (items, i) => {
          if (i == id) {
            return { ...items, PlayDuration: e };
          } else {
            return items;
          }
        }
      );
    }
    setTestasset(ChnagedObject);
    setAddAsset(updated);
  };

  const jsonCanvasData = {
    version: "5.3.0",
    objects: [
      {
        layoutID: 1,
        layoutDtlID: 1,
        type: "rect",
        version: "5.3.0",
        originX: "left",
        originY: "top",
        left: 0,
        top: 0,
        width: 350,
        height: 150,
        fill: "#D9D9D9",
        stroke: "null",
        strokeWidth: 1,
        strokeDashArray: "null",
        strokeLineCap: "butt",
        strokeDashOffset: 0,
        strokeLineJoin: "miter",
        strokeUniform: false,
        strokeMiterLimit: 4,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        flipX: false,
        flipY: false,
        opacity: 1,
        shadow: "null",
        visible: true,
        backgroundColor: "",
        fillRule: "nonzero",
        paintFirst: "fill",
        globalCompositeOperation: "source-over",
        skewX: 0,
        skewY: 0,
        rx: 0,
        ry: 0,
      },
      {
        layoutID: 2,
        layoutDtlID: 1,
        type: "rect",
        version: "5.3.0",
        originX: "left",
        originY: "top",
        left: 350,
        top: 0,
        width: 125,
        height: 268,
        fill: "#D5E3FF",
        stroke: "null",
        strokeWidth: 1,
        strokeDashArray: "null",
        strokeLineCap: "butt",
        strokeDashOffset: 0,
        strokeLineJoin: "miter",
        strokeUniform: false,
        strokeMiterLimit: 4,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        flipX: false,
        flipY: false,
        opacity: 1,
        shadow: "null",
        visible: true,
        backgroundColor: "",
        fillRule: "nonzero",
        paintFirst: "fill",
        globalCompositeOperation: "source-over",
        skewX: 0,
        skewY: 0,
        rx: 0,
        ry: 0,
      },
      // {
      //   layoutID: 3,
      //   layoutDtlID: 1,
      //   type: "rect",
      //   version: "5.3.0",
      //   originX: "left",
      //   originY: "top",
      //   left: 0,
      //   top: 150,
      //   width: 350,
      //   height: 120,
      //   fill: "#7D87A9",
      //   stroke: "null",
      //   strokeWidth: 1,
      //   strokeDashArray: "null",
      //   strokeLineCap: "butt",
      //   strokeDashOffset: 0,
      //   strokeLineJoin: "miter",
      //   strokeUniform: false,
      //   strokeMiterLimit: 4,
      //   scaleX: 1,
      //   scaleY: 1,
      //   angle: 0,
      //   flipX: false,
      //   flipY: false,
      //   opacity: 1,
      //   shadow: "null",
      //   visible: true,
      //   backgroundColor: "",
      //   fillRule: "nonzero",
      //   paintFirst: "fill",
      //   globalCompositeOperation: "source-over",
      //   skewX: 0,
      //   skewY: 0,
      //   rx: 0,
      //   ry: 0,
      // },
    ],
  };

  // console.log(compositonData);
  // console.log(addAsset);

  return (
    <>
      <div className="flex bg-white py-3 border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <PreviewModal show={modalVisible} onClose={closeModal}>
            <div className="grid relative  h-[268px] w-[476px]">
              <RxCrossCircled
                className="absolute z-50 w-[30px] h-[30px] text-white bg-black top-1 right-1 cursor-pointer"
                onClick={closeModal}
              />
              {/* <div className="w-full col-span-full text-center row-span-2 bg-red h-full "> */}
              {modalVisible && (
                <Carousel items={addAsset} compositonData={compositonData} />
              )}
              {/* </div> */}
              {/* <div className="w-full col-span-1 text-center row-span-2 bg-yellow-500 h-full">
                asd
              </div> */}
              {/* <div className="w-full col-span-full text-center row-span-1 bg-green h-full">
                {" "}
                asd
              </div> */}
              {/* {jsonCanvasData.objects.map((obj, index) => (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    left: obj.left + "px",
                    top: obj.top + "px",
                    width: obj.width + "px",
                    height: obj.height + "px",
                    backgroundColor: obj.fill,
                  }}
                >
                  {modalVisible && (
                    <Carousel items={addAsset[index][index + 1]} />
                  )}
                </div>
              ))} */}
            </div>
          </PreviewModal>

          <div className="lg:flex lg:justify-between sm:block xs:block  items-center mt-5">
            {edited ? (
              <input
                type="text"
                className="border border-primary rounded-full px-7 py-2.5 block"
                placeholder="Enter schedule name"
                value={compositionName}
                onChange={(e) => setCompositionName(e.target.value)}
              />
            ) : (
              <>
                <div className="flex">
                  <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
                    {compositionName}
                  </h1>
                  <button onClick={() => setEdited(true)}>
                    <GoPencil className="ml-4 text-lg" />
                  </button>
                </div>
              </>
            )}
            {/* cancel + preview + save btns */}
            <div className="flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap playlistbtn">
              <button
                onClick={onCancel}
                className="sm:ml-2 xs:ml-1  flex align-middle border-white bg-SlateBlue text-white items-center border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
              >
                Cancel
              </button>
              <button
                onClick={openModal}
                className="sm:ml-2 xs:ml-1  flex align-middle border-white bg-SlateBlue text-white items-center border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
              >
                Preview
              </button>
              <button
                onClick={onSave}
                className="sm:ml-2 xs:ml-1  flex align-middle border-white bg-SlateBlue text-white items-center border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
              >
                Save
              </button>
            </div>
          </div>
          <div className="flex flex-wrap rounded-xl mt-8 shadow bg-white">
            <div className="w-full md:w-1/2 border-r-2 border-r-[#E4E6FF] p-5">
              <div className="flex items-center justify-between mb-4">
                <Link to="/FileUpload">
                  <button
                    //onClick={() => setShowAssetModal(true)}
                    className="sm:ml-2 xs:ml-1  flex align-middle border-white bg-SlateBlue text-white items-center border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                  >
                    New Assets Upload
                  </button>
                </Link>
                {showAssetModal ? (
                  <>
                    <AssetModal setShowAssetModal={setShowAssetModal} />
                  </>
                ) : null}
              </div>
              <div className="overflow-y-auto min-h-[320px] max-h-[320px] rounded-xl mt-8 shadow bg-white mb-6">
                <table
                  className="w-full bg-white lg:table-fixed md:table-auto sm:table-auto xs:table-auto border border-[#E4E6FF]"
                  cellPadding={20}
                >
                  <thead>
                    <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg text-left">
                      <th className="text-[#5A5881] py-2.5 text-base font-semibold">
                        Assets Name
                      </th>
                      <th className="text-[#5A5881] py-2.5 text-base font-semibold">
                        Type
                      </th>
                      <th className="text-[#5A5881] py-2.5 text-base font-semibold">
                        Tags
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {assetData.map((assetdata, index) => (
                      <tr
                        key={index}
                        className="border-b border-b-[#E4E6FF]"
                        onClick={() => addSeletedAsset(assetdata, index + 1)}
                      >
                        <td className="break-words"> {assetdata.assetName}</td>
                        <td className="p-2">{assetdata.fileExtention}</td>
                        <td className="p-2 ">Tags, Tags </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="w-full md:w-1/2 p-5">
              <div className="flex border-b border-b-[#E4E6FF] pb-5">
                <div className="layout-img me-5">
                  <img
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(
                      compositonData?.svg
                    )}`}
                    alt="Logo"
                    className="w-32"
                  />
                </div>
                <div className="layout-detaills">
                  <h3 className="text-lg font-medium block mb-3">
                    Duration:-<span>0 Sec</span>
                  </h3>
                  <div className="flex">
                    {Array(compositonData?.lstLayloutModelList?.length)
                      .fill(2)
                      .map((item, index) => (
                        <button
                          className={`px-5 ${
                            currentSection == index + 1
                              ? "bg-primary"
                              : "bg-white"
                          } ${
                            currentSection == index + 1
                              ? "text-white"
                              : "text-primary"
                          }  rounded-full py-2 border border-primary me-3`}
                          key={index}
                          onClick={() => setcurrentSection(index + 1)}
                        >
                          Section {index + 1}
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto overflow-y-auto min-h-[320px] max-h-[320px] mt-3 mb-6">
                <table
                  className="w-full lg:table-fixed md:table-auto sm:table-auto xs:table-auto"
                  cellPadding={10}
                >
                  <tbody>
                    {addAsset.length > 0 &&
                      addAsset
                        .filter((item, index) => index + 1 === currentSection)
                        .map((item, index) => {
                          console.log(index + 1 === currentSection);
                          return (
                            <tr key={index}>
                              <td>
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 w-10 h-10">
                                    <>
                                      {item.assetType === "OnlineImage" && (
                                        <>
                                          <img
                                            className="w-full h-full rounded-sm"
                                            src={item.assetFolderPath}
                                            alt={item.assetName}
                                          />
                                        </>
                                      )}
                                      {item.assetType === "Image" && (
                                        <img
                                          src={item.assetFolderPath}
                                          alt={item.assetName}
                                          className="imagebox relative"
                                        />
                                      )}
                                      {item.assetType === "Video" && (
                                        <video
                                          controls
                                          className="w-full h-full rounded-sm"
                                        >
                                          <source
                                            src={item.assetFolderPath}
                                            type="video/mp4"
                                          />
                                          Your browser does not support the
                                          video tag.
                                        </video>
                                      )}
                                      {item.assetType === "DOC" && (
                                        <a
                                          href={item.assetFolderPath}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {item.assetName}
                                        </a>
                                      )}
                                    </>
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                      Assets 123
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center w-24">Image</td>
                              <td className="text-center w-24">
                                {item?.isEdited ? (
                                  <span className=" px-2 py-2 border border-[#E4E6FF] rounded-full">
                                    {item.PlayDuration} Sec
                                  </span>
                                ) : (
                                  <span className="flex  px-2 py-2 border border-[#E4E6FF] rounded-full">
                                    <input
                                      className="flex outline-none w-full"
                                      value={item.PlayDuration}
                                      onChange={(e) =>
                                        onChangeSelectedAsset(
                                          e.target.value,
                                          index
                                        )
                                      }
                                    />
                                  </span>
                                )}
                              </td>
                              <td className="text-sm flex justify-end w-24">
                                <a
                                  className="px-2"
                                  onClick={() => onEditSelectedAsset(index)}
                                >
                                  <img
                                    src="../../../Settings/edit-icon.svg"
                                    className="w-5"
                                  />
                                </a>
                                <a onClick={() => deleteSeletedAsset(index)}>
                                  <img
                                    src="../../../Settings/delete-icon.svg"
                                    className="w-5"
                                  />
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
              </div>

              <div className="click-add">
                <p className="text-filthy-brown">
                  Add Assets have from Left side panel
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default SelectLayout;
