import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import './../../Styles/assest.css';
import { BiLoaderCircle } from 'react-icons/bi'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import axios from "axios";
const API_UPLOAD_URL = "http://192.168.1.219/api/ImageVideoDoc/ImageVideoDocUpload";
const Unsplash = ({ closeModal, onSelectedImages }) => {
    const [img, setImg] = useState("Natural");
    const [res, setRes] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    // const [fileData, setFileData] = useState([]);

    const API_KEY = "Sgv-wti48nSLfRjYsH7lmH_8N3wjzC18ccTYFxBzxmw";

    const fetchRequest = async (query, page = 1) => {
        const data = await fetch(
            `https://api.unsplash.com/search/photos?page=${page}&query=${encodeURIComponent(
                query.toLowerCase()
            )}&client_id=${API_KEY}`
        );
        const dataJ = await data.json();
        const result = dataJ.results;
        console.log(result);

        if (page === 1) {
            // Reset the state for the current page when page is 1
            setCurrentPage(2);
            setRes(result);
        } else {
            setRes((prevResults) => [...prevResults, ...result]);
            setCurrentPage(page + 1); // Update the current page for the next request
        }
    };
    useEffect(() => {
        fetchRequest(img);
    }, [img]);
    useEffect(() => {
        onSelectedImages(selectedImages);
    }, [selectedImages]);

    const handleImageSelect = (imageId) => {
        setSelectedImages((prevSelected) =>
            prevSelected.includes(imageId)
                ? prevSelected.filter((imgId) => imgId !== imageId)
                : [...prevSelected, imageId]
        );
    };


    const handleImageUpload = () => {
        onSelectedImages(selectedImages);
        closeModal();
    };

    const handleLoadMore = () => {

        fetchRequest(img, currentPage);
    };
    // api

    // const handleImageUpload = async () => {
    //     try {
    //         selectedImages.forEach((image) => {
    //             const formData = new FormData();

    //             const details = "Some Details about the file";
    //             const CategorieType = getContentType(image.type);

    //             axios.get(image.urls.small, { responseType: 'blob' })
    //                 .then(response => {
    //                     const imageBlob = response.data;
    //                     const fileName = image.urls.small.split('/').pop();

    //                     formData.append("File", imageBlob, fileName);
    //                     formData.append("operation", "Insert");
    //                     formData.append("CategorieType", CategorieType);
    //                     formData.append("details", details);

    //                     axios.post(API_UPLOAD_URL, formData)
    //                         .then((response) => {
    //                             console.log("Upload data in API:", response.data);
    //                         })
    //                         .catch((error) => {
    //                             console.error("Upload Error:", error);
    //                         });
    //                 })
    //                 .catch(error => {
    //                     console.error("Error fetching image:", error);
    //                 });
    //         });

    //         // Close the modal
    //         closeModal();
    //     } catch (error) {
    //         // Handle error here
    //         console.error('Error uploading images:', error);
    //     }
    // };
    // const getContentType = (mime) => {
    //     if (!mime) {
    //         return "file content type not found";
    //     }

    //     if (mime.startsWith("image/")) {
    //         return "Image";
    //     } else if (mime.startsWith("video/")) {
    //         return "Video";
    //     } else if (
    //         mime.startsWith("application/pdf") ||
    //         mime.startsWith("text/") ||
    //         mime === "application/msword" ||
    //         mime === "application/vnd.ms-excel" ||
    //         mime ===
    //         "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    //     ) {
    //         return "DOC";
    //     } else {
    //         return "file content type not found";
    //     }
    // };


    return (
        <>
            <div className='backdrop'>
                <div className='fixed unsplash-model bg-primary lg:px-5 md:px-5 sm:px-3 xs:px-2 py-7 rounded-2xl'>
                    <button onClick={closeModal} className=' absolute right-3 top-3 text-2xl rounded-lg'><AiOutlineCloseCircle className=' text-SlateBlue' /></button>
                    <div className='text-center '>
                        <h1 className=' text-SlateBlue lg:text-3xl md:text-3xl sm:lg:text-xl xs:text-lg lg:mb-5 md:mb-5 sm:mb-3 xs:mb-2 font-medium'>Search Images from Unsplash</h1>
                        <input
                            className="form-control-sm py-2 fs-4 text-capitalize border border-3 border-dark unspalsh-searchbox"
                            type="text"
                            placeholder="Search Anything..."
                            value={img}
                            onChange={(e) => setImg(e.target.value)}
                        />
                    </div>
                    <div className='container mx-auto'>
                        <div className="grid grid-cols-12 px-3 gap-4 unsplash-section bg-white rounded-lg">
                            {res.map((val) => {
                                const isSelected = selectedImages.includes(val.urls.small);
                                return (
                                    <div key={val.id} className="lg:col-span-3 md:col-span-3 sm:col-span-6 xs:col-span-12 relative unsplash-box pt-2">
                                        <label className='relative'>
                                            <input
                                                type="checkbox"
                                                checked={selectedImages.includes(val.id)}
                                                className=' absolute top-3 left-3 z-10 '
                                                onChange={() => handleImageSelect(val.id)}
                                            />

                                            <img
                                                className="relative unsplash-img"
                                                src={val.urls.small}
                                                alt={val.alt_description}
                                            />
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className='text-center '>

                        <div className='text-center '>

                            {res.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleLoadMore}
                                    className="text-[#8d8c8c] fs-3 my-4 flex items-center justify-center mx-auto"
                                >
                                    <BiLoaderCircle /> Load More
                                </button>
                            )}
                        </div>
                    </div>
                    <div className='text-center mt-5'>
                        <button
                            type="button"
                            onClick={handleImageUpload}
                            className="bg-primary text-center p-2 rounded-md text-white fs-3"
                        >
                            Upload Images
                        </button>
                    </div>
                    <ul>
                        {uploadedImages.map((image) => (
                            <li key={image.id}>
                                <img src={image.url} alt="Uploaded" />
                            </li>
                        ))}
                    </ul>

                </div>

            </div>
        </>
    );
};


export default Unsplash