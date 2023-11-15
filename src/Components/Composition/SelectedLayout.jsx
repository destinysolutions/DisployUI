import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Footer from "../Footer";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { AiOutlineSearch } from "react-icons/ai";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
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
import { useLocation, useNavigate } from "react-router-dom";
const DEFAULT_IMAGE = "";

import { useSelector } from "react-redux";

const SelectLayout = ({ sidebarOpen, setSidebarOpen }) => {
  SelectLayout.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const { state } = useLocation();
  const [addCounter, setaddCounter] = useState(1);
  const [assetData, setAssetData] = useState([]);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [addAsset, setAddAsset] = useState([]);
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;
  const [jsondata, setjsondata] = useState({
    version: 0,
    objects: [],
  });
  const { selectedObjects, editor, onReady } = useFabricJSEditor();
  const [modalVisible, setModalVisible] = useState(false);
  const [compositonData, setcompositonData] = useState([]);
  const [currentSection, setcurrentSection] = useState(1);
  const [Testasset, setTestasset] = useState({});

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const _onReady = (canvas) => {
    fabric.Image.fromURL(DEFAULT_IMAGE, (img) => {
      canvas.renderAll();
      onReady(canvas);
    });
  };
  const navigate = useNavigate();
  useEffect(() => {
    // console.log("state", state);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${SELECT_BY_LIST}?LayoutDtlID=${state?.layoutDtlID}`,
      headers: { Authorization: authToken },
      data: "",
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data?.data[0].lstLayloutModelList));
        setcompositonData(response.data?.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
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
  const onAddRectangle = () => {
    // editor.addRectangle();
    if (addCounter == 1) {
      const rect = new fabric.Rect({
        left: 0,
        top: 0,
        width: 350,
        height: 150,
        fill: "red",
      });
      editor.canvas.add(rect);

      // Bring the newly added rectangle to the front
      rect.bringToFront();

      editor.canvas.renderAll();
      setaddCounter(2);
    } else if (addCounter == 2) {
      const rect = new fabric.Rect({
        left: 350,
        top: 0,
        width: 125,
        height: 268,
        fill: "green",
      });
      editor.canvas.add(rect);

      // Bring the newly added rectangle to the front
      rect.bringToFront();

      editor.canvas.renderAll();
      setaddCounter(3);
    } else if (addCounter == 3) {
      const rect = new fabric.Rect({
        left: 0,
        top: 150,
        width: 350,
        height: 120,
        fill: "blue",
      });
      editor.canvas.add(rect);

      // Bring the newly added rectangle to the front
      rect.bringToFront();

      editor.canvas.renderAll();
      setaddCounter(4);
    } else {
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        right: 100,
        bottom: 100,
        width: 100,
        height: 100,
        fill: "orange",
      });
      editor.canvas.add(rect);

      // Bring the newly added rectangle to the front
      rect.bringToFront();

      editor.canvas.renderAll();
    }
  };

  const onDeleteAll = () => {
    editor.deleteAll();
    setText("");
    setaddCounter(1);
  };

  const onDeleteSelected = () => {
    editor.deleteSelected();
  };

  const onSave = async () => {
    // const canvasData = JSON.stringify(editor.canvas.toJSON());
    let data = new FormData();
    data.append("CompositionID", 0);
    data.append("CompositionName", state?.name);
    data.append("Resolution", "1920 x 1080");
    data.append("Tags", "Tags");
    data.append("LayoutID", state.layoutDtlID);
    data.append("UserID", 0);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: ADDPLAYLIST,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
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
                durationType: "hour",
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

    // console.log("===>", newdata);
  };

  const addSeletedAsset = (data, currentSection) => {
    console.log("data", data);
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
    setTestasset(newdatas);
    setAddAsset(newdd);
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
    // const newData = CompositionData.map((item, index) => {
    //   if (index == id) {
    //     return { ...item, PlayDuration: e };
    //   } else {
    //     return item;
    //   }
    // });
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
      {
        layoutID: 3,
        layoutDtlID: 1,
        type: "rect",
        version: "5.3.0",
        originX: "left",
        originY: "top",
        left: 0,
        top: 150,
        width: 350,
        height: 120,
        fill: "#7D87A9",
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
    ],
  };

  return (
    <>
      <div className="flex bg-white py-3 border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <PreviewModal show={modalVisible} onClose={closeModal}>
            <div className="flex relative justify-center items-center h-[268px] w-[476px]">
              <RxCrossCircled
                className="absolute z-50 w-[30px] h-[30px] text-white top-1 right-1"
                onClick={closeModal}
              />
              {jsonCanvasData.objects.map((obj, index) => (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    left: obj.left + "px",
                    top: obj.top + "px",
                    width: obj.width + "px",
                    height: obj.height + "px",
                    backgroundColor: obj.fill,
                    // Apply other CSS properties as needed
                  }}
                >
                  {modalVisible && (
                    <Carousel items={addAsset[index][index + 1]} />
                  )}
                </div>
              ))}
            </div>
          </PreviewModal>
          {/* <div className="lg:flex lg:justify-between sm:block xs:block items-center">
            <input
              type="text"
              placeholder="Sep 26th, 2023, 12:47 PM "
              className="border border-primary rounded-full px-7 py-2.5 block"
            />
            <div className="flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap playlistbtn">
              <button className="sm:ml-2 xs:ml-1  flex align-middle border-white bg-SlateBlue text-white items-center border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                Save
              </button>
            </div>
          </div> */}

          {/* <div className="w-full flex flex-wrap rounded-xl mt-8 shadow bg-white">
            <div className="flex w-full md:w-1/2 lg:w-1/2 xl:w-2/3 border-r-2 border-r-[#E4E6FF] p-5 justify-center items-center">
              <div className="layout-card block text-center cursor-pointer mx-auto ">
                <FabricJSCanvas
                  className="h-[268px] w-[476px] "
                  onReady={_onReady}
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:w-1/2 xl:w-2/3 p-5">
              <h3 className="text-lg font-medium block mb-3">Resolution</h3>
              <select
                data-te-select-init
                className="border border-primary rounded-full px-4 py-2.5 block "
              >
                <option value="1">Landscape 1920 x 1080</option>
                <option value="2">Portrait 1080 x 1920</option>
                <option value="3">Custom</option>
              </select>

              <div className="overflow-x-auto mt-3 mb-6">
                <table
                  className="w-full bg-white lg:table-fixed md:table-auto sm:table-auto xs:table-auto"
                  cellPadding={10}
                >
                  <tbody>
                    <tr>
                      <td className="w-16">
                        <strong>Section 1:</strong>{" "}
                      </td>
                      <td className="w-24">
                        <div className="flex items-center">
                          <span>Width</span>
                          <span className="px-2">
                            <input
                              type="text"
                              className="bg-gray-50 border border-[#E4E6FF] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="286"
                            />
                          </span>
                          <span className="me-5">Px,</span>
                        </div>
                      </td>
                      <td className="w-24">
                        <div className="flex items-center">
                          <span>Height</span>
                          <span className="px-2">
                            <input
                              type="text"
                              className="bg-gray-50 border border-[#E4E6FF] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="170"
                            />
                          </span>
                          <span>Px</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-16">
                        <strong>Section 2:</strong>{" "}
                      </td>
                      <td className="w-24">
                        <div className="flex items-center">
                          <span>Width</span>
                          <span className="px-2">
                            <input
                              type="text"
                              className="bg-gray-50 border border-[#E4E6FF] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="75"
                            />
                          </span>
                          <span className="me-5">Px,</span>
                        </div>
                      </td>
                      <td className="w-24">
                        <div className="flex items-center">
                          <span>Height</span>
                          <span className="px-2">
                            <input
                              type="text"
                              className="bg-gray-50 border border-[#E4E6FF] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="245"
                            />
                          </span>
                          <span>Px</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-16">
                        <strong>Section 3:</strong>{" "}
                      </td>
                      <td className="w-24">
                        <div className="flex items-center">
                          <span>Width</span>
                          <span className="px-2">
                            <input
                              type="text"
                              className="bg-gray-50 border border-[#E4E6FF] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="286"
                            />
                          </span>
                          <span className="me-5">Px,</span>
                        </div>
                      </td>
                      <td className="w-24">
                        <div className="flex items-center">
                          <span>Height</span>
                          <span className="px-2">
                            <input
                              type="text"
                              className="bg-gray-50 border border-[#E4E6FF] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="75"
                            />
                          </span>
                          <span>Px</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="click-add">
                <p>
                  Click (
                  <a href="#" className="text-filthy-brown">
                    Add Section
                  </a>
                  ) to add a new Section
                </p>
              </div>
            </div>
          </div> */}
          {/* OnSelect Section */}
          {/* <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(image)}`}
            className="h-20 w-20"
          /> */}

          <div className="lg:flex lg:justify-between sm:block xs:block  items-center mt-5">
            <input
              type="text"
              placeholder="Sep 26th, 2023, 12:47 PM "
              className="border border-primary rounded-full px-7 py-2.5 block"
            />
            <div className="flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap playlistbtn">
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
                <div className="search-part flex items-center">
                  <div className="relative ">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <AiOutlineSearch className="w-5 h-5 text-gray " />
                    </span>
                    <input
                      type="text"
                      placeholder="Search Content "
                      className="border border-primary rounded-full px-7 py-2.5 block w-full p-4 pl-10"
                    />
                  </div>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    className="ml-1 text-lg"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21 3H5a1 1 0 0 0-1 1v2.59c0 .523.213 1.037.583 1.407L10 13.414V21a1.001 1.001 0 0 0 1.447.895l4-2c.339-.17.553-.516.553-.895v-5.586l5.417-5.417c.37-.37.583-.884.583-1.407V4a1 1 0 0 0-1-1zm-6.707 9.293A.996.996 0 0 0 14 13v5.382l-2 1V13a.996.996 0 0 0-.293-.707L6 6.59V5h14.001l.002 1.583-5.71 5.71z"></path>
                  </svg>
                </div>
                <button
                  onClick={() => setShowAssetModal(true)}
                  className="sm:ml-2 xs:ml-1  flex align-middle border-white bg-SlateBlue text-white items-center border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                >
                  New Assets
                </button>
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
                        onClick={() =>
                          addSeletedAsset(assetdata, currentSection)
                        }
                      >
                        <td className="flex"> {assetdata.assetName}</td>
                        <td className="p-2">PNG</td>
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
                      compositonData.svg
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
                    {Array(compositonData.lstLayloutModelList?.length)
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

                    {/* <button className=" px-5 py-2 border border-primary rounded-full">
                      Section 2
                    </button> */}
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
                      addAsset[currentSection - 1] &&
                      addAsset[currentSection - 1][currentSection]?.map(
                        (item, index) => (
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
                                        Your browser does not support the video
                                        tag.
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
                        )
                      )}
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
