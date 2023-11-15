import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbBoxMultiple } from "react-icons/tb";
import { FiUpload } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import { MdPlaylistAddCircle } from "react-icons/md";
import { RiPlayList2Line } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BsCameraVideo } from "react-icons/bs";
import { IoImageOutline } from "react-icons/io5";
import "../../Styles/playlist.css";
import { TfiYoutube } from "react-icons/tfi";
import { TbCoffee } from "react-icons/tb";
import { TiWeatherSunny } from "react-icons/ti";
import { HiOutlineAnnotation } from "react-icons/hi";
import { IoFastFoodOutline } from "react-icons/io5";
import { MdArrowForwardIos } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { SlArrowDown } from "react-icons/sl";
import PropTypes from "prop-types";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoBarChartSharp } from "react-icons/io5";
import { RiPlayListFill } from "react-icons/ri";
import { BiAnchor } from "react-icons/bi";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { HiDotsVertical } from "react-icons/hi";

import { Link } from "react-router-dom";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import { GET_ALL_COMPOSITIONS } from "../../Pages/Api";
import { useSelector } from "react-redux";
import axios from "axios";

const Composition = ({ sidebarOpen, setSidebarOpen }) => {
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;
  const navigation = useNavigate();

  const [toggle, setToggle] = useState(1);
  function updatetoggle(toggleTab) {
    setToggle(toggleTab);
  }
  const [activeTab, setActiveTab] = useState(1);
  const [popupActiveTab, setPopupActiveTab] = useState(2);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
    setPopupActiveTab(tabNumber);
  };
  const [onClickMore, setOnClickMore] = useState(false);
  const initialComposition = [
    {
      CompositionName: "Composition 1",
      DateAdded: "10 May 2023 / 10:30AM",
      Resolution: "1280x720 Pixels",
      Duration: "10 Sec",
      Tags: "Tags, Tags",
      isSelected: false,
      onClickMore: false,
    },
    {
      CompositionName: "Composition 2",
      DateAdded: "10 May 2023 / 10:30AM",
      Resolution: "1280x720 Pixels",
      Duration: "15 Sec",
      Tags: "Tags, Tags",
      isSelected: false,
      onClickMore: false,
    },
    {
      CompositionName: "Composition 3",
      DateAdded: "10 May 2023 / 10:30AM",
      Resolution: "1280x720 Pixels",
      Duration: "10 Sec",
      Tags: "Tags, Tags",
      isSelected: false,
      onClickMore: false,
    },
    {
      CompositionName: "Composition 4",
      DateAdded: "10 May 2023 / 10:30AM",
      Resolution: "1280x720 Pixels",
      Duration: "20 Sec",
      Tags: "Tags, Tags",
      isSelected: false,
      onClickMore: false,
    },
    {
      CompositionName: "Composition 5",
      DateAdded: "10 May 2023 / 10:30AM",
      Resolution: "1280x720 Pixels",
      Duration: "21 Sec",
      Tags: "Tags, Tags",
      isSelected: false,
      onClickMore: false,
    },
  ];
  const [compositionData, setCompositionData] = useState([]);
  const loadComposition = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: GET_ALL_COMPOSITIONS,
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setCompositionData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    loadComposition();
  });
  const [playlistDropdown, setplaylistDropdown] = useState(false);
  const [showAppTabContent, setShowAppTabContent] = useState(false);
  const [showYoutubeContent, setShowYoutubeContent] = useState(false);
  const [showTagAdded, setShowTagAdded] = useState(false);

  const [playlists, setPlaylists] = useState([]);
  //const [CompositionList, setCompositionList] = useState(initialComposition);
  const [SelectAllCompositionList, setSelectAllCompositionList] =
    useState(false);

  const addNewPlaylist = () => {
    // Create a new playlist object here
    const newPlaylist = {
      name: `Playlist Name ${playlists.length + 3}`,
      savedTime: "01:10:00",
    };

    // Update the playlists state with the new playlist
    setPlaylists([...playlists, newPlaylist]);
  };

  const [playlistChange, setplaylistChange] = useState(1);

  const handlePlaylistChange = (playlistNO) => {
    setplaylistChange(playlistNO);
  };

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const onSelectComposition = (param) => {
    const CompositionData = [...CompositionList];
    const newData = CompositionData.map((item, index) => {
      if (index == param) {
        return { ...item, isSelected: !item.isSelected };
      } else {
        return item;
      }
    });
    setCompositionList(newData);
  };

  const onALLSelectComposition = (e) => {
    const CompositionData = [...CompositionList];
    const newData = CompositionData.map((item) => {
      return { ...item, isSelected: e.target.checked };
    });
    setCompositionList(newData);
    setSelectAllCompositionList(e.target.checked);
  };

  // const onClickMoreComposition = (param) => {
  //   const CompositionData = [...CompositionList];
  //   const newData = CompositionData.map((item, index) => {
  //     if (index == param) {
  //       return { ...item, onClickMore: !item.onClickMore };
  //     } else {
  //       return { ...item, onClickMore: false };
  //     }
  //   });
  //   setCompositionList(newData);
  // };
  const onClickMoreComposition = (compositionID) => {
    // Toggle the action menu for the clicked schedule item
    setOnClickMore((prevState) => ({
      ...prevState,
      [compositionID]: !prevState[compositionID] || false,
    }));
  };
  return (
    <>
      <div className="flex bg-white py-3 border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block xs:block  items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 "></h1>
            <div className="flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap playlistbtn">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <AiOutlineSearch className="w-5 h-5 text-gray " />
                </span>
                <input
                  type="text"
                  placeholder="Search Content"
                  className="border border-primary rounded-full px-7 py-2.5 block w-full p-4 pl-10"
                />
              </div>
              <button className="sm:ml-2 xs:ml-1 flex align-middle border-white bg-SlateBlue text-white items-center border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                Preview
              </button>
              <button
                onClick={() => navigation("/addcomposition")}
                className="sm:ml-2 xs:ml-1  flex align-middle border-white bg-SlateBlue text-white items-center border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
              >
                Add Composition
              </button>
              <button className="sm:ml-2 xs:ml-1  flex align-middle border-white bg-SlateBlue text-white items-center border-2 rounded-full p-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <input
                  type="checkbox"
                  className="w-6 h-5"
                  checked={SelectAllCompositionList}
                  onChange={(event) => onALLSelectComposition(event)}
                />
              </button>
              {SelectAllCompositionList && (
                <button className="sm:ml-2 xs:ml-1  flex align-middle border-white bg-SlateBlue text-white items-center border-2 rounded-full xs:px-2 xs:py-1 sm:py-2 sm:px-3 md:p-3 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                  <RiDeleteBinLine />
                </button>
              )}
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl mt-8 shadow bg-white mb-6">
            <table
              className="w-full bg-white lg:table-fixed md:table-auto sm:table-auto xs:table-auto"
              cellPadding={20}
            >
              <thead>
                <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg text-left">
                  <th className="text-[#5A5881] text-base font-semibold">
                    Composition Name
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold">
                    Date Added
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold">
                    Resolution
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold">
                    Duration
                  </th>
                  <th
                    colSpan="2"
                    className="text-[#5A5881] text-base font-semibold"
                  >
                    Tags{" "}
                  </th>
                </tr>
              </thead>
              <tbody>
                {compositionData.map((composition) => (
                  <tr
                    className="border-b border-b-[#E4E6FF]"
                    key={composition.compositionID}
                  >
                    <td className="flex">
                      <input
                        type="checkbox"
                        className="w-6 h-5 me-2"
                        // checked={isSelected}
                        // value={isSelected}
                        onChange={() =>
                          onSelectComposition(composition.compositionID)
                        }
                      />
                      {composition.compositionName}
                    </td>
                    <td className="p-2">{/* {DateAdded} */}</td>
                    <td className="p-2 ">{composition.resolution}</td>
                    <td className="p-2">{/* {Duration} */}</td>
                    <td className="p-2">{composition.tags}</td>
                    <td className="p-2 text-center relative ">
                      <div className="relative ">
                        <button
                          className="ml-3 relative"
                          onClick={() =>
                            onClickMoreComposition(composition.compositionID)
                          }
                        >
                          <HiDotsVertical />
                        </button>
                        {/* action popup start */}
                        {onClickMore[composition.compositionID] && (
                          <div className="scheduleAction z-10 ">
                            <div className="my-1">
                              <button>Edit </button>
                            </div>
                            <div className=" mb-1">
                              <button>Duplicate</button>
                            </div>
                            <div className=" mb-1">
                              <button>Set to Screens</button>
                            </div>
                            <div className="mb-1 border border-[#F2F0F9]"></div>
                            <div className=" mb-1 text-[#D30000]">
                              <button>Delete</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Composition;
