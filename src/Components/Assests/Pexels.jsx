import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../../Styles/assest.css';
import { BiLoaderCircle } from 'react-icons/bi'
import { AiOutlineCloseCircle } from 'react-icons/ai'
const Pexels = ({ closeModal }) => {
    const [photos, setPhotos] = useState([]);
    const [media, setMedia] = useState([]);
    const [searchQuery, setSearchQuery] = useState('nature');
    const [selectedMedia, setSelectedMedia] = useState({ images: [], videos: [] });
    const [uploadedMedia, setUploadedMedia] = useState({ images: [], videos: [] });
    const [selectedMediaType, setSelectedMediaType] = useState('videos');

    useEffect(() => {
        const API_KEY = 't8fp87NsuBPGQQ0c1LBDCTnPj02F509RretM2yQfaGBEEBzkGs022PCy';

        if (selectedMediaType === 'videos') {
            axios
                .get(`https://api.pexels.com/videos/search?query=${searchQuery}`, {
                    headers: {
                        Authorization: API_KEY,
                    },
                })
                .then((response) => {
                    setMedia(response.data.videos);
                })
                .catch((error) => {
                    console.error('Error fetching videos:', error);
                });
        } else if (selectedMediaType === 'images') {
            axios
                .get(`https://api.pexels.com/v1/search?query=${searchQuery}`, {
                    headers: {
                        Authorization: API_KEY,
                    },
                })
                .then((response) => {
                    setPhotos(response.data.photos);
                })
                .catch((error) => {
                    console.error('Error fetching images:', error);
                });
        }
    }, [searchQuery, selectedMediaType]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSelectMedia = (mediaType, mediaId) => {
        setSelectedMedia((prevSelected) => {
            const prevSelectedMedia = prevSelected[mediaType];
            if (prevSelectedMedia.includes(mediaId)) {
                return {
                    ...prevSelected,
                    [mediaType]: prevSelectedMedia.filter((id) => id !== mediaId),
                };
            } else {
                return {
                    ...prevSelected,
                    [mediaType]: [...prevSelectedMedia, mediaId],
                };
            }
        });
    };

    const handleUpload = () => {
        // Simulate media upload by displaying selected media as uploaded
        setUploadedMedia(selectedMedia);
    };

    return (
        <>
            <div className='backdrop'>

                <div className='fixed unsplash-model bg-[#d5e3ff] lg:px-5 md:px-5 sm:px-3 xs:px-2 py-7 rounded-2xl '>
                    <button onClick={closeModal} className=' absolute right-3 top-3 text-2xl rounded-lg'><AiOutlineCloseCircle /></button>
                    <h1>Media from Pexels</h1>
                    <select value={selectedMediaType} onChange={(e) => setSelectedMediaType(e.target.value)}>
                        <option value="videos">Videos</option>
                        <option value="images">Images</option>
                    </select>
                    <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Enter search query..." />

                    {/* Conditional rendering based on selected media type */}
                    <div className='container mx-auto'>
                        <div >
                            {selectedMediaType === 'videos' ? (
                                <div className="grid grid-cols-12 px-3 gap-4 unsplash-section bg-white rounded-lg">
                                    {media.map((item) => (
                                        <div key={item.id} className="lg:col-span-3 md:col-span-3 sm:col-span-6 xs:col-span-12 relative unsplash-box pt-2">
                                            {/* Display videos with checkboxes */}
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMedia.videos.includes(item.id)}
                                                    onChange={() => handleSelectMedia('videos', item.id)}
                                                />
                                                <video width="320" height="240" controls>
                                                    <source src={item.video_files[0].divnk} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                                <p>Video by: {item.user.name}</p>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-12 px-3 gap-4 unsplash-section bg-white rounded-lg">
                                    {photos.map((photo) => (
                                        <div key={photo.id} className="lg:col-span-3 md:col-span-3 sm:col-span-6 xs:col-span-12 relative unsplash-box pt-2">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMedia.images.includes(photo.id)}
                                                    onChange={() => handleSelectMedia('images', photo.id)}
                                                />
                                                <img src={photo.src.medium} alt={photo.photographer} />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button onClick={handleUpload}>Upload Selected Media</button>

                            {/* Display selected media as uploaded */}
                            {uploadedMedia.images.length > 0 && (
                                <div>
                                    <h2>Uploaded Photos</h2>
                                    <ul>
                                        {uploadedMedia.images.map((photoId) => {
                                            const photo = photos.find((photo) => photo.id === photoId);
                                            return (
                                                <li key={photo.id}>
                                                    <img src={photo.src.medium} alt={photo.photographer} />
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}

                            {uploadedMedia.videos.length > 0 && (
                                <div>
                                    <h2>Uploaded Videos</h2>
                                    <ul>
                                        {uploadedMedia.videos.map((videoId) => {
                                            const video = media.find((item) => item.id === videoId);
                                            return (
                                                <li key={video.id}>
                                                    <video width="320" height="240" controls>
                                                        <source src={video.video_files[0].link} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                    <p>Video by: {video.user.name}</p>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Pexels;
