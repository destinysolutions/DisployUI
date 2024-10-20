import React from 'react'
import AdvertismentSidebar from './AdvertismentSidebar'
import AdvertismentNavbar from './AdvertismentNavbar'
import CustomerBookslot from '../Components/Common/PurchasePlan/CustomerBookslot'

export default function AddCustomerBookslot({ sidebarOpen, setSidebarOpen }) {
    return (
        <>
            <div className="flex border-b border-gray ">
                <AdvertismentSidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <AdvertismentNavbar />
            </div>
            <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain ">
                <CustomerBookslot sidebarOpen={sidebarOpen} />
            </div>
        </>
    )
}
