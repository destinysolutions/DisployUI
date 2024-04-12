import React from 'react'

const CreateAPI = () => {
    return (
        <>
            <div className='lg:p-5 md:p-5 sm:p-2 xs:p-2'>
                <div className="flex items-center justify-between mx-2 mb-5">
                    <h1 className="font-medium lg:text-2xl md:text-2xl sm:text-xl">
                        Create New API
                    </h1>
                </div>
                <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2 border border-gray rounded-xl py-5">
                    <h2 className="font-medium text-lg mb-5">Create an API key</h2>
                    <div className="full flex flex-wrap -mx-3 mb-3">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                            <div className="relative w-full border-none">
                                <label className="input-box-label" htmlFor="grid-first-name"> Choose the API key type you want to create </label>
                                <select className="border border-gray rounded w-full py-5 px-4 h-6  focus:outline-none focus:bg-white focus:border-gray-500">
                                    <option>Select API Key</option>
                                    <option >Screen </option>
                                    <option>Assets</option>
                                    <option>Play list</option>
                                    <option>Disploy Studio </option>
                                    <option>App </option>
                                    <option>Report </option>
                                </select>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <div className="relative w-full border-none">
                                <label className="input-box-label" htmlFor="grid-last-name" >
                                    Name the API key
                                </label>
                                <input className="border border-gray w-full py-5 px-4 h-6 rounded focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Enter API key" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 lg:px-5 md:px-5 sm:px-2 xs:px-2">
                        <div className="w-full md:w-1/2">
                            <h2 className="font-medium text-lg mb-5">Permission types</h2>
                            <div className="text-center flex flex-wrap">
                                <div className="flex items-center mr-4 mb-4">
                                    <input id="full-access" type="radio" name="radio" className="hidden" defaultChecked />
                                    <label htmlFor="full-access" className="flex items-center cursor-pointer">
                                        <span className="w-4 h-4 inline-block mr-1 border border-blue-600 rounded-full"></span>
                                        Full Access</label>
                                </div>
                                <div className="flex items-center mr-4 mb-4">
                                    <input id="read-only" type="radio" name="radio" className="hidden" />
                                    <label htmlFor="read-only" className="flex items-center cursor-pointer">
                                        <span className="w-4 h-4 inline-block mr-1 border border-blue-600 rounded-full"></span>
                                        Read Only</label>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <h2 className="font-medium text-lg mb-5">API types</h2>
                            <div className="text-center flex flex-wrap">
                                <div className="flex items-center mr-4 mb-4">
                                    <input id="get" type="radio" name="radio" className="hidden" defaultChecked />
                                    <label htmlFor="get" className="flex items-center cursor-pointer">
                                        <span className="w-4 h-4 inline-block mr-1 border border-blue-600 rounded-full"></span>
                                        Get</label>
                                </div>
                                <div className="flex items-center mr-4 mb-4">
                                    <input id="post" type="radio" name="radio" className="hidden" />
                                    <label htmlFor="post" className="flex items-center cursor-pointer">
                                        <span className="w-4 h-4 inline-block mr-1 border border-blue-600 rounded-full"></span>
                                        Post</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-12 my-4'>
                        <button className='text-white bg-blue-700 hover:bg-blue-800 rounded-full text-base px-8 py-2 text-center'>Create Key</button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default CreateAPI
