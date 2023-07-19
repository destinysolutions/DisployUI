import React from 'react'
import '../../Styles/Settings.css'
const ScreenAuthorize = () => {
    return (
        <>
            <div className="screen-authorize-section text-center">

                <h1 className='lg:text-base md:text-base sm:text-sm xs:text-sm text-primary font-medium'>Enter Visible to Authorize the Screen Code </h1>
                <div className="relative my-4">
                    <input type='text' placeholder='Enter Phone Number' name="phno" className="formInput w-full placeholder:text-center placeholder:text-gray lg:w-[450px] md:w-[350px] sm:w-full xs:w-full" />
                </div>
                <div className='col-span-12 text-center'>
                    <button className='hover:bg-white hover:text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full bg-primary text-white '>Verify</button>
                </div>

            </div>
        </>
    )
}

export default ScreenAuthorize
