import React from 'react'
import { useState } from "react";
import { FaCertificate } from 'react-icons/fa'
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md'
import { AiOutlineCloseCircle } from 'react-icons/ai'
const Userrole = () => {
    const [showdata, setShowdata] = useState(false);
    const handleDropupClick = () => {
        setShowdata(!showdata);
    };
    {/*model */ }
    const [showuserroleModal, setshowuserroleModal] = useState(false)
    return (
        <>
            <div>
                <button className=" dashboard-btn  flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 sm:mt-2 py-2 text-base sm:text-sm mb-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50" onClick={() => setshowuserroleModal(true)}>
                    <FaCertificate className="text-lg mr-1" />
                    Add New Role
                </button>

                <div className="accordions  clear-both">
                    <div className="section shadow-md py-3 px-5 rounded-md bg-[#E4E6FF]  lg:flex md:flex  sm:block items-center justify-between">
                        <h1 className="text-lg text-primary font-medium">Manager</h1>
                        <div className=" flex items-center">
                            <button
                                className="showicon"
                                onClick={handleDropupClick}
                            >

                                {showdata ? (
                                    <MdOutlineKeyboardArrowUp className="text-3xl" />
                                ) : (
                                    <MdOutlineKeyboardArrowDown className="text-3xl" />
                                )}
                            </button>
                        </div>

                    </div>

                    {showdata && (
                        <div className='bg-[#EFF3FF] py-5'>
                            <table className='w-full text-left' cellPadding={15}>
                                <thead>
                                    <tr className='border-b border-b-[#E4E6FF]'>
                                        <th className=' w-2/5'></th>
                                        <th className='text-[#5A5881] text-base font-semibold  w-1/12'>Create</th>
                                        <th className='text-[#5A5881] text-base font-semibold w-1/12'>Edit</th>
                                        <th className='text-[#5A5881] text-base font-semibold w-1/12'>Delete</th>
                                        <th className='text-[#5A5881] text-base font-semibold w-2/12'>Propose Changes</th>
                                        <th className='text-[#5A5881] text-base font-semibold w-2/12'>Approve Changes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className='border-b border-b-[#E4E6FF]'>
                                        <td className='text-[#5E5E5E] max-w-xl'>Screen</td>
                                        <td><input type='checkbox' value='screate' name='screate' checked /></td>
                                        <td><input type='checkbox' value='screen' name='screen' checked /></td>
                                        <td><input type='checkbox' value='delete' name='delete' checked /></td>
                                        <td><input type='checkbox' value='Propose' name='Propose' /></td>
                                        <td><input type='checkbox' value='Approve' name='Approve' /></td>
                                    </tr>
                                    {/*end of tr */}
                                    <tr className='border-b border-b-[#E4E6FF]'>
                                        <td className='text-[#5E5E5E] max-w-xl'>My Schedule</td>
                                        <td><input type='checkbox' value='screate' name='screate' /></td>
                                        <td><input type='checkbox' value='screen' name='screen' /></td>
                                        <td><input type='checkbox' value='delete' name='delete' /></td>
                                        <td><input type='checkbox' value='Propose' name='Propose' /></td>
                                        <td><input type='checkbox' value='Approve' name='Approve' /></td>
                                    </tr>
                                    {/*end of tr */}

                                    <tr className='border-b border-b-[#E4E6FF]'>
                                        <td className='text-[#5E5E5E] max-w-xl'>Apps</td>
                                        <td><input type='checkbox' value='screate' name='screate' /></td>
                                        <td><input type='checkbox' value='screen' name='screen' /></td>
                                        <td><input type='checkbox' value='delete' name='delete' /></td>
                                        <td><input type='checkbox' value='Propose' name='Propose' /></td>
                                        <td><input type='checkbox' value='Approve' name='Approve' /></td>
                                    </tr>
                                    {/*end of tr */}
                                    <tr className='border-b border-b-[#E4E6FF]'>
                                        <td className='text-[#5E5E5E] max-w-xl'>Setting</td>
                                        <td><input type='checkbox' value='screate' name='screate' /></td>
                                        <td><input type='checkbox' value='screen' name='screen' /></td>
                                        <td><input type='checkbox' value='delete' name='delete' /></td>
                                        <td><input type='checkbox' value='Propose' name='Propose' /></td>
                                        <td><input type='checkbox' value='Approve' name='Approve' /></td>
                                    </tr>
                                    {/*end of tr */}
                                    <tr className='border-b border-b-[#E4E6FF]'>
                                        <td className='text-[#5E5E5E] max-w-xl'>Reports</td>
                                        <td><input type='checkbox' value='screate' name='screate' /></td>
                                        <td><input type='checkbox' value='screen' name='screen' /></td>
                                        <td><input type='checkbox' value='delete' name='delete' /></td>
                                        <td><input type='checkbox' value='Propose' name='Propose' /></td>
                                        <td><input type='checkbox' value='Approve' name='Approve' /></td>
                                    </tr>
                                    {/*end of tr */}
                                    <tr className='border-b border-b-[#E4E6FF]'>
                                        <td className='text-[#5E5E5E] max-w-xl'>Trash</td>
                                        <td><input type='checkbox' value='screate' name='screate' /></td>
                                        <td><input type='checkbox' value='screen' name='screen' /></td>
                                        <td><input type='checkbox' value='delete' name='delete' /></td>
                                        <td><input type='checkbox' value='Propose' name='Propose' /></td>
                                        <td><input type='checkbox' value='Approve' name='Approve' /></td>
                                    </tr>
                                    {/*end of tr */}
                                    <tr className='border-b border-b-[#E4E6FF]'>
                                        <td colSpan={5} className='text-primary max-w-xl font-medium'>Billing</td>
                                    </tr>
                                    {/*end of tr */}
                                    <tr className='border-b border-b-[#E4E6FF]'>
                                        <td className='text-[#5E5E5E] max-w-xl'>Payment Method</td>
                                        <td><input type='checkbox' value='pscreate' name='pscreate' /></td>
                                        <td><input type='checkbox' value='pscreen' name='pscreen' /></td>
                                        <td><input type='checkbox' value='pdelete' name='pdelete' /></td>
                                        <td><input type='checkbox' value='pPropose' name='pPropose' /></td>
                                        <td><input type='checkbox' value='pApprove' name='pApprove' /></td>
                                    </tr>
                                    {/*end of tr */}
                                    <tr className='border-b border-b-[#E4E6FF]'>
                                        <td className='text-[#5E5E5E] max-w-xl'>Receive bank Access</td>
                                        <td><input type='checkbox' value='pscreate' name='pscreate' /></td>
                                        <td><input type='checkbox' value='pscreen' name='pscreen' /></td>
                                        <td><input type='checkbox' value='pdelete' name='pdelete' /></td>
                                        <td><input type='checkbox' value='pPropose' name='pPropose' /></td>
                                        <td><input type='checkbox' value='pApprove' name='pApprove' /></td>
                                    </tr>
                                    {/*end of tr */}
                                    <tr className='border-b border-b-[#E4E6FF]'>
                                        <td colSpan={5} className='text-primary max-w-xl font-medium'>Content</td>
                                    </tr>
                                    {/*end of tr */}
                                    <tr className='border-b border-b-[#E4E6FF]'>
                                        <td className='text-[#5E5E5E] max-w-xl'>Assets</td>
                                        <td><input type='checkbox' value='ascreate' name='ascreate' /></td>
                                        <td><input type='checkbox' value='ascreen' name='ascreen' /></td>
                                        <td><input type='checkbox' value='adelete' name='adelete' /></td>
                                        <td><input type='checkbox' value='aPropose' name='aPropose' /></td>
                                        <td><input type='checkbox' value='aApprove' name='aApprove' /></td>
                                    </tr>
                                    {/*end of tr */}
                                    <tr className='border-b border-b-[#E4E6FF]'>
                                        <td className='text-[#5E5E5E] max-w-xl'>Disploy Studio</td>
                                        <td><input type='checkbox' value='ascreate' name='ascreate' /></td>
                                        <td><input type='checkbox' value='ascreen' name='ascreen' /></td>
                                        <td><input type='checkbox' value='adelete' name='adelete' /></td>
                                        <td><input type='checkbox' value='aPropose' name='aPropose' /></td>
                                        <td><input type='checkbox' value='aApprove' name='aApprove' /></td>
                                    </tr>
                                    {/*end of tr */}

                                    <tr className='border-b border-b-[#E4E6FF]'>
                                        <td className='text-[#5E5E5E] max-w-xl'>Playlist</td>
                                        <td><input type='checkbox' value='ascreate' name='ascreate' /></td>
                                        <td><input type='checkbox' value='ascreen' name='ascreen' /></td>
                                        <td><input type='checkbox' value='adelete' name='adelete' /></td>
                                        <td><input type='checkbox' value='aPropose' name='aPropose' /></td>
                                        <td><input type='checkbox' value='aApprove' name='aApprove' /></td>
                                    </tr>
                                    {/*end of tr */}

                                    <tr className='border-b border-b-[#E4E6FF]'>
                                        <td className='text-[#5E5E5E] max-w-xl'>Template</td>
                                        <td><input type='checkbox' value='ascreate' name='ascreate' /></td>
                                        <td><input type='checkbox' value='ascreen' name='ascreen' /></td>
                                        <td><input type='checkbox' value='adelete' name='adelete' /></td>
                                        <td><input type='checkbox' value='aPropose' name='aPropose' /></td>
                                        <td><input type='checkbox' value='aApprove' name='aApprove' /></td>
                                    </tr>
                                    {/*end of tr */}
                                    <tr>
                                        <td colSpan={6} className="text-right"><button className='bg-primary text-white text-base px-6 py-2 shadow-md rounded-full'>Save</button></td>
                                    </tr>
                                    {/*end of tr */}

                                </tbody>
                            </table>
                        </div>
                    )}

                </div>

                {/*accordions1 close */}
                <div className="accordions  clear-both mt-3">
                    <div className="section shadow-md py-3 px-5 rounded-md bg-[#E4E6FF]  lg:flex md:flex  sm:block items-center justify-between">
                        <h1 className="text-lg text-primary font-medium">Jr. Manager</h1>
                        <div className=" flex items-center">
                            <button className="showicon">

                                {showdata ? (
                                    <MdOutlineKeyboardArrowUp className="text-3xl" />
                                ) : (
                                    <MdOutlineKeyboardArrowDown className="text-3xl" />
                                )}
                            </button>
                        </div>

                    </div>
                </div>
                {/*accordions 2 close */}

                <div className="accordions  clear-both mt-3">
                    <div className="section shadow-md py-3 px-5 rounded-md bg-[#E4E6FF]  lg:flex md:flex  sm:block items-center justify-between">
                        <h1 className="text-lg text-primary font-medium">Viewer</h1>
                        <div className=" flex items-center">
                            <button className="showicon">

                                {showdata ? (
                                    <MdOutlineKeyboardArrowUp className="text-3xl" />
                                ) : (
                                    <MdOutlineKeyboardArrowDown className="text-3xl" />
                                )}
                            </button>
                        </div>

                    </div>
                </div>
                {/*accordions 3 close */}
            </div>

            {showuserroleModal && (
                <>
                    <div className="backdrop">
                        <div className="user-model">

                            <div className="hours-heading flex justify-between items-center p-5 border-b border-gray">
                                <h1 className='text-lg font-medium text-primary'>Add New Role</h1>
                                <AiOutlineCloseCircle className='text-4xl text-primary cursor-pointer' onClick={() => setshowuserroleModal(false)} />
                            </div>
                            <hr className="border-gray " />
                            <div className="model-body lg:p-5 md:p-5 sm:p-2 xs:p-2 ">
                                <div className=" lg:p-3 md:p-3 sm:p-2 xs:py-3 xs:px-1 text-left rounded-2xl">

                                    <div className="grid grid-cols-12 gap-6">
                                        <div className='col-span-12'>
                                            <div className="relative">
                                                <input type='text' placeholder='Enter New Role Name' name="name" className="formInput w-full" />
                                            </div>
                                        </div>

                                        <div className='col-span-12 text-center'>
                                            <button className='bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2' onClick={() => setshowuserroleModal(false)}>Cancel</button>
                                            <button className='bg-white text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white'>Save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Userrole