import React from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const Privateroute = ({ element: Element, ...rest }) => {
  const isAuthenticated = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user !== null;
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const handleResize = useCallback(() => {
    if (window.innerWidth < 780) {
      setSidebarOpen(false);
    } else if (!sidebarOpen) {
      setSidebarOpen(true);
    }
  }, [sidebarOpen]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize, sidebarOpen]);

  useEffect(() => {
    handleResize();
    window.addEventListener("load", handleResize);

    return () => {
      window.removeEventListener("load", handleResize);
    };
  }, [handleResize]);

  return (
    <Routes>
    <Route
      {...rest}
      element={
        isAuthenticated() ? (
          <Element sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        ) : (
          <Navigate to="/" />
        )
      }
    /></Routes>
  );
};

export default Privateroute;
