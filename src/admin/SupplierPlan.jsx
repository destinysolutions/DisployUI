import React, { useState } from 'react'
import { SlCalender } from 'react-icons/sl';
import AddSuppliarPlan from './AddSuppliarPlan';

const SupplierPlan = () => {
  const [planModel, setPlanModal] = useState(false);
  const [planDetail, setPlanDetail] = useState({
    planName: "",
    cost: "",
    isActive: false
  })
  const [error, setError] = useState({
    planName: false,
    cost: false
  });

  const handleNewSupllierPlan = () => {
    let errorFound = false;
    if (!planDetail.planName) {
      setError({
        ...error,
        planName: true
      });
      errorFound = true;
    }
    if (!planDetail.cost) {
      setError({
        ...error,
        cost: true
      });
      errorFound = true;
    }

    if (errorFound) {
      return;
    }

  }

  return (
    <>
      <div className='lg:p-5 md:p-5 sm:p-2 xs:p-2'>
        <div className="flex items-center justify-between mx-2 mb-5">
          <h1 className="font-medium lg:text-2xl md:text-2xl sm:text-xl">
            Supplier Pricing Plans
          </h1>

          <div className="flex items-center gap-2">
            <button
              className="flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50 gap-1"
              onClick={() => setPlanModal(true)}
            >
              <SlCalender className="text-2xl mr-1" />
              Add New Custom Plan
            </button>
          </div>
        </div>
        <div className="rounded-xl mt-5 overflow-x-scroll sc-scrollbar sm:rounded-lg">
          <table
            className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
            cellPadding={15}
          >
            <thead className="items-center table-head-bg">
              <tr>
                <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                  Plan Name
                </th>
                <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                  Cost
                </th>
                <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                  Status
                </th>

              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 bg-white">
                <td className="px-5 py-3 text-lg">
                  <p className="text-gray-900 whitespace-no-wrap">
                    Lavern Laboy
                  </p>
                </td>
                <td className="px-5 py-3 text-lg">
                  <p className="text-gray-900 whitespace-no-wrap">$5875</p>
                </td>
                <td className="px-5 py-3 text-lg">
                  <span className="relative inline-block px-3 py-1 font-semibold bg-orange-200 text-orange-400 leading-tight rounded-full">
                    Pending
                  </span>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

      </div>
      {planModel && (
        <AddSuppliarPlan
          planModel={planModel}
          setPlanModal={setPlanModal}
          setPlanDetail={setPlanDetail}
          planDetail={planDetail}
          handleNewSupllierPlan={handleNewSupllierPlan}
          error={error}
        />
      )}
    </>
  )
}

export default SupplierPlan
