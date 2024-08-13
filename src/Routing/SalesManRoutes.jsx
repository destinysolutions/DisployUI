import React from 'react'
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SalesManDashboard from "../SalesMan/Dashboard"
import ErrorFallback from '../Components/ErrorFallback';
import SalesUserProfile from '../SalesMan/SalesUserProfile';
const SalesManRoutes = ({ sidebarOpen, setSidebarOpen }) => {
    return (
        <BrowserRouter>
            <ErrorBoundary
                fallback={ErrorFallback}
                onReset={() => {
                    window.location.reload();
                }}
            >
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                    <Route path="/register" element={<Navigate to="/dashboard" />} />
                    <Route
                        path="/dashboard"
                        element={
                            <SalesManDashboard
                                sidebarOpen={sidebarOpen}
                                setSidebarOpen={setSidebarOpen}
                            />
                        }
                    />

                    <Route
                        path="/userprofile"
                        element={
                            <SalesUserProfile
                                sidebarOpen={sidebarOpen}
                                setSidebarOpen={setSidebarOpen}
                            />
                        }
                    />
                </Routes>
            </ErrorBoundary>
        </BrowserRouter>
    )
}

export default SalesManRoutes
