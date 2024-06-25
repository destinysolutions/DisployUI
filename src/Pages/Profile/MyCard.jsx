import React, { useEffect, useState } from 'react'
import { DEFAULT_CARD, DELETE_CARD, GET_ALL_CARD } from '../Api';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { handleDefaultCard, handleDeleteCard } from '../../Redux/CardSlice';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { capitalizeFirstLetter, formatMonth } from '../../Components/Common/Common';

const MyCard = ({ fetchCards, cardList, setLoading }) => {
    const { user, token, userDetails } = useSelector((state) => state.root.auth);
    const authToken = `Bearer ${token}`;
    const dispatch = useDispatch();
    const handleDelete = (item) => {
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${DELETE_CARD}?CardId=${item?.paymentMethodID}`,
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken
            },
        }

        Swal.fire({
            title: "Delete Confirmation",
            text: "Are you sure you want to remove this Card?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "No, cancel",
            confirmButtonText: "Yes, I'm sure",
            customClass: {
                text: "swal-text-bold",
                content: "swal-text-color",
                confirmButton: "swal-confirm-button-color",
            },
            confirmButtonColor: "#ff0000",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true)
                dispatch(handleDeleteCard({ config })).then((res) => {
                    if (res?.payload?.status) {
                        toast.success(res?.payload?.message)
                        fetchCards()
                        setLoading(false)

                    }
                })
            }
        });
    }


    const handleDefault = (item) => {
        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${DEFAULT_CARD}?Email=${userDetails?.email}&CardId=${item?.paymentMethodID}`,
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken
            },
        }

        Swal.fire({
            title: "Delete Confirmation",
            text: "You want to set this Card As Default Payment?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "No, cancel",
            confirmButtonText: "Yes, I'm sure",
            customClass: {
                text: "swal-text-bold",
                content: "swal-text-color",
                confirmButton: "swal-confirm-button-color",
            },
            confirmButtonColor: "#ff0000",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true)
                dispatch(handleDefaultCard({ config })).then((res) => {
                    if (res?.payload?.status) {
                        toast.success(res?.payload?.message)
                        fetchCards()
                        setLoading(false)
                    } else {
                        setLoading(false)
                    }
                })
            }
        });
    }

    return (
        <>
            <div className="md:w-1/2 px-3">
                <h3 className="user-name mb-3">{cardList?.length > 0 ? "My Cards" : ""}</h3>
                {cardList?.length > 0 && cardList?.map((item, index) => {
                    return (
                        <div className="card-shadow px-5 py-3 mb-3" key={index}>
                            <div className="w-full flex justify-between">
                                <div className="card_detail">
                                    <img
                                        className="middle rounded-fullmiddle rounded-full"
                                        src="../../../Settings/logos_mastercard.svg"
                                        alt=""
                                    />
                                    <p className="text-gray-900 whitespace-no-wrap flex mb-2 gap-1 text-center items-center">
                                        <div>
                                            {item?.cardHolderName ? item?.cardHolderName : userDetails?.firstName + " " + userDetails?.lastName}
                                        </div>
                                        <div className="blue-btn ml-2 bg-blue-200 text-sm">
                                            {item?.isDefault ? "Primary" :"" }
                                        </div>
                                    </p>
                                    <p className="text-gray-900 whitespace-no-wrap flex-center-middle">
                                        {capitalizeFirstLetter(item?.funding)} Card **** **** **** {item?.cardNumber}
                                    </p>
                                </div>
                                <div className="card_btn_detail flex flex-col gap-3">
                                    <div className="flex justify-center gap-3">
                                    {!item?.isDefault && (
                                        <span className='bg-blue-200 cursor-pointer px-3 py-1.5 text-blue-600 rounded-full text-sm' onClick={() => handleDefault(item)}>Set as default</span>
                                    )}
                                        <button className="delete-btn cursor-pointer" onClick={() => handleDelete(item)}>Delete</button>
                                    </div>
                                    <p className="">Card expires at {formatMonth(item?.exp_month)}/{item?.exp_year}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}

            </div>

        </>
    )
}

export default MyCard
