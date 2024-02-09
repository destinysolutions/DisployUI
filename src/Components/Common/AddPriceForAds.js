import { useState } from "react";



const AddPriceForRendAds = ({
    setOpenPriceAds,
    label,
    AddPriceAds
}) => {

    const [price, setPrice] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        AddPriceAds(price)
    };


    return (
        <>
            <div
                id="authentication-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
                <div className="relative p-4 w-full h-full flex items-center justify-center">
                    <div className="relative bg-slate-50 rounded-lg shadow-lg dark:bg-gray-700 w-[500px]">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {label}
                            </h3>
                            <button
                                onClick={() => setOpenPriceAds(false)}
                                type="button"
                                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-hide="authentication-modal"
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-4 md:p-5">
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Add Price
                                    </label>
                                    <input
                                        type="number"
                                        name="add_price"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Enter Per Screen Price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)} // Update price state on input change
                                    />
                                </div>
                                <button
                                    className="w-full  bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    type="submit" // Set button type to submit
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddPriceForRendAds