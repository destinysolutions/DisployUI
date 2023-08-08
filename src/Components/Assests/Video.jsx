import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import RecordRTC from 'recordrtc';

const VideoRecorder = () => {
    const webcamRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);

    const startRecording = () => {
        const recorder = new RecordRTC(webcamRef.current.stream, {
            type: 'video',
            mimeType: 'video/webm',
        });
        recorder.startRecording();
        setRecording(true);
    };

    const stopRecording = () => {
        webcamRef.current.stream.getTracks().forEach(track => track.stop());
        recorder.stopRecording(() => {
            const blobs = recorder.getBlob();
            setRecordedChunks([blobs]);
        });
        setRecording(false);
    };

    const downloadVideo = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'recorded-video.webm';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <Webcam audio={true} ref={webcamRef} />
            {recording ? (
                <button onClick={stopRecording}>Stop Recording</button>
            ) : (
                <button onClick={startRecording}>Start Recording</button>
            )}
            {recordedChunks.length > 0 && (
                <button onClick={downloadVideo}>Download Video</button>
            )}
        </div>
    );
};

export default VideoRecorder;
