import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../../Styles/assest.css';
import { BiLoaderCircle } from 'react-icons/bi'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { ALL_FILES_UPLOAD } from "../../Pages/Api";
const Pexels = ({ closeModal }) => {
    const [photos, setPhotos] = useState([]);
    const [media, setMedia] = useState([]);
    const [searchQuery, setSearchQuery] = useState('Nature');
    const [selectedMedia, setSelectedMedia] = useState({ images: [], videos: [] });
    const [uploadedMedia, setUploadedMedia] = useState({ images: [], videos: [] });
    const [selectedMediaType, setSelectedMediaType] = useState('images');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const API_KEY = 't8fp87NsuBPGQQ0c1LBDCTnPj02F509RretM2yQfaGBEEBzkGs022PCy';

        if (selectedMediaType === 'images') {
            axios
                .get(`https://api.pexels.com/v1/search?query=${searchQuery}&page=${currentPage}`, {
                    headers: {
                        Authorization: API_KEY,
                    },
                })
                .then((response) => {
                    setPhotos((prevPhotos) => [...prevPhotos, ...response.data.photos]);
                })
                .catch((error) => {
                    console.error('Error fetching images:', error);
                });
        } else if (selectedMediaType === 'videos') {
            axios
                .get(`https://api.pexels.com/videos/search?query=${searchQuery}&page=${currentPage}`, {
                    headers: {
                        Authorization: API_KEY,
                    },
                })
                .then((response) => {
                    setMedia((prevMedia) => [...prevMedia, ...response.data.videos]);
                })
                .catch((error) => {
                    console.error('Error fetching videos:', error);
                });
        }
    }, [searchQuery, selectedMediaType, currentPage]);
    const handleLoadMore = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };


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
        // Merge the selected images with the previously uploaded ones
        setUploadedMedia((prevUploadedMedia) => {
            return {
                ...prevUploadedMedia,
                images: [...prevUploadedMedia.images, ...selectedMedia.images],
                videos: [...prevUploadedMedia.videos, ...selectedMedia.videos],
            };
        });
    };

    // API

    const formData = new FormData();
    selectedMedia.images.forEach((imageId) => {
        const photo = photos.find((photo) => photo.id === imageId);
        formData.append('images[]', photo.src.medium);
    });

    // Append selected videos to FormData
    selectedMedia.videos.forEach((videoId) => {
        const video = media.find((item) => item.id === videoId);
        formData.append('videos[]', video.video_files[0].link);
    });
    const API_UPLOAD_URL = ALL_FILES_UPLOAD; // Replace with your API endpoint
    axios
        .post(API_UPLOAD_URL, formData)
        .then((response) => {

            console.log('Upload successful:', response.data);

            setSelectedMedia({ images: [], videos: [] });
        })
        .catch((error) => {
            console.error('Error uploading media:', error);
        });

    return (
        <>
            <div className='backdrop'>

                <div className='fixed unsplash-model bg-black lg:px-5 md:px-5 sm:px-3 xs:px-2 py-7 rounded-2xl '>
                    <button onClick={closeModal} className=' absolute right-3 top-3 text-2xl rounded-lg'><AiOutlineCloseCircle /></button>
                    <div className='text-center mb-5'>
                        <h1 className=' text-SlateBlue lg:text-3xl md:text-3xl sm:lg:text-xl xs:text-lg lg:mb-5 md:mb-5 sm:mb-3 xs:mb-2 font-medium'>Media from Pexels</h1>
                        <div className='border rounded-full bg-white max-w-sm  mx-auto flex items-center pexels-input'>
                            <select value={selectedMediaType} onChange={(e) => setSelectedMediaType(e.target.value)} className='py-2 bg-[#ebe7e7] mr-2 rounded-tl-3xl rounded-bl-3xl px-2'>
                                <option value="images">Images</option>
                                <option value="videos">Videos</option>
                            </select>
                            <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Enter search query..." className=" bg-[transparent] form-control-sm py-2 fs-4 text-capitalize w-full" />
                        </div>

                    </div>
                    {/* Conditional rendering based on selected media type */}
                    <div className='container mx-auto'>
                        <div >
                            {selectedMediaType === 'images' ? (
                                <div className="grid grid-cols-12 px-3 gap-4 unsplash-section bg-white rounded-lg">
                                    {photos.map((photo, index) => (
                                        <div key={`p${photo.id}_${index}`} className="lg:col-span-3 md:col-span-3 sm:col-span-6 xs:col-span-12 relative unsplash-box pt-2">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMedia.images.includes(photo.id)}
                                                    onChange={() => handleSelectMedia('images', photo.id)}
                                                    className='absolute top-3 left-3 z-10'
                                                />
                                                <img src={photo.src.medium} alt={photo.photographer} className="relative unsplash-img" />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-12 px-3 gap-4 unsplash-section bg-white rounded-lg">
                                    {media.map((item, index) => (
                                        <div key={`v${item.id}_${index}`} className="lg:col-span-3 md:col-span-3 sm:col-span-6 xs:col-span-12 relative  unsplash-box  pt-2">
                                            {/* Display videos with checkboxes */}
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMedia.videos.includes(item.id)}
                                                    onChange={() => handleSelectMedia('videos', item.id)}
                                                    className='absolute top-3 left-3 z-10'
                                                />
                                                <video width="100%" height="200px" controls className='relative unsplash-img'>
                                                    <source src={item.video_files[0].link} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}


                            <div className='text-center mt-5'>
                                <button onClick={handleLoadMore} className="text-[#8d8c8c] fs-3 my-4 flex items-center justify-center mx-auto"><BiLoaderCircle /> Load More</button>
                            </div>

                            <div className='text-center mt-5'>
                                <button onClick={handleUpload} className="bg-primary text-center p-2 rounded-md text-white fs-3">Upload Media</button>
                            </div>

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
