import React, { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import PropTypes from "prop-types";
import { AiOutlineFile, AiOutlineFolder } from "react-icons/ai";
import { BiImageAlt } from "react-icons/bi";

const Trash = ({ sidebarOpen, setSidebarOpen }) => {
  Trash.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const [deletedData, setDeletedData] = useState([]);

  useEffect(() => {
    axios
      .get("https://disployapi.thedestinysolutions.com/api/Trash/GetAllTrash")
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
        <div className="pt-6 px-5 page-contain">
          <div className={`${sidebarOpen ? "ml-52" : "ml-0"}`}>
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
                      Datee modified
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deletedData.map((item) => (
                    <tr key={item.id}>
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