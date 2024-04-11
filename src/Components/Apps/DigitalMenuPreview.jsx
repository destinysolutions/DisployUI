import React, { useRef } from 'react'
import digitalMenuLogo from "../../images/AppsImg/foods.svg";
import { Swiper, SwiperSlide } from 'swiper/react';
import "../../Styles/Swiper.css"
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const DigitalMenuPreview = ({ customizeData, PreviewData }) => {
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
                    <div className="lg:col-span-12 md:col-span-12 sm:col-span-12 xs:col-span-12 shadow-md bg-white rounded-lg p-5  items-center">
                        <Swiper
                            spaceBetween={30}
                            centeredSlides={true}
                            autoplay={{
                                delay: (customizeData?.EachPageTime * 1000),
                                disableOnInteraction: false,
                            }}
                            navigation={false}
                            modules={[Autoplay, Pagination, Navigation]}
                            onAutoplayTimeLeft={onAutoplayTimeLeft}
                            className="mySwiper"
                        >
                            {PreviewData?.map((category) => {
                                return (
                                    <div>
                                        {category?.allItem?.map((cate) => {
                                            return (
                                                <>
                                                    <SwiperSlide>
                                                        <div className='flex justify-between items-center border-b border-black'>
                                                            <span>
                                                                {category?.show ? category?.categoryname : ""}
                                                            </span>
                                                            <img src={digitalMenuLogo} className='mb-2 w-36 h-36' />
                                                        </div>
                                                        <div className='mt-2 grid grid-cols-12 gap-4'>
                                                            {cate?.list?.map((item, index) => {
                                                                return (
                                                                    <>
                                                                        <div className='lg:col-span-3 md:col-span-3 sm:col-span-6 xs:col-span-6 '>
                                                                            <div className="p-4 border border-gray-300 rounded-md h-full">
                                                                                <div className='flex justify-center'>
                                                                                    {item?.image ? (
                                                                                        <img src={item?.image?.assetFolderPath} className='w-36 h-36' />
                                                                                    ) : (
                                                                                        <img src={digitalMenuLogo} className='w-36 h-36' />
                                                                                    )}
                                                                                </div>

                                                                                <div className='flex justify-between gap-3 mx-5'>
                                                                                    <span>
                                                                                        {item?.name}
                                                                                    </span>
                                                                                    <span>
                                                                                        {item?.price}
                                                                                    </span>
                                                                                </div>
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
                            <div className="autoplay-progress" slot="container-end">
                                <svg viewBox="0 0 48 48" ref={progressCircle}>
                                    <circle cx="24" cy="24" r="20"></circle>
                                </svg>
                                <span ref={progressContent}></span>
                            </div>
                        </Swiper>

                    </div>
                </div>
            </div>
        </>
    )
}

export default DigitalMenuPreview
