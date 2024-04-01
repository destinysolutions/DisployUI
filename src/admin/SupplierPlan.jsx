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
          <div className="title">
            <h2 className="font-bold text-xl">Supplier Pricing Plans</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50 gap-1"
              onClick={() => setPlanModal(true)}
            >
              <SlCalender className="text-2xl mr-1" />
              Add New Plan
            </button>
          </div>

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
