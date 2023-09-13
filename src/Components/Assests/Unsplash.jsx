import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "./../../Styles/assest.css";
import { BiLoaderCircle } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import { ALL_FILES_UPLOAD } from "../../Pages/Api";

import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";

const Unsplash = ({ closeModal, onSelectedImages }) => {
  const [img, setImg] = useState("Natural");
  const [res, setRes] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState({});
  const API_KEY = "Sgv-wti48nSLfRjYsH7lmH_8N3wjzC18ccTYFxBzxmw";
  const navigate = useNavigate();

  const fetchRequest = async (query, page = 1) => {
    const data = await fetch(
      `https://api.unsplash.com/search/photos?page=${page}&query=${encodeURIComponent(
        query.toLowerCase()
      )}&client_id=${API_KEY}`
    );
    const dataJ = await data.json();
    const result = dataJ.results;

    if (page === 1) {
      setCurrentPage(2);
      setRes(result);
    } else {
      setRes((prevResults) => [...prevResults, ...result]);
      setCurrentPage(page + 1);
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
  const handleLoadMore = () => {
    fetchRequest(img, currentPage);
  };
  const [imageUploadStatus, setImageUploadStatus] = useState({});
  const handleImageUpload = () => {
    setUploadInProgress(true);
    selectedImages.forEach((image) => {
      const formData = new FormData();
      const details = "Some Details about the file";
      formData.append("FileType", image.urls.full);
      formData.append("operation", "Insert");
      formData.append("CategorieType", "OnlineImage");
      formData.append("details", details);
      formData.append("name", image.alt_description);
      formData.append("resolutions", `${image.height}*${image.width}`);
      setImageUploadProgress((prevProgress) => ({
        ...prevProgress,
        [image.id]: 0,
      }));
      axios
        .post(ALL_FILES_UPLOAD, formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setImageUploadProgress((prevProgress) => ({
              ...prevProgress,
              [image.id]: progress,
            }));
          },
        })

        .then((response) => {
          console.log("Upload Success:", response.data);
          setImageUploadStatus((prevStatus) => ({
            ...prevStatus,
            [image.id]: "success",
          }));
          navigate("/assets");
        })
        .catch((error) => {
          console.error("Upload Error:", error);
          setImageUploadStatus((prevStatus) => ({
            ...prevStatus,
            [image.id]: "error",
          }));
        })
        .finally(() => {
          if (
            selectedImages.every(
              (img) => imageUploadStatus[img.id] === "success"
            )
          ) {
            setUploadInProgress(false);
          }
        });
    });
  };

  useEffect(() => {
    const allImagesUploaded = selectedImages.every(
      (img) => imageUploadProgress[img.id] === 100
    );

    if (allImagesUploaded) {
      // Introduce a delay before setting uploadInProgress to false
      setTimeout(() => {
        setUploadInProgress(false);
      }, 5000);
    }
  }, [selectedImages, imageUploadProgress]);
  const handleDeleteImage = (imageId) => {
    setSelectedImages((prevSelected) =>
      prevSelected.filter((img) => img.id !== imageId)
    );
  };

  return (
    <>
      <div className="backdrop">
        <div className="fixed unsplash-model bg-primary lg:px-5 md:px-5 sm:px-3 xs:px-2 py-7 rounded-2xl">
          <button
            onClick={closeModal}
            className=" absolute right-3 top-3 text-2xl rounded-lg"
          >
            <AiOutlineCloseCircle className=" text-SlateBlue" />
          </button>
          <div className="text-center ">
            <h1 className=" text-SlateBlue lg:text-3xl md:text-3xl sm:lg:text-xl xs:text-lg lg:mb-5 md:mb-5 sm:mb-3 xs:mb-2 font-medium">
              Search Images from Unsplash
            </h1>
            <input
              className="form-control-sm py-2 fs-4 text-capitalize border border-3 border-dark unspalsh-searchbox"
              type="text"
              placeholder="Search Anything..."
              value={img}
              onChange={(e) => setImg(e.target.value)}
            />
          </div>
          <div className="container mx-auto">
            <div className="grid grid-cols-12 px-3 gap-4 unsplash-section bg-white rounded-lg">
              {res.map((val) => {
                return (
                  <div
                    key={val.id}
                    className="lg:col-span-3 md:col-span-3 sm:col-span-6 xs:col-span-12 relative unsplash-box"
                    onClick={() => handleImageSelect(val)}
                    style={{
                      border: selectedImages.includes(val)
                        ? "2px solid blue"
                        : "2px solid white",
                    }}
                  >
                    <img
                      className="relative unsplash-img"
                      src={val.urls.full}
                      alt={val.alt_description}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Display selected image previews with name and size */}

          {/* Display progress bars */}
          <div className="  bg-white shadow-2xl max-w-xs">
            {uploadInProgress && (
              <div className="bg-white shadow-2xl max-w-xs flex ">
                {/* Conditionally render individual image upload spinners */}
                {selectedImages.map((image) => (
                  <div
                    key={image.id}
                    className="image-upload-progress progress-container"
                  >
                    <div className="progress flex items-center">
                      <div
                        className="progress-bar"
                        style={{ width: `${imageUploadProgress[image.id]}%` }}
                      ></div>
                      {imageUploadProgress[image.id]}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center ">
            <div className="text-center ">
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

          <div className="text-center mt-5">
            <button
              type="button"
              onClick={handleImageUpload}
              className="bg-primary text-center p-2 rounded-md text-white fs-3"
            >
              Upload Images
            </button>
          </div>

          {/* <div className="selected-images mt-3">
            {selectedImages.map((image) => (
              <div key={image.id} className="selected-image flex bg-white p-2 rounded-sm shadow-inner items-center  justify-between">
                <div className="flex items-center">
                  <img src={image.urls.full} alt={image.alt_description} className="w-20  h-20 rounded-lg" />
                  <div className="ml-2">
                    <p className=" text-sm">Name: {image.alt_description}</p>
                    <p className=" text-sm">Size: {image.file_size} KB</p>
                  </div>
                </div>
                <div>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    <RiDeleteBin6Line className="text-red text-lg" />
                  </button>
                </div>
              </div>
            ))}
            </div> */}
        </div>
      </div>
    </>
  );
};

export default Unsplash;
