import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import Papa from "papaparse";
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Uptimereport from './Uptimereport';
import Auditlogreport from './Auditlogreport';
import SalesReport from './SalesReport';
import CancelReport from './CancelReport';
import Mediareport from './Mediareport';
import PropTypes from "prop-types";
import { AUDITREPORT, BILLINGREPORT, CANCELREPORT, MEDIAREPORT, SALESREPORT, UPTIMEREPORT } from '../../Pages/Api';
import BillingReport from './BillingReport';
const FinalReport = ({ sidebarOpen, setSidebarOpen }) => {
    FinalReport.propTypes = {
        sidebarOpen: PropTypes.bool.isRequired,
        setSidebarOpen: PropTypes.func.isRequired,
    };
    const { token } = useSelector((state) => state.root.auth);
    const authToken = `Bearer ${token}`;
    const { report, daily, date } = useParams();
    const [allReportData, setAllReportData] = useState({
        allData: [],
        SearchData: []
    })
    const [loading, setLoading] = useState(false);

    function convertDateFormat(inputDate) {
        let [day, month, year] = inputDate.split("-");
        let formattedDate = new Date(`${year}-${month}-${day}T00:00:00.051Z`);
        return formattedDate.toISOString();
    }

    function generateDataObject(daily, date, report) {
        let data;
        const defaultDate = "2024-01-16T07:07:30.051Z";
    
        if (daily === "daily") {
            data = {
                "dataType": daily,
                "singleDate": convertDateFormat(date),
                "month": 0,
                "year": 0,
                "startDate": defaultDate,
                "endDate": defaultDate
            };
        } else if (daily === "monthly") {
            let separatedValues = date.split("&&");
            const Month = separatedValues[0];
            const Year = separatedValues[1];
            data = {
                "dataType": daily,
                "singleDate": defaultDate,
                "month": Month,
                "year": Year,
                "startDate": defaultDate,
                "endDate": defaultDate
            };
        } else {
            let separatedValues = date.split("&&");
            const start = separatedValues[0];
            const end = separatedValues[1];
            data = {
                "dataType": daily,
                "singleDate": defaultDate,
                "month": 0,
                "year": 0,
                "startDate": convertDateFormat(start),
                "endDate": convertDateFormat(end)
            };
        }
    
        return { report, data };
    }

    const reportURLs = {
        "uptimereport": UPTIMEREPORT,
        "auditlogreport": AUDITREPORT,
        "salesreport": SALESREPORT,
        "cancelreport": CANCELREPORT,
        "mediareport": MEDIAREPORT,
        "default": BILLINGREPORT
    };

    const fetchData = () => {
        setLoading(true)
        let { data } = generateDataObject(daily, date, report);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: reportURLs[report] || reportURLs["default"],
            headers: {
                'Content-Type': 'application/json',
                Authorization: authToken,
            },
            data: JSON.stringify(data)
        };
        axios.request(config)
            .then((response) => {
                setAllReportData({
                    allData: response?.data?.data,
                    SearchData: response?.data?.data
                })
                setLoading(false)
            })
            .catch((error) => {
                console.log(error);
                setLoading(false)
            });
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleChange = (e) => {
        const searchQuery = e.target.value.toLowerCase();
        if (searchQuery === "") {
            setAllReportData({ ...allReportData, SearchData: allReportData?.allData })
        } else {
            if (report === "uptimereport") {
                const filterData = allReportData?.allData?.filter((item) => item?.screenName?.toLowerCase().includes(searchQuery))
                setAllReportData({ ...allReportData, SearchData: filterData })
            } else if (report === "auditlogreport") {
                const filterData = allReportData?.allData?.filter((item) => item?.performedBy?.toLowerCase().includes(searchQuery))
                setAllReportData({ ...allReportData, SearchData: filterData })
            } else if (report === "salesreport") {
                const filterData = allReportData?.allData?.filter((item) => item?.customer?.toLowerCase().includes(searchQuery))
                setAllReportData({ ...allReportData, SearchData: filterData })
            } else if (report === "cancelreport") {
                const filterData = allReportData?.allData?.filter((item) => item?.customer?.toLowerCase().includes(searchQuery))
                setAllReportData({ ...allReportData, SearchData: filterData })
            } else if(report === "mediareport") {
                const filterData = allReportData?.allData?.filter((item) => item?.screenName?.toLowerCase().includes(searchQuery))
                setAllReportData({ ...allReportData, SearchData: filterData })
            }else{
                const filterData = allReportData?.allData?.filter((item) => item?.customer?.toLowerCase().includes(searchQuery))
                setAllReportData({ ...allReportData, SearchData: filterData })
            }
        }
    }

    const debouncedOnChange = debounce(handleChange, 500);

    const exportDataToCSV = () => {
        const csv = Papa.unparse(allReportData?.allData);
        const csvBlob = new Blob([csv], { type: "text/csv" });
        const csvUrl = URL.createObjectURL(csvBlob);
        const link = document.createElement("a");
        link.href = csvUrl;
        link.download = `${report}.csv`;
        link.click();
        URL.revokeObjectURL(csvUrl);
    };
    return (
        <>
            <div className="flex border-b border-gray">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>
            <div className='pt-6'>
                {report === "uptimereport" && (
                    <Uptimereport allReportData={allReportData} debouncedOnChange={debouncedOnChange} exportDataToCSV={exportDataToCSV} loading={loading} sidebarOpen={sidebarOpen}/>
                )}
                {report === "auditlogreport" && (
                    <Auditlogreport allReportData={allReportData} debouncedOnChange={debouncedOnChange} exportDataToCSV={exportDataToCSV} loading={loading} sidebarOpen={sidebarOpen}/>
                )}
                {report === "salesreport" && (
                    <SalesReport allReportData={allReportData} debouncedOnChange={debouncedOnChange} exportDataToCSV={exportDataToCSV} loading={loading} sidebarOpen={sidebarOpen}/>
                )}
                {report === "cancelreport" && (
                    <CancelReport allReportData={allReportData} debouncedOnChange={debouncedOnChange} exportDataToCSV={exportDataToCSV} loading={loading} sidebarOpen={sidebarOpen}/>
                )}
                {report === "mediareport" && (
                    <Mediareport allReportData={allReportData} debouncedOnChange={debouncedOnChange} exportDataToCSV={exportDataToCSV} loading={loading} sidebarOpen={sidebarOpen}/>
                )}
                {report === "billingreport" && (
                    <BillingReport allReportData={allReportData} debouncedOnChange={debouncedOnChange} exportDataToCSV={exportDataToCSV} loading={loading} sidebarOpen={sidebarOpen}/>
                )}
            </div>

            <Footer />
        </>
    )
}

export default FinalReport
