import React, { useRef } from 'react'
import digitalMenuLogo from "../../images/AppsImg/foods.svg";
import { Swiper, SwiperSlide } from 'swiper/react';
import "../../Styles/Swiper.css"
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const DigitalMenuPreview = ({ customizeData, PreviewData, selectedColor }) => {
    const progressCircle = useRef(null);
    const progressContent = useRef(null);
    const onAutoplayTimeLeft = (s, time, progress) => {
        progressCircle.current.style.setProperty('--progress', 1 - progress);
        progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    };
    return (
        <>
            <div className="mt-6">
                <div className="grid grid-cols-12 gap-4 h-full">
                    <div className={`lg:col-span-12 md:col-span-12 sm:col-span-12 xs:col-span-12 shadow-md rounded-lg p-5  items-center`} style={{ backgroundColor: selectedColor }}>
                        <Swiper
                            spaceBetween={30}
                            centeredSlides={true}
                            autoplay={{
                                delay: (customizeData?.EachPageTime * 1000),
                                disableOnInteraction: false,
                            }}
                            navigation={false}
                            modules={[Autoplay, Pagination, Navigation]}
                            onAutoplayTimeLeft={PreviewData?.length > 1 && onAutoplayTimeLeft}
                            className="mySwiper"
                        >
                            {PreviewData?.map((category) => {
                                return (
                                    <div>
                                        {category?.allItem?.map((cate) => {
                                            return (
                                                <>
                                                    <SwiperSlide style={{ backgroundColor: selectedColor }}>
                                                        <div className='flex justify-between h-36 items-center border-b border-black'>
                                                            <span>
                                                                {category?.show ? category?.categoryname : ""}
                                                            </span>
                                                            {/*<img src={digitalMenuLogo} className='mb-2 w-36 h-36' />*/}
                                                        </div>
                                                        <div className='mt-2 grid grid-cols-12 gap-4'>
                                                            {cate?.list?.map((item, index) => {
                                                                return (
                                                                    <>
                                                                        <div className='lg:col-span-3 md:col-span-3 sm:col-span-6 xs:col-span-6'>
                                                                            <div className="p-4 border border-gray-300 rounded-md h-full shadow-md">
                                                                                {item?.features && (
                                                                                    <div className="text-center text-sm text-gray-600 uppercase font-semibold mb-2">
                                                                                        <span className="bg-yellow-400 py-1 px-2 rounded-md">Top Feature</span>
                                                                                    </div>
                                                                                )}

                                                                                <div className='flex justify-center'>
                                                                                    <img
                                                                                        src={item?.image ? item?.image?.assetFolderPath : digitalMenuLogo}
                                                                                        alt={item?.name}
                                                                                        className='w-36 h-36 object-cover rounded-md'
                                                                                    />
                                                                                </div>

                                                                                <div className='flex justify-between items-center mt-3'>
                                                                                    <span className="text-lg font-semibold">{item?.name}</span>
                                                                                    {customizeData?.ShowPrice && (
                                                                                        <span className="text-base font-normal text-gray-600">{customizeData?.CurrencyShow ? "$" : ""}{item?.price ? item?.price : "0.00"}</span>
                                                                                    )}
                                                                                </div>
                                                                                {item?.soldOut && (
                                                                                    <div className='text-center text-2xl text-rose-600 mt-2'>
                                                                                        Sold Out
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                    </>
                                                                )
                                                            })
                                                            }
                                                        </div>
                                                    </SwiperSlide>
                                                </>
                                            )
                                        })}

                                    </div>
                                )
                            })}
                            {PreviewData?.length > 1 && (
                                <div className="autoplay-progress" slot="container-end">
                                    <svg viewBox="0 0 48 48" ref={progressCircle}>
                                        <circle cx="24" cy="24" r="20"></circle>
                                    </svg>
                                    <span ref={progressContent}></span>
                                </div>
                            )}
                        </Swiper>

                    </div>
                </div>
            </div>
        </>
    )
}

export default DigitalMenuPreview
