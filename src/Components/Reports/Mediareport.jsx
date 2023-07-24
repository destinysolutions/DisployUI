import React from 'react'
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import PropTypes from "prop-types";
import '../../Styles/Report.css'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { AiOutlineSearch } from 'react-icons/ai'
import { LuDownload } from 'react-icons/lu'
import { CiFilter } from 'react-icons/ci'
import { Link } from 'react-router-dom';
import Footer from '../Footer';

const Mediareport = ({ sidebarOpen, setSidebarOpen }) => {
    Mediareport.propTypes = {
        sidebarOpen: PropTypes.bool.isRequired,
        setSidebarOpen: PropTypes.func.isRequired,
    };

    return (

        <>
            <div className="flex border-b border-gray py-3">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>
            <div className="pt-6 px-5">
                <div className={`${sidebarOpen ? "ml-52" : "ml-0"}`}>
                    <div className="lg:flex lg:justify-between sm:block xs:block  items-center">
                        <div className='flex items-center lg:mb-0 md:mb-0 sm:mb-4'>
                            <Link to={'/reports'}><MdKeyboardArrowLeft className='text-4xl text-primary' /></Link>
                            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl xs:text-xs text-[#001737]  ">
                                Media Reports
                            </h1>
                        </div>

                        <div className='rightbtn flex items-center flex-wrap'>
                            <ul className='p-0 m-0 lg:flex md:flex sm:block xs:block items-center border rounded-md border-primary  lg:mr-3 md:mr-3 sm:mr-2 xs:mr-0 lg:w-auto md:w-auto sm:w-auto xs:w-full'>
                                <li className='bg-primary text-white py-1 px-4 font-light-[26px] rounded-tl-md rounded-tb-md'><label className=' leading-8'>Daily</label></li>
                                <li><input type='date' className='date-formate px-2 py-1 bg-[transparent] text-base lg:w-auto md:w-auto sm:w-full xs:w-full' /></li>
                            </ul>

                            <div className=" flex items-end justify-end relative sm:mr-0">
                                <AiOutlineSearch className="absolute top-[13px] left-[15px] z-10 text-primary searchicon" />
                                <input
                                    type="text"
                                    placeholder=" Search Users "
                                    className="border border-primary rounded-full bg-[transparent] pl-7 py-2 search-user placeholder:text-primary" />
                            </div>

                            <div className='ml-2'>
                                <button className="border rounded-full  hover:shadow-xl hover:bg-SlateBlue border-primary ">
                                    <LuDownload className="p-2 text-4xl text-primary hover:text-white " />
                                </button>
                            </div>


                        </div>



                    </div>

                    <div className='sectiondetails mt-5 bg-white p-5 rounded-md drop-shadow-sm overflow-x-auto'>
                        <table className='w-full text-[#5E5E5E]' cellPadding={20}>
                            <tr className='bg-[#E4E6FF] rounded-md'>
                                <th className='flex items-center font-medium p-3'>Media <CiFilter className='text-sm text-primary ml-2' /></th>
                                <th className=' font-medium text-center p-3'>Loop Counter</th>
                                <th className=' font-medium text-center p-3'>Duration</th>
                            </tr>

                            <tr className=' align-middle border-b border-[#E4E6FF]'>
                                <td><p>Media Name 1</p></td>
                                <td className='text-center'><span className='bg-[#E4E6FF] px-4 py-2 text-base rounded-md'>3</span></td>
                                <td className='text-center'><span className='bg-[#E4E6FF] px-4 py-2 text-base rounded-md'>00:05:10</span></td>
                            </tr>

                            <tr className=' align-middle border-b border-[#E4E6FF]'>
                                <td><p>Media Name 2</p></td>
                                <td className='text-center'><span className='bg-[#E4E6FF] px-4 py-2 text-base rounded-md'>6</span></td>
                                <td className='text-center'><span className='bg-[#E4E6FF] px-4 py-2 text-base rounded-md'>00:24:25</span></td>
                            </tr>


                        </table>
                    </div>

                </div>
            </div>
            <Footer/>
        </>
    )
}

export default Mediareport
