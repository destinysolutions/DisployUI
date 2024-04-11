import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Footer from "../Footer";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { AiOutlineSave, AiOutlineSearch } from "react-icons/ai";
import { useFabricJSEditor } from "fabricjs-react";
import { fabric } from "fabric";
import axios from "axios";
import { FaSave } from "react-icons/fa";
import {
  ADDPLAYLIST,
  ADDSUBPLAYLIST,
  GET_ALL_FILES,
  GET_ALL_TEXT_SCROLL_INSTANCE,
  GET_ALL_YOUTUBEDATA,
  SELECT_BY_LIST,
} from "../../Pages/Api";
import PreviewModal from "./PreviewModel";
import { RxCrossCircled } from "react-icons/rx";
import Carousel from "./DynamicCarousel";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Delete_icon from "../../images/Settings/delete-icon.svg";
import edit_icon from "../../images/Settings/edit-icon.svg";
import view_icon from "../../images/Settings/view-icon.svg";
import { useSelector } from "react-redux";
import moment from "moment";
import { GoPencil } from "react-icons/go";
import toast from "react-hot-toast";
import { useRef } from "react";
import ReactPlayer from "react-player";
import ShowAppsModal from "../ShowAppsModal";
import { Button, Input } from "@material-tailwind/react";
import { HiDocumentDuplicate } from "react-icons/hi2";

