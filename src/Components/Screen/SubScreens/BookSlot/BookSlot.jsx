import React, { Suspense, useState } from "react";
import Loading from "../../../Loading";
import PropTypes from "prop-types";
import Sidebar from "../../../Sidebar";
import { Navbar } from "@material-tailwind/react";

const BookSlot = ({ sidebarOpen, setSidebarOpen }) => {
  BookSlot.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const [sidebarload, setSidebarLoad] = useState(false);
  return (
    <>
      {sidebarload && <Loading />}

      {!sidebarload && (
        <Suspense fallback={<Loading />}>
          <>
          <div className="flex border-b border-gray">
              <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              <Navbar />
            </div>
            <div className="pt-16 px-5 page-contain">
              <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}></div>
              </div>
          </>
        </Suspense>
      )}
    </>
  );
};

export default BookSlot;
