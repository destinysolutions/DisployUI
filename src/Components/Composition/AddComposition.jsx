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
      <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block xs:block  items-center ">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737]"></h1>
            <div className="flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap playlistbtn"></div>
          </div>
          <div className="rounded-xl shadow-lg bg-white p-5">
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
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
              {loading ? (
                <div className="flex col-span-3 text-center m-5 justify-center">
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
