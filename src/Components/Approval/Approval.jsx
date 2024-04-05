import React, { useEffect } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getApprovalData, handleApproval } from "../../Redux/ApprovalSlice";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { APPROVEDETAILBYID } from "../../Pages/Api";
import { socket } from "../../App";
const Approval = ({ sidebarOpen, setSidebarOpen }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const [ApprovalList, setApprovalList] = useState([]);
  const [loading, setLoading] = useState(false);

  // pagination Start
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  // Get current items based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ApprovalList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(ApprovalList?.length / itemsPerPage);
  // pagination End

  const fetchApproval = () => {
    setLoading(true);
    dispatch(getApprovalData())
      .then((res) => {
        setApprovalList(res?.payload?.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    fetchApproval();
  }, []);

  const HandleToggle = (selectApproval) => {
    try {
      Swal.fire({
        title: "Approval",
        text: "Are you sure you want to Approve",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#00A300",
        cancelButtonColor: "#FF0000",
        confirmButtonText: "Yes, Approve it!",
      }).then((result) => {
        if (result.isConfirmed) {
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${APPROVEDETAILBYID}?IsApprove=1&UserApproverDetailsID=${selectApproval?.userApproverDetailsID}`,
            headers: {
              "Content-Type": "multipart/form-data;",
              Authorization: authToken,
            },
          };
          dispatch(handleApproval({ config }))
            .then((res) => {
              if (res?.payload?.status === 200) {
                if (res?.payload?.macID !== "") {
                  const Params = {
                    id: socket.id,
                    connection: socket.connected,
                    macId: res?.payload?.macID,
                  };
                  socket.emit("ScreenConnected", Params);
                }
                Swal.fire({
                  title: "Approved!",
                  text: "Your Request has been approved.",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 1500,
                });
                fetchApproval();
              }
            })
            .catch((error) => {
              console.log("error", error);
            });
        }
        if (result.isDismissed) {
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${APPROVEDETAILBYID}?IsApprove=2&UserApproverDetailsID=${selectApproval?.userApproverDetailsID}`,
            headers: {
              "Content-Type": "multipart/form-data;",
              Authorization: authToken,
            },
          };
          dispatch(handleApproval({ config }))
            .then((res) => {
              if (res?.payload?.status === 200) {
                Swal.fire({
                  title: "Cancelled",
                  text: "Your Request has been cancelled.",
                  icon: "error",
                  showConfirmButton: false,
                  timer: 1500,
                });
                fetchApproval();
              }
            })
            .catch((error) => {
              console.log("error", error);
            });
        }
      });
    } catch (error) {
      console.log("error ", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      {/* sidebar and navbar display start */}
      <div className="flex ">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      {/* sidebar and navbar display end */}
      <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium text-2xl sm:text-xl text-[#001737] sm:mb-4 ml-">
              Approval
            </h1>
          </div>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md overflow-y-auto relative">
            <div className="overflow-x-scroll sc-scrollbar rounded-lg">
              <table
                className="screen-table w-full bg-white lg:table-fixed md:table-auto sm:table-auto xs:table-auto"
                cellPadding={15}
              >
                <thead>
                  <tr className="items-center table-head-bg">
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Type
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Name
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Request Date
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Requested BY
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                {loading && (
                  <tr>
                    <td colSpan={5}>
                      <div className="flex text-center m-5 justify-center">
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="inline w-10 h-10 me-3 text-black-200 animate-spin dark:text-black-600"
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
                    </td>
                  </tr>
                )}
                {!loading &&
                  currentItems.length > 0 &&
                  currentItems.map((item, index) => (
                    <tr key={index} className="border-b-[#E4E6FF] border-b">
                      <td className="text-[#5E5E5E] text-center">
                        {item?.type}
                      </td>
                      <td className="text-[#5E5E5E] text-center">
                        {item?.name}
                      </td>
                      <td className="text-[#5E5E5E] text-center">
                        {item?.date}
                      </td>

                      <td className="text-[#5E5E5E] text-center">
                        {item?.userName}
                      </td>
                      <td className="text-[#5E5E5E] text-center">
                        <label className="relative inline-flex items-center me-5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={false}
                            className="sr-only peer"
                            onChange={(e) => {
                              HandleToggle(item);
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                        </label>
                      </td>
                    </tr>
                  ))}
                {!loading && currentItems.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <div className="flex text-center justify-center">
                        <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2 text-black">
                          No Data Available
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </table>
            </div>

            {/* Pagination start */}
            <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
              <div className="flex items-center">
                <span className="text-gray-500">{`Total ${ApprovalList?.length} Approval`}</span>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex cursor-pointer hover:bg-white hover:text-primary items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 5H1m0 0 4 4M1 5l4-4"
                    />
                  </svg>
                  {sidebarOpen ? "Previous" : ""}
                </button>
                <div className="flex items-center me-3">
                  <span className="text-gray-500">{`Page ${currentPage} of ${totalPages}`}</span>
                </div>
                {/* <span>{`Page ${currentPage} of ${totalPages}`}</span> */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={(currentPage === totalPages) || (ApprovalList?.length === 0)}
                  className="flex hover:bg-white hover:text-primary cursor-pointer items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  {sidebarOpen ? "Next" : ""}
                  <svg
                    className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {/* Pagination End */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Approval;
