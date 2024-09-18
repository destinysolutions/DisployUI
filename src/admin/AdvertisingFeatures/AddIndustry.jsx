import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { AiOutlineClose, AiOutlineCloseCircle } from 'react-icons/ai'

export default function AddIndustry({ setShowIndustryModal, setindustryCategory, industryCategory, addIndustry, onClose, setIndustry, Editindustry }) {
    const inputRef = useRef(null);
    const [value, setvalue] = useState('');

    const handleAddTag = (e) => {
        e.preventDefault();

        if (!value.replace(/\s/g, "").length) {
            toast.remove();
            return toast.error("Please enter some text.");
        }


        setindustryCategory(prevState => [...prevState, { category: value }]);

        const payload = {
            "industryID": Editindustry?.industryID,
            "industryName": Editindustry?.industryName,
            "industryInclude": [...industryCategory, { category: value }]
        }
        addIndustry(payload)
        setvalue("");
    };

    return (
        <div>
            <div onClick={() => setShowIndustryModal(false)} className="inset-0 fixed z-9990 bg-black/50"></div>
            <div className=" bg-white z-9999 space-y-3 overflow-y-scroll hide_scrollbar fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 min-w-80vw max-h-[50vh] max-w-[50vw] min-h-[50vh] min-w-[50vw] p-5 rounded-lg">
                <div className="flex items-center justify-between w-full bg-white sticky -top-6 p-2">
                    <h3 className="text-left font-semibold text-base sticky top-0 bg-white w-full">
                        Add Includes
                    </h3>
                    <button onClick={() => onClose()}>
                        <AiOutlineCloseCircle className="text-2xl" />
                    </button>
                </div>
                <div className="flex items-center gap-3 flwro w-full h-full flex-wrap overflow-y-scroll hide_scrollbar">
                    <ul className="flex items-center gap-3 flex-wrap flex-initial h-full overflow-y-scroll hide_scrollbar">
                        {industryCategory?.length > 0 &&
                            industryCategory?.map((tag, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-1 border border-black/40 rounded-lg p-1"
                                >
                                    {tag?.category}
                                    <AiOutlineClose
                                        size={10}
                                        className=" cursor-pointer text-black w-5 h-5 bg-lightgray p-1"
                                    // onClick={() => handleDeleteTag(tag)}
                                    />
                                </li>
                            ))}
                    </ul>
                    <form
                        onSubmit={(e) => handleAddTag(e)}
                        className="flex-initial w-fit"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            className="border h-auto rounded-lg p-1 w-full"
                            onChange={(e) => setvalue(e.target.value)}
                            value={value}
                        />
                    </form>
                </div>
            </div>

        </div>
    )
}
