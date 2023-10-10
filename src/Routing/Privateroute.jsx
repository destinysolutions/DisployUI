import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const Privateroute = () => {

    const token = localStorage.getItem('token')

    console.log(token);

    return (
        <>
            {
                token ? <Outlet /> : <Navigate to='/' />
            }
        </>
    )
}

export default Privateroute

