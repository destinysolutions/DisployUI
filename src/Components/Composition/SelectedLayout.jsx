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
  GET_ALL_TEXT_SCROLL_INSTANCE,
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
import toast from "react-hot-toast";

const SelectLayout = ({ sidebarOpen, setSidebarOpen }) => {
  SelectLayout.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const currentDate = new Date();

  const [modalVisible, setModalVisible] = useState(false);
  const [compositonData, setcompositonData] = useState(null);
  const [currentSection, setcurrentSection] = useState(1);
  const [Testasset, setTestasset] = useState({});
  const [compositionName, setCompositionName] = useState(
    moment(currentDate).format("YYYY-MM-DD hh:mm")
  );
  const [assetData, setAssetData] = useState([]);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [addAsset, setAddAsset] = useState([]);
  const [edited, setEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingLoader, setSavingLoader] = useState(false);
  // const [jsonCanvasData, setJsonCanvasData] = useState([
  //   {
  //     layoutID: 1,
  //     layoutDtlID: 1,
  //     type: "rect",
  //     version: "5.3.0",
  //     originX: "left",
  //     originY: "top",
  //     left: 0,
  //     top: 0,
  //     width: 350,
  //     height: 150,
  //     fill: "#D9D9D9",
  //     stroke: "null",
  //     strokeWidth: 1,
  //     strokeDashArray: "null",
  //     strokeLineCap: "butt",
  //     strokeDashOffset: 0,
  //     strokeLineJoin: "miter",
  //     strokeUniform: false,
  //     strokeMiterLimit: 4,
  //     scaleX: 1,
  //     scaleY: 1,
  //     angle: 0,
  //     flipX: false,
  //     flipY: false,
  //     opacity: 1,
  //     shadow: "null",
  //     visible: true,
  //     backgroundColor: "",
  //     fillRule: "nonzero",
  //     paintFirst: "fill",
  //     globalCompositeOperation: "source-over",
  //     skewX: 0,
  //     skewY: 0,
  //     rx: 0,
  //     ry: 0,
  //   },
  // ]);

  const { state } = useLocation();

  const UserData = useSelector((Alldata) => Alldata.user);

  const authToken = `Bearer ${UserData.user.data.token}`;

  const { editor, onReady } = useFabricJSEditor();

  const navigate = useNavigate();

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const onCancel = () => navigate("/addcomposition");

  const { id } = useParams();

  const totalDurationSeconds = addAsset
    .map((e, index) => e[index + 1])
    .flat(Infinity)
    .filter((item) => item?.duration !== undefined)
    .reduce((acc, curr) => {
      if (curr?.duration !== undefined && curr?.duration !== null) {
        return acc + Number(curr?.duration);
      }
    }, 0);

  const _onReady = (canvas) => {
    fabric.Image.fromURL(DEFAULT_IMAGE, (img) => {
      canvas.renderAll();
      onReady(canvas);
    });
  };

  const onSave = async () => {
    const newdata = [];
    addAsset.map((item, index) => {
      item[index + 1].map((i) => newdata.push(i));
    });
    let data = JSON.stringify({
      compositionID: 0,
      compositionName: compositionName,
      resolution: "1920 * 1080",
      tags: "tags",
      layoutID: id,
      userID: 0,
      duration: totalDurationSeconds,
      dateAdded: new Date(),
      sections: newdata,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: ADDPLAYLIST,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      data,
    };
    setSavingLoader(true);
    await axios
      .request(config)
      .then((response) => {
        if (response?.data?.status == 200) {
          navigate("/composition");
          setSavingLoader(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setSavingLoader(false);
        return error;
      });
  };

  const addSeletedAsset = (data, currSection) => {
    const findLayoutDetailID = compositonData?.lstLayloutModelList.find(
      (item) => item?.sectionID == currentSection
    );

    let newdatas = { ...Testasset };
    if (newdatas?.[currentSection]) {
      newdatas[currentSection].push({
        duration: 10,
        isEdited: false,
        sectionID: currentSection,
        compositionDetailsID: 0,
        compositionID: 0,
        mediaID: data?.assetID,
        durationType: "Second",
        layoutDetailsID: findLayoutDetailID?.layoutID,
        userID: 0,
        mediaTypeID: 1,
        assetName: data?.assetName,
        assetFolderPath: data?.assetFolderPath,
        resolutions: data?.resolutions,
        fileExtention: data?.fileExtention,
        fileSize: data?.fileSize,
        assetType: data?.assetType,
        type: data?.type,
        perentID: data?.perentID,
        userName: data?.userName,
        text: data?.text,
        scrollType: data?.scrollType,
        instanceName: data?.instanceName,
      });
    } else {
      newdatas[currentSection] = [
        {
          duration: 10,
          isEdited: false,
          sectionID: currentSection,
          compositionDetailsID: 0,
          compositionID: 0,
          mediaID: data?.assetID,
          durationType: "Second",
          layoutDetailsID: findLayoutDetailID?.layoutID,
          userID: 0,
          mediaTypeID: 1,
          assetName: data?.assetName,
          assetFolderPath: data?.assetFolderPath,
          resolutions: data?.resolutions,
          fileExtention: data?.fileExtention,
          fileSize: data?.fileSize,
          assetType: data?.assetType,
          type: data?.type,
          perentID: data?.perentID,
          userName: data?.userName,
          text: data?.text,
          scrollType: data?.scrollType,
          instanceName: data?.instanceName,
        },
      ];
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
    if (Number(e) > 300) {
      toast.remove();
      toast.error("Seconds should be less than or equal to 300.");
    }
    if (Number(e) < 1) {
      toast.remove();
      toast.error("Minimum number should 1.");
      return;
    }

    const CompositionData = [...addAsset];

    const updated = CompositionData.map((item, index) => {
      if (index + 1 == currentSection) {
        return {
          ...item,
          [currentSection]: item[currentSection].map((items, i) => {
            if (i == id) {
              return { ...items, duration: e };
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
            return { ...items, duration: e };
          } else {
            return items;
          }
        }
      );
    }
    setTestasset(ChnagedObject);
    setAddAsset(updated);
  };

  const handleShowPreview = () => {
    toast.remove();
    if (
      addAsset.map((e, index) => e[index + 1].length).includes(0) ||
      addAsset.length === 0 ||
      addAsset.length !== compositonData?.lstLayloutModelList.length
    ) {
      toast.error("Please select assests for both sections.");
      return;
    }
    openModal();
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
        width: 80,
        height: 70,
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
        left: 0,
        top: 70,
        width: 80,
        height: 30,
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
      {
        layoutID: 2,
        layoutDtlID: 1,
        type: "rect",
        version: "5.3.0",
        originX: "left",
        originY: "top",
        left: 80,
        top: 0,
        width: 20,
        height: 100,
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
    ],
  };

  const handleFetchLayoutById = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${SELECT_BY_LIST}?LayoutID=${id}`,
      headers: { Authorization: authToken },
      data: "",
    };
    setLoading(true);
    axios
      .request(config)
      .then((response) => {
        if (response?.data?.status == 200) {
          setcompositonData(response.data?.data[0]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleFetchAllData = () => {
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
        return allAssets;
      })
      .then((res) => {
        axios
          .get(GET_ALL_TEXT_SCROLL_INSTANCE, {
            headers: {
              Authorization: authToken,
            },
          })
          .then((response) => {
            // const newData = [...res, ...response?.data?.data];
            // console.log(newData);
            setAssetData([...res, ...response?.data?.data]);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    handleFetchLayoutById();
    handleFetchAllData();
  }, []);

  // console.log(compositonData);
  // console.log(assetData);
  // console.log(addAsset);

  const items = [
    {
      layoutID: 6,
      layoutDtlID: 2,
      type: "rect",
      version: "5.3.0",
      originX: "left",
      originY: "top",
      leftside: 1,
      topside: 1,
      width: 60,
      height: 100,
      fill: "#D9D9D9",
      stroke: "#8E94A9",
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
      sectionID: 1,
      top: 1,
      left: 1,
      right: 0,
      bottom: 0,
    },
    {
      layoutID: 7,
      layoutDtlID: 2,
      type: "rect",
      version: "5.3.0",
      originX: "left",
      originY: "top",
      leftside: 1,
      topside: 1,
      width: 40,
      height: 100,
      fill: "#000000",
      stroke: "#8E94A9",
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
      sectionID: 1,
      top: 1,
      left: 0,
      right: 1,
      bottom: 0,
    },
  ];
  // console.log(items);

  return (
    <>
      <div className="flex bg-white py-3 border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5 page-contain ">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <PreviewModal show={modalVisible} onClose={closeModal}>
            <div
              className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 `}
              style={{
                maxWidth: `${compositonData?.screenWidth}px`,
                minWidth: `${compositonData?.screenWidth}px`,
                maxHeight: `${compositonData?.screenHeight}px`,
                minHeight: `${compositonData?.screenHeight}px`,
              }}
            >
              <RxCrossCircled
                className="absolute z-50 w-[30px] h-[30px] text-white hover:bg-black/50 bg-black/20 rounded-full top-1 right-1 cursor-pointer"
                onClick={closeModal}
              />

              {!loading &&
              compositonData !== null &&
              compositonData?.lstLayloutModelList.length > 2
                ? jsonCanvasData.objects.map((obj, index) => (
                    <div
                      key={index}
                      style={{
                        position: "absolute",
                        left: obj.left + "%",
                        top: obj.top + "%",
                        width: obj.width + "%",
                        height: obj.height + "%",
                        backgroundColor: obj.fill,
                        // Apply other CSS properties as needed
                      }}
                    >
                      {modalVisible && (
                        <Carousel items={addAsset[index][index + 1]} />
                      )}
                    </div>
                  ))
                : compositonData?.lstLayloutModelList?.map((obj, index) => (
                    <div
                      key={index}
                      style={{
                        // width: "20%",
                        // height: "20%",
                        width: obj?.width + "px",
                        height: obj?.height + "px",
                        backgroundColor: obj.fill,
                      }}
                    >
                      {modalVisible && (
                        <Carousel
                          items={addAsset[index][index + 1]}
                          // items={items}
                          compositonData={obj}
                        />
                      )}
                    </div>
                  ))}
            </div>
          </PreviewModal>

          {/* top div edit date&time + btns  */}
          <div className="lg:flex lg:justify-between sm:block xs:block  items-center mt-5">
            {edited ? (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  className="border border-primary rounded-full px-7 py-2.5 block"
                  placeholder="Enter schedule name"
                  value={compositionName}
                  onChange={(e) => setCompositionName(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => {
                    setEdited(false);
                  }}
                >
                  Save
                </button>
                {/* <button type="button" onClick={() => setEdited(false)}>
                  Cancel
                </button> */}
              </div>
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
                disabled={savingLoader}
                className="sm:ml-2 xs:ml-1  flex align-middle border-white bg-SlateBlue text-white items-center border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
              >
                Cancel
              </button>
              <button
                onClick={handleShowPreview}
                className="sm:ml-2 xs:ml-1  flex align-middle border-white bg-SlateBlue text-white items-center border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                disabled={savingLoader}
              >
                Preview
              </button>
              <button
                onClick={onSave}
                disabled={savingLoader}
                className="sm:ml-2 xs:ml-1  flex align-middle border-white bg-SlateBlue text-white items-center border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
              >
                {savingLoader ? "Saving..." : "Save"}
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
              <div className="overflow-y-auto min-h-[50vh] max-h-[50vh] rounded-xl mt-8 shadow bg-white mb-6">
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
                        className="border-b border-b-[#E4E6FF] cursor-pointer"
                        onClick={() => addSeletedAsset(assetdata, index + 1)}
                      >
                        <td className="break-words">
                          {" "}
                          {assetdata.assetName || assetdata?.instanceName}
                        </td>
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
                    Duration:-&nbsp;<span>{totalDurationSeconds} Sec</span>
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
                      addAsset[currentSection - 1] &&
                      addAsset[currentSection - 1][currentSection].map(
                        (item, index) => {
                          return (
                            <tr
                              key={index}
                              className="w-full flex items-center md:gap-5 gap-3"
                            >
                              <td>
                                <div className="flex items-center w-full">
                                  <div
                                    className={` ${
                                      item?.instanceName
                                        ? "w-auto"
                                        : "min-w-[2rem] min-h-[2rem] max-w-[3rem] max-h-[3rem]"
                                    } `}
                                  >
                                    <>
                                      {item.assetType === "OnlineImage" && (
                                        <>
                                          <img
                                            className="w-full h-full rounded-sm"
                                            src={item?.assetFolderPath}
                                            alt={item?.assetName}
                                          />
                                        </>
                                      )}
                                      {item.assetType === "Image" && (
                                        <img
                                          src={item?.assetFolderPath}
                                          alt={item?.assetName}
                                          className="imagebox relative"
                                        />
                                      )}
                                      {item.assetType === "Video" && (
                                        <video
                                          controls
                                          className="w-full h-full rounded-sm"
                                        >
                                          <source
                                            src={item?.assetFolderPath}
                                            type="video/mp4"
                                          />
                                          Your browser does not support the
                                          video tag.
                                        </video>
                                      )}
                                      {item.assetType === "DOC" && (
                                        <a
                                          href={item?.assetFolderPath}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {item.assetName}
                                        </a>
                                      )}
                                      {item.instanceName && (
                                        <a
                                          href={item?.instanceName}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {item.instanceName}
                                        </a>
                                      )}
                                    </>
                                  </div>
                                  <div className="ml-3 w-24">
                                    <p className="text-gray-900 break-words hyphens-auto">
                                      {item?.assetName && item?.assetName}
                                      {item?.text && item?.text}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center w-24">
                                {item?.assetType}
                              </td>
                              <td
                                className={`text-center w-fit ${
                                  item?.instanceName && "hidden"
                                }`}
                              >
                                {!item?.isEdited ? (
                                  <span className="border whitespace-nowrap border-[#E4E6FF] rounded-full p-2">
                                    {item.duration} Sec
                                  </span>
                                ) : (
                                  <span className="border border-[#E4E6FF] rounded-full w-full">
                                    <input
                                      className="outline-none border border-[#E4E6FF] rounded-full p-2 w-full"
                                      value={item.duration}
                                      type="number"
                                      onChange={(e) =>
                                        onChangeSelectedAsset(
                                          e.target.value,
                                          index
                                        )
                                      }
                                      min="0"
                                      max="300"
                                    />
                                  </span>
                                )}
                              </td>
                              <td className="text-sm flex justify-end items-center gap-2 w-24">
                                <a onClick={() => onEditSelectedAsset(index)}>
                                  <img
                                    src="../../../Settings/edit-icon.svg"
                                    className="min-w-[2rem] cursor-pointer"
                                  />
                                </a>
                                <a onClick={() => deleteSeletedAsset(index)}>
                                  <img
                                    src="../../../Settings/delete-icon.svg"
                                    className="min-w-[2rem] cursor-pointer"
                                  />
                                </a>
                              </td>
                            </tr>
                          );
                        }
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
