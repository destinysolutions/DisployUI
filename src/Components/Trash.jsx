import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import PropTypes from "prop-types";

import { GET_ALL_TRASHDATA } from "../Pages/Api";

const Trash = ({ sidebarOpen, setSidebarOpen }) => {
  Trash.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const [deletedData, setDeletedData] = useState([]);

  useEffect(() => {
    axios
      .get(GET_ALL_TRASHDATA)
      .then((response) => {
        setDeletedData(response.data.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching deleted data:", error);
      });
  }, []);

  return (
    <div>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      {
        <div className="pt-16 px-5 page-contain">
          <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
            <div className="lg:flex lg:justify-between sm:block items-center">
              <h1 className="not-italic font-medium text-2xl sm:text-xl text-[#001737] sm:mb-4 ml-">
                Trash
              </h1>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-xl overflow-y-auto relative">
              <table className="w-full" cellPadding={15}>
                <thead>
                  <tr className="text-left">
                    <th className=" sticky top-0 border-b border-lightgray th-bg-100 text-md font-semibold">
                      Name
                    </th>
                    <th className=" sticky top-0 border-b border-lightgray th-bg-100 text-md font-semibold">
                      File location
                    </th>
                    <th className=" sticky top-0 border-b border-lightgray th-bg-100 text-md font-semibold">
                      Date deleted
                    </th>
                    <th className=" sticky top-0 border-b border-lightgray th-bg-100 text-md font-semibold">
                      Size
                    </th>
                    <th className=" sticky top-0 border-b border-lightgray th-bg-100 text-md font-semibold">
                      Item type
                    </th>
                    <th className=" sticky top-0 border-b border-lightgray th-bg-100 text-md font-semibold">
                      Date modified
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deletedData.map((item) => (
                    <tr key={item.trashId}>
                      <td className=" border-b border-lightgray text-sm ">
                        {item.fileName}
                      </td>
                      <td className=" border-b border-lightgray text-sm w-44 break-all">
                        {item.fileLocation}
                      </td>
                      <td className=" border-b border-lightgray text-sm ">
                        {item.dateDeleted}
                      </td>
                      <td className=" border-b border-lightgray text-sm ">
                        {item.fileSize}
                      </td>
                      <td className=" border-b border-lightgray text-sm ">
                        {item.fileType}
                      </td>
                      <td className=" border-b border-lightgray text-sm ">
                        {item.dateModified}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default Trash;
