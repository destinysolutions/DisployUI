import React from 'react'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'
import CustomerBookslot from '../Common/PurchasePlan/CustomerBookslot'


export default function AddBookYourSlot({ sidebarOpen, setSidebarOpen }) {

    return (
        <div>
            <div className="flex bg-white border-b border-gray">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>

            <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain ">
                <CustomerBookslot sidebarOpen={sidebarOpen} />
            </div>
        </div>
    )
}
