import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import '../../Styles/assest.css'
import { BsRecordCircle } from 'react-icons/bs'
import { MdOutlineStopCircle } from 'react-icons/md'
import { BiDownload } from "react-icons/bi";
import { TbCameraSelfie } from "react-icons/tb";
import { MdFlipCameraAndroid } from "react-icons/md";
const VideoRecorder = ({ closeModal, onVideoRecorded }) => {
    const webcamRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [facingMode, setFacingMode] = useState('user');
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const startRecording = () => {
        try {
            if (webcamRef.current) {
                const stream = webcamRef.current.stream;

                // Create a new MediaRecorder instance and save it to state
                const newMediaRecorder = new MediaRecorder(stream);
                newMediaRecorder.ondataavailable = handleDataAvailable;
                newMediaRecorder.start();

                // Save the MediaRecorder instance to state
                setMediaRecorder(newMediaRecorder);
                setRecording(true);
            }
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };



    const stopRecording = () => {
        try {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }
            setRecording(false);
        } catch (error) {
            console.error('Error stopping recording:', error);
        }
    };

    const constraints = {
        video: { facingMode: 'user' } // or 'environment' for the back camera
    };
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            // Use the new stream for recording
        })
        .catch((error) => {
            console.error('Error accessing camera:', error);
        });


    const toggleCamera = () => {
        setFacingMode((prevFacingMode) =>
            prevFacingMode === 'user' ? 'environment' : 'user'
        );
    };


    const handleDownload = () => {
        try {
            if (recordedBlob) {
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(recordedBlob);
                downloadLink.download = 'recorded_video.webm';
                downloadLink.click();
            }
        } catch (error) {
            console.error('Error handling download:', error);
        }
    };
    const handleDataAvailable = (event) => {
        if (event.data.size > 0) {
            setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
            const newBlob = new Blob([...recordedChunks, event.data], { type: 'video/webm' });
            setRecordedBlob(newBlob);
            onVideoRecorded(newBlob); // Send the new blob to the parent component
        }
    };
    return (
        <div>
            <div className='backdrop'>
                <div className='fixed unsplash-model bg-primary lg:px-5 md:px-5 sm:px-3 xs:px-2 pt-10 rounded-2xl lg:w-1/2 md:w-1/2 sm:w-4/5 xs:w-4/5  '>
                    <button
                        onClick={closeModal}
                        className='absolute right-3 top-3 text-2xl rounded-lg'
                    >
                        <AiOutlineCloseCircle />
                    </button>
                    <Webcam
                        audio={true}
                        videoConstraints={{ facingMode }}
                        ref={webcamRef}
                        mirrored={true}
                        className='videocanvas w-full'
                    />
                    <div className='my-5 relative'>
                        <div className='text-center relative'>
                            <button onClick={recording ? stopRecording : startRecording}>
                                {recording ? <MdOutlineStopCircle className='lg:text-6xl md:text-6xl sm:text-4xl xs:text-4xl text-red' /> : <BsRecordCircle className='lg:text-6xl md:text-6xl sm:text-4xl xs:text-4xl text-white' />}
                            </button>
                        </div>
                        <div className='text-right absolute right-0 top-2/4 -translate-y-1/2'>
                            <button onClick={toggleCamera}><MdFlipCameraAndroid className='lg:text-4xl md:text-4xl sm:text-2xl xs:text-2xl' /></button>
                            {recordedChunks.length > 0 && (
                                <button onClick={handleDownload} className='lg:text-4xl md:text-4xl sm:text-2xl xs:text-2xl ml-2'><BiDownload /></button>
                            )}
                        </div>

                    </div>
                    {/* Video element removed here */}
                </div>
            </div>
        </div>
    );
};

export default VideoRecorder;
