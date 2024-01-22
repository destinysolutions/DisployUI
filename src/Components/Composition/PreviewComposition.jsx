import React from 'react'
import Carousel from './DynamicCarousel'
import { RxCrossCircled } from 'react-icons/rx'
import PreviewModal from "./PreviewModel"
const PreviewComposition = ({ previewModalData, closeModal, loading, layotuDetails, modalVisible ,modalRef}) => {
    return (
        <PreviewModal show={modalVisible} onClose={closeModal}>
            <div
                className={`fixed left-1/2 -translate-x-1/2 min-h-[90vh] max-h-[90vh] min-w-[80vw] max-w-[80vw]`}
                ref={modalRef}
            >
                <div style={{ padding: "15px", backgroundColor: "white" }}>
                    <RxCrossCircled
                        className="fixed z-50 text-4xl p-1 m-2 rounded-full top-[-27px] right-[-23px] cursor-pointer bg-black text-white"
                        onClick={closeModal}
                    />

                    {!loading &&
                        layotuDetails?.lstLayloutModelList.length > 0 &&
                        layotuDetails?.lstLayloutModelList?.map((obj, index) => (
                            <div
                                key={index}
                                style={{
                                    position: "fixed",
                                    left: obj.leftside + "%",
                                    top: obj.topside + "%",
                                    width: obj?.width + "%",
                                    height: obj?.height + "%",
                                    // backgroundColor: obj.fill,
                                }}
                            >
                                {modalVisible && (
                                    <Carousel
                                        items={previewModalData[index][index + 1]}
                                        composition={obj}
                                    />
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </PreviewModal>
    )
}

export default PreviewComposition
