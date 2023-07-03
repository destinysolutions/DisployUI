import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar"
import Navbar from "../Navbar";
import { TiFolderOpen } from 'react-icons/ti'
import { AiOutlineCloudUpload, AiOutlineUnorderedList } from 'react-icons/ai'
import { RxDashboard } from 'react-icons/rx'
import AssetsAPI from './Assestsapi'
import { BsThreeDots } from 'react-icons/bs'
import '../../Styles/assest.css'
import { FiUpload } from 'react-icons/fi'
import { MdPlaylistPlay } from 'react-icons/md'
import { FiDownload } from 'react-icons/fi'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { CgMoveRight } from 'react-icons/cg'
const Assets = ({ sidebarOpen, setSidebarOpen }) => {
    const [tabitems, setTabitems] = useState(AssetsAPI)
    const [activetab, setActivetab] = useState(1)
    const filterItems = (catgitem) => {
        const updatedItem = AssetsAPI.filter((curEle) => {
            return curEle.category == catgitem;
        })
        setTabitems(updatedItem);

    }

    const handleActiveBtnClick = (btnNumber) => {
        setActivetab(btnNumber)
    }
    const [assetsdw, setassetsdw] = useState(false)
    const [asstab, setTogglebtn] = useState(1);
    function updatetoggle(id) {
        setTogglebtn(id);

    }
    return (
        <>
            <div className="flex border-b border-gray py-3">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>
            {<div className="pt-6 px-5">
                <div className={`${sidebarOpen ? "ml-[13rem]" : "ml-16"}`}>
                    <div className="lg:flex lg:justify-between sm:block items-center">
                        <h1 className="not-italic font-medium text-2xl sm:text-xl text-[#001737] sm:mb-4 ml-">
                            Assets
                        </h1>
                        <div className="lg:flex md:flex sm:block lg:mt-0 md:mt-0 sm:mt-3">
                            <button className=" dashboard-btn  flex align-middle border-primary items-center border rounded-full lg:px-6 sm:px-5  py-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                                <TiFolderOpen className="text-2xl rounded-full mr-1 bg-primary text-white p-1" />
                                New Folder
                            </button>
                            <button className=" dashboard-btn flex align-middle items-center text-primary rounded-full  text-base border border-primary lg:px-9 sm:px-5  mr-3  py-2 sm:text-sm hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                                <AiOutlineCloudUpload className="text-2xl rounded-full mr-1 bg-primary text-white p-1" />
                                Upload
                            </button>

                            <ul className="flex items-center  mr-3  rounded-full  border border-primary">
                                <li className="flex items-center "><button className={asstab === 1 ? 'tabshow tabassactive px-5' : 'asstab px-5'} onClick={() => updatetoggle(1)}><RxDashboard className="text-primary text-lg" /></button></li>
                                <li className="flex items-center "><button className={asstab === 2 ? 'tabshow tabassactive pr-5' : 'asstab pr-5'} onClick={() => updatetoggle(2)}><AiOutlineUnorderedList /></button></li>

                            </ul>
                            <button>
                                <input type="checkbox" className=" mx-1 w-6 h-5 mt-2" />
                            </button>
                        </div>
                    </div>

                    <div className="tabs mt-5">

                        <button className={activetab === 1 ? 'tabactivebtn ' : 'tabbtn'} onClick={() => { setTabitems(AssetsAPI); handleActiveBtnClick(1) }}>All</button>
                        <button className={activetab === 2 ? 'tabactivebtn ' : 'tabbtn'} onClick={() => { filterItems('image'); handleActiveBtnClick(2) }}>Images</button>
                        <button className={activetab === 3 ? 'tabactivebtn ' : 'tabbtn'} onClick={() => { filterItems('video'); handleActiveBtnClick(3) }}>Video</button>
                        <button className={activetab === 4 ? 'tabactivebtn ' : 'tabbtn'} onClick={() => { filterItems('doc'); handleActiveBtnClick(4) }}>Doc</button>
                        <button className={activetab === 5 ? 'tabactivebtn ' : 'tabbtn'} onClick={() => { filterItems('apps'); handleActiveBtnClick(5) }}>Apps</button>
                    </div>

                    <div className={asstab === 1 ? 'show-togglecontent active w-full tab-details mt-10' : 'togglecontent'}>
                        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-12 gap-4">

                            {
                                tabitems.map((elem) => {
                                    const { id, Image, icon, title, subtitle } = elem;
                                    return (
                                        <>

                                            <div className="relative">
                                                <div className="imagebox relative">
                                                    <img src={Image} className="w-full rounded-2xl" />
                                                    <div className="checkbox flex justify-between absolute top-5 px-4 w-full">
                                                        <input type="checkbox" className="w-[20px] h-[20px]" />
                                                        <button onClick={() => setassetsdw((prev) => !prev)}><BsThreeDots className="text-2xl" /></button>
                                                        {
                                                            assetsdw &&

                                                            <div className="assetsdw">
                                                                <ul>
                                                                    <li className="flex text-sm items-center"><FiUpload className="mr-2 text-lg" />Set to Screen</li>
                                                                    <li className="flex text-sm items-center" ><MdPlaylistPlay className="mr-2 text-lg" />Add to Playlist</li>
                                                                    <li className="flex text-sm items-center" ><FiDownload className="mr-2 text-lg" />Download</li>
                                                                    <li className="flex text-sm items-center" ><CgMoveRight className="mr-2 text-lg" />Move to</li>
                                                                    <li className="flex text-sm items-center" ><RiDeleteBin5Line className="mr-2 text-lg" />Move to Trast</li>
                                                                </ul>
                                                            </div>

                                                        }

                                                    </div>
                                                </div>
                                                <div className="tabicon text-center absolute left-2/4">
                                                    <p>{icon}</p>

                                                </div>
                                                <div className="title text-center relative mt-10">
                                                    <h2>{title}</h2>
                                                    <h2>{subtitle}</h2>
                                                </div>
                                            </div>

                                        </>
                                    )

                                })
                            }
                        </div>
                    </div>


                </div>
            </div>
            }
        </>
    )
}

export default Assets
