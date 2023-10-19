import React from "react";
import { useState } from "react";
import { FaCertificate } from "react-icons/fa";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useEffect } from "react";
const Userrole = () => {
  const [showdata, setShowdata] = useState(false);
  const handleDropupClick = () => {
    setShowdata(!showdata);
  };
  {
    /*model */
  }
  const [showuserroleModal, setshowuserroleModal] = useState(false);

  const tableData = [
    {
      id: 1,
      name: "Screen",
      create: true,
      edit: false,
      delete: true,
      proposeChanges: false,
      approveChanges: true,
    },
    {
      id: 2,
      name: "My Schedule",
      create: false,
      edit: true,
      delete: true,
      proposeChanges: true,
      approveChanges: false,
    },
    {
      id: 3,
      name: "Apps",
      create: false,
      edit: true,
      delete: true,
      proposeChanges: true,
      approveChanges: false,
    },
    {
      id: 4,
      name: "Settings",
      create: false,
      edit: true,
      delete: true,
      proposeChanges: true,
      approveChanges: false,
    },
    {
      id: 5,
      name: "Reports",
      create: false,
      edit: true,
      delete: true,
      proposeChanges: true,
      approveChanges: false,
    },
    {
      id: 6,
      name: "Trash",
      create: false,
      edit: true,
      delete: true,
      proposeChanges: true,
      approveChanges: false,
    },
  ];
  //   const [checkboxStates, setCheckboxStates] = useState({});

  //   const handleCheckboxChange = (id) => {
  //     setCheckboxStates((prevStates) => ({
  //       ...prevStates,
  //       [id]: !prevStates[id], // Toggle the checkbox state
  //     }));
  //   };

  const [checkboxStates, setCheckboxStates] = useState({});

  const [showPopup, setShowPopup] = useState(false); // New state to control the popup visibility
  const [selectedRows, setSelectedRows] = useState([]);
  const handleCheckboxChange = (checkboxId, rowId) => {
    // Update checkbox state when clicked
    setCheckboxStates((prevState) => ({
      ...prevState,
      [rowId]: {
        ...prevState[rowId],
        [checkboxId]: !prevState[rowId]?.[checkboxId] || true,
      },
    }));
  };

  // Check if any checkbox is checked
  const isAnyCheckboxChecked = Object.values(checkboxStates).some(
    (isChecked) => isChecked
  );

  // Function to handle the "Set Approval" button click
  const handleSetApprovalClick = (rowId) => {
    if (isAnyCheckboxChecked) {
      // If any checkbox is checked, fetch selected row names and show the popup
      const rowData = tableData.find((row) => row.id === rowId);
      setSelectedRows(rowData ? [rowData.name] : []);
      setShowPopup(true);
    }
  };

  // Function to close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Billing
  const BillingData = [
    {
      id: 7,
      name: "Payment Method",
      create: true,
      edit: false,
      delete: true,
      proposeChanges: false,
      approveChanges: true,
    },
    {
      id: 8,
      name: "receive bank Access",
      create: false,
      edit: true,
      delete: true,
      proposeChanges: true,
      approveChanges: false,
    },
  ];

  // content
  const contentData = [
    {
      id: 9,
      name: "Assets",
      create: true,
      edit: false,
      delete: true,
      proposeChanges: false,
      approveChanges: true,
    },
    {
      id: 10,
      name: "Disploy Studio",
      create: false,
      edit: true,
      delete: true,
      proposeChanges: true,
      approveChanges: false,
    },
    {
      id: 11,
      name: "Playlist",
      create: false,
      edit: true,
      delete: true,
      proposeChanges: true,
      approveChanges: false,
    },
    {
      id: 12,
      name: "Template",
      create: false,
      edit: true,
      delete: true,
      proposeChanges: true,
      approveChanges: false,
    },
  ];

  // State to store the checkbox and dropdown states retrieved from localStorage
  const [localStorageData, setLocalStorageData] = useState({
    checkboxState: {},
    dropdownStates: {},
  });
  // Destructure checkboxStates and dropdownStates from localStorageData
  const { checkboxState, dropdownStates } = localStorageData;
  // Effect hook to retrieve data from localStorage on component mount
  useEffect(() => {
    const storedCheckboxStates = JSON.parse(
      localStorage.getItem("approvalReqCheckboxes")
    );
    const storedDropdownStates = JSON.parse(
      localStorage.getItem("approvalReqDropdowns")
    );

    setLocalStorageData({
      checkboxState: storedCheckboxStates || {},
      dropdownStates: storedDropdownStates || {},
    });
  }, []);

  const mergedCheckboxStates = {
    ...checkboxState,
    ...localStorageData.checkboxState,
  };
  const mergedDropdownStates = {
    ...dropdownStates,
    ...localStorageData.dropdownStates,
  };

  // console.log(mergedDropdownStates.screen);
  // console.log(mergedDropdownStates.mySchedule);
  // console.log(mergedDropdownStates.apps);
  // console.log(mergedDropdownStates.settings);
  // console.log(mergedDropdownStates.reports);
  return (
    <>
      <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2">
        <button
          className=" dashboard-btn  flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5  py-2 text-base sm:text-sm mb-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
          onClick={() => setshowuserroleModal(true)}
        >
          <FaCertificate className="text-lg mr-1" />
          Add New Role
        </button>

        <div className="accordions  clear-both">
          <div className="section shadow-md py-3 px-5 rounded-md bg-lightgray flex  items-center justify-between">
            <h1 className="text-lg text-primary font-medium">Manager</h1>
            <div className=" flex items-center">
              <button className="showicon" onClick={handleDropupClick}>
                {showdata ? (
                  <MdOutlineKeyboardArrowUp className="text-3xl" />
                ) : (
                  <MdOutlineKeyboardArrowDown className="text-3xl" />
                )}
              </button>
            </div>
          </div>

          {showdata && (
            <div className="bg-[#EFF3FF] py-5 overflow-x-auto">
              <table className="w-full text-left" cellPadding={15}>
                <thead>
                  <tr className="border-b border-b-[#E4E6FF]">
                    <th className=" w-2/5"></th>
                    <th className="text-[#5A5881] text-base font-semibold  w-1/12">
                      Create
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-1/12">
                      Edit
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-1/12">
                      Delete
                    </th>
                    <th>Need Approval</th>
                    {/* <th className='text-[#5A5881] text-base font-semibold w-2/12'>Propose Changes</th>
                                        <th className='text-[#5A5881] text-base font-semibold w-2/12'>Approve Changes</th> */}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row) => (
                    <tr key={row.id} className="border-b border-b-[#E4E6FF]">
                      <td className="text-[#5E5E5E] max-w-xl">{row.name}</td>
                      <td>
                        <input
                          type="checkbox"
                          id={`cbx${row.id}-1`}
                          className="hidden cbx"
                          checked={
                            checkboxStates[row.id]?.[`cbx${row.id}-1`] || false
                          }
                          onChange={() =>
                            handleCheckboxChange(`cbx${row.id}-1`, row.id)
                          }
                        />
                        <label className="check cbx">
                          <svg width="18px" height="18px" viewBox="0 0 18 18">
                            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                            <polyline points="1 9 7 14 15 4"></polyline>
                          </svg>
                        </label>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          id={`cbx${row.id}-2`}
                          className="hidden cbx"
                          checked={
                            checkboxStates[row.id]?.[`cbx${row.id}-2`] || false
                          }
                          onChange={() =>
                            handleCheckboxChange(`cbx${row.id}-2`, row.id)
                          }
                        />
                        <label htmlFor={`cbx${row.id}-2`} className="check cbx">
                          <svg width="18px" height="18px" viewBox="0 0 18 18">
                            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                            <polyline points="1 9 7 14 15 4"></polyline>
                          </svg>
                        </label>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          id={`cbx${row.id}-3`}
                          className="hidden cbx"
                          checked={
                            checkboxStates[row.id]?.[`cbx${row.id}-3`] || false
                          }
                          onChange={() =>
                            handleCheckboxChange(`cbx${row.id}-3`, row.id)
                          }
                        />
                        <label htmlFor={`cbx${row.id}-3`} className="check cbx">
                          <svg width="18px" height="18px" viewBox="0 0 18 18">
                            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                            <polyline points="1 9 7 14 15 4"></polyline>
                          </svg>
                        </label>
                      </td>
                      <td>
                        {row.name === "Screen" &&
                          mergedCheckboxStates.screen === true && (
                            <button
                              onClick={() => handleSetApprovalClick(row.id)}
                              disabled={
                                !Object.values(
                                  checkboxStates[row.id] || {}
                                ).some((isChecked) => isChecked)
                              }
                            >
                              Set Approval
                            </button>
                          )}
                        {row.name === "Apps" &&
                          mergedCheckboxStates.apps === true && (
                            <button
                              onClick={() => handleSetApprovalClick(row.id)}
                              disabled={
                                !Object.values(
                                  checkboxStates[row.id] || {}
                                ).some((isChecked) => isChecked)
                              }
                            >
                              Set Approval
                            </button>
                          )}

                        {row.name === "My Schedule" &&
                          mergedCheckboxStates.mySchedule === true && (
                            <button
                              onClick={() => handleSetApprovalClick(row.id)}
                              disabled={
                                !Object.values(
                                  checkboxStates[row.id] || {}
                                ).some((isChecked) => isChecked)
                              }
                            >
                              Set Approval
                            </button>
                          )}
                        {row.name === "Reports" &&
                          mergedCheckboxStates.reports === true && (
                            <button
                              onClick={() => handleSetApprovalClick(row.id)}
                              disabled={
                                !Object.values(
                                  checkboxStates[row.id] || {}
                                ).some((isChecked) => isChecked)
                              }
                            >
                              Set Approval
                            </button>
                          )}
                        {row.name === "Settings" &&
                          mergedCheckboxStates.settings === true && (
                            <button
                              onClick={() => handleSetApprovalClick(row.id)}
                              disabled={
                                !Object.values(
                                  checkboxStates[row.id] || {}
                                ).some((isChecked) => isChecked)
                              }
                            >
                              Set Approval
                            </button>
                          )}
                      </td>
                      {selectedRows !== null && showPopup && (
                        <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                          <div className="relative w-auto ">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                              <div className="flex items-center justify-between p-5 border-b border-[#A7AFB7] border-slate-200 rounded-t">
                                <h3 className="text-xl font-medium">
                                  Approval
                                </h3>
                                <button
                                  className="p-1 text-xl"
                                  onClick={closePopup}
                                >
                                  Close
                                </button>
                              </div>
                              <div className="my-3 ml-4">
                                <table cellPadding={10}>
                                  <thead>
                                    <tr className="text-center">
                                      <th></th>
                                      <th>L1</th>
                                      {mergedDropdownStates.screen >= 2 && (
                                        <th>L2</th>
                                      )}
                                      {mergedDropdownStates.screen >= 3 && (
                                        <th>L3</th>
                                      )}
                                      {mergedDropdownStates.screen >= 4 && (
                                        <th>L4</th>
                                      )}
                                      {mergedDropdownStates.screen >= 5 && (
                                        <th>L5</th>
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>{selectedRows}</td>
                                      <td>
                                        <select className="border border-primary p-3">
                                          <option value="Pankaj(Owner)">
                                            Pankaj (Owner)
                                          </option>
                                          <option value="Shubhas(Manager)">
                                            Shubhas (Manager)
                                          </option>
                                          <option value="Maulik(Jr. Manager)">
                                            Maulik (Jr. Manager)
                                          </option>
                                          <option value="Hetal(Developer)">
                                            Hetal (Developer)
                                          </option>
                                        </select>
                                      </td>
                                      {mergedDropdownStates.screen >= 2 && (
                                        <td>
                                          <select className="border border-primary p-3">
                                            <option value="Pankaj(Owner)">
                                              Pankaj (Owner)
                                            </option>
                                            <option value="Shubhas(Manager)">
                                              Shubhas (Manager)
                                            </option>
                                            <option value="Maulik(Jr. Manager)">
                                              Maulik (Jr. Manager)
                                            </option>
                                            <option value="Hetal(Developer)">
                                              Hetal (Developer)
                                            </option>
                                          </select>
                                        </td>
                                      )}

                                      {mergedDropdownStates.screen >= 3 && (
                                        <td>
                                          <select className="border border-primary p-3">
                                            <option value="Pankaj(Owner)">
                                              Pankaj (Owner)
                                            </option>
                                            <option value="Shubhas(Manager)">
                                              Shubhas (Manager)
                                            </option>
                                            <option value="Maulik(Jr. Manager)">
                                              Maulik (Jr. Manager)
                                            </option>
                                            <option value="Hetal(Developer)">
                                              Hetal (Developer)
                                            </option>
                                          </select>
                                        </td>
                                      )}
                                      {mergedDropdownStates.screen >= 4 && (
                                        <td>
                                          <select className="border border-primary p-3">
                                            <option value="Pankaj(Owner)">
                                              Pankaj (Owner)
                                            </option>
                                            <option value="Shubhas(Manager)">
                                              Shubhas (Manager)
                                            </option>
                                            <option value="Maulik(Jr. Manager)">
                                              Maulik (Jr. Manager)
                                            </option>
                                            <option value="Hetal(Developer)">
                                              Hetal (Developer)
                                            </option>
                                          </select>
                                        </td>
                                      )}
                                      {mergedDropdownStates.screen >= 5 && (
                                        <td>
                                          <select className="border border-primary p-3">
                                            <option value="Pankaj(Owner)">
                                              Pankaj (Owner)
                                            </option>
                                            <option value="Shubhas(Manager)">
                                              Shubhas (Manager)
                                            </option>
                                            <option value="Maulik(Jr. Manager)">
                                              Maulik (Jr. Manager)
                                            </option>
                                            <option value="Hetal(Developer)">
                                              Hetal (Developer)
                                            </option>
                                          </select>
                                        </td>
                                      )}
                                    </tr>
                                  </tbody>
                                </table>
                                <div className="flex justify-end p-6">
                                  <button
                                    className="border border-primary px-4 py-2 rounded-full"
                                    onClick={closePopup}
                                  >
                                    save
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* <td>
                                                <input
                                                    type="checkbox"
                                                    id={`cbx${row.id}-4`}
                                                    className="hidden cbx"
                                                    checked={checkboxStates[`cbx${row.id}-4`] || false}
                                                    onChange={() => handleCheckboxChange(`cbx${row.id}-4`)}
                                                />
                                                <label htmlFor={`cbx${row.id}-4`} className="check cbx">
                                                    <svg width="18px" height="18px" viewBox="0 0 18 18">
                                                        <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                                                        <polyline points="1 9 7 14 15 4"></polyline>
                                                    </svg>
                                                </label>
                                            </td> */}

                      {/* <td>
                                                <input
                                                    type="checkbox"
                                                    id={`cbx${row.id}-5`}
                                                    className="hidden cbx"
                                                    checked={checkboxStates[`cbx${row.id}-5`] || false}
                                                    onChange={() => handleCheckboxChange(`cbx${row.id}-5`)}
                                                />
                                                <label htmlFor={`cbx${row.id}-5`} className="check cbx">
                                                    <svg width="18px" height="18px" viewBox="0 0 18 18">
                                                        <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                                                        <polyline points="1 9 7 14 15 4"></polyline>
                                                    </svg>
                                                </label>
                                            </td> */}
                    </tr>
                  ))}
                  {/*Billing */}
                  <tr className="border-b border-b-[#E4E6FF]">
                    <td
                      colSpan={5}
                      className="text-primary max-w-xl font-medium"
                    >
                      Billing
                    </td>
                  </tr>
                  {BillingData.map((row) => (
                    <tr key={row.id} className="border-b border-b-[#E4E6FF]">
                      <td className="text-[#5E5E5E] max-w-xl">{row.name}</td>
                      <td>
                        <input
                          type="checkbox"
                          id={`cbx${row.id}-1`}
                          className="hidden cbx"
                          checked={checkboxStates[`cbx${row.id}-1`] || false}
                          onChange={() =>
                            handleCheckboxChange(`cbx${row.id}-1`)
                          }
                        />
                        <label className="check cbx">
                          <svg width="18px" height="18px" viewBox="0 0 18 18">
                            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                            <polyline points="1 9 7 14 15 4"></polyline>
                          </svg>
                        </label>
                      </td>

                      <td>
                        <input
                          type="checkbox"
                          id={`cbx${row.id}-2`}
                          className="hidden cbx"
                          checked={checkboxStates[`cbx${row.id}-2`] || false}
                          onChange={() =>
                            handleCheckboxChange(`cbx${row.id}-2`)
                          }
                        />
                        <label className="check cbx">
                          <svg width="18px" height="18px" viewBox="0 0 18 18">
                            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                            <polyline points="1 9 7 14 15 4"></polyline>
                          </svg>
                        </label>
                      </td>

                      <td>
                        <input
                          type="checkbox"
                          id={`cbx${row.id}-3`}
                          className="hidden cbx"
                          checked={checkboxStates[`cbx${row.id}-3`] || false}
                          onChange={() =>
                            handleCheckboxChange(`cbx${row.id}-3`)
                          }
                        />
                        <label  className="check cbx">
                          <svg width="18px" height="18px" viewBox="0 0 18 18">
                            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                            <polyline points="1 9 7 14 15 4"></polyline>
                          </svg>
                        </label>
                      </td>

                      <td>
                        <input
                          type="checkbox"
                          id={`cbx${row.id}-4`}
                          className="hidden cbx"
                          checked={checkboxStates[`cbx${row.id}-4`] || false}
                          onChange={() =>
                            handleCheckboxChange(`cbx${row.id}-4`)
                          }
                        />
                        <label  className="check cbx">
                          <svg width="18px" height="18px" viewBox="0 0 18 18">
                            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                            <polyline points="1 9 7 14 15 4"></polyline>
                          </svg>
                        </label>
                      </td>

                      <td>
                        <input
                          type="checkbox"
                          id={`cbx${row.id}-5`}
                          className="hidden cbx"
                          checked={checkboxStates[`cbx${row.id}-5`] || false}
                          onChange={() =>
                            handleCheckboxChange(`cbx${row.id}-5`)
                          }
                        />
                        <label  className="check cbx">
                          <svg width="18px" height="18px" viewBox="0 0 18 18">
                            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                            <polyline points="1 9 7 14 15 4"></polyline>
                          </svg>
                        </label>
                      </td>
                    </tr>
                  ))}

                  {/*content */}
                  <tr className="border-b border-b-[#E4E6FF]">
                    <td
                      colSpan={5}
                      className="text-primary max-w-xl font-medium"
                    >
                      Content
                    </td>
                  </tr>

                  {contentData.map((row) => (
                    <tr key={row.id} className="border-b border-b-[#E4E6FF]">
                      <td className="text-[#5E5E5E] max-w-xl">{row.name}</td>
                      <td>
                        <input
                          type="checkbox"
                          id={`cbx${row.id}-1`}
                          className="hidden cbx"
                          checked={checkboxStates[`cbx${row.id}-1`] || false}
                          onChange={() =>
                            handleCheckboxChange(`cbx${row.id}-1`)
                          }
                        />
                        <label className="check cbx">
                          <svg width="18px" height="18px" viewBox="0 0 18 18">
                            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                            <polyline points="1 9 7 14 15 4"></polyline>
                          </svg>
                        </label>
                      </td>

                      <td>
                        <input
                          type="checkbox"
                          id={`cbx${row.id}-2`}
                          className="hidden cbx"
                          checked={checkboxStates[`cbx${row.id}-2`] || false}
                          onChange={() =>
                            handleCheckboxChange(`cbx${row.id}-2`)
                          }
                        />
                        <label className="check cbx">
                          <svg width="18px" height="18px" viewBox="0 0 18 18">
                            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                            <polyline points="1 9 7 14 15 4"></polyline>
                          </svg>
                        </label>
                      </td>

                      <td>
                        <input
                          type="checkbox"
                          id={`cbx${row.id}-3`}
                          className="hidden cbx"
                          checked={checkboxStates[`cbx${row.id}-3`] || false}
                          onChange={() =>
                            handleCheckboxChange(`cbx${row.id}-3`)
                          }
                        />
                        <label  className="check cbx">
                          <svg width="18px" height="18px" viewBox="0 0 18 18">
                            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                            <polyline points="1 9 7 14 15 4"></polyline>
                          </svg>
                        </label>
                      </td>

                      <td>
                        <input
                          type="checkbox"
                          id={`cbx${row.id}-4`}
                          className="hidden cbx"
                          checked={checkboxStates[`cbx${row.id}-4`] || false}
                          onChange={() =>
                            handleCheckboxChange(`cbx${row.id}-4`)
                          }
                        />
                        <label  className="check cbx">
                          <svg width="18px" height="18px" viewBox="0 0 18 18">
                            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                            <polyline points="1 9 7 14 15 4"></polyline>
                          </svg>
                        </label>
                      </td>

                      <td>
                        <input
                          type="checkbox"
                          id={`cbx${row.id}-5`}
                          className="hidden cbx"
                          checked={checkboxStates[`cbx${row.id}-5`] || false}
                          onChange={() =>
                            handleCheckboxChange(`cbx${row.id}-5`)
                          }
                        />
                        <label  className="check cbx">
                          <svg width="18px" height="18px" viewBox="0 0 18 18">
                            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                            <polyline points="1 9 7 14 15 4"></polyline>
                          </svg>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/*accordions1 close */}
        <div className="accordions  clear-both mt-3">
          <div className="section shadow-md py-3 px-5 rounded-md bg-lightgray flex  items-center justify-between">
            <h1 className="text-lg text-primary font-medium">Jr. Manager</h1>
            <div className=" flex items-center">
              <button className="showicon">
                {showdata ? (
                  <MdOutlineKeyboardArrowUp className="text-3xl" />
                ) : (
                  <MdOutlineKeyboardArrowDown className="text-3xl" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/*accordions 2 close */}

        <div className="accordions  clear-both mt-3">
          <div className="section shadow-md py-3 px-5 rounded-md bg-lightgray flex  items-center justify-between">
            <h1 className="text-lg text-primary font-medium">Viewer</h1>
            <div className=" flex items-center">
              <button className="showicon">
                {showdata ? (
                  <MdOutlineKeyboardArrowUp className="text-3xl" />
                ) : (
                  <MdOutlineKeyboardArrowDown className="text-3xl" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/*accordions 3 close */}
      </div>

      {showuserroleModal && (
        <>
          <div className="backdrop">
            <div className="user-model">
              <div className="hours-heading flex justify-between items-center p-5 border-b border-gray">
                <h1 className="text-lg font-medium text-primary">
                  Add New Role
                </h1>
                <AiOutlineCloseCircle
                  className="text-4xl text-primary cursor-pointer"
                  onClick={() => setshowuserroleModal(false)}
                />
              </div>
              <hr className="border-gray " />
              <div className="model-body lg:p-5 md:p-5 sm:p-2 xs:p-2 ">
                <div className=" lg:p-3 md:p-3 sm:p-2 xs:py-3 xs:px-1 text-left rounded-2xl">
                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter New Role Name"
                          name="name"
                          className="formInput w-full"
                        />
                      </div>
                    </div>

                    <div className="col-span-12 text-center">
                      <button
                        className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                        onClick={() => setshowuserroleModal(false)}
                      >
                        Cancel
                      </button>
                      <button className="bg-white text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Userrole;
