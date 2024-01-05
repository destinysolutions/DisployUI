import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ApprovalReq = () => {
  const [titleData, setTitleData] = useState([]);

  const RadioButton = ["One", "Two", "Three", "Four", "Five"];
  const { token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const initialCheckboxStates = {
    screen: false,
    mySchedule: false,
    apps: false,
    settings: false,
    reports: false,
  };

  const initialDropdownStates = {
    screen: "1",
    mySchedule: "1",
    apps: "1",
    settings: "1",
    reports: "1",
  };

  const [checkboxState, setCheckboxStates] = useState(initialCheckboxStates);
  const [dropdownStates, setDropdownStates] = useState(initialDropdownStates);

  useEffect(() => {
    // Store checkboxStates and dropdownStates in local storage whenever they change
    localStorage.setItem(
      "approvalReqCheckboxes",
      JSON.stringify(checkboxState)
    );
    localStorage.setItem(
      "approvalReqDropdowns",
      JSON.stringify(dropdownStates)
    );
  }, [checkboxState, dropdownStates]);

  const handleCheckboxChange = (rowId) => {
    setCheckboxStates((prevState) => ({
      ...prevState,
      [rowId]: !prevState[rowId],
    }));
  };

  const handleDropdownChange = (rowId, value) => {
    setDropdownStates((prevState) => ({
      ...prevState,
      [rowId]: value,
    }));
  };
  useEffect(() => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://disployapi.thedestinysolutions.com/api/OrganizationUsersRole/ListOfModule",
      headers: {
        Authorization: authToken,
      },
    };
    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setTitleData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    // <div className="p-16">
    //   <table cellPadding={10}>
    //     <thead>
    //       <th></th>
    //       <th></th>
    //       <th>approve</th>
    //       <th>Level of approval</th>
    //     </thead>
    //     <tbody className="text-center">
    //       <tr>
    //         <td>Screen</td>
    //         <td></td>
    //         <td>
    //           <input
    //             type="checkbox"
    //             checked={checkboxState["screen"]}
    //             onChange={() => handleCheckboxChange("screen")}
    //           />
    //         </td>
    //         <td>
    //           {/* <select
    //             className="border border-primary"
    //             value={dropdownStates["screen"]}
    //             onChange={(e) => handleDropdownChange("screen", e.target.value)}
    //           >
    //             <option value="1">1</option>
    //             <option value="2">2</option>
    //             <option value="3">3</option>
    //             <option value="4">4</option>
    //             <option value="5">5</option>
    //           </select> */}
    //           <input type="radio" />
    //           <label className="mx-2">1</label>
    //           <input type="radio" />
    //           <label className="mx-2">2</label>
    //           <input type="radio" />
    //           <label className="mx-2">3</label>
    //           <input type="radio" />
    //           <label className="mx-2">4</label>
    //         </td>
    //       </tr>
    //       <tr>
    //         <td>My Schedule</td>
    //         <td></td>
    //         <td>
    //           <input
    //             type="checkbox"
    //             checked={checkboxState["mySchedule"]}
    //             onChange={() => handleCheckboxChange("mySchedule")}
    //           />
    //         </td>
    //         <td>
    //           <select
    //             className="border border-primary"
    //             value={dropdownStates["mySchedule"]}
    //             onChange={(e) =>
    //               handleDropdownChange("mySchedule", e.target.value)
    //             }
    //           >
    //             <option value="1">1</option>
    //             <option value="2">2</option>
    //             <option value="3">3</option>
    //             <option value="4">4</option>
    //             <option value="5">5</option>
    //           </select>
    //         </td>
    //       </tr>
    //       <tr>
    //         <td>Apps</td>
    //         <td></td>
    //         <td>
    //           <input
    //             type="checkbox"
    //             checked={checkboxState["apps"]}
    //             onChange={() => handleCheckboxChange("apps")}
    //           />
    //         </td>
    //         <td>
    //           <select
    //             className="border border-primary"
    //             value={dropdownStates["apps"]}
    //             onChange={(e) => handleDropdownChange("apps", e.target.value)}
    //           >
    //             <option value="1">1</option>
    //             <option value="2">2</option>
    //             <option value="3">3</option>
    //             <option value="4">4</option>
    //             <option value="5">5</option>
    //           </select>
    //         </td>
    //       </tr>
    //       <tr>
    //         <td>Settings</td>
    //         <td></td>
    //         <td>
    //           <input
    //             type="checkbox"
    //             checked={checkboxState["settings"]}
    //             onChange={() => handleCheckboxChange("settings")}
    //           />
    //         </td>
    //         <td>
    //           <select
    //             className="border border-primary"
    //             value={dropdownStates["settings"]}
    //             onChange={(e) =>
    //               handleDropdownChange("settings", e.target.value)
    //             }
    //           >
    //             <option value="1">1</option>
    //             <option value="2">2</option>
    //             <option value="3">3</option>
    //             <option value="4">4</option>
    //             <option value="5">5</option>
    //           </select>
    //         </td>
    //       </tr>
    //       <tr>
    //         <td>Reports</td>
    //         <td></td>
    //         <td>
    //           <input
    //             type="checkbox"
    //             checked={checkboxState["reports"]}
    //             onChange={() => handleCheckboxChange("reports")}
    //           />
    //         </td>
    //         <td>
    //           <select
    //             className="border border-primary"
    //             value={dropdownStates["reports"]}
    //             onChange={(e) =>
    //               handleDropdownChange("reports", e.target.value)
    //             }
    //           >
    //             <option value="1">1</option>
    //             <option value="2">2</option>
    //             <option value="3">3</option>
    //             <option value="4">4</option>
    //             <option value="5">5</option>
    //           </select>
    //         </td>
    //       </tr>
    //     </tbody>
    //   </table>
    //   <div className="py-4 px-44">
    //     <Link to="/userrole">
    //       <button className="border border-primary px-4 py-2 rounded-full">
    //         save
    //       </button>
    //     </Link>
    //   </div>
    // </div>
    <div className="p-0">
      <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2">
        <h1 className="font-medium lg:text-2xl md:text-2xl sm:text-xl mb-0">
          Approval Required
        </h1>
      </div>
      <div className="lg:px-5 md:px-5 sm:px-2 xs:px-2">
        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden overflow-x-auto w-full">
          <table className="min-w-full leading-normal" cellPadding={20}>
            <thead className="text-center">
              <tr className="border-b border-b-[#E4E6FF] bg-[#EFF3FF]">
                <th className="text-[#5A5881] text-base font-semibold">
                  Title
                </th>
                <th className="text-[#5A5881] text-base font-semibold">
                  Approve
                </th>
                <th className="text-[#5A5881] text-base font-semibold">
                  Level of Approval
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {titleData.map((title, index) => {
                return (
                  title.isForApproval === true && (
                    <tr className="border-b border-b-[#E4E6FF]">
                      <td>{title.pageName}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={checkboxState[title.pageName]}
                          onChange={() => handleCheckboxChange(title.pageName)}
                        />
                      </td>
                      <td className="flex justify-center">
                        {RadioButton.map((radio, radioIndex) => (
                          <React.Fragment key={radioIndex}>
                            <input
                              id={`radio${index}-${radioIndex}`}
                              type="radio"
                              name={`radio${index}`}
                              className="ml-3"
                              // checked={/* Your condition for checking the radio button */}
                              // onChange={() =>
                              //   handleRadioChange(radioIndex, title.moduleID)
                              // }
                            />
                            <label
                              htmlFor={`radio${index}-${radioIndex}`}
                              className="flex items-center cursor-pointer ml-2"
                            >
                              {radio}
                            </label>
                          </React.Fragment>
                        ))}
                      </td>
                    </tr>
                  )
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:px-5 md:px-5 sm:px-2 xs:px-2 full flex justify-end mb-5">
        <Link to="/settingapproval">
          <button className="hover:bg-white hover:text-primary text-base px-6 py-2 border border-primary  shadow-md rounded-full bg-primary text-white ">
            save
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ApprovalReq;
