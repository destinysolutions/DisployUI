import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "../../../Styles/dashboard.css";
import { AiOutlineSearch } from "react-icons/ai";
import { CiMenuKebab } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  ADD_REGISTER_URL,
  All_REGISTER_URL,
  DELETE_USER,
  UPDATE_TRIAL_DAY,
} from "../../../Pages/Api";
import Footer from "../../Footer";
const Users = () => {
  const [userData, setUserData] = useState([]);
  const [deletePopup, setdeletePopup] = useState(false);

  useEffect(() => {
    axios
      .get(All_REGISTER_URL)
      .then((response) => {
        const fetchedData = response.data.data;
        setUserData(fetchedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
  const handleEditTrialDay = (row) => {
    const newTrialDays = parseInt(prompt("Enter new trial days:"));
    if (!isNaN(newTrialDays)) {
      // Update the trial day via API
      const data = {
        userID: row.userID,
        mode: "TDUpdate",
        operation: "TDUpdate",
        trialDays: newTrialDays,
      };

      axios
        .post(UPDATE_TRIAL_DAY, data)
        .then((response) => {
          // Update the trial day in the state
          setUserData((prevData) =>
            prevData.map((user) =>
              user.userID === row.userID
                ? { ...user, trialDays: newTrialDays }
                : user
            )
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const columns = [
    {
      name: "Name",
      selector: (row) => row.firstName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.emailID,
      sortable: true,
    },
    {
      name: "PhoneNo",
      selector: (row) => row.phoneNumber,
      sortable: true,
    },
    {
      name: "Brand",
      selector: (row) => row.companyName,
      sortable: true,
    },
    {
      name: "Trial Day",
      selector: (row) => row.trialDays,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="relative">
          <button onClick={() => handleActionClick(row.userID)}>
            <CiMenuKebab />
          </button>
          {showActionBox === row.userID && (
            <>
              <div className="actionpopup z-10 ">
                <button
                  onClick={() => setShowActionBox(false)}
                  className="bg-white absolute top-[-14px] left-[-8px] z-10  rounded-full drop-shadow-sm p-1"
                >
                  <AiOutlineClose />
                </button>

                {/* <div className=" my-1">
                  <NavLink to="/edituser">Edit</NavLink>
                </div>
                <div className=" mb-1">
                  <NavLink to="/viewuserprofile">View Profile</NavLink>
                </div>
                <div className=" mb-2 text-[#007F00]">
                  <NavLink to={""}>Active User</NavLink>
                </div> */}
                {/* <div className="mb-1 border border-[#F2F0F9]"></div> */}
                <div className=" my-1">
                  <button onClick={() => handleEditTrialDay(row)}>
                    Edit Trial Day
                  </button>
                </div>
                <div className=" mb-1 text-[#D30000]">
                  <button onClick={() => setdeletePopup(true)}>Delete</button>
                </div>
              </div>
              {deletePopup ? (
                <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
                  <div className="relative w-full max-w-xl max-h-full">
                    <div className="relative bg-white rounded-lg shadow">
                      <div className="py-6 text-center">
                        <RiDeleteBin6Line className="mx-auto mb-4 text-[#F21E1E] w-14 h-14" />
                        <h3 className="mb-5 text-xl text-primary">
                          Are you sure you want to delete this User?
                        </h3>
                        <div className="flex justify-center items-center space-x-4">
                          <button
                            className="border-primary border rounded text-primary px-5 py-2 font-bold text-lg"
                            onClick={() => setdeletePopup(false)}
                          >
                            No, cancel
                          </button>

                          <button
                            className="text-white bg-[#F21E1E] rounded text-lg font-bold px-5 py-2"
                            onClick={() => {
                              handleDelete(row.userID);
                              setdeletePopup(false);
                            }}
                          >
                            Yes, I'm sure
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      ),
    },
  ];

  function handleFilter(event) {
    const newData = userData.filter((row) => {
      return row.firstName
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    setUserData(newData);
  }

  const [showActionBox, setShowActionBox] = useState(false);
  const handleActionClick = (rowId) => {
    setShowActionBox(rowId);
  };

  return (
    <>
      <div className="bg-white p-3 rounded-md">
        <div className="text-right mb-5 mr-5 flex items-end justify-end relative sm:mr-0">
          <AiOutlineSearch className="absolute top-[13px] right-[232px] z-10 text-gray searchicon" />
          <input
            type="text"
            placeholder=" Search Users "
            className="border border-gray rounded-full px-7 py-2 search-user"
            onChange={handleFilter}
          />
        </div>
        <DataTable
          columns={columns}
          data={userData}
          fixedHeader
          pagination
          paginationPerPage={10}
        ></DataTable>
      </div>
    </>
  );
};

export default Users;
