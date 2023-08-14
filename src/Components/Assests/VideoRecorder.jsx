import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import '../../Styles/assest.css'
import { BsRecordCircle } from 'react-icons/bs'
import { MdOutlineStopCircle } from 'react-icons/md'
import { BiDownload } from "react-icons/bi";
import { TbCameraSelfie } from "react-icons/tb";
import { MdFlipCameraAndroid } from "react-icons/md";
import axios from 'axios';
import { ALL_FILES_UPLOAD } from '../../Pages/Api';

const VideoRecorder = ({ closeModal, onVideoRecorded }) => {

    const webcamRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [recordedChunksList, setRecordedChunksList] = useState([]);
    const [facingMode, setFacingMode] = useState('user');
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const startRecording = () => {
        try {
            if (webcamRef.current) {
                const stream = webcamRef.current.stream;
                const newMediaRecorder = new MediaRecorder(stream);
                newMediaRecorder.ondataavailable = handleDataAvailable(newMediaRecorder);
                newMediaRecorder.start();
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

    const toggleCamera = () => {
        setFacingMode((prevFacingMode) =>
            prevFacingMode === 'user' ? 'environment' : 'user'
        );
    };

    const handleDownload = () => {
        try {
            if (recordedChunksList.length > 0) {
                const combinedChunks = recordedChunksList.flatMap(
                    (recording) => recording.chunks
                );
                const combinedBlob = new Blob(combinedChunks, {
                    type: 'video/webm',
                });

                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(combinedBlob);
                downloadLink.download = 'recorded_video.webm';
                downloadLink.click();
            }
        } catch (error) {
            console.error('Error handling download:', error);
        }
    };
    const sendDataToApi = async (videoBlob) => {
        try {
            const uniqueFileName = `recorded_video_${Date.now()}.webm`; // Generate a unique file name with timestamp
            const formData = new FormData();
            formData.append('File', videoBlob, uniqueFileName); // Use the unique file name
            formData.append('operation', 'Insert');
            formData.append('CategorieType', 'Video');
            formData.append('details', 'Video Uploaded');

            const response = await axios.post(
                ALL_FILES_UPLOAD,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('API response:', response.data);
        } catch (error) {
            console.error('Error sending data to API:', error);
        }
    };

    const handleDataAvailable = (recorderIndex) => (event) => {
        if (event.data.size > 0) {
            const newChunk = event.data;
            setRecordedChunksList((prevRecordings) => {
                const existingRecording = prevRecordings.find((recording, index) => index === recorderIndex);

                if (existingRecording) {
                    return prevRecordings.map((recording, index) =>
                        index === recorderIndex
                            ? { ...recording, chunks: [...recording.chunks, newChunk] }
                            : recording
                    );
                } else {
                    return [...prevRecordings, { recorder: recorderIndex, chunks: [newChunk] }];
                }
            });

            sendDataToApi(newChunk);
        }
    };

    return (
        <div>
            <div className='backdrop'>
                <div className='fixed unsplash-model bg-primary lg:px-5 md:px-5 sm:px-3 xs:px-2 pt-10 rounded-2xl lg:w-1/2 md:w-1/2 sm:w-4/5 xs:w-4/5  '>
                    <button
                        onClick={closeModal}
                        className='absolute right-3 top-3 text-2xl rounded-lg text-SlateBlue'
                    >
                        <AiOutlineCloseCircle />
                    </button>
                    <Webcam
                        audio={true}
                        videoConstraints={{ facingMode: facingMode }}
                        ref={webcamRef}
                        className='videocanvas w-full'
                    />

                    <div className='my-5 relative'>
                        <div className='text-center relative'>
                            <button onClick={recording ? stopRecording : startRecording}>
                                {recording ? <MdOutlineStopCircle className='lg:text-6xl md:text-6xl sm:text-4xl xs:text-4xl text-red' /> : <BsRecordCircle className='lg:text-6xl md:text-6xl sm:text-4xl xs:text-4xl text-white' />}
                            </button>
                        </div>
                        <div className='text-right absolute right-0 top-2/4 -translate-y-1/2'>


                            <button onClick={toggleCamera}>
                                {facingMode === 'user' ? (
                                    <TbCameraSelfie className='lg:text-4xl md:text-4xl sm:text-2xl xs:text-2xl text-SlateBlue' />
                                ) : (
                                    <MdFlipCameraAndroid className='lg:text-4xl md:text-4xl sm:text-2xl xs:text-2xl text-SlateBlue' />
                                )}
                            </button>

                            {recordedChunksList.length > 0 && (
                                <button onClick={handleDownload} className='lg:text-4xl md:text-4xl sm:text-2xl xs:text-2xl ml-2'>
                                    <BiDownload className=' text-SlateBlue' />
                                </button>
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
