import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { RiDeleteBinLine } from "react-icons/ri";
import { AiOutlineSearch } from "react-icons/ai";
import "../../Styles/playlist.css";
import { HiDotsVertical } from "react-icons/hi";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import {
  DELETE_ALL_COMPOSITIONS,
  DELETE_COMPOSITION_BY_ID,
  GET_ALL_COMPOSITIONS,
} from "../../Pages/Api";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";

const Composition = ({ sidebarOpen, setSidebarOpen }) => {
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;
  const navigation = useNavigate();

  const [showActionBox, setShowActionBox] = useState(false);
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
        setCompositionData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onClickMoreComposition = (compositionID) => {
    setShowActionBox((prevState) => {
      const updatedState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = key === compositionID ? !prevState[key] : false;
        return acc;
      }, {});
      return { ...updatedState, [compositionID]: !prevState[compositionID] };
    });
  };

  const handelDeleteComposition = (com_id) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${DELETE_COMPOSITION_BY_ID}?ID=${com_id}`,
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [selectAll, setSelectAll] = useState(false);

  const handleSelectComposition = (compositionID) => {
    setCompositionData((prevCompositionData) => {
      const updatedComposition = prevCompositionData.map((composition) =>
        composition.compositionID === compositionID
          ? { ...composition, isChecked: !composition.isChecked }
          : composition
      );

      // Check if all checkboxes are checked or not
      const allChecked = updatedComposition.every(
        (composition) => composition.isChecked
      );
      setSelectAll(allChecked);

      return updatedComposition;
    });
  };

  const handleSelectAll = () => {
    setCompositionData((prevCompositionData) => {
      const updatedComposition = prevCompositionData.map((composition) => ({
        ...composition,
        isChecked: !selectAll,
      }));

      setSelectAll(!selectAll);

      return updatedComposition;
    });
  };
  const handleDeleteAllCompositions = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: DELETE_ALL_COMPOSITIONS,
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        loadComposition();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    loadComposition();
  }, []);
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
                  checked={selectAll}
                  onChange={() => handleSelectAll()}
                />
              </button>

              <button
                onClick={handleDeleteAllCompositions}
                className="sm:ml-2 xs:ml-1  flex align-middle border-white bg-SlateBlue text-white items-center border-2 rounded-full xs:px-2 xs:py-1 sm:py-2 sm:px-3 md:p-3 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                style={{ display: selectAll ? "block" : "none" }}
              >
                <RiDeleteBinLine />
              </button>
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
                    Tags
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
                        className="w-6 h-5 mr-2"
                        checked={composition.isChecked || false}
                        onChange={() =>
                          handleSelectComposition(composition.compositionID)
                        }
                      />
                      {composition.compositionName}
                    </td>
                    <td className="p-2">
                      {moment(composition.dateAdded).format("YYYY-MM-DD")}
                    </td>
                    <td className="p-2 ">{composition.resolution}</td>
                    <td className="p-2">{composition.duration}</td>
                    <td className="p-2">{composition.tags}</td>
                    <td className="p-2 text-center relative ">
                      <div className="relative ">
                        <button
                          className="ml-3 relative"
                          onClick={() => {
                            onClickMoreComposition(composition.compositionID);
                          }}
                        >
                          <HiDotsVertical />
                        </button>
                        {/* action popup start */}
                        {showActionBox[composition.compositionID] && (
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
                              <button
                                onClick={() =>
                                  handelDeleteComposition(
                                    composition.compositionID
                                  )
                                }
                              >
                                Delete
                              </button>
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
