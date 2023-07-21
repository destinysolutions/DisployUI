import { useState } from 'react'
import React from 'react'
import { BiUserPlus } from 'react-icons/bi'
import { FiFilter } from 'react-icons/fi'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import '../../Styles/Settings.css'
const Users = () => {
    const [users, setUsers] = useState([
        {
            name: 'Dhara',
            phoneEnabled: false,
            emailEnabled: true,
            roles: 'Manager',
            screen: 'Screen Access',
        },
        {
            name: 'Dhara',
            phoneEnabled: false,
            emailEnabled: true,
            roles: 'Manager',
            screen: 'Screen Access',
        },
        {
            name: 'Dhara',
            phoneEnabled: true,
            emailEnabled: false,
            roles: 'Manager',
            screen: 'Screen Access',
        },
        {
            name: 'Dhara',
            phoneEnabled: false,
            emailEnabled: true,
            roles: 'Manager',
            screen: 'Screen Access',
        },
        // Add more users here...
    ]);

    const handlePhoneToggle = (index) => {
        const updatedUsers = [...users];
        updatedUsers[index].phoneEnabled = !updatedUsers[index].phoneEnabled;
        setUsers(updatedUsers);
    };

    const handleEmailToggle = (index) => {
        const updatedUsers = [...users];
        updatedUsers[index].emailEnabled = !updatedUsers[index].emailEnabled;
        setUsers(updatedUsers);
    };
    {/*model */ }
    const [showuserModal, setshowuserModal] = useState(false)
    return (
        <>
            <div className='lg:p-5 md:p-5 sm:p-2 xs:p-2'>
                <div>
                    <button className="flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 mb-5 py-2 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50" onClick={() => setshowuserModal(true)}>
                        <BiUserPlus className="text-2xl mr-1" />
                        Add New Users
                    </button>
                </div>
                <div className='clear-both overflow-x-auto'>
                    <table className=' bg-[#EFF3FF] w-full text-left rounded-xl' cellPadding={15}>
                        <thead>
                            <tr className='border-b border-b-[#E4E6FF]'>

                                <th className='text-[#5A5881] text-base font-semibold'><lable className='flex items-center'>Name<FiFilter className='ml-1 text-lg' /></lable></th>
                                <th className='text-[#5A5881] text-base font-semibold'>Phone Number</th>
                                <th className='text-[#5A5881] text-base font-semibold'>Email</th>
                                <th className='text-[#5A5881] text-base font-semibold'><div className='flex items-center'>Roles<FiFilter className='ml-1 text-lg' /></div></th>
                                <th className='text-[#5A5881] text-base font-semibold'><div className='flex items-center'>Screen Access <FiFilter className='ml-1 text-lg' /></div></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index} className='border-b border-b-[#E4E6FF]'>
                                    <td className='text-[#5E5E5E]'>{user.name}</td>
                                    <td>
                                        <label className="inline-flex relative items-center  cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={user.phoneEnabled}
                                                onChange={() => handlePhoneToggle(index)}
                                            />
                                            <div
                                                className={`w-11 h-6 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${user.phoneEnabled ? "bg-[#41479B]" : "bg-[#ABB1FF]"
                                                    }`}
                                            ></div>
                                        </label>
                                    </td>
                                    <td>
                                        <label className="inline-flex relative items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={user.emailEnabled}
                                                onChange={() => handleEmailToggle(index)}
                                            />
                                            <div
                                                className={`w-11 h-6 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${user.emailEnabled ? "bg-[#41479B]" : "bg-[#ABB1FF]"
                                                    }`}
                                            ></div>
                                        </label>
                                    </td>
                                    <td className='text-[#5E5E5E]'>{user.roles}</td>
                                    <td className='text-[#5E5E5E]'>{user.screen}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showuserModal && (
                <>
                    <div className="backdrop">
                        <div className="user-model">

                            <div className="hours-heading flex justify-between items-center p-5 border-b border-gray">
                                <h1 className='text-lg font-medium text-primary'>Add New User</h1>
                                <AiOutlineCloseCircle className='text-4xl text-primary cursor-pointer' onClick={() => setshowuserModal(false)} />
                            </div>
                            <hr className="border-gray " />
                            <div className="model-body lg:p-5 md:p-5 sm:p-2 xs:p-2 ">
                                <div className=" lg:p-3 md:p-3 sm:p-2 xs:py-3 xs:px-1 text-left rounded-2xl">

                                    <div className="grid grid-cols-12 gap-6">
                                        <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                            <div className="relative">
                                                <label className="formLabel">User Name</label>
                                                <input type='text' placeholder='Enter User Name' name="name" className="formInput" />
                                            </div>
                                        </div>
                                        <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                            <div className="relative">
                                                <label className="formLabel">Phone No</label>
                                                <input type='text' placeholder='Enter Phone No' name="phoneno" className="formInput" />
                                            </div>
                                        </div>
                                        <div className='col-span-12'>
                                            <div className="relative">
                                                <label className="formLabel">Email</label>
                                                <input type='text' placeholder='Enter Email Address' name="email" className="formInput" />
                                            </div>
                                        </div>
                                        <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                            <div className="relative">
                                                <label className="formLabel">Roles</label>
                                                <select className="formInput">
                                                    <option selected>Enter Roles</option>
                                                    <option>Manager</option>
                                                    <option>Jr. Manager</option>
                                                    <option>Viewer</option>
                                                </select>

                                            </div>
                                        </div>
                                        <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                            <div className="relative">
                                                <label className="formLabel">Screen Access</label>
                                                <input type='text' placeholder='Enter Screen Name' name="screenaccess" className="formInput" />
                                            </div>
                                        </div>
                                        <div className='col-span-12 text-center'>
                                            <button className='bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2' onClick={() => setshowuserModal(false)}>Cancel</button>
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

export default Users