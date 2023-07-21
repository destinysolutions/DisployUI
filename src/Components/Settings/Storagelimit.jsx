import React from 'react'
import { useState } from 'react';
import { FiFilter, FiEdit2 } from 'react-icons/fi'
const Storagelimit = () => {
    const [storagelimit, setshowstoragelimit] = useState([
        {
            id: 1,
            name: 'Dhara',
            email: 'Dhara@gmail.com',
            consumedspace: '3GB',
            availablespace: '3GB',
            allotspace: '3GB',
            statusEnabled: true,
        },
        {
            id: 2,
            name: 'Dhara',
            email: 'Dhara@gmail.com',
            consumedspace: '3GB',
            availablespace: '3GB',
            allotspace: '3GB',
            statusEnabled: false,
        },
    ]);
    const handleStatusToggle = (index) => {
        const updatedLimit = [...storagelimit];
        updatedLimit[index].statusEnabled = !updatedLimit[index].statusEnabled;
        setshowstoragelimit(updatedLimit);
    };
    return (
        <>
            <div className='overflow-x-auto'>
                <table className='w-full text-left rounded-xl' cellPadding={20}>
                    <thead>
                        <tr className='border-b border-b-[#E4E6FF] bg-[#EFF3FF]'>
                            <th className='text-[#5A5881] text-base font-semibold'><span className='flex items-center'>Customer Name <FiFilter className='ml-1 text-lg' /></span></th>
                            <th className='text-[#5A5881] text-base font-semibold text-center'><span className='flex items-center justify-center'>Phone Email <FiFilter className='ml-1 text-lg' /></span></th>
                            <th className='text-[#5A5881] text-base font-semibold'><span className='flex items-center justify-center'>Consumed
                                Space</span></th>
                            <th className='text-[#5A5881] text-base font-semibold'><div className='flex items-center justify-center'>Available
                                Space</div></th>
                            <th className='text-[#5A5881] text-base font-semibold'><div className='flex items-center justify-center'>Allot
                                Space</div></th>
                            <th className='text-[#5A5881] text-base font-semibold'><div className='flex items-center justify-center'>Status</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {storagelimit.map((limits, index) => (
                            <tr key={index} className='border-b border-b-[#E4E6FF]'>
                                <td className='text-[#5E5E5E]'>{limits.name}</td>
                                <td className='text-[#5E5E5E] text-center'>{limits.email}</td>
                                <td className='text-[#5E5E5E] text-center'><span style={{ background: '#E4E6FF', padding: '10px 15px', borderRadius: '5px' }}>{limits.consumedspace}</span></td>
                                <td className='text-[#5E5E5E] text-center'><span style={{ background: '#E4E6FF', padding: '10px 15px', borderRadius: '5px' }}>{limits.allotspace} </span></td>
                                <td className='text-[#5E5E5E] text-center'><span style={{ background: '#E4E6FF', padding: '10px 15px', borderRadius: '5px', display: 'inline-flex', alignItems: 'center' }}> {limits.availablespace} <FiEdit2 className=' text-sm ml-1' /></span> </td>
                                <td className='text-center'>
                                    <label className="inline-flex relative items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={limits.statusEnabled}
                                            onChange={() => handleStatusToggle(index)}
                                        />
                                        <div
                                            className={`w-10 h-5 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all ${limits.statusEnabled ? "bg-[#009618]" : "bg-red"
                                                }`}
                                        ></div>
                                    </label>
                                </td>


                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Storagelimit