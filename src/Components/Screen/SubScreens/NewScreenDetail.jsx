import React from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";

const NewScreenDetail = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      <div className="flex border-b border-gray py-3">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5">
        <div className={`${sidebarOpen ? "ml-52" : "ml-16"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium text-2xl text-[#001737] sm-mb-3">
            New Screens Details
            </h1>
            <div className="lg:flex md:flex sm:block">
              <button className="flex align-middle border-primary items-center border rounded-full lg:px-9 sm:px-7 sm-mt-2 py-2 sm:mt-2  text-base mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                Edit
              </button>
              </div>
          </div>
          <div className="shadow-md p-5 rounded-md bg-white flex items-center justify-between mt-7">
          <form className="w-full max-w-sm">
  <div className="md:flex md:items-center mb-6">
    <div className="md:w-full">
      <label className="text-[#001737] font-medium text-lg mb-1 md:mb-0">
      Screen Name:
      </label>
    </div>
    <div className="md:w-full">
      <input className="bg-gray-200 appearance-none border-[1px] border-[#D5E3FF] rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text"/>
    </div>
  </div>
  <div className="md:flex md:items-center mb-6">
    <div className="md:w-full">
      <label className=" text-[#001737] font-medium text-lg  mb-1 md:mb-0" >
      Google Location:
      </label>
    </div>
    <div className="md:w-full">
      <input className="bg-gray-200 appearance-none border-[1px] border-[#D5E3FF] rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"  type="text" />
    </div>
  </div>
  <div className="md:flex md:items-center mb-6">
    <div className="md:w-full">
      <label className=" text-[#001737] font-medium text-lg  mb-1 md:mb-0">
      Time Zone:
      </label>
    </div>
    <div className="md:w-full">
      <input className="bg-gray-200 appearance-none border-[1px] border-[#D5E3FF] rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"  type="text" />
    </div>
  </div>
  <div className="md:flex md:items-center mb-6">
    <div className="md:w-full">
      <label className=" text-[#001737] font-medium text-lg  mb-1 md:mb-0">
      Screen Orientation:
      </label>
    </div>
    <div className="md:w-full">
      <input className="bg-gray-200 appearance-none border-[1px] border-[#D5E3FF] rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" />
    </div>
  </div>
  <div className="md:flex md:items-center mb-6">
    <div className="md:w-full">
      <label className=" text-[#001737] font-medium text-lg  mb-1 md:mb-0">
      Screen Resolution:
      </label>
    </div>
    <div className="md:w-full">
      <input className="bg-gray-200 appearance-none border-[1px] border-[#D5E3FF] rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" />
    </div>
  </div>
  <div className="md:flex md:items-center mb-6">
    <div className="md:w-full">
      <label className=" text-[#001737] font-medium text-lg  mb-1 md:mb-0">
      Type:
      </label>
    </div>
    <div className="md:w-full">
      <input className="bg-gray-200 appearance-none border-[1px] border-[#D5E3FF] rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" />
    </div>
  </div>
  <div className="md:flex md:items-center mb-6">
    <div className="md:w-full">
      {/* <label className=" text-[#001737] font-medium text-lg  mb-1 md:mb-0">
      Type:
      </label> */}
    </div>
    <div className="md:w-full">
      <input className="bg-gray-200 appearance-none border-[1px] border-[#D5E3FF] rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" />
    </div>
  </div>
  <div className="md:flex md:items-center mb-6">
    <div className="md:w-full">
      <label className=" text-[#001737] font-medium text-lg  mb-1 md:mb-0">
      Tags:
      </label>
    </div>
    <div className="md:w-full">
      <input className="bg-gray-200 appearance-none border-[1px] border-[#D5E3FF] rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" />
    </div>
  </div>

  <div className="md:flex md:items-center">
    <div className="md:w-full"></div>
    <div className="md:w-full">
      <button className="shadow bg-primary focus:shadow-outline focus:outline-none text-white font-medium py-2 px-9 rounded-full" type="button">
      Save
      </button>
    </div>
  </div>
</form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewScreenDetail;
