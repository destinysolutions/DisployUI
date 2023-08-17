import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "./../../Styles/assest.css";
import { BiLoaderCircle } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import { ALL_FILES_UPLOAD } from "../../Pages/Api";
import { FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
const API_UPLOAD_URL =
  "http://192.168.1.219/api/ImageVideoDoc/ImageVideoDocUpload";
const Unsplash = ({ closeModal, onSelectedImages }) => {
  const [img, setImg] = useState("Natural");
  const [res, setRes] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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
  const handleLoadMore = () => {
    fetchRequest(img, currentPage);
  };

  console.log(selectedImages);

  const handleImageUpload = () => {
    selectedImages.forEach((image) => {
      const formData = new FormData();
      const details = "Some Details about the file";
      formData.append("FileType", image.urls.full);
      formData.append("operation", "Insert");
      formData.append("CategorieType", "Online");
      formData.append("details", details);
      axios
        .post(ALL_FILES_UPLOAD, formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
          },
        })


        .then((response) => {
          console.log("Upload Success:", response.data);
          setUploadProgress(0);
          setUploadSuccess(true);
        })
        .catch((error) => {
          console.error("Upload Error:", error);
        });
    });
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
        </div>

        <div className="  bg-white shadow-2xl">
          {uploadProgress > 0 && (
            
            <div className="progress-container">
              <div><h1>Uploading... </h1></div>
              <div
                className="progress-bar"
                style={{ width: `${uploadProgress}%` }}>{uploadProgress}%
              </div>
            </div>
            
          )}
        
        </div>

        {uploadSuccess && (
          <div className="backdrop">
            <div className="success-popup lg:w-auto md:w-auto sm:w-4/5 xs:w-[90%]">

              <div className="relative w-full">
                <div className="relative bg-white rounded-lg shadow">
                  <div className="lg:p-6 md:p-6 sm:p-3 xs:p-2 text-center">
                    <FiCheckCircle className="mx-auto mb-4 text-[#20AE5C] w-14 h-14" />
                    <h3 className="mb-5 text-2xl font-bold text-[#20AE5C]">
                      Image Upload successfully
                    </h3>
                    <h2 className="mb-3 leading-3">Thank you for your request.</h2>
                    <div>
                      <p className="mb-3 leading-5">
                        We are working hard to find the best service and deals for
                        you.
                      </p>
                    </div>

                    <h5 className="mb-7 text-[#9892A6] mt-1  leading-5">
                      Kindly check your media gallery for confirmation.
                    </h5>
                    <Link to="/assets">
                      <button className="text-white bg-[#20AE5C] rounded text-lg font-bold px-7 py-2.5">
                        Continue
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default Unsplash;
