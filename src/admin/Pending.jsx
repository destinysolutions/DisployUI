import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { DELETE_USER } from "../Pages/Api";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import {
  ADD_ORGANIZATION_MASTER,
  GET_ALL_ORGANIZATION_SIGNUPS,
  SELECT_BY_ORGANIZATION_SIGNUPS_ID,
} from "./AdminAPI";

const Pending = ({ sidebarOpen, setSidebarOpen }) => {
  const [userData, setUserData] = useState([]);
  const [deletePopup, setdeletePopup] = useState(false);
  const [pendingForm, setPendingForm] = useState(false);
  const [pendingUserData, setPendingUserData] = useState([]);
  const [trialExtend, setTrialExtended] = useState(false);
  const [newTrialDay, setNewTrialDay] = useState(14);
  const [originalUserData, setOriginalUserData] = useState([]);
  const handleCheckboxChange = (event) => {
    setTrialExtended(event.target.checked);
  };
  const handleUserData = () => {
    axios
      .get(GET_ALL_ORGANIZATION_SIGNUPS)
      .then((response) => {
        const fetchedData = response.data.data;
        setUserData(fetchedData);
        setOriginalUserData(fetchedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    handleUserData();
  }, []);

  const selectByuserData = (id) => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${SELECT_BY_ORGANIZATION_SIGNUPS_ID}?ID=${id}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setPendingUserData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleAcceptUser = (orgSignupID) => {
    pendingUserData.forEach((userData) => {
      const data = {
        organizationName: userData.organizationName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        isActive: true,
        isTrial: true,
        trialDays: newTrialDay,
        createdBy: 0,
        modifiedBy: 0,
        operation: "Insert",
        Latitude: "12.12",
        Longitude: "12.12",
        OrgSingupID: orgSignupID,
        GoogleLocation: userData.googleLocation,
      };

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: ADD_ORGANIZATION_MASTER,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
      };

      axios
        .request(config)
        .then((response) => {
          handleUserData();
          setPendingForm(false);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };
  const handleDelete = (id) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${DELETE_USER}?Id=${id}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setUserData((prevData) =>
          prevData.filter((user) => user.userID !== id)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      name: "First Name",
      selector: (row) => row.firstName,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.lastName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Google Location",
      selector: (row) => row.googleLocation,
      sortable: true,
    },
    {
      name: "PhoneNo",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Organization Name",
      selector: (row) => row.organizationName,
      sortable: true,
    },
    {
      name: "Trial Day",
      selector: (row) => "14",
      sortable: true,
    },
    {
      name: "Approval",
      cell: (row) => (
        <div className="relative">
          <button
            className="text-red"
            onClick={() => {
              setPendingForm(true);
              selectByuserData(row.orgSingupID);
            }}
          >
            Pending
          </button>
          {pendingForm && (
            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
              <div className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
                    <div className="flex items-center">
                      <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                        Accept User Request
                      </h3>
                    </div>
                    <button
                      className="p-1 text-xl ml-8"
                      onClick={() => setPendingForm(false)}
                    >
                      <AiOutlineCloseCircle className="text-2xl" />
                    </button>
                  </div>
                  <div className="p-4">
                    {trialExtend == true ? (
                      <>
                        <input
                          type="number"
                          placeholder="Enter Trial Days"
                          className="formInput"
                          value={newTrialDay}
                          onChange={(e) => setNewTrialDay(e.target.value)}
                        />
                      </>
                    ) : (
                      <div className="flex items-center">
                        <label>Do you want to Trial Days extend ?</label>
                        <input
                          className="border border-primary ml-3 rounded h-6 w-6"
                          type="checkbox"
                          checked={trialExtend}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                    )}

                    <div className="flex justify-center items-center mt-5">
                      <button
                        onClick={() => handleAcceptUser(row.orgSingupID)}
                        className="border border-primary rounded-full px-6 py-2 not-italic font-medium"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <div className="relative">
    //       <button onClick={() => handleActionClick(row.orgSingupID)}>
    //         <CiMenuKebab />
    //       </button>
    //       {showActionBox === row.orgSingupID && (
    //         <>
    //           <div className="actionpopup z-10 ">
    //             <button
    //               onClick={() => setShowActionBox(false)}
    //               className="bg-white absolute top-[-14px] left-[-8px] z-10  rounded-full drop-shadow-sm p-1"
    //             >
    //               <AiOutlineClose />
    //             </button>

    //             <div className=" my-1">
    //               <button onClick={() => handleEditTrialDay(row)}>
    //                 Edit Trial Day
    //               </button>
    //             </div>
    //             <div className=" mb-1 text-[#D30000]">
    //               <button onClick={() => setdeletePopup(true)}>Delete</button>
    //             </div>
    //           </div>
    //           {deletePopup ? (
    //             <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
    //               <div className="relative w-full max-w-xl max-h-full">
    //                 <div className="relative bg-white rounded-lg shadow">
    //                   <div className="py-6 text-center">
    //                     <RiDeleteBin6Line className="mx-auto mb-4 text-[#F21E1E] w-14 h-14" />
    //                     <h3 className="mb-5 text-xl text-primary">
    //                       Are you sure you want to delete this User?
    //                     </h3>
    //                     <div className="flex justify-center items-center space-x-4">
    //                       <button
    //                         className="border-primary border rounded text-primary px-5 py-2 font-bold text-lg"
    //                         onClick={() => setdeletePopup(false)}
    //                       >
    //                         No, cancel
    //                       </button>

    //                       <button
    //                         className="text-white bg-[#F21E1E] rounded text-lg font-bold px-5 py-2"
    //                         onClick={() => {
    //                           handleDelete(row.orgSingupID);
    //                           setdeletePopup(false);
    //                         }}
    //                       >
    //                         Yes, I'm sure
    //                       </button>
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           ) : null}
    //         </>
    //       )}
    //     </div>
    //   ),
    // },
  ];

  function handleFilter(event) {
    const searchValue = event.target.value.toLowerCase();

    if (searchValue === "") {
      setUserData(originalUserData);
    } else {
      const newData = userData.filter((row) => {
        return row.firstName.toLowerCase().includes(searchValue);
      });
      setUserData(newData);
    }
  }

  const [showActionBox, setShowActionBox] = useState(false);
  const handleActionClick = (rowId) => {
    setShowActionBox(rowId);
  };

  return (
    <>
      <div className="flex border-b border-gray ">
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <AdminNavbar />
      </div>
      <div className="pt-6 px-5 page-contain ">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium text-2xl sm:text-xl text-[#001737] sm:mb-4 ">
              Pending User
            </h1>

            <div className="text-right mb-5 mr-5 relative sm:mr-0">
              <AiOutlineSearch className="absolute top-[13px] right-[232px] z-10 text-gray searchicon" />
              <input
                type="text"
                placeholder=" Search Users "
                className="border border-gray rounded-full px-7 py-2 search-user"
                onChange={handleFilter}
              />
            </div>
          </div>
          <div className="mt-7">
            <DataTable
              columns={columns}
              data={userData}
              fixedHeader
              pagination
              paginationPerPage={10}
            ></DataTable>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pending;
