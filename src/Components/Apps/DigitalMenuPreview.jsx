import React, { useRef, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import digitalMenuLogo from "../../images/AppsImg/foods.svg";
import { Swiper, SwiperSlide } from 'swiper/react';
import "../../Styles/Swiper.css"
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { toPng } from 'html-to-image';

const DigitalMenuPreview = forwardRef(({ customizeData, PreviewData, selectedColor, priceColor, textColor, theme, onImagesGenerated }, ref) => {
    const progressCircle = useRef(null);
    const progressContent = useRef(null);
    const htmlElementRef = useRef(null);

    useImperativeHandle(ref, () => ({
        generateImages: handleGenerateImages
    }));

    const onAutoplayTimeLeft = (s, time, progress) => {
        progressCircle.current.style.setProperty('--progress', 1 - progress);
        progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    };

    const handleGenerateImages = async () => {
        const images = [];
        const swiperSlides = document.querySelectorAll('.swiper-slide');
        for (let i = 0; i < swiperSlides.length; i++) {
            const slide = swiperSlides[i];
            try {
                const dataUrl = await toPng(slide, { cacheBust: true, useCORS: true });
                images.push(dataUrl);
            } catch (error) {
                console.error('Error generating image:', error);
            }
        }
        onImagesGenerated(images); // Pass images back to parent
    };

    return (
        <div className="mt-6">
            <div className="grid grid-cols-12 gap-4 h-full">
                <div ref={htmlElementRef} className={`lg:col-span-12 md:col-span-12 sm:col-span-12 xs:col-span-12 shadow-md rounded-lg items-center`} style={{ backgroundColor: theme?.posThemePath ? "none" : selectedColor, backgroundImage: theme?.posThemePath ? `url(${theme.posThemePath})` : "none", backgroundSize: "cover" }}>
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
                                                <SwiperSlide className='p-5 rounded-lg' style={{ backgroundColor: theme?.posThemePath ? "none" : selectedColor, backgroundImage: theme?.posThemePath ? `url(${theme.posThemePath})` : "none", backgroundSize: "cover" }}>
                                                    <div className={`flex justify-between h-36 items-center border-b-2 ${(theme?.posThemeID === 1 || theme?.posThemeID === 3 || theme?.posThemeID === 5) ? "border-black" : "border-gray-300"}`}>
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
                                                                        <div className={`p-4 border-2 ${(theme?.posThemeID === 1 || theme?.posThemeID === 3 || theme?.posThemeID === 5) ? "border-black" : "border-gray-300"} rounded-md h-full shadow-md`}>
                                                                            <div className='flex justify-center relative w-36 h-36 mx-auto overflow-hidden border border-white rounded-full'>
                                                                                <img
                                                                                    src={item?.image ? item?.image?.assetFolderPath : digitalMenuLogo}
                                                                                    alt={item?.name}
                                                                                    className='w-full object-cover rounded-md'
                                                                                />
                                                                                {item?.soldOut && (
                                                                                    <div className='sold-out text-center text-2xl bg-rose-600 text-white mt-2 absolute top-0 left-0'>
                                                                                        Sold Out
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            <div className='w-full pt-5'>{item?.features && (
                                                                                <div className="text-center text-sm text-gray-600 uppercase font-semibold mb-2">
                                                                                    <span className="bg-yellow-400 py-1 px-2 rounded-md">Top Feature</span>
                                                                                </div>
                                                                            )}</div>

                                                                            <div className='flex justify-between items-center mt-3'>
                                                                                <div className='flex flex-col'>
                                                                                    <span
                                                                                        className="text-xl font-semibold"
                                                                                        style={{
                                                                                            color: textColor
                                                                                        }}
                                                                                    >
                                                                                        {item?.name}
                                                                                    </span>
                                                                                    <span
                                                                                        className="text-base"
                                                                                        style={{
                                                                                            color: textColor
                                                                                        }}
                                                                                    >
                                                                                        {item?.description}
                                                                                    </span>
                                                                                </div>
                                                                                <div className='flex flex-col'>
                                                                                    {customizeData?.ShowPrice && (
                                                                                        <span
                                                                                            className="text-lg font-normal text-gray-600"
                                                                                            style={{
                                                                                                color: priceColor
                                                                                            }}
                                                                                        >
                                                                                            {customizeData?.CurrencyShow ?
                                                                                                customizeData?.Currency === "GBP"
                                                                                                    ? "£"
                                                                                                    : customizeData?.Currency === "USD"
                                                                                                        ? "$"
                                                                                                        : ""
                                                                                                : ""}
                                                                                            {item?.price ? `${item?.price}.00` : "0.00"}
                                                                                            {customizeData?.CurrencyShow ?
                                                                                                customizeData?.Currency === "EUR" ? "€" : ""
                                                                                                : ""
                                                                                            }
                                                                                        </span>
                                                                                    )}
                                                                                    <span className='text-base text-slate-400'>
                                                                                        {item?.calories ? `${item?.calories}cal` : ""}
                                                                                    </span>
                                                                                </div>
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
    );
});

export default DigitalMenuPreview;
