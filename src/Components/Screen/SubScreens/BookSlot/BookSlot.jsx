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
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              <Navbar />
            </div>
            <div className="pt-16 px-5 page-contain">
              <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                <h1>Find your screen</h1>
                <div className="grid grid-cols-3 gap-4 h-full">
                  <div className="col-span-2 rounded-lg bg-white p-5">
                    <div>TimeZone</div>
                    <div>Indian Standard Time (7-24pm)</div>
                    <div>India</div>
                    <input type="text" placeholder="Navrangpura, Ahmedabad, Gujarat, India" className="w-full"/>
                    <div>United States</div>
                    <input type="text" placeholder="Chicago, New Chicago, New York, USA" className="w-full"/>
                    <div className="grid grid-cols-3 gap-4">
                      <input type="text" placeholder="include" className="col-span-1"/>
                      <input type="text" placeholder="Search" className="col-span-2"/>
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-5">
                    <div>Reach</div>
                    <div>17 Screens</div>
                    <div>Do you want to book your slot for all screens or any particular screen?</div>
                    <div className="flex flex-col">
                    <input type="text" placeholder="All Screen"/>
                    <input type="text" placeholder="Select Screen"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </Suspense>
      )}
    </>
  );
};

export default BookSlot;
