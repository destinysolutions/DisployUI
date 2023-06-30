import React, { useState, useEffect } from "react";
import Sidebar from "../../Sidebar"
import Navbar from "../../Navbar";
import '../../../Styles/screen.css'
import { IoMdRefresh } from 'react-icons/io'
import { MdArrowBackIosNew } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { HiOutlineChevronDown } from 'react-icons/hi2'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { MdElectricBolt } from 'react-icons/md'
import { Link } from "react-router-dom";
const Screensplayer = ({ sidebarOpen, setSidebarOpen }) => {
    const [toggle, setToggle] = useState(1);
    function updatetoggle(id) {
        setToggle(id);

    }
    const [sync, setsyncToggle] = useState(1);
    function updatesynctoggle(id) {
        setsyncToggle(id);

    }
    const [mediadw, setMediadw] = useState(false)
    return (
        <>
            <div className="flex border-b border-gray py-3">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>
            {<div className="pt-6 px-5">
                <div className={`${sidebarOpen ? "ml-[13rem]" : "ml-16"}`}>
                    <div className="justify-between flex items-center xs-block">
                        <div className="section-title">
                            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl sm:mb-4  text-[#001737]">Screen Player</h1>
                        </div>
                        <div className="icons flex  items-center">
                            <div>
                                <Link to={'../screens'}>
                                    <button className="border rounded-full mr-2 hover:shadow-xl hover:bg-SlateBlue border-SlateBlue">
                                        <MdArrowBackIosNew className="p-1 text-3xl text-SlateBlue hover:text-white " />
                                    </button></Link>
                            </div>
                            <div>
                                <button className="border rounded-full mr-2 hover:shadow-xl hover:bg-SlateBlue border-SlateBlue">
                                    <IoMdRefresh className="p-1 text-3xl text-SlateBlue hover:text-white " />
                                </button>
                            </div>

                            <div >
                                <div>
                                    <button className="border rounded-full mr-2 hover:shadow-xl border-SlateBlue hover:bg-red hover:border-red">
                                        <RiDeleteBin5Line className="p-1 text-3xl text-SlateBlue hover:text-white " />
                                    </button>
                                </div>

                            </div>

                        </div>

                    </div>


                    <div className="relative bg-white shadow-lg rounded-e-md">
                        <div className="screen-palyer-img ">
                            <img src="./../../../../public/ScreenImg/dragon.svg" className="mx-auto" />
                        </div>


                        <div className="grid  grid-cols-12  screen-player-details pb-7 sm:pb-0 border-b border-[#D5E3FF]">
                            <div className="default-media flex items-center xs-block justify-between bg-[#595F7A] py-2 px-5 rounded-md lg:col-start-4 lg:col-span-6 md:col-start-3 md:col-span-8  sm:col-start-1 sm:col-span-12">
                                <div>
                                    <p className="text-[#E4E6FF] text-sm font-light">Now Playing</p>
                                    <h4 className="text-[#E4E6FF] text-lg">Default Media</h4>
                                </div>

                                <div className="relative">
                                    <button className="bg-white p-1 rounded-md shadow mr-2 hover:bg-SlateBlue relative" onClick={() => setMediadw((prev) => !prev)}><HiOutlineChevronDown className="text-primary text-lg hover:text-white" /></button>
                                    <button className="bg-white p-1 rounded-md shadow hover:bg-SlateBlue"><AiOutlineCloudUpload className="text-primary text-lg hover:text-white" /></button>
                                    {mediadw &&

                                        <div className="mediadw">
                                            <ul>
                                                <li className="flex text-sm items-center"><MdElectricBolt className="mr-2 text-lg" />Default Media</li>
                                                <li className="flex text-sm items-center" ><AiOutlineCloudUpload className="mr-2 text-lg" />Browse More</li>
                                            </ul>
                                        </div>
                                    }


                                </div>
                            </div>
                        </div>

                        <div className="grid  grid-cols-12">
                            <div className="lg:col-start-4 lg:col-span-6 md:col-start-3 md:col-span-8  sm:col-start-1 sm:col-span-12 text-center">
                                <ul className="inline-flex items-center justify-center border border-primary rounded-full my-4 shadow-xl">
                                    <li className="text-sm firstli"> <button className={toggle === 1 ? 'tabshow tabactive' : 'tab'} onClick={() => updatetoggle(1)}>Info</button></li>
                                    <li className="text-sm"> <button className={toggle === 2 ? 'tabshow tabactive' : 'tab'} onClick={() => updatetoggle(2)}>Setting</button></li>
                                </ul>
                                <div className={toggle === 1 ? 'show-togglecontent active' : 'togglecontent'}>
                                    <table cellPadding={10} className="w-full border-[#D5E3FF] border rounded-xl screen-status">
                                        <tr className="border-b border-[#D5E3FF]">
                                            <td className="text-right lg:w-2/4 md:w-2/4 sm:w-full">
                                                <p className="text-primary text-lg font-medium">Screen Status:</p>
                                            </td>
                                            <td className="text-left"><button className="bg-gray py-2 px-8 rounded-full text-primary hover:bg-primary hover:text-white">Offline</button></td>
                                        </tr>
                                        <tr className="border-b border-[#D5E3FF]">
                                            <td className="text-right"><p className="text-primary text-lg font-medium">Screen Details:</p></td>
                                            <td className="text-left"><p className="text-base text-[#515151]">Sony, S01-5000035, 5120 x 2880, (Ultrawide 5K)</p></td>
                                        </tr>
                                        <tr className="border-b border-[#D5E3FF]">
                                            <td className="text-right"><p className="text-primary text-lg font-medium">Mac ID:</p></td>
                                            <td className="text-left"><p className="text-base text-[#515151]">4C : 7C : 5F : 0B : 54 : 05</p></td>
                                        </tr>
                                        <tr className="border-b border-[#D5E3FF]">
                                            <td className="text-right"><p className="text-primary text-lg font-medium">Operating System:</p></td>
                                            <td className="text-left"><p className="text-base text-[#515151]">Apple TV</p></td>
                                        </tr>
                                        <tr className="border-b border-[#D5E3FF]">
                                            <td className="text-right"><p className="text-primary text-lg font-medium">Google Location:</p></td>
                                            <td className="text-left"><p className="text-base text-[#515151]">132, My Street, Kingston, New York 12401.</p></td>
                                        </tr>
                                        <tr className="border-b border-[#D5E3FF]">
                                            <td className="text-right"><p className="text-primary text-lg font-medium">Time Zone:</p></td>
                                            <td className="text-left"><p className="text-base text-[#515151]">Asia/Calcutta</p></td>
                                        </tr>
                                        <tr className="border-b border-[#D5E3FF]">
                                            <td className="text-right"><p className="text-primary text-lg font-medium">Tags:</p></td>
                                            <td className="text-left"><p className="text-base text-[#515151]">Marketing</p></td>
                                        </tr>
                                        <tr className="border-b border-[#D5E3FF]">
                                            <td className="text-right"><p className="text-primary text-lg font-medium">Connected Since:</p></td>
                                            <td className="text-left"><p className="text-base text-[#515151]">Jun 5, 2023, 8:16 PM</p></td>
                                        </tr>
                                        <tr className="border-b border-[#D5E3FF]">
                                            <td className="text-right"><p className="text-primary text-lg font-medium">Connected By:</p></td>
                                            <td className="text-left"><p className="text-base text-[#515151]">User Name</p></td>
                                        </tr>
                                        <tr className="border-b border-[#D5E3FF]">
                                            <td className="text-right"><p className="text-primary text-lg font-medium">Operating Hours:</p></td>
                                            <td className="text-left"><p className="text-base text-[#515151]">Always on</p></td>
                                        </tr>

                                    </table>
                                    <div className="text-right my-5">
                                        <button className="bg-primary text-base px-5 py-2 rounded-full text-white">Save</button>
                                    </div>
                                </div>

                                <div className={toggle === 2 ? 'show-togglecontent active' : 'togglecontent'}>
                                    <table cellPadding={10} className="w-full border-[#D5E3FF] border rounded-xl ">
                                        <tr className="border-b border-[#D5E3FF]">
                                            <td className="text-right lg:w-2/4  md:w-2/4 sm:w-full">
                                                <p className="text-primary text-lg font-medium">Orientation:</p>
                                            </td>
                                            <td className="text-left">
                                                <div className="flex justify-center">

                                                    <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
                                                        <input
                                                            className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                                            type="radio"
                                                            name="inlineRadioOptions"
                                                            id="inlineRadio1"
                                                            value="option1" />
                                                        <label
                                                            className="mt-px inline-block pl-[0.15rem] opacity-50 hover:cursor-pointer"
                                                            for="inlineRadio1">0</label>
                                                    </div>


                                                    <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
                                                        <input
                                                            className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                                            type="radio"
                                                            name="inlineRadioOptions"
                                                            id="inlineRadio1"
                                                            value="option1" />
                                                        <label
                                                            className="mt-px inline-block pl-[0.15rem] opacity-50 hover:cursor-pointer"
                                                            for="inlineRadio1">90</label>
                                                    </div>


                                                    <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
                                                        <input
                                                            className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                                            type="radio"
                                                            name="inlineRadioOptions"
                                                            id="inlineRadio1"
                                                            value="option1" />
                                                        <label
                                                            className="mt-px inline-block pl-[0.15rem] opacity-50 hover:cursor-pointer"
                                                            for="inlineRadio1">180</label>
                                                    </div>

                                                    <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
                                                        <input
                                                            className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                                            type="radio"
                                                            name="inlineRadioOptions"
                                                            id="inlineRadio1"
                                                            value="option1" />
                                                        <label
                                                            className="mt-px inline-block pl-[0.15rem] opacity-50 hover:cursor-pointer"
                                                            for="inlineRadio1">270</label>
                                                    </div>

                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-right pb-0">
                                                <p className="text-primary text-lg font-medium">Playback Mode:</p>
                                            </td>
                                            <td className="text-left pb-0">
                                                <ul className="inline-flex items-center justify-center  my-4 ">
                                                    <li className="text-sm"> <button className={sync === 1 ? 'tabsyncshow tabsyncactive ' : 'synctab'} onClick={() => updatesynctoggle(1)}>sync</button></li>
                                                    <li className="text-sm"> <button className={sync === 2 ? 'tabsyncshow tabsyncactive' : 'synctab'} onClick={() => updatesynctoggle(2)}>Unsync</button></li>
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr className={sync === 1 ? 'show-togglesynccontent active w-full' : 'togglesynccontent'} >
                                            <td colSpan={2}>

                                                <table cellPadding={10} className="sync-table w-full" >
                                                    <tr className="border-b border-[#D5E3FF]">
                                                        <td className="text-center pt-0" colSpan={2}>
                                                            <p className="text-primary text-sm font-medium">Sync mode will keep your screens in sync with each other when playing the same content</p>
                                                        </td>
                                                    </tr>
                                                    <tr className="border-b border-[#D5E3FF]">
                                                        <td className="text-right">
                                                            <p className="text-primary text-lg font-medium">Google Location:</p>
                                                        </td>
                                                        <td>
                                                            <input type="text" placeholder="132, My Street, Kingston, New York..." />
                                                        </td>
                                                    </tr>

                                                    <tr className="border-b border-[#D5E3FF]">
                                                        <td className="text-right">
                                                            <p className="text-primary text-lg font-medium">Overwrite Time Zone:</p>
                                                        </td>
                                                        <td className="relative">
                                                            <select className="relative">
                                                                <option>Asia/Calcutta</option>
                                                                <option>Asia/Calcutta</option>
                                                            </select>

                                                        </td>
                                                    </tr>

                                                    <tr className="border-b border-[#D5E3FF]">
                                                        <td className="text-right">
                                                            <p className="text-primary text-lg font-medium">Screen Group:</p>
                                                        </td>
                                                        <td>
                                                            <select>
                                                                <option>Ungrouped</option>
                                                                <option>grouped</option>
                                                            </select>
                                                        </td>
                                                    </tr>

                                                    <tr className="border-b border-[#D5E3FF]">
                                                        <td className="text-right">
                                                            <p className="text-primary text-lg font-medium">Tags</p>
                                                        </td>
                                                        <td>
                                                            <select>
                                                                <option>Marketing</option>

                                                            </select>
                                                        </td>
                                                    </tr>

                                                    <tr className="border-b border-[#D5E3FF]">
                                                        <td className="text-right">
                                                            <p className="text-primary text-lg font-medium">Operating Hours:</p>
                                                        </td>
                                                        <td>
                                                            <select>
                                                                <option>Select</option>
                                                                <option>Always On</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <div className="text-right my-5">
                                                    <button className="bg-primary text-base px-5 py-2 rounded-full text-white hover:bg-SlateBlue">Save</button>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr className={sync === 2 ? 'show-togglesynccontent active w-full' : 'togglesynccontent'} >
                                            <td colSpan={2}>

                                                <table cellPadding={10} className="sync-table w-full" >
                                                    <tr className="border-b border-[#D5E3FF]">
                                                        <td className="text-center pt-0" colSpan={2}>
                                                            <p className="text-primary text-sm font-medium">Unsync mode will play your content from the beginning each time and won't keep this screen in sync</p>
                                                        </td>
                                                    </tr>
                                                    <tr className="border-b border-[#D5E3FF]">
                                                        <td className="text-right">
                                                            <p className="text-primary text-lg font-medium">Google Location</p>
                                                        </td>
                                                        <td>
                                                            <input type="text" placeholder="132, My Street, Kingston, New York..." />
                                                        </td>
                                                    </tr>

                                                    <tr className="border-b border-[#D5E3FF]">
                                                        <td className="text-right">
                                                            <p className="text-primary text-lg font-medium">Select Time Zone</p>
                                                        </td>
                                                        <td className="relative">
                                                            <select className="relative">
                                                                <option>Asia/Calcutta</option>
                                                                <option>Asia/Calcutta</option>
                                                            </select>

                                                        </td>
                                                    </tr>

                                                    <tr className="border-b border-[#D5E3FF]">
                                                        <td className="text-right">
                                                            <p className="text-primary text-lg font-medium">Screen Group</p>
                                                        </td>
                                                        <td>
                                                            <select>
                                                                <option>Ungrouped</option>
                                                                <option>grouped</option>
                                                            </select>
                                                        </td>
                                                    </tr>

                                                    <tr className="border-b border-[#D5E3FF]">
                                                        <td className="text-right">
                                                            <p className="text-primary text-lg font-medium">Tags</p>
                                                        </td>
                                                        <td>
                                                            <select>
                                                                <option>Marketing</option>

                                                            </select>
                                                        </td>
                                                    </tr>

                                                    <tr className="border-b border-[#D5E3FF]">
                                                        <td className="text-right">
                                                            <p className="text-primary text-lg font-medium">Operating Hours:</p>
                                                        </td>
                                                        <td>
                                                            <select>
                                                                <option>Select</option>
                                                                <option>Always On</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <div className="text-right my-5">
                                                    <button className="bg-primary text-base px-5 py-2 rounded-full text-white hover:bg-SlateBlue">Save</button>
                                                </div>
                                            </td>
                                        </tr>


                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    )
}

export default Screensplayer
