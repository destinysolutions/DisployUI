import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { MdDeleteForever, MdOutlineModeEdit, MdSave } from 'react-icons/md';
import { GoPencil } from 'react-icons/go';
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AiOutlineClose } from 'react-icons/ai';
import moment from 'moment';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Footer';
import digitalMenuLogo from "../../images/AppsImg/foods.svg";
import { FaRegQuestionCircle } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';
import DigitalMenuCustomize from './DigitalMenuCustomize';
import DigitalMenuPreview from './DigitalMenuPreview';
import { useForm } from 'react-hook-form';
import DigitalMenuAssets from './DigitalMenuAssets';

const DigitalMenuBoardDetail = ({ sidebarOpen, setSidebarOpen }) => {
  const { token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const [customizeData, setCustomizeData] = useState({
    "EachPageTime": "30",
    "EachPage": "auto",
    "ImageLayout": "When I attach an image",
    "Currency": "USD",
    "CurrencyShow": true,
    "ShowPrice": true,
    "FontSize": "Medium",
    "Theme": "Light Theme",
  })
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: customizeData
  });
  const dispatch = useDispatch();
  const history = useNavigate();

  const [saveLoading, setSaveLoading] = useState(false);
  const currentDate = new Date();
  const [instanceName, setInstanceName] = useState(
    moment(currentDate).format("YYYY-MM-DD hh:mm A")
  );
  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [assetPreview, setAssetPreview] = useState("");

  const [edited, setEdited] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectItem, setSelectItem] = useState("");



  const [showPreviewPopup, setShowPreviewPopup] = useState(false);
  const [firstCategory, setFirstCategory] = useState(0);
  const [showCustomizemodal, setShowCustomizemodal] = useState(false);

  const [addCategory, setAddCategory] = useState([{
    categoryname: "UNNAMED CATEGORY",
    allItem: [{
      name: "",
      description: "",
      price: "",
      calories: "",
      image: "",
      features: false,
      soldOut: false,
    }],
    show: false
  }])
  console.log('addCategory', addCategory)


  const handleOnSaveInstanceName = (e) => {
    if (!instanceName.replace(/\s/g, "").length) {
      toast.remove();
      return toast.error("Please enter at least minimum 1 character.");
    }
    setEdited(false);
  };

  //Insert  API
  const addDigitalMenuApp = () => {
    // if (!YoutubeVideo?.includes("youtu.be")) {
    //   toast.remove();
    //   return toast.error("Please Enter Vaild Youtube URL");
    // }
    // if (instanceName === "" || YoutubeVideo === "") {
    //   toast.remove();
    //   return toast.error("Please fill all the details");
    // }
    let data = JSON.stringify({
      instanceName: instanceName,
      //   youTubeURL: YoutubeVideo,
      //   muteVideos: isMuted,
      //   toggleSubtitles: areSubtitlesOn,
      //   youTubePlaylist: maxVideos,
      operation: "Insert",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      //   url: YOUTUBE_INSTANCE_ADD_URL,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      data: data,
    };
    setSaveLoading(true);
    axios
      .request(config)
      .then((response) => {
        if (window.history.length === 1) {
          //   dispatch(handleNavigateFromComposition());
          //   dispatch(handleChangeNavigateFromComposition(false));
          localStorage.setItem("isWindowClosed", "true");
          window.close();
        } else {
          history("/Digital-Menu-Board");
        }
        setSaveLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setSaveLoading(false);
      });
  };

  // const handleNameChange = (index, value) => {
  //   const updatedTime = [...addItem];
  //   updatedTime[index].name = value;
  //   setAddItem(updatedTime);
  // }

  const handleNameChange = (categoryIndex, itemIndex, value) => {
    setAddCategory(prevState => {
      const updatedCategories = [...prevState];
      const updatedCategory = { ...updatedCategories[categoryIndex] };
      const updatedItems = [...updatedCategory.allItem];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], name: value };
      updatedCategory.allItem = updatedItems;
      updatedCategories[categoryIndex] = updatedCategory;
      return updatedCategories;
    });
  };

  // const handleDescriptionChange = (index, value) => {
  //   const updatedTime = [...addItem];
  //   updatedTime[index].description = value;
  //   setAddItem(updatedTime);
  // }

  const handleDescriptionChange = (categoryIndex, itemIndex, value) => {
    setAddCategory(prevState => {
      const updatedCategories = [...prevState];
      const updatedCategory = { ...updatedCategories[categoryIndex] };
      const updatedItems = [...updatedCategory.allItem];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], description: value };
      updatedCategory.allItem = updatedItems;
      updatedCategories[categoryIndex] = updatedCategory;
      return updatedCategories;
    });
  };

  // const handlePriceChange = (index, value) => {
  //   const updatedTime = [...addItem];
  //   updatedTime[index].price = value;
  //   setAddItem(updatedTime);
  // }

  const handlePriceChange = (categoryIndex, itemIndex, value) => {
    setAddCategory(prevState => {
      const updatedCategories = [...prevState];
      const updatedCategory = { ...updatedCategories[categoryIndex] };
      const updatedItems = [...updatedCategory.allItem];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], price: value };
      updatedCategory.allItem = updatedItems;
      updatedCategories[categoryIndex] = updatedCategory;
      return updatedCategories;
    });
  };

  // const handleCaloriesChange = (index, value) => {
  //   const updatedTime = [...addItem];
  //   updatedTime[index].calories = value;
  //   setAddItem(updatedTime);
  // }

  const handleCaloriesChange = (categoryIndex, itemIndex, value) => {
    setAddCategory(prevState => {
      const updatedCategories = [...prevState];
      const updatedCategory = { ...updatedCategories[categoryIndex] };
      const updatedItems = [...updatedCategory.allItem];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], calories: value };
      updatedCategory.allItem = updatedItems;
      updatedCategories[categoryIndex] = updatedCategory;
      return updatedCategories;
    });
  };

  // const handleFeatureChange = (index, value) => {
  //   const updatedTime = [...addItem];
  //   updatedTime[index].features = value;
  //   setAddItem(updatedTime);
  // }

  const handleFeatureChange = (categoryIndex, itemIndex, value) => {
    setAddCategory(prevState => {
      const updatedCategories = [...prevState];
      const updatedCategory = { ...updatedCategories[categoryIndex] };
      const updatedItems = [...updatedCategory.allItem];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], features: value };
      updatedCategory.allItem = updatedItems;
      updatedCategories[categoryIndex] = updatedCategory;
      return updatedCategories;
    });
  };


  // const handleSoldOutChange = (index, value) => {
  //   const updatedTime = [...addItem];
  //   updatedTime[index].soldOut = value;
  //   setAddItem(updatedTime);
  // }

  const handleSoldOutChange = (categoryIndex, itemIndex, value) => {
    setAddCategory(prevState => {
      const updatedCategories = [...prevState];
      const updatedCategory = { ...updatedCategories[categoryIndex] };
      const updatedItems = [...updatedCategory.allItem];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], soldOut: value };
      updatedCategory.allItem = updatedItems;
      updatedCategories[categoryIndex] = updatedCategory;
      return updatedCategories;
    });
  };

  // const handleFileChange = (index, event) => {
  //   const file = event.target.files[0];
  //   const updatedAllTime = [...addItem];
  //   updatedAllTime[index] = { ...updatedAllTime[index], image: file };
  //   setAddItem(updatedAllTime);
  // }

  const handleFileChange = (categoryIndex, itemIndex, event) => {
    const file = event.target.files[0];
    console.log('file', file)
    setAddCategory(prevState => {
      const updatedCategories = [...prevState];
      const updatedCategory = { ...updatedCategories[categoryIndex] };
      const updatedItems = [...updatedCategory.allItem];
      console.log('updatedItems', updatedItems)
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], image: file };
      updatedCategory.allItem = updatedItems;
      updatedCategories[categoryIndex] = updatedCategory;
      console.log('updatedCategories', updatedCategories)
      return updatedCategories;
    });
  };

  // const handleDeleteItem = (id) => {
  //   const updatedAllTime = [...addItem];
  //   const filteredData = updatedAllTime?.filter((item, index) => index !== id)
  //   setAddItem(filteredData)
  // }

  const handleDeleteItem = (categoryIndex, itemIndex) => {
    setAddCategory(prevState => {
      const updatedCategories = [...prevState];
      const updatedCategory = { ...updatedCategories[categoryIndex] };
      const updatedItems = [...updatedCategory.allItem];
      updatedItems.splice(itemIndex, 1); // Remove the item at the specified index
      updatedCategory.allItem = updatedItems;
      updatedCategories[categoryIndex] = updatedCategory;
      return updatedCategories;
    });
  };

  const handleAddCategory = () => {
    const updatedAllTime = [...addCategory];
    if (firstCategory === 0) {
      updatedAllTime[0].show = true;
      setAddCategory(updatedAllTime)
      setFirstCategory(firstCategory + 1)
    } else {
      setAddCategory([
        ...addCategory,
        {
          categoryname: "UNNAMED CATEGORY",
          allItem: [{
            name: "",
            description: "",
            price: "",
            calories: "",
            image: "",
            features: false,
            soldOut: false,
          }],
          show: true
        },
      ]);

    }
  }

  const handleAddItem = (categoryIndex) => {
    setAddCategory(prevState => {
      const updatedCategories = [...prevState];
      const updatedCategory = { ...updatedCategories[categoryIndex] };
      const newItem = {
        name: "",
        description: "",
        price: "",
        calories: "",
        image: "",
        features: false,
        soldOut: false,
      };
      updatedCategory.allItem.push(newItem);
      updatedCategories[categoryIndex] = updatedCategory;
      return updatedCategories;
    });
  };

  const handleDeleteCategory = (id) => {
    const updatedAllTime = [...addCategory];
    if (updatedAllTime?.length > 1) {
      const filteredData = updatedAllTime?.filter((item, index) => index !== id)
      setAddCategory(filteredData)
    } else {
      let arr = []
      updatedAllTime?.map((item) => {
        let obj = {
          ...item,
          show: false
        }
        arr.push(obj)
      })
      setAddCategory(arr)
    }
  }

  const handleCustomize = () => {
    setShowCustomizemodal(true)
  }

  const toggleModal = () => {
    setShowCustomizemodal(!showCustomizemodal)
  }

  const onSubmit = (data) => {
    setCustomizeData(data)
    // Handle form submission here
    console.log(data);
  };

  const handleAssetAdd = (asset) => {
    setSelectedAsset(asset);
    setAssetPreview(asset);
  };

  const HandleSubmitAsset = () => {
    setAddCategory(prevState => {
      const updatedCategories = [...prevState];
      const updatedCategory = { ...updatedCategories[selectCategory] };
      const updatedItems = [...updatedCategory.allItem];
      updatedItems[selectItem] = { ...updatedItems[selectItem], image: selectedAsset };
      updatedCategory.allItem = updatedItems;
      updatedCategories[selectCategory] = updatedCategory;
      return updatedCategories;
    });
    setOpenModal(false)
  }

  return (
    <>
      <div className="flex border-b border-gray bg-white">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block  items-center">
            <div className="flex items-center">
              {edited ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="w-full border border-primary rounded-md px-2 py-1"
                    placeholder="Enter schedule name"
                    value={instanceName}
                    onChange={(e) => {
                      setInstanceName(e.target.value);
                    }}
                  />
                  <MdSave
                    onClick={() => handleOnSaveInstanceName()}
                    className="min-w-[1.5rem] min-h-[1.5rem] cursor-pointer"
                  />
                </div>
              ) : (
                <>
                  <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] ">
                    {instanceName}
                  </h1>
                  <button onClick={() => setEdited(true)}>
                    <GoPencil className="ml-4 text-lg" />
                  </button>
                </>
              )}
            </div>
            <div className="flex justify-end md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap youtubebtnpopup">
              <button
                className="flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2  text-base sm:text-sm mr-2 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                disabled={saveLoading}
                onClick={() => {
                  setShowPreviewPopup(!showPreviewPopup);
                }}
              >
                {showPreviewPopup ? "Edit" : "Preview"}
              </button>
              <button
                className="flex align-middle border-white bg-SlateBlue text-white sm:mt-2  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 .  text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                onClick={() => addDigitalMenuApp()}
                disabled={saveLoading}
              >
                {saveLoading ? "Saving..." : "Save"}
              </button>
              {/* <div className="relative sm:mt-2">
                  <button
                    onClick={() => setShowPopup(!showPopup)}
                    className="sm:ml-2 xs:ml-1 flex align-middle border-primary items-center border-2 rounded-full p-2 text-xl  hover:bg-SlateBlue hover:text-white  hover:shadow-lg hover:shadow-primary-500/50 hover:border-white"
                  >
                    <BiDotsHorizontalRounded />
                  </button>
                  {showPopup && (
                    <div className="editdw z-30">
                      <ul>
                        <li
                          className="flex text-sm items-center cursor-pointer"
                          onClick={() => setShowSetScreenModal(true)}
                        >
                          <FiUpload className="mr-2 text-lg" />
                          Set to Screen
                        </li>
                        <li className="flex text-sm items-center mt-2">
                          <MdPlaylistPlay className="mr-2 text-lg" />
                          Add to Playlist
                        </li>
                        <li className="flex text-sm items-center mt-2">
                          <TbBoxMultiple className="mr-2 text-lg" />
                          Duplicate
                        </li>
                        <li className="flex text-sm items-center mt-2">
                          <TbCalendarTime className="mr-2 text-lg" />
                          Set availability
                        </li>
                        <li
                          className="flex text-sm items-center mt-2 cursor-pointer"
                          onClick={() => setPlaylistDeleteModal(true)}
                        >
                          <RiDeleteBin5Line className="mr-2 text-lg" />
                          Delete
                        </li>
                      </ul>
                    </div>
                  )}
                  {showSetScreenModal && (
                    <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
                      <div className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                          <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
                            <div className="flex items-center">
                              <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                                Select Screens to Playlist Name
                              </h3>
                            </div>
                            <button
                              className="p-1 text-xl ml-8"
                              onClick={() => setShowSetScreenModal(false)}
                            >
                              <AiOutlineCloseCircle className="text-2xl" />
                            </button>
                          </div>
                          <div className="flex justify-between items-center p-4">
                            <div className="text-right mr-5 flex items-end justify-end relative sm:mr-0">
                              <AiOutlineSearch className="absolute top-[13px] right-[233px] z-10 text-gray searchicon" />
                              <input
                                type="text"
                                placeholder=" Search Playlist"
                                className="border border-primary rounded-full px-7 py-2 search-user"
                              />
                            </div>
                            <div className="flex items-center">
                              <button className="bg-lightgray rounded-full px-4 py-2 text-SlateBlue">
                                Tags
                              </button>
                              <button className="flex items-center bg-lightgray rounded-full px-4 py-2 text-SlateBlue ml-3">
                                <input type="checkbox" className="w-5 h-5 mr-2" />
                                All Clear
                              </button>
                            </div>
                          </div>
                          <div className="px-9">
                            <div className="overflow-x-auto p-4 shadow-xl bg-white rounded-lg ">
                              <table className=" w-full ">
                                <thead>
                                  <tr className="flex justify-between items-center">
                                    <th className="font-medium text-[14px]">
                                      <button className="bg-lightgray rounded-full flex  items-center justify-center px-6 py-2">
                                        Name
                                      </button>
                                    </th>
                                    <th className="p-3 font-medium text-[14px]">
                                      <button className="bg-lightgray rounded-full flex  items-center justify-center px-6 py-2">
                                        Group
                                      </button>
                                    </th>
                                    <th className="p-3 font-medium text-[14px]">
                                      <button className="bg-lightgray rounded-full flex  items-center justify-center px-6 py-2">
                                        Playing
                                      </button>
                                    </th>
                                    <th className="p-3 font-medium text-[14px]">
                                      <button className="bg-lightgray rounded-full px-6 py-2 flex  items-center justify-center">
                                        Status
                                      </button>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="mt-3 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                                    <td className="flex items-center ">
                                      <input type="checkbox" className="mr-3" />
                                      <div>
                                        <div>Tv 1</div>
                                      </div>
                                    </td>
                                    <td className="p-2">Marketing</td>
                                    <td className="p-2">25 May 2023</td>
                                    <td className="p-2">
                                      <button className="rounded-full px-6 py-1 text-white bg-[#3AB700]">
                                        Live
                                      </button>
                                    </td>
                                  </tr>
                                  <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                                    <td className="flex items-center ">
                                      <input type="checkbox" className="mr-3" />
                                      <div>
                                        <div>Tv 1</div>
                                      </div>
                                    </td>
                                    <td className="p-2">Marketing</td>
                                    <td className="p-2">25 May 2023</td>
                                    <td className="p-2">
                                      <button className="rounded-full px-6 py-1 text-white bg-[#D40000]">
                                        Offline
                                      </button>
                                    </td>
                                  </tr>
                                  <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                                    <td className="flex items-center ">
                                      <input type="checkbox" className="mr-3" />
                                      <div>
                                        <div>Tv 1</div>
                                      </div>
                                    </td>
                                    <td className="p-2">Marketing</td>
                                    <td className="p-2">25 May 2023</td>
                                    <td className="p-2">
                                      <button className="rounded-full px-6 py-1 text-white bg-[#D40000]">
                                        Offline
                                      </button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="flex justify-between p-6">
                            <button className="border-2 border-primary px-4 py-2 rounded-full">
                              Add new Playlist
                            </button>
                            <Link to="/composition">
                              <button className="bg-primary text-white px-4 py-2 rounded-full">
                                Save
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {playlistDeleteModal && (
                    <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
                      <div className="w-auto my-6 mx-auto lg:max-w-xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                          <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
                            <div className="flex items-center">
                              <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                                Delete Playlist Name?
                              </h3>
                            </div>
                            <button
                              className="p-1 text-xl ml-8"
                              onClick={() => setPlaylistDeleteModal(false)}
                            >
                              <AiOutlineCloseCircle className="text-2xl" />
                            </button>
                          </div>
                          <div className="p-5">
                            <p>
                              Playlist Name is being used elsewhere and will be
                              removed when deleted. Please check before deleting.
                            </p>
                            <div className="flex mt-4">
                              <label className="font-medium">Playlist : </label>
                              <p className="ml-2">Ram Siya Ram</p>
                            </div>
                          </div>
                          <div className="flex justify-center items-center pb-5">
                            <button
                              className="border-2 border-primary px-4 py-1.5 rounded-full"
                              onClick={() => setPlaylistDeleteModal(false)}
                            >
                              Cencel
                            </button>
                            <Link to="/apps">
                              <button className="bg-primary text-white ml-3 px-4 py-2 rounded-full">
                                Delete
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div> */}

              <Link to="/Digital-Menu-Board">
                <button className="sm:ml-2 xs:ml-1 sm:mt-2 border-primary items-center border-2  rounded-full text-xl  hover:text-white hover:bg-SlateBlue hover:border-white hover:shadow-lg hover:shadow-primary-500/50 p-2 ">
                  <AiOutlineClose />
                </button>
              </Link>
            </div>
          </div>
          {!showPreviewPopup && (
            <div className="mt-6">
              <div className='flex justify-between items-center m-3'>
                <div className='flex items-center gap-4'>
                  <img src={digitalMenuLogo} className='w-16' />
                  <span> New Instance</span>
                </div>
                <div className='flex items-center gap-4'>
                  <FaRegQuestionCircle size={30} />
                  <button
                    className="border flex items-center gap-2 border-primary rounded-full px-3 py-2 not-italic font-medium"
                    onClick={() => {
                      handleCustomize()
                    }}
                  >
                    <MdOutlineModeEdit />
                    Customize
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 h-full">
                <div className="lg:col-span-12 md:col-span-12 sm:col-span-12 xs:col-span-12 shadow-md bg-white rounded-lg p-5  items-center">
                  <div className='flex justify-end mb-3'>
                    <button
                      type="submit"
                      className="hover:bg-white cursor-pointer hover:text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full bg-primary text-white"
                      onClick={() => {
                        handleAddCategory()
                      }}
                    >
                      Add Category
                    </button>
                  </div>
                  {addCategory && addCategory?.map((category, index) => {
                    return (
                      <>
                        {category?.show && (
                          <div className='flex items-center justify-between m-3'>
                            <div>
                              <span>
                                {category?.categoryname}
                              </span>
                            </div>
                            <div>
                              <div className="flex justify-center gap-4">
                                <div
                                  data-tip
                                  data-for="Delete"
                                  className="cursor-pointer text-xl flex gap-3 rounded-full px-2 py-2 text-white text-center bg-[#FF0000]"
                                  onClick={() =>
                                    handleDeleteCategory(index)
                                  }
                                >
                                  <MdDeleteForever />
                                  <ReactTooltip
                                    id="Delete"
                                    place="bottom"
                                    type="warning"
                                    effect="solid"
                                  >
                                    <span>Delete</span>
                                  </ReactTooltip>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="overflow-x-scroll sc-scrollbar rounded-lg">
                          <table
                            className="screen-table w-full lg:table-fixed sm:table-fixed xs:table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 "
                            cellPadding={15}
                          >
                            <thead className="table-head-bg screen-table-th">
                              <tr className="items-center table-head-bg ">
                                <th className="text-[#5A5881] text-base text-center font-semibold w-200">
                                  Item Name
                                </th>
                                <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                                  Description
                                </th>
                                <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                                  Price
                                </th>
                                <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                                  Calories
                                </th>
                                <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                                  Image
                                </th>
                                <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                                  Featured
                                </th>
                                <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                                  Sold Out
                                </th>
                                <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>

                              {category?.allItem && (
                                <>
                                  {category?.allItem.map((item, indexs) => {
                                    return (
                                      <tr key={indexs}>
                                        <td className="text-[#5E5E5E]">
                                          <input type='text' value={item?.name} className="w-42 relative border border-black rounded-md p-3"
                                            placeholder='Item Name'
                                            onChange={(e) =>
                                              handleNameChange(index, indexs, e.target.value)
                                            }
                                          />
                                        </td>
                                        <td className="text-[#5E5E5E] text-center">
                                          <input type='text' value={item?.description} className="w-42 relative border border-black rounded-md p-3"
                                            placeholder='Description'
                                            onChange={(e) =>
                                              handleDescriptionChange(index, indexs, e.target.value)
                                            } />
                                        </td>

                                        <td className="text-[#5E5E5E] text-center">
                                          <input type='number' value={item?.price} className="w-42 relative border border-black rounded-md p-3"
                                            placeholder='Price'
                                            onChange={(e) =>
                                              handlePriceChange(index, indexs, e.target.value)
                                            } />
                                        </td>

                                        <td className="text-[#5E5E5E] text-center">
                                          <input type='number' value={item?.calories} className="w-42 relative border border-black rounded-md p-3"
                                            placeholder='0'
                                            onChange={(e) =>
                                              handleCaloriesChange(index, indexs, e.target.value)
                                            } />
                                        </td>

                                        <td
                                          className="text-[#5E5E5E] text-center"
                                        >
                                          {item?.image === "" ? (

                                            <a
                                              className='cursor-pointer underline'
                                              onClick={() => {
                                                setSelectCategory(index)
                                                setSelectItem(indexs)
                                                setOpenModal(true)
                                              }}
                                            >
                                              Upload
                                            </a>
                                          ) : (
                                            <div className='flex items-center gap-4'>
                                              <img src={item?.image?.assetFolderPath} className='w-20 h-16' />
                                              <a className='cursor-pointer underline'
                                                onClick={() => {
                                                  setAddCategory(prevState => {
                                                    const updatedCategories = [...prevState];
                                                    const updatedCategory = { ...updatedCategories[index] };
                                                    const updatedItems = [...updatedCategory.allItem];
                                                    updatedItems[indexs] = { ...updatedItems[indexs], image: "" };
                                                    updatedCategory.allItem = updatedItems;
                                                    updatedCategories[index] = updatedCategory;
                                                    return updatedCategories;
                                                  });
                                                }
                                                }>
                                                Remove
                                              </a>
                                            </div>
                                          )}
                                        </td>

                                        <td className="text-[#5E5E5E] text-center">
                                          <input type='checkbox' value={item?.features}
                                            onChange={(e) =>
                                              handleFeatureChange(index, indexs, e.target.value)
                                            } />
                                        </td>

                                        <td
                                          className="text-[#5E5E5E] text-center"
                                        >
                                          <input type='checkbox' value={item?.soldOut}
                                            onChange={(e) =>
                                              handleSoldOutChange(index, indexs, e.target.value)
                                            } />

                                        </td>
                                        <td className="text-center">
                                          <div className="flex justify-center gap-4">
                                            <div
                                              data-tip
                                              data-for="Delete"
                                              className="cursor-pointer text-xl flex gap-3 rounded-full px-2 py-2 text-white text-center bg-[#FF0000]"
                                              onClick={() =>
                                                handleDeleteItem(index, indexs)
                                              }
                                            >
                                              <MdDeleteForever />
                                              <ReactTooltip
                                                id="Delete"
                                                place="bottom"
                                                type="warning"
                                                effect="solid"
                                              >
                                                <span>Delete</span>
                                              </ReactTooltip>
                                            </div>
                                          </div>
                                        </td>


                                      </tr>
                                    );
                                  })}
                                </>
                              )}

                            </tbody>
                          </table>
                        </div>
                        <div className='flex justify-end items-center mr-3 mt-2'>
                          <button
                            className="border flex items-center gap-2 border-primary rounded-full px-3 py-2 not-italic font-medium"
                            onClick={() =>
                              handleAddItem(index)
                            }
                          >
                            Add Item
                          </button>

                        </div>
                      </>
                    )
                  })}
                </div>
                {/* <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12 relative">
                  <div className="videoplayer relative md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 bg-white">
  
                  </div>
                          </div>*/}


              </div>
            </div>
          )}
          {showPreviewPopup && (
            <DigitalMenuPreview customizeData={customizeData} addCategory={addCategory} />
          )}
        </div>
      </div>
      <Footer />

      {showCustomizemodal && (
        <DigitalMenuCustomize toggleModal={toggleModal} register={register} errors={errors} handleSubmit={handleSubmit} onSubmit={onSubmit} />
      )}
      {openModal && (
        <DigitalMenuAssets openModal={openModal} setOpenModal={setOpenModal} setAssetPreviewPopup={setAssetPreviewPopup} selectedAsset={selectedAsset} handleAssetAdd={handleAssetAdd} assetPreviewPopup={assetPreviewPopup} assetPreview={assetPreview} HandleSubmitAsset={HandleSubmitAsset} />
      )}

    </>
  )
}

export default DigitalMenuBoardDetail
