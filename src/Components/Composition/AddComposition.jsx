import PropTypes from "prop-types";
import Footer from "../Footer";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { SELECT_BY_LIST } from "../../Pages/Api";
import { useDispatch, useSelector } from "react-redux";
import { HiArrowLongLeft } from "react-icons/hi2";
import { handleGetCompositionLayouts } from "../../Redux/CompositionSlice";

const AddComposition = ({ sidebarOpen, setSidebarOpen }) => {
  AddComposition.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const { token } = useSelector((state) => state.root.auth);
  const { compositionLayouts, loading } = useSelector(
    (state) => state.root.composition
  );
  const authToken = `Bearer ${token}`;

  const navigation = useNavigate();
  const dispatch = useDispatch();

  const SelectLayout = (data) => {
    navigation(`/addcomposition/${data?.layoutDtlID}`);
  };

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: SELECT_BY_LIST,
      headers: {
        Authorization: authToken,
      },
    };
    const response = dispatch(handleGetCompositionLayouts({ config }));
    if (!response) return;
  }, []);

  return (
    <>
      <div className="flex bg-white border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-16 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block xs:block  items-center ">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 "></h1>
            <div className="flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap playlistbtn"></div>
          </div>
          <div className="rounded-xl mt-8 shadow bg-white p-5">
            <h4
              className="text-lg font-medium mb-5 flex w-fit items-center gap-2 cursor-pointer "
              onClick={() => {
                if (window.history.length > 1) {
                  navigation("/composition");
                } else {
                  window.close();
                }
              }}
            >
              <HiArrowLongLeft size={30} /> Standard
            </h4>
            <div className="grid grid-cols-3 gap-8">
              {loading ? (
                <div className="text-center col-span-full font-semibold text-2xl">
                  Loading...
                </div>
              ) : compositionLayouts?.length == 0 && !loading ? (
                <div>No layouts here.</div>
              ) : (
                compositionLayouts?.map((item, index) => (
                  <div className="relative" key={index}>
                    <div className="layout-card block text-center max-w-xs mx-auto ">
                      <img
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(
                          item.svg
                        )}`}
                        alt="Logo"
                        className=" mx-auto"
                      />
                      <div className="onhover_show">
                        <div className="text">
                          <h4 className="text-lg font-medium">{item?.name}</h4>
                          <p className="text-sm font-normal ">
                            Total Section: {item.lstLayloutModelList.length}
                          </p>
                        </div>
                        <button
                          className="bg-SlateBlue mx-auto text-white rounded-full px-4 py-2 hover:bg-primary hover:text-white text-sm hover:bg-primary-500"
                          onClick={() => SelectLayout(item)}
                        >
                          Use This Layout
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default AddComposition;
