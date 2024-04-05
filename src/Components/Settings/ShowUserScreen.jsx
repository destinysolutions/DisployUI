import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { RiUser3Fill } from "react-icons/ri";
const ShowUserScreen = ({ showUsersRef, setShowUsers, loading, userList }) => {
  return (
    <>
      <div>
        <div className="bg-black bg-opacity-20 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
          <div
            ref={showUsersRef}
            className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs"
          >
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col lg:w-[700px] bg-white outline-none focus:outline-none">
              <div className="relative w-full cursor-pointer z-40 rounded-full">
                <button
                  className="text-xl absolute -right-3 -top-4 bg-black text-white rounded-full"
                  onClick={() => {
                    setShowUsers(false);
                  }}
                >
                  <AiOutlineCloseCircle className="text-3xl" />
                </button>
              </div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg col-span-2 sm:col-span-2 max-h-325">
                <div className="overflow-x-scroll sc-scrollbar">
                  <table className="w-full p-4 rounded-lg" cellPadding={15}>
                    <thead>
                      <tr className="items-center table-head-bg">
                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                          UserName
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                          Role
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading && (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center font-semibold text-lg"
                          >
                            <div className="flex text-center m-5 justify-center">
                              <svg
                                aria-hidden="true"
                                role="status"
                                className="inline w-10 h-10 me-3 text-gray-200 animate-spin dark:text-gray-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="#1C64F2"
                                />
                              </svg>
                             
                            </div>
                          </td>
                        </tr>
                      )}
                      {!loading &&
                        userList?.length > 0 &&
                        userList?.map((item, index) => (
                          // {store?.getUserData?.map(
                          // (item, index) => (
                          <tr
                            key={index}
                            className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                          >
                            <td className="text-[#5E5E5E] text-center flex">
                              {item?.profilePhoto ? (
                                <img
                                  className="w-10 h-10 rounded-full"
                                  src={item?.profilePhoto}
                                  alt="Jese image"
                                />
                              ) : (
                                <RiUser3Fill className="w-10 h-10" />
                              )}
                              <div className="ps-3 flex text-center">
                                <div className="font-normal text-gray-500 mt-2">
                                  {item.firstName + " " + item.lastName}
                                </div>
                              </div>
                            </td>
                            <td className="text-[#5E5E5E] text-center">
                              {item?.userRoleName}
                            </td>
                            <td className="text-[#5E5E5E] text-center">
                              {item.isActive == 1 ? (
                                <span
                                  style={{
                                    backgroundColor: "#cee9d6",
                                  }}
                                  className=" text-xs bg-gray-300 hover:bg-gray-400 text-[#33d117] font-semibold px-4  text-green-800 me-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                >
                                  Active
                                </span>
                              ) : (
                                <span
                                  style={{
                                    backgroundColor: "#d1d5db",
                                  }}
                                  className="bg-[#FF0000] rounded-full px-6 py-1 text-white hover:bg-primary text-sm"
                                >
                                  Inactive
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      {!loading && userList?.length === 0 && (
                        <tr>
                          <td colSpan={6}>
                            <p className="text-center p-2">
                              No Users available.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowUserScreen;
