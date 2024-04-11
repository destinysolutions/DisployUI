import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'

const ViewPlan = ({ toggleModal, selectPlan }) => {
    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="relative p-4 w-full max-w-xl max-h-full">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600 ">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {selectPlan?.planName} Plan
                            </h3>
                            <AiOutlineCloseCircle
                                className="text-4xl text-primary cursor-pointer"
                                onClick={() => toggleModal()}
                            />
                        </div>
                        <div className='p-4 xs:p-2'>
                        <table
                                    className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                                    cellPadding={15}
                                >
                                    <thead className="sticky z-10 top-0 items-center table-head-bg">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                                                Feature Name
                                            </th>
                                            <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                                                Value
                                            </th>
                                        </tr>
                                    </thead>
                                    </table>
                            <div className="rounded-xl max-h-96 vertical-scroll-inner sm:rounded-lg">
                                <table
                                    className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                                    cellPadding={15}
                                >
                                    
                                    <tbody>
                                        {selectPlan?.planDetails?.map((item) => {
                                            return (item?.lstOfFeatures?.map((detail) => {
                                                return (
                                                    <tr className="border-b border-gray-200 bg-white">
                                                        <td className="px-5 py-3 text-lg">
                                                            <p className="text-gray-900 whitespace-no-wrap">
                                                                {detail?.name}
                                                            </p>
                                                        </td>
                                                        <td className="px-5 py-3 text-lg">
                                                            <p className="text-gray-900 whitespace-no-wrap">{detail?.value}</p>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            )})}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewPlan
