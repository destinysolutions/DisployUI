
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorFallback from '../Components/ErrorFallback';
import Dashboard from '../Advertisment/Dashboard';
import AdvertisementReports from '../Advertisment/AdvertisementReports';
import AdvertismentInvoice from '../Advertisment/AdvertismentInvoice';

const AdvertismentRoute = ({ sidebarOpen, setSidebarOpen }) => {
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
                            <Dashboard
                                sidebarOpen={sidebarOpen}
                                setSidebarOpen={setSidebarOpen}
                            />
                        }
                    />

                    <Route
                        path="/report"
                        element={
                            <AdvertisementReports
                                sidebarOpen={sidebarOpen}
                                setSidebarOpen={setSidebarOpen}
                            />
                        }
                    />
                    <Route
                        path="/invoice"
                        element={
                            <AdvertismentInvoice
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

export default AdvertismentRoute
