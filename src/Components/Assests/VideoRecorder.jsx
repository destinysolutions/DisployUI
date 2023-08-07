import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { BiVideoOff } from 'react-icons/bi'
import { AiOutlineVideoCamera } from "react-icons/ai";
import { FiCamera } from "react-icons/fi";
import { MdOutlineDownloading } from 'react-icons/md'
const VideoRecorder = () => {
    const webcamRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [videoBlob, setVideoBlob] = useState(null);

    const handleStartRecording = () => {
        setIsRecording(true);
        const mediaRecorder = new MediaRecorder(webcamRef.current.stream);
        const chunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            setIsRecording(false);
            const videoBlob = new Blob(chunks, { type: 'video/webm' });
            setVideoBlob(videoBlob);
        };

        mediaRecorder.start();
    };

    const handleStopRecording = () => {
        if (webcamRef.current) {
            webcamRef.current.stream.getTracks().forEach((track) => track.stop());
        }
    };

    const handleSwitchCamera = () => {
        if (webcamRef.current) {
            webcamRef.current.switchCamera();
        }
    };

    const handleSaveVideo = () => {
        if (videoBlob) {
            const videoUrl = URL.createObjectURL(videoBlob);
            // Save the video URL to your state or send it to the server for further processing.
        }
    };

    return (
        <div className='flex items-center justify-between'>
            <div>
                <Webcam
                    audio={true}
                    mirrored={false}
                    ref={webcamRef}
                    style={{ width: 640, height: 480 }}
                />
            </div>
            <div>
                {isRecording ? (
                    <button color="secondary" onClick={handleStopRecording}>
                        <BiVideoOff />
                    </button>
                ) : (
                    <button color="primary" onClick={handleStartRecording}>
                        <AiOutlineVideoCamera />
                    </button>
                )}
                <button onClick={handleSwitchCamera}>
                    <FiCamera />
                </button>
                {videoBlob && (
                    <button onClick={handleSaveVideo}>
                        <MdOutlineDownloading />
                    </button>
                )}
            </div>
        </div>
    );
};

export default VideoRecorder;
