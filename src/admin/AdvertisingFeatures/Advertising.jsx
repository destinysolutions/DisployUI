import React, { useState } from 'react'
import AdminSidebar from '../AdminSidebar'
import AdminNavbar from '../AdminNavbar'
import Footer from '../../Components/Footer'
import { IoBusiness, IoBusinessOutline, IoLocation } from 'react-icons/io5';
import { FaHandHoldingDollar } from 'react-icons/fa6';
import { TbTopologyStar3 } from 'react-icons/tb';
import approvalIcon from "../../images/MenuIcons/approval_icon.svg";
import { RiAdvertisementFill } from 'react-icons/ri';
import CostByArea from './CostByArea';
import Advertiser from './Advertiser';
import CommissionRate from './CommissionRate';
import AdScreens from './AdScreens';
import Approve from './Approve';
import IndustryInformation from './IndustryInformation';
import { GiRadarSweep } from "react-icons/gi";
import PurposeScreens from './PurposeScreens';

export default function Advertising({ sidebarOpen, setSidebarOpen }) {
    const [STabs, setSTabs] = useState(1);

    const handleTab = (tab) => {
        setSTabs(tab)
    }


    return (
        <div>
            <div className="flex border-b border-gray">
                <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <AdminNavbar />
            </div>
            <div className="pt-6 px-5 page-contain">
                <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                    <div className="lg:flex justify-between sm:flex xs:block  items-center mb-5 ">
                        <div className=" lg:mb-0 md:mb-0 sm:mb-4">
                            <h1 className="not-italic font-medium lg:text-2xl  md:text-2xl sm:text-xl xs:text-xs text-[#001737]  ">
                                Features of advertising
                            </h1>
                        </div>
                    </div>

                    <div className="grid w-full lg:grid-cols-4 md:grid-cols-1 sm:grid-cols-1  m-5">
                        {/*Tab*/}
                        <div className="mainsettingtab col-span-1 w-full p-0">
                            <ul className="w-full">
                                <li className=''>
                                    <button
                                        className={STabs === 1 ? "stabshow settingtabactive" : "settingtab"}
                                        onClick={() => handleTab(1)}
                                    >
                                        <IoLocation className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />
                                        <span className="text-base text-primary">Cost by Area</span>
                                    </button>
                                </li>

                                <li>
                                    <button
                                        className={
                                            STabs === 2 ? "stabshow settingtabactive" : "settingtab"
                                        }
                                        onClick={() => handleTab(2)}
                                    >
                                        <FaHandHoldingDollar className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />
                                        <span className="text-base text-primary">Commission Rate</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={
                                            STabs === 3 ? "stabshow settingtabactive" : "settingtab"
                                        }
                                        onClick={() => handleTab(3)}
                                    >
                                        <RiAdvertisementFill className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />
                                        <span className="text-base text-primary">Ad Screens</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={
                                            STabs === 4 ? "stabshow settingtabactive" : "settingtab"
                                        }
                                        onClick={() => handleTab(4)}
                                    >
                                        <TbTopologyStar3 className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />
                                        <span className="text-base text-primary">Advertiser</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={
                                            STabs === 5 ? "stabshow settingtabactive" : "settingtab"
                                        }
                                        onClick={() => handleTab(5)}
                                    >
                                        <div className='bg-primary text-white text-3xl rounded-md p-1 mr-2'>
                                            <img src={approvalIcon} alt="Approval" className="text-white" style={{ filter: 'brightness(0) invert(1)' }} />
                                        </div>
                                        {/* <HiClipboardDocumentList className="bg-primary text-white text-3xl rounded-md p-1 mr-2" /> */}
                                        <span className="text-base text-primary">Approve</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={
                                            STabs === 6 ? "stabshow settingtabactive" : "settingtab"
                                        }
                                        onClick={() => handleTab(6)}
                                    >
                                        <IoBusinessOutline className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />

                                        <span className="text-base text-primary">Industry information</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={
                                            STabs === 7 ? "stabshow settingtabactive" : "settingtab"
                                        }
                                        onClick={() => handleTab(7)}
                                    >
                                        <GiRadarSweep className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />
                                        <span className="text-base text-primary">Purpose of <br />Disploy screens</span>
                                    </button>
                                </li>


                            </ul>
                        </div>

                        {/*Tab details*/}
                        <div className="col-span-3 w-full bg-white  tabdetails rounded-md relative">
                            {STabs === 1 && (
                                <div><CostByArea sidebarOpen={sidebarOpen} /></div>
                            )}
                            {STabs === 2 && (
                                <div><CommissionRate /></div>
                            )}
                            {STabs === 3 && (
                                <div><AdScreens /></div>
                            )}
                            {STabs === 4 && (
                                <div><Advertiser sidebarOpen={sidebarOpen} /></div>
                            )}
                            {STabs === 5 && (
                                <div><Approve sidebarOpen={sidebarOpen} handleTab={handleTab} /></div>
                            )}
                            {STabs === 6 && (
                                <div><IndustryInformation sidebarOpen={sidebarOpen} /></div>
                            )}
                            {STabs === 7 && (
                                <div><PurposeScreens sidebarOpen={sidebarOpen} /></div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
