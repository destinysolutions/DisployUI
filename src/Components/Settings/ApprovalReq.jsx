import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const ApprovalReq = () => {
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

  // useEffect(() => {
  //   // Retrieve values from local storage
  //   const storedCheckboxStates = JSON.parse(
  //     localStorage.getItem("approvalReqCheckboxes")
  //   );
  //   if (storedCheckboxStates) {
  //     setCheckboxStates(storedCheckboxStates);
  //   }

  //   const storedDropdownStates = JSON.parse(
  //     localStorage.getItem("approvalReqDropdowns")
  //   );
  //   if (storedDropdownStates) {
  //     setDropdownStates(storedDropdownStates);
  //   }
  // }, []);

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
  return (
    <div className="p-16">
      <table cellPadding={10}>
        <thead>
          <th></th>
          <th></th>
          <th>approve</th>
          <th>Level of approval</th>
        </thead>
        <tbody className="text-center">
          <tr>
            <td>Screen</td>
            <td></td>
            <td>
              <input
                type="checkbox"
                checked={checkboxState["screen"]}
                onChange={() => handleCheckboxChange("screen")}
              />
            </td>
            <td>
              {/* <select
                className="border border-primary"
                value={dropdownStates["screen"]}
                onChange={(e) => handleDropdownChange("screen", e.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select> */}
              <input type="radio" />
              <label className="mx-2">1</label>
              <input type="radio" />
              <label className="mx-2">2</label>
              <input type="radio" />
              <label className="mx-2">3</label>
              <input type="radio" />
              <label className="mx-2">4</label>
            </td>
          </tr>
          <tr>
            <td>My Schedule</td>
            <td></td>
            <td>
              <input
                type="checkbox"
                checked={checkboxState["mySchedule"]}
                onChange={() => handleCheckboxChange("mySchedule")}
              />
            </td>
            <td>
              <select
                className="border border-primary"
                value={dropdownStates["mySchedule"]}
                onChange={(e) =>
                  handleDropdownChange("mySchedule", e.target.value)
                }
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Apps</td>
            <td></td>
            <td>
              <input
                type="checkbox"
                checked={checkboxState["apps"]}
                onChange={() => handleCheckboxChange("apps")}
              />
            </td>
            <td>
              <select
                className="border border-primary"
                value={dropdownStates["apps"]}
                onChange={(e) => handleDropdownChange("apps", e.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Settings</td>
            <td></td>
            <td>
              <input
                type="checkbox"
                checked={checkboxState["settings"]}
                onChange={() => handleCheckboxChange("settings")}
              />
            </td>
            <td>
              <select
                className="border border-primary"
                value={dropdownStates["settings"]}
                onChange={(e) =>
                  handleDropdownChange("settings", e.target.value)
                }
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Reports</td>
            <td></td>
            <td>
              <input
                type="checkbox"
                checked={checkboxState["reports"]}
                onChange={() => handleCheckboxChange("reports")}
              />
            </td>
            <td>
              <select
                className="border border-primary"
                value={dropdownStates["reports"]}
                onChange={(e) =>
                  handleDropdownChange("reports", e.target.value)
                }
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="py-4 px-44">
        <Link to="/userrole">
          <button className="border border-primary px-4 py-2 rounded-full">
            save
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ApprovalReq;
