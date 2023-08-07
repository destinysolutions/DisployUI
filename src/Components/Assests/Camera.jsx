import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { AiOutlineCloseCircle } from 'react-icons/ai'

const Camera = ({ closeModal }) => {
    const webcamRef = useRef(null);
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);

    const captureFront = () => {
        const frontImageSrc = webcamRef.current.getScreenshot();
        setFrontImage(frontImageSrc);
    };

    const captureBack = () => {
        const backImageSrc = webcamRef.current.getScreenshot();
        setBackImage(backImageSrc);
    };

    return (
        <>
            <div className='backdrop'>

                <div className='fixed unsplash-model bg-lightgray lg:px-5 md:px-5 sm:px-3 xs:px-2 py-7 rounded-2xl '>
                    <button onClick={closeModal} className=' absolute right-3 top-3 text-2xl rounded-lg'><AiOutlineCloseCircle /></button>
                    <h2>Front Photo</h2>
                    <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
                    <button onClick={captureFront}>Capture Front Photo</button>
                    {frontImage && <img src={frontImage} alt="Front" />}

                    <h2>Back Photo</h2>
                    <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
                    <button onClick={captureBack}>Capture Back Photo</button>
                    {backImage && <img src={backImage} alt="Back" />}
                </div>
            </div>
        </>
    );
};

export default Camera;