const DEFAULT_IMAGE = "";
const SelectLayout = ({ sidebarOpen, setSidebarOpen }) => {
  SelectLayout.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [compositonData, setcompositonData] = useState(null);
  const [currentSection, setcurrentSection] = useState(1);
  const [Testasset, setTestasset] = useState({});
  const [compositionName, setCompositionName] = useState(
    moment().format("YYYY-MM-DD hh:mm A")
  );
  const [assetData, setAssetData] = useState([]);
  const [addAsset, setAddAsset] = useState([]);
  const [edited, setEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingLoader, setSavingLoader] = useState(false);
  const [activeTab, setActiveTab] = useState("asset");
  const [dragStartForDivToDiv, setDragStartForDivToDiv] = useState(false);
  const [screenType, setScreenType] = useState("");
  const [showAppModal, setShowAppModal] = useState(false);

  const { state } = useLocation();
  const { token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const { editor, onReady } = useFabricJSEditor();

  const navigate = useNavigate();

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const modalRef = useRef(null);

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
    toast.remove();
    if (compositionName === "") {
      return toast.error("Please add compostition name");
    }
    if (
      addAsset.map((e, index) => e[index + 1].length).includes(0) ||
      addAsset.length === 0 ||
      addAsset.length !== compositonData?.lstLayloutModelList.length
    ) {
      return toast.error("Please select assests for every section.");
    }
    const newdata = [];
    addAsset.map((item, index) => {
      item[index + 1].map((i) => newdata.push(i));
    });
    let data = JSON.stringify({
      compositionID: 0,
      compositionName: compositionName,
      resolution: "1920 x 1080",
      tags: "",
      layoutID: id,
      userID: 0,
      duration: totalDurationSeconds,
      dateAdded: moment().format("YYYY-MM-DD hh:mm"),
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
          if (window.history.length > 2) {
            navigate("/composition");
          } else {
            localStorage.setItem("isWindowClosed", "true");
            window.close();
          }
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

    function findMediaId() {
      if (data?.textScroll_Id !== null && data?.textScroll_Id !== undefined) {
        return data?.textScroll_Id;
      } else if (data?.assetID !== null && data?.assetID !== undefined) {
        return data?.assetID;
      } else if (data?.youtubeId !== null && data?.youtubeId !== undefined) {
        return data?.youtubeId;
      }
    }

    let newdatas = { ...Testasset };
    if (Object.keys(newdatas).length === 0) {
      for (const [key, value] of Object.entries(
        compositonData.lstLayloutModelList
      )) {
        if (currentSection !== +key + 1) {
          newdatas[+key + 1] = [];
        }
      }
    }
    if (newdatas?.[currentSection]) {
      newdatas[currentSection].push({
        duration: 10,
        isEdited: false,
        sectionID: currentSection,
        compositionDetailsID: 0,
        compositionID: 0,
        layoutDetailsID: findLayoutDetailID?.layoutID,
        userID: 0,
        mediaID: findMediaId(),
        durationType: "Second",
        mediaTypeID:
          data?.textScroll_Id !== null && data?.textScroll_Id !== undefined
            ? 4
            : data?.youtubeId !== null && data?.youtubeId !== undefined
              ? 5
              : 1,
        assetName: data?.assetName,
        assetFolderPath:
          data?.assetFolderPath === undefined && data?.youTubeURL !== undefined
            ? data?.youTubeURL
            : data?.assetFolderPath,
        resolutions: data?.resolutions,
        fileExtention: data?.fileExtention,
        fileSize: data?.fileSize,
        assetType:
          data?.assetType === undefined && data?.youTubeURL !== undefined
            ? "Video"
            : data?.text && data?.assetType === undefined
              ? "Text"
              : data?.assetType,
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
          layoutDetailsID: findLayoutDetailID?.layoutID,
          userID: 0,
          mediaID: findMediaId(),
          durationType: "Second",
          mediaTypeID:
            data?.textScroll_Id !== null && data?.textScroll_Id !== undefined
              ? 4
              : data?.youtubeId !== null && data?.youtubeId !== undefined
                ? 5
                : 1,
          assetName: data?.assetName,
          assetFolderPath:
            data?.assetFolderPath === undefined &&
              data?.youTubeURL !== undefined
              ? data?.youTubeURL
              : data?.assetFolderPath,
          resolutions: data?.resolutions,
          fileExtention: data?.fileExtention,
          fileSize: data?.fileSize,
          assetType:
            data?.assetType === undefined && data?.youTubeURL !== undefined
              ? "Video"
              : data?.text && data?.assetType === undefined
                ? "Text"
                : data?.assetType,
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
              return {
                ...items,
                isEdited: !items.isEdited,
                duration: items?.duration === "" ? "1" : items?.duration,
              };
            } else {
              return {
                ...items,
                duration: items?.duration === "" ? "1" : items?.duration,
              };
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
            return {
              ...items,
              isEdited: !items.isEdited,
              duration: items?.duration === "" ? "1" : items?.duration,
            };
          } else {
            return {
              ...items,
              duration: items?.duration === "" ? "1" : items?.duration,
            };
          }
        }
      );
    }
    setTestasset(ChnagedObject);
    setAddAsset(updated);
  };

  const onChangeSelectedAsset = (e, id) => {
    if (e.length > 3) {
      toast.remove();
      toast.error("Seconds should be less than or equal to 3 digits.");
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
      toast.error("Please select assests for every section.");
      return;
    }
    setScreenType(compositonData?.screenType);
    openModal();
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
            const data = [...res, ...response?.data?.data];
            return data;
          })
          .then((res) => {
            axios
              .get(GET_ALL_YOUTUBEDATA, {
                headers: {
                  Authorization: authToken,
                },
              })
              .then((response) => {
                const fetchedData = response.data.data;
                setAssetData([...res, ...fetchedData]);
              });
          });
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const handleOnSaveCompositionName = () => {
    if (!compositionName.replace(/\s/g, "").length) {
      toast.remove();
      return toast.error("Please enter some text.");
    }
    setEdited(false);
  };

  const handleClickOnCancel = () => {
    if (!addAsset.map((e, index) => e[index + 1].length).every((i) => i == 0)) {
      if (window.confirm("Changes are unsaved, Are you sure?")) {
        navigate("/addcomposition");
      }
    } else {
      navigate("/addcomposition");
    }
  };

  useEffect(() => {
    handleFetchLayoutById();
    handleFetchAllData();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const isClosed = localStorage.getItem("isWindowClosed");
      if (isClosed === "true") {
        handleFetchAllData();
        localStorage.setItem("isWindowClosed", "false");
        // window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutsidePreviewModal = (event) => {
      if (modalRef.current && !modalRef.current.contains(event?.target)) {
        closeModal();
      }
    };
    document.addEventListener("click", handleClickOutsidePreviewModal, true);
    return () => {
      document.removeEventListener(
        "click",
        handleClickOutsidePreviewModal,
        true
      );
    };
  }, [handleClickOutsidePreviewModal]);

  function handleClickOutsidePreviewModal() {
    closeModal();
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleDragStartForDivToDiv = (event, item) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(item));
    setDragStartForDivToDiv(true);
  };

  const handleDropForDivToDiv = (event) => {
    const item = event.dataTransfer.getData("text/plain");
    if (dragStartForDivToDiv) {
      addSeletedAsset(JSON.parse(item));
      setDragStartForDivToDiv(false);
      toast.remove();
      toast.success(`item added to the ${currentSection} section.`);
    }
  };

  const handleDragOverForDivToDiv = (event) => {
    event.preventDefault();
  };

  const handleDragStartWithinlist = (event, item, index) => {
    const obj = { ...item };
    Object.assign(obj, { startIndex: index });
    event.dataTransfer.setData("text/plain", JSON.stringify(obj));
  };

  const handleDropForWithinlist = (event, index) => {
    const item = JSON.parse(event.dataTransfer.getData("text/plain"));
    if (!dragStartForDivToDiv) {
      const reOrderData = reorder(
        addAsset[currentSection - 1][currentSection],
        item?.startIndex,
        index
      );
      let newdatas = {};

      if (Object.keys(newdatas).length === 0) {
        for (const [key, value] of Object.entries(
          compositonData.lstLayloutModelList
        )) {
          if (currentSection === +key + 1) {
            newdatas[+key + 1] = reOrderData;
          } else if (
            currentSection != +key + 1 &&
            Object.values(addAsset[key])[0].length > 0
          ) {
            newdatas[+key + 1] = Object.values(addAsset[key])[0];
          } else {
            newdatas[+key + 1] = [];
          }
        }
      }
      const newdd = Object.entries(newdatas).map(([k, i]) => ({ [k]: i }));
      setAddAsset(newdd);
    }
  };

  const handleDragOverForWithinlist = (event, index) => {
    event.preventDefault();
  };

  return (
    <>
      {showAppModal && <ShowAppsModal setShowAppModal={setShowAppModal} />}
      <div className="flex bg-white border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <PreviewModal show={modalVisible} onClose={closeModal}>
            <div
              ref={modalRef}
              className={`fixed border w-full left-1/2 -translate-x-1/2 ${screenType === "portrait"
                ? "md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72"
                : "md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72"
                }  `}
            >
              <RxCrossCircled
                className="fixed z-50 w-[30px] h-[30px] text-white bg-black rounded-full hover:bg-white hover:text-black -top-4 -right-4 cursor-pointer"
                onClick={closeModal}
              />

              {!loading &&
                compositonData !== null &&
                compositonData?.lstLayloutModelList?.map((obj, index) => (
                  <div
                    key={index}
                    style={{
                      position: "fixed",
                      left: obj.leftside + "%",
                      top: obj.topside + "%",
                      width: obj?.width + "%",
                      height: obj?.height + "%",
                      backgroundColor: obj.fill,
                    }}
                  >
                    {modalVisible && (
                      <Carousel
                        items={addAsset[index][index + 1]}
                        compositonData={obj}
                        isPlay={true}
                      />
                    )}
                  </div>
                ))}
            </div>
          </PreviewModal>

          {/* top div edit date&time + btns  */}
          <div className="lg:flex lg:justify-between sm:block xs:block  items-center">
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
                    handleOnSaveCompositionName();
                  }}
                >
                  <AiOutlineSave className="text-2xl ml-1 hover:text-primary" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex">
                  <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737]">
                    {compositionName}
                  </h1>
                  <button onClick={() => setEdited(true)}>
                    <GoPencil className="ml-4 text-lg" />
                  </button>
                </div>
              </>
            )}
            {/* cancel + preview + save btns */}
            <div className="flex md:mt-5 lg:mt-0 mt-2 sm:flex-wrap md:flex-nowrap xs:flex-wrap playlistbtn justify-end">
              <button
                onClick={handleClickOnCancel}
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
          <div className="flex flex-wrap rounded-xl lg:mt-8 mt-3 shadow bg-white">
            <div className="w-full xl:w-1/2 border-r-2 space-y-5 border-r-[#E4E6FF]">
              <div className="flex items-center justify-between  rounded-lg w-full text-white bg-SlateBlue">
                <div
                  onClick={() => setActiveTab("asset")}
                  className={`w-1/2 text-center p-2 ${activeTab === "asset" && "bg-black translate-x-0"
                    }  rounded-lg cursor-pointer transition-all duration-100  ease-in`}
                >
                  Assets
                </div>
                <div
                  onClick={() => setActiveTab("apps")}
                  className={`w-1/2 text-center rounded-lg transition-all duration-100 ease-in-out p-2 ${activeTab === "apps" && "bg-black"
                    } cursor-pointer`}
                >
                  Apps
                </div>
              </div>
              <div className="text-center">
                {activeTab === "asset" ? (
                  <Link to="/FileUpload" target="_blank">
                    <button
                      className="border-white bg-SlateBlue text-white border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                      onClick={() => {
                        localStorage.setItem("isWindowClosed", "false");
                      }}
                    >
                      Add New Assets
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={() => setShowAppModal(true)}
                    className="border-white bg-SlateBlue text-white border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                  >
                    Add New Apps
                  </button>
                )}
              </div>
              <div className="vertical-scroll-inner min-h-[50vh] max-h-[50vh] rounded-xl shadow bg-white mb-6">
                <table
                  className="w-full bg-white lg:table-fixed md:table-auto sm:table-auto xs:table-auto border border-[#E4E6FF]"
                  cellPadding={15}
                >
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

                  <tbody>
                    {!loading &&
                      assetData
                        .filter((item) => {
                          if (activeTab === "asset") {
                            if (
                              item.hasOwnProperty("assetID")
                            ) {
                              return item;
                            }
                          } else {
                            if (!item.hasOwnProperty("assetID")) {
                              return item;
                            }
                          }
                        })
                        .map((data, index) => (
                          <tr
                            key={index}
                            className="border-b border-b-[#E4E6FF] cursor-pointer"
                            onClick={() => addSeletedAsset(data, index + 1)}
                            draggable
                            onDragStart={(event) =>
                              handleDragStartForDivToDiv(event, data)
                            }
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
                                  direction={
                                    data?.scrollType == 1 ? "right" : "left"
                                  }
                                  scrollamount="10"
                                >
                                  {data?.text}
                                </marquee>
                              )}
                              {(data.assetType === "Video" ||
                                data.assetType === "OnlineVideo" ||
                                data.assetType === "Youtube" ||
                                data?.youTubeURL) && (
                                  <ReactPlayer
                                    url={
                                      data?.assetFolderPath || data?.youTubeURL
                                    }
                                    className="h-80px w-160px  relative z-10"
                                    controls={true}
                                    playing={false}
                                    loop={false}
                                  />
                                )}


                              {/*{data.assetType === "DOC" && (
                                <p href={data?.assetFolderPath}>
                                  {data.assetName}
                                </p>
                              )}*/}

                              {data.assetType === "DOC" && (
                                <div className="flex justify-center items-center">
                                  <HiDocumentDuplicate className=" text-primary text-4xl" />
                                </div>
                              )}
                            </td>
                            <td className="p-2 w-full text-center hyphens-auto break-words">
                              {data.assetName || data?.instanceName}
                            </td>
                            <td className="p-2 w-full text-center">
                              {data?.fileExtention
                                ? data?.fileExtention
                                : data?.assetType}
                              {data?.youtubeId && "Youtube video"}
                              {data?.textScroll_Id && "TextScroll"}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* right side div */}
            <div className="w-full xl:w-1/2 p-5">
              {/* section tabs && layout  */}
              <div className="flex flex-wrap border-b border-b-[#E4E6FF] pb-5 w-full">
                <div
                  className={`layout-img me-5 ${compositonData?.screenType === "portrait"
                    ? "w-24 h-36"
                    : "w-36 h-24"
                    } bg-[#D5E3FF] relative`}
                >
                  {!loading &&
                    compositonData !== null &&
                    compositonData?.lstLayloutModelList?.map((obj, index) => (
                      <div
                        key={index}
                        style={{
                          position: "absolute",
                          left: obj.leftside + "%",
                          top: obj.topside + "%",
                          width: obj?.width + "%",
                          height: obj?.height + "%",
                          backgroundColor:
                            currentSection == index + 1 && "#e4aa07",
                        }}
                        className="border border-black "
                      ></div>
                    ))}
                </div>
                <div className="layout-detaills">
                  <h3 className="text-lg font-medium block mb-3">
                    Duration:-&nbsp;<span>{totalDurationSeconds} Sec</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Array(compositonData?.lstLayloutModelList?.length)
                      .fill(2)
                      .map((item, index) => (
                        <button
                          className={`px-5 ${currentSection == index + 1
                            ? "bg-primary"
                            : "bg-white"
                            } ${currentSection == index + 1
                              ? "text-white"
                              : "text-primary"
                            }  rounded-full py-2 border border-primary `}
                          key={index}
                          onClick={() => setcurrentSection(index + 1)}
                        >
                          Section {index + 1}
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              {/* selected images */}
              <div
                onDrop={(event) => handleDropForDivToDiv(event, "main_div")}
                onDragOver={(event) => handleDragOverForDivToDiv(event)}
                className="custom-scrollbar min-h-[50vh] max-h-[50vh] mt-3 mb-6"
              >
                <table
                  className="w-full lg:table-fixed md:table-auto sm:table-auto xs:table-auto selected-img-table"
                  cellPadding={15}
                >
                  <tbody>
                    {addAsset.length > 0 &&
                      addAsset[currentSection - 1] !== undefined &&
                      addAsset[currentSection - 1][currentSection]?.map(
                        (item, index) => {
                          return (
                            <tr
                              onDrop={(event) =>
                                handleDropForWithinlist(event, index)
                              }
                              onDragOver={(event) =>
                                handleDragOverForWithinlist(event, index)
                              }
                              draggable
                              onDragStart={(event) =>
                                handleDragStartWithinlist(event, item, index)
                              }
                              key={index}
                              className="w-full flex cursor-grab items-center md:gap-5 gap-3"
                            >
                              <td className="">
                                {item.assetType === "OnlineImage" && (
                                  <img
                                    className="imagebox img_w relative  object-cover"
                                    src={item?.assetFolderPath}
                                    alt={item?.assetName}
                                  />
                                )}
                                {item.assetType === "Image" && (
                                  <img
                                    src={item?.assetFolderPath}
                                    alt={item?.assetName}
                                    className="imagebox img_w relative object-cover"
                                  />
                                )}
                                {item.instanceName && item?.scrollType && (
                                  <marquee
                                    className="text-lg w-full h-full flex items-center text-black"
                                    direction={
                                      item?.scrollType == 1 ? "right" : "left"
                                    }
                                    scrollamount="10"
                                  >
                                    {item?.text}
                                  </marquee>
                                )}
                                {(item.assetType === "Video" ||
                                  item.assetType === "OnlineVideo" ||
                                  item.assetType === "Youtube") && (
                                    <ReactPlayer
                                      url={item?.assetFolderPath}
                                      className="relative z-20 videoinner img_w max-h-10"
                                      controls={false}
                                      playing={false}
                                      loop={true}
                                    />
                                  )}

                                {item.assetType === "DOC" && (
                                  <div className="flex justify-center items-center">
                                    <HiDocumentDuplicate className=" text-primary text-4xl" />
                                  </div>
                                )}

                                {/*  {item.assetType === "DOC" && (
                                  <p href={item?.assetFolderPath}>
                                    {item.assetName}
                                  </p>
                              )}*/}
                              </td>
                              <td>
                                <div className="ml-3">
                                  <p className="text-gray-900 break-words hyphens-auto line-clamp-2">
                                    {item?.assetName && item?.assetName}
                                    {item?.text && item?.text}
                                    {item?.instanceName && item?.instanceName}
                                  </p>
                                </div>
                              </td>
                              <td className="text-center min-w-[20%]">
                                {item?.assetType ?? "-"}
                              </td>
                              <td className={`text-center min-w-[30%] `}>
                                {!item?.isEdited ? (
                                  <p className="border min-w-full whitespace-nowrap border-[#E4E6FF] rounded-full p-2">
                                    {item.duration} Sec
                                  </p>
                                ) : (
                                  // <p className="flex items-center gap-2 border-[#E4E6FF] rounded-full w-full min-w-[3rem]">

                                  <div className="relative flex items-center gap-2 border-[#E4E6FF] rounded-full w-full min-w-[3rem]">
                                    <Input
                                      className="outline-none border border-[#E4E6FF] rounded-full p-2 w-full min-w-full"
                                      value={item.duration}
                                      type="number"
                                      onChange={(e) =>
                                        onChangeSelectedAsset(
                                          e.target.value,
                                          index
                                        )
                                      }
                                      min="0"
                                      max="999"
                                    />
                                    <span
                                      // size="sm"
                                      // color={item.duration? "gray":"blue-gray" }
                                      className="absolute right-3 text-black font-normal shadow-none"
                                    >
                                      Sec
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td className="text-sm flex justify-end items-center gap-4 min-w-[20%]">
                                <a onClick={() => onEditSelectedAsset(index)}>
                                  {!item?.isEdited ? (
                                    <img
                                      src={edit_icon}
                                      className="w-10 cursor-pointer"
                                    />
                                  ) : (
                                    <img
                                      src={edit_icon}
                                      className="w-10 cursor-pointer"
                                    />
                                  )}
                                </a>
                                <a onClick={() => deleteSeletedAsset(index)}>
                                  <img
                                    src={Delete_icon}
                                    className="w-10 cursor-pointer"
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
                  Add Assets And Apps have from Left side panel
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
