import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarOverlap, setsidebarOverlap] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 780) {
        setsidebarOverlap(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div className="flex border-b border-gray py-3">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarOverlap={sidebarOverlap}
        />
        <Navbar />
      </div>
      {/* <div className="pt-6 px-5">
        <div
          className={`${
            sidebarOpen ? (sidebarOverlap ? "ml-60" : "") : "ml-2"
          }`}
        ></div>
      </div> */}
    </>
  );
};

export default Header;
