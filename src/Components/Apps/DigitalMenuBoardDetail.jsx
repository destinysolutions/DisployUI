import React, { lazy, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { MdDeleteForever, MdOutlineModeEdit, MdSave } from 'react-icons/md';
import { GoPencil } from 'react-icons/go';
import { AiOutlineClose } from 'react-icons/ai';
import moment from 'moment';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import DigitalMenuAssets from './DigitalMenuAssets';
import { ADD_EDIT_DIGITAL_MENU, GET_DIGITAL_MENU_BY_ID, POS_ITEM_LIST, POS_THEME } from '../../Pages/Api';
import Swal from 'sweetalert2';
import { HiOutlineViewList } from 'react-icons/hi';
import { chunkArray, generateAllCategory, generateCategorybyID } from '../Common/Common';
import { handleAllPosTheme } from '../../Redux/CommonSlice';

import DigitalMenuCustomize from './DigitalMenuCustomize';
import Footer from '../Footer';
import digitalMenuLogo from "../../images/AppsImg/foods.svg";
import DigitalMenuPreview from './DigitalMenuPreview';
import Loading from '../Loading';
import PurchasePlanWarning from '../Common/PurchasePlan/PurchasePlanWarning';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';


// const Navbar = lazy(() => import('../Navbar'));
// const Loading = lazy(() => import('../Loading'));
// const Sidebar = lazy(() => import('../Sidebar'));
// const PurchasePlanWarning = lazy(() => import('../Common/PurchasePlan/PurchasePlanWarning'));
// const Footer = lazy(() => import('../Footer'));
// const DigitalMenuPreview = lazy(() => import('./DigitalMenuPreview'));
// const DigitalMenuCustomize = lazy(() => import('./DigitalMenuCustomize'));



const DigitalMenuBoardDetail = ({ sidebarOpen, setSidebarOpen }) => {
  const { id } = useParams();
  const { userDetails, user, token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const [customizeData, setCustomizeData] = useState({
    "EachPageTime": "30",
    "EachPage": "auto",
    "ImageLayout": "When I attach an image",
    "Currency": "USD",
    "CurrencyShow": true,
    "ShowPrice": true,
    "FontSize": "Medium",
    "Theme": "",
    "Topfeature": false,
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
  const [selectedColor, setSelectedColor] = useState("#4A90E2");
  const [textColor, setTextColor] = useState("#455670");
  const [priceColor, setPriceColor] = useState("#1B1B1E");
  const [menuName, setMenuName] = useState("");
  const [subtitle, setSubTitle] = useState("");
  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [assetPreview, setAssetPreview] = useState("");
  const [edited, setEdited] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectItem, setSelectItem] = useState("");
  const [showPreviewPopup, setShowPreviewPopup] = useState(false);
  const [firstCategory, setFirstCategory] = useState(0);
  const [showCustomizemodal, setShowCustomizemodal] = useState(false);
  const [PreviewData, setPreviewData] = useState([])
  const [PosTheme, setPosTheme] = useState([])
  const [theme, setTheme] = useState({})
  const [selectedtheme, setSelectedTheme] = useState({})
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

  useEffect(() => {
    let allData = []
    addCategory?.map((item) => {
      let arr = [];
      if (customizeData?.EachPage === "auto") {
        let obj = {
          categoryname: item?.categoryname,
          show: item?.show,
          categoryID: item?.categoryID,
          digitalMenuAppId: item?.digitalMenuAppId,
          list: item?.allItem
        }
        arr?.push(obj)
      } else {
        const filterarr = chunkArray(item?.allItem, parseInt(customizeData?.EachPage));
        let allArray = []
        filterarr?.map((data) => {
          let obj = {
            categoryname: item?.categoryname,
            show: item?.show,
            categoryID: item?.categoryID,
            digitalMenuAppId: item?.digitalMenuAppId,
            list: data
          }
          allArray?.push(obj)
        })
        arr = allArray
      }
      let obj = {
        ...item,
        allItem: arr
      };
      allData?.push(obj)
    })
    setPreviewData(allData)

  }, [addCategory, customizeData])

  useEffect(() => {

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: POS_THEME,
      headers: {
        Authorization: authToken,
      },
    }

    dispatch(handleAllPosTheme({ config }))
      .then((res) => {
        setPosTheme(res?.payload?.data)
      })
      .catch((error) => {
        console.log('error', error)
      })

  }, [])

  const handleOnSaveInstanceName = (e) => {
    if (!instanceName.replace(/\s/g, "").length) {
      toast.remove();
      return toast.error("Please enter at least minimum 1 character.");
    }
    setEdited(false);
  };

  //Insert  API
  const addDigitalMenuApp = () => {
    toast.loading("Saving...")
    let data = JSON.stringify({
      "digitalMenuAppId": id ? id : 0,
      "userID": 0,
      "appName": instanceName,
      "nameOfthisMenu": menuName,
      "subTitle": subtitle,
      "createdDate": "2024-03-14T04:16:33.588Z",
      "createdBy": 0,
      "updatedDate": "2024-03-14T04:16:33.588Z",
      "updatedBy": 0,
      "category": generateAllCategory(addCategory),
      "customizeMaster": {
        "customizeID": 0,
        "digitalMenuAppId": id ? id : 0,
        "timespent": customizeData?.EachPageTime,
        "imagestodisplay": customizeData?.EachPage,
        "switchTo": customizeData?.ImageLayout,
        "currencyID": 0,
        "currencyName": customizeData?.Currency,
        "isShowcurrencysign": customizeData?.CurrencyShow,
        "isShowprices": customizeData?.ShowPrice,
        "isMovetop": customizeData?.Topfeature,
        "fontSize": customizeData?.FontSize,
        "color": selectedColor,
        "textColor": textColor,
        "priceColor": priceColor,
        "logo": "string",
        "theme": selectedtheme
      }
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: ADD_EDIT_DIGITAL_MENU,
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
        toast.remove()
        if (window.history.length === 1) {
          localStorage.setItem("isWindowClosed", "true");
          window.close();
        } else {
          history("/Digital-Menu-Board");
        }
        setSaveLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.remove()
        setSaveLoading(false);
      });
  };

  const fetchPosItem = () => {
    toast.loading("Creating POS Menu")
    setLoading(true)
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: POS_ITEM_LIST,
      headers: {
        Authorization: authToken,
      },
    };

    axios.request(config).then((res) => {
      let data = res?.data?.data;
      let allCategory = [];
      data?.map((category) => {
        let allItems = [];
        category?.posItemDetails?.map((item) => {
          let itemDetail = {
            name: item?.itemName,
            description: item?.itemDescription,
            price: item?.price,
            calories: 0,
            image: item?.itemImageurl !== null ? item?.itemImageurl : "",
            features: false,
            soldOut: false,
          }
          allItems?.push(itemDetail)
        })
        let categoryObj = {
          categoryname: category?.categoryname,
          allItem: allItems,
          show: true
        }
        allCategory?.push(categoryObj)
      })
      setAddCategory(allCategory)
      toast.remove()
      setLoading(false)
    }).catch((error) => {
      toast.remove()
      setLoading(false)
      console.log(error)
    })
  }

  useEffect(() => {
    if (id) {
      setLoader(true)
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${GET_DIGITAL_MENU_BY_ID}?DigitalMenuAppId=${id}`,
        headers: {
          Authorization: authToken,
        },
      };
      axios
        .request(config)
        .then((response) => {
          let data = response?.data?.data;
          setCustomizeData({
            "EachPageTime": data?.customizeMaster?.timespent,
            "EachPage": data?.customizeMaster?.imagestodisplay,
            "ImageLayout": data?.customizeMaster?.switchTo,
            "Currency": data?.customizeMaster?.currencyName,
            "CurrencyShow": data?.customizeMaster?.isShowcurrencysign,
            "ShowPrice": data?.customizeMaster?.isShowprices,
            "FontSize": data?.customizeMaster?.fontSize,
            "Theme": data?.customizeMaster?.theme,
            "Topfeature": data?.customizeMaster?.isMovetop,
          })
          setSelectedTheme(data?.customizeMaster?.theme)
          const matchedTheme = PosTheme.find(item => Number(item?.posThemeID) === Number(data?.customizeMaster?.theme));
          setTheme(matchedTheme)
          setSelectedColor(data?.customizeMaster?.color)
          setInstanceName(data?.appName)
          setSubTitle(data?.subTitle)
          setMenuName(data?.nameOfthisMenu)
          let allcategory = generateCategorybyID(data)
          setAddCategory(allcategory)
          setLoader(false)
        }).catch((error) => {
          setLoader(false)
          console.log('error', error)
        })
    }
  }, [id])

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

  const handleDeleteItem = (categoryIndex, itemIndex) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this item",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        toast.loading("Deleting...");
        setTimeout(() => {
          setAddCategory(prevState => {
            const updatedCategories = [...prevState];
            const updatedCategory = { ...updatedCategories[categoryIndex] };
            const updatedItems = [...updatedCategory.allItem];
            updatedItems.splice(itemIndex, 1); // Remove the item at the specified index
            updatedCategory.allItem = updatedItems;
            updatedCategories[categoryIndex] = updatedCategory;
            return updatedCategories;
          });
          toast.remove();
        }, 1000);
      }
    });
  };

  const handleAddCategory = () => {
    toast.loading("Creating...");
    setTimeout(() => {
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
      toast?.remove();
    }, 1000);
  }

  const handleAddItem = (categoryIndex) => {
    toast.loading("Creating...");
    setTimeout(() => {
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
      toast?.remove();
    }, 1000);
  };

  const handleDeleteCategory = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this category",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        toast.loading("Deleting...");
        setTimeout(() => {
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
          toast?.remove();
        }, 1000);
      }
    });

  }

  const handleCustomize = () => {
    setShowCustomizemodal(true)
  }

  const toggleModal = () => {
    setShowCustomizemodal(!showCustomizemodal)
  }

  const onSubmit = (data) => {
    if (selectedtheme !== "") {
      const matchedTheme = PosTheme.find(item => Number(item?.posThemeID) === Number(selectedtheme));
      setTheme(matchedTheme)
    }
    setCustomizeData(data)
    // Handle form submission here
    toggleModal()
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

  const handleDragStartForDivToDiv = (event, category, categoryIndex) => {
    event.dataTransfer.setData('category', JSON.stringify(category));
    event.dataTransfer.setData('categoryIndex', categoryIndex.toString());
  };

  const handleDragStartWithinlist = (event, item, itemIndex) => {
    event.dataTransfer.setData('item', JSON.stringify(item));
    event.dataTransfer.setData('itemIndex', itemIndex);
  };

  const handleDropForWithinlist = (event, categoryIndex, targetIndex) => {
    event.preventDefault();
    if (targetIndex !== undefined || targetIndex !== "undefined") {
      if (event?.dataTransfer?.getData('item')) {
        const draggedItem = JSON?.parse(event?.dataTransfer?.getData('item'));
        const sourceIndex = parseInt(event?.dataTransfer?.getData('itemIndex'));
        setAddCategory(prevState => {
          const updatedCategories = [...prevState];
          const targetCategory = updatedCategories[categoryIndex];
          targetCategory.allItem.splice(sourceIndex, 1);
          targetCategory.allItem.splice(targetIndex, 0, draggedItem);
          return updatedCategories;
        });
      }
    }
  };

  const handleDragOverForWithinlist = (event, index) => {
    event.preventDefault();
  };

  const handleCategoryName = (index, value) => {
    const updatedTime = [...addCategory];
    updatedTime[index].categoryname = value;
    setAddCategory(updatedTime);
  }

  const handleDragOverForWithinCategorylist = (event, targetIndex) => {
    event.preventDefault();
  };

  const handleDropForWithinCategorylist = (event, targetIndex) => {
    event.preventDefault();
    if (event?.dataTransfer?.getData('category')) {
      const draggedCategory = JSON.parse(event?.dataTransfer?.getData('category'));
      const sourceIndex = parseInt(event?.dataTransfer?.getData('categoryIndex'));

      setAddCategory(prevState => {
        const updatedCategories = [...prevState];
        updatedCategories.splice(sourceIndex, 1);
        updatedCategories.splice(targetIndex, 0, draggedCategory);
        return updatedCategories;
      });
    }
  };

  return (
    <>
      <div className="flex border-b border-gray bg-white">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className={user?.isTrial && user?.userDetails?.isRetailer === false && !user?.isActivePlan ?"lg:pt-32 md:pt-32 pt-10 px-5 page-contain" : "lg:pt-24 md:pt-24 pt-10 px-5 page-contain"}>
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          {loader ? <Loading /> : (
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
                <Link to="/Digital-Menu-Board">
                  <button className="sm:ml-2 xs:ml-1 sm:mt-2 border-primary items-center border-2  rounded-full text-xl  hover:text-white hover:bg-SlateBlue hover:border-white hover:shadow-lg hover:shadow-primary-500/50 p-2 ">
                    <AiOutlineClose />
                  </button>
                </Link>
              </div>
            </div>
          )}
          {!showPreviewPopup && (
            <div className="mt-6">
              <div className='flex justify-between items-center m-3'>
                <div className='flex items-center gap-4'>
                  <img src={digitalMenuLogo} className='w-16' />
                  <div className='flex flex-col gap-2'>
                    <input type='text' className="w-42 relative p-2" placeholder='Name this menu' value={menuName} onChange={(e) => setMenuName(e.target.value)} />
                    <input type='text' className="w-42 relative p-1" placeholder='Enter a subtitle (optional)' value={subtitle} onChange={(e) => setSubTitle(e.target.value)} />
                  </div>

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
                  <div className='flex justify-end mb-3 gap-3'>
                    <button
                      type="submit"
                      className="hover:bg-white cursor-pointer hover:text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full bg-primary text-white"
                      onClick={() => {
                        fetchPosItem()
                      }}
                    >
                      POS
                    </button>
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
                  {loading && (
                    <div className="flex text-center m-5 justify-center">
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-10 h-10 me-3 text-gray-200 animate-spin dark:text-gray-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="#1C64F2"
                        />
                      </svg>
                    </div>
                  )}
                  {!loading && addCategory && addCategory?.map((category, index) => {
                    return (
                      <>
                        {category?.show && (
                          <div className='flex items-center justify-between m-3'>
                            <div>
                              <input type='text' value={category?.categoryname} className="w-56 relative border border-black rounded-md p-2" onChange={(e) => handleCategoryName(index, e.target.value)} />
                            </div>
                            <div>
                              <div className="flex justify-center gap-4">
                                <div
                                  className="cursor-pointer text-xl flex gap-3 rounded-full px-2 py-2 text-white text-center bg-[#FF0000]"
                                  onClick={() =>
                                    handleDeleteCategory(index)
                                  }
                                >
                                  <MdDeleteForever />
                                </div>

                                <div
                                  className="cursor-pointer text-xl flex gap-3 rounded-full px-2 py-2 text-white text-center bg-blue-400"
                                  draggable
                                  onDragStart={(event) =>
                                    handleDragStartForDivToDiv(event, category, index)
                                  }
                                  onDrop={(event) =>
                                    handleDropForWithinCategorylist(event, index)
                                  }
                                  onDragOver={(event) =>
                                    handleDragOverForWithinCategorylist(event, index)
                                  }
                                >
                                  <HiOutlineViewList />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="overflow-x-scroll sc-scrollbar rounded-lg">
                          <table
                            className="digital-menu-table w-full lg:table-fixed sm:table-fixed xs:table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 "
                            cellPadding={15}
                          >
                            <thead className="table-head-bg digital-menu-table-th">
                              <tr className="items-center table-head-bg ">
                                <th className="text-[#5A5881] text-base text-center font-semibold w-52">
                                  Item Name
                                </th>
                                <th className="text-[#5A5881] text-base font-semibold  text-center w-80">
                                  Description
                                </th>
                                <th className="text-[#5A5881] text-base font-semibold  text-center w-32">
                                  Price
                                </th>
                                <th className="text-[#5A5881] text-base font-semibold  text-center w-32">
                                  Calories
                                </th>
                                <th className="text-[#5A5881] text-base font-semibold  text-center w-64">
                                  Image
                                </th>
                                <th className="text-[#5A5881] text-base font-semibold  text-center w-24">
                                  Featured
                                </th>
                                <th className="text-[#5A5881] text-base font-semibold  text-center w-24">
                                  Sold Out
                                </th>
                                <th className="text-[#5A5881] text-base font-semibold  text-center w-48">
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
                                          <input type='text' value={item?.name} className="w-full relative border border-black rounded-md p-3"
                                            placeholder='Item Name'
                                            onChange={(e) =>
                                              handleNameChange(index, indexs, e.target.value)
                                            }
                                          />
                                        </td>
                                        <td className="text-[#5E5E5E] text-center">
                                          <input type='text' value={item?.description} className="w-full relative border border-black rounded-md p-3"
                                            placeholder='Description'
                                            onChange={(e) =>
                                              handleDescriptionChange(index, indexs, e.target.value)
                                            } />
                                        </td>

                                        <td className="text-[#5E5E5E] text-center">
                                          <input type='number' value={item?.price} className="w-full relative border border-black rounded-md p-3"
                                            placeholder='Price'
                                            onChange={(e) =>
                                              handlePriceChange(index, indexs, e.target.value)
                                            } />
                                        </td>

                                        <td className="text-[#5E5E5E] text-center">
                                          <input type='number' value={item?.calories} className="w-full relative border border-black rounded-md p-3"
                                            placeholder='Calories'
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
                                            <div className='flex items-center gap-4 justify-center'>
                                              <img src={item?.image?.assetFolderPath} className='w-24 h-16' />
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
                                          <input type='checkbox'
                                            checked={item?.features}
                                            onChange={(e) =>
                                              handleFeatureChange(index, indexs, e.target.checked)
                                            } />
                                        </td>

                                        <td
                                          className="text-[#5E5E5E] text-center"
                                        >
                                          <input type='checkbox' checked={item?.soldOut}
                                            onChange={(e) =>
                                              handleSoldOutChange(index, indexs, e.target.checked)
                                            } />

                                        </td>
                                        <td className="text-center">
                                          <div className="flex justify-center gap-4">
                                            <div
                                              className="cursor-pointer text-xl flex gap-3 rounded-full px-2 py-2 text-white text-center bg-[#FF0000]"
                                              onClick={() =>
                                                handleDeleteItem(index, indexs)
                                              }
                                            >
                                              <MdDeleteForever />
                                            </div>
                                            <div
                                              className="cursor-pointer text-xl flex gap-3 rounded-full px-2 py-2 text-white text-center bg-blue-400"
                                              draggable
                                              onDragStart={(event) =>
                                                handleDragStartWithinlist(event, item, indexs)
                                              }
                                              onDrop={(event) =>
                                                handleDropForWithinlist(event, index, indexs)
                                              }
                                              onDragOver={(event) =>
                                                handleDragOverForWithinlist(event, indexs)
                                              }
                                            >
                                              <HiOutlineViewList />
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
              </div>
            </div>
          )}
          {showPreviewPopup && (
            <DigitalMenuPreview customizeData={customizeData} PreviewData={PreviewData} selectedColor={selectedColor} textColor={textColor} priceColor={priceColor} theme={theme} />
          )}
        </div>
      </div>
      <Footer />

      {showCustomizemodal && (
        <DigitalMenuCustomize toggleModal={toggleModal} register={register} errors={errors} handleSubmit={handleSubmit} onSubmit={onSubmit} selectedColor={selectedColor} setSelectedColor={setSelectedColor} setTextColor={setTextColor} textColor={textColor} setPriceColor={setPriceColor} priceColor={priceColor} PosTheme={PosTheme} setSelectedTheme={setSelectedTheme} selectedtheme={selectedtheme}/>
      )}
      {openModal && (
        <DigitalMenuAssets openModal={openModal} setOpenModal={setOpenModal} setAssetPreviewPopup={setAssetPreviewPopup} selectedAsset={selectedAsset} handleAssetAdd={handleAssetAdd} assetPreviewPopup={assetPreviewPopup} assetPreview={assetPreview} HandleSubmitAsset={HandleSubmitAsset} />
      )}

      {(userDetails?.isTrial === false) && (userDetails?.isActivePlan === false) && (user?.userDetails?.isRetailer === false) && (
        <PurchasePlanWarning />
      )}
    </>
  )
}

export default DigitalMenuBoardDetail
