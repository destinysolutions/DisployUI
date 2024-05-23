import React, { useEffect, useState } from 'react'
import { DELETE_CARD, GET_ALL_CARD } from '../Api';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { GetAllCardList, handleDeleteCard } from '../../Redux/CardSlice';
import toast from 'react-hot-toast';

const MyCard = () => {
    const { user, token } = useSelector((state) => state.root.auth);
    const authToken = `Bearer ${token}`;
    const dispatch = useDispatch();
    const [cardList, setCardList] = useState([])

    const fetchCards = async () => {
        try {
            const config = {
                method: "get",
                maxBodyLength: Infinity,
                url: GET_ALL_CARD,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken
                },
            }
            dispatch(GetAllCardList({ config })).then((res) => {
                if (res?.payload?.status) {
                    setCardList(res?.payload?.data);
                }
            })
        } catch (error) {
            toast.error('Error fetching cards');
        }
    };

    useEffect(() => {
        fetchCards()
    }, [])

    const handleDelete = () => {
        try {
            const config = {
                method: "get",
                maxBodyLength: Infinity,
                url: `${DELETE_CARD}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken
                },
            }
            dispatch(handleDeleteCard({ config })).then((res) => {
                if (res?.payload?.status) {
                    setCardList(res?.payload?.data);
                }
            })
        } catch (error) {
            toast.error('Error fetching cards');
        }
    }

    return (
        <>
            <div className="md:w-1/2 px-3">
                <h3 className="user-name mb-3">My Cards</h3>
                <div className="card-shadow px-5 py-3 mb-3">
                    <div className="w-full flex justify-between">
                        <div className="card_detail">
                            <img
                                className="middle rounded-fullmiddle rounded-full"
                                src="../../../Settings/logos_mastercard.svg"
                                alt=""
                            />
                            <p className="text-gray-900 whitespace-no-wrap flex-center-middle my-2">
                                Tom McBride{" "}
                                <a href="#" className="blue-btn ml-2">
                                    Primary
                                </a>
                            </p>
                            <p className="text-gray-900 whitespace-no-wrap flex-center-middle">
                                Axis Bank **** **** **** 8395
                            </p>
                        </div>
                        <div className="card_btn_detail relative">
                            <div className="flex">
                                <button className="edit-btn me-3">Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete()}>Delete</button>
                            </div>
                            <p className="absolute bottom-0">Card expires at 10/27</p>
                        </div>
                    </div>
                </div>
                <div className="card-shadow px-5 py-3">
                    <div className="w-full flex justify-between">
                        <div className="card_detail">
                            <img
                                className="middle rounded-fullmiddle rounded-full"
                                src="../../../Settings/logos_mastercard.svg"
                                alt=""
                            />
                            <p className="text-gray-900 whitespace-no-wrap flex-center-middle my-2">
                                Tom McBride{" "}
                                <a href="#" className="blue-btn ml-2">
                                    Primary
                                </a>
                            </p>
                            <p className="text-gray-900 whitespace-no-wrap flex-center-middle">
                                Axis Bank **** **** **** 8395
                            </p>
                        </div>
                        <div className="card_btn_detail relative">
                            <div className="flex">
                                <button className="edit-btn me-3">Edit</button>
                                <button className="delete-btn">Delete</button>
                            </div>
                            <p className="absolute bottom-0">Card expires at 10/27</p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default MyCard
