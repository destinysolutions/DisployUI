import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ALL_FILES_UPLOAD } from "../../Pages/Api";
import { FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
const Pixabay = ({ closeModal }) => {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const API_KEY = "38694421-d79007fafdaa5464faa5f9999";
    const BASE_URL = "https://pixabay.com/api/?key=" + API_KEY;

    let url = `${BASE_URL}&q=${encodeURIComponent(
      searchTerm
    )}&page=${currentPage}`;

    axios
      .get(url)
      .then((response) => {
        // If it's the first page, update the images directly
        if (currentPage === 1) {
          setImages(response.data.hits);
        } else {
          // For subsequent pages, append the new images to the existing images
          setImages((prevImages) => [...prevImages, ...response.data.hits]);
        }

        // Update totalPages based on Pixabay API response
        setTotalPages(Math.ceil(response.data.totalHits / 20)); // Assuming 20 images per page
      })
      .catch((error) => {
        console.error("Error fetching data from Pixabay API:", error);
      });
  }, [searchTerm, currentPage]);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleImageSelect = (image) => {
    if (image) {
      // Check if the image is not null or undefined
      setSelectedImages((prevSelected) =>
        prevSelected.includes(image)
          ? prevSelected.filter((img) => img !== image)
          : [...prevSelected, image]
      );
    }
  };

  // Function to load more images when "Load More" button is clicked
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      // If there are more pages to load
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  //API
  const handleImageUpload = () => {
    selectedImages.forEach((image) => {
      const formData = new FormData();
      const details = "Some Details about the file";
      formData.append("FileType", image.webformatURL);
      formData.append("operation", "Insert");
      formData.append("CategorieType", "Online");
      formData.append("details", details);
      formData.append(
        "resolutions",
        `${image.webformatHeight}*${image.webformatWidth}`
      );
      formData.append("name", image.tags);
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
        <div className="fixed unsplash-model bg-black lg:px-5 md:px-5 sm:px-3 xs:px-2 py-7 rounded-2xl">
          <button
            onClick={closeModal}
            className="absolute right-3 top-3 text-2xl rounded-lg"
          >
            <AiOutlineCloseCircle className=" text-SlateBlue" />
          </button>
          <div className="text-center ">
            <h1 className=" text-SlateBlue lg:text-3xl md:text-3xl sm:lg:text-xl xs:text-lg lg:mb-5 md:mb-5 sm:mb-3 xs:mb-2 font-medium">
              Pixabay Image Gallery
            </h1>

            <div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-control-sm py-2 fs-4 text-capitalize border border-3 border-dark unspalsh-searchbox"
              />
            </div>
          </div>
          <div className="grid grid-cols-12 px-3 gap-4 unsplash-section bg-white rounded-lg">
            {images.map((image) => (
              <div
                key={image.id}
                className="lg:col-span-3 md:col-span-3 sm:col-span-6 xs:col-span-12 relative unsplash-box"
                onClick={() => handleImageSelect(image)}
                style={{
                  border: selectedImages.includes(image)
                    ? "2px solid blue"
                    : "2px solid white",
                }}
              >
                <img
                  src={image.webformatURL}
                  alt={image.tags}
                  className=" h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
          {currentPage < totalPages && (
            <div className="mt-4 text-center">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Load More
              </button>
            </div>
          )}
          {selectedImages.length > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={handleImageUpload}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Upload Selected Images
              </button>
            </div>
          )}

          <div className="  bg-white shadow-2xl">
            {uploadProgress > 0 && (
              <div className="progress-container">
                <div>
                  <h1>Uploading... </h1>
                </div>
                <div
                  className="progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                >
                  {uploadProgress}%
                </div>
              </div>
            )}
          </div>

          {uploadSuccess && (
            <div className="success-popup lg:w-auto md:w-auto sm:w-4/5 xs:w-[90%]">
              <div className="relative w-full max-w-xl max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                  <div className="lg:p-6 md:p-6 sm:p-3 xs:p-2 text-center">
                    <FiCheckCircle className="mx-auto mb-4 text-[#20AE5C] w-14 h-14" />
                    <h3 className="mb-5 text-2xl font-bold text-[#20AE5C]">
                      Image Upload successfully
                    </h3>
                    <p className="text-black">Thank you for your request.</p>
                    <p className="text-black mt-2 mb-4">
                      We are working hard to find the best service and deals for
                      you.
                    </p>
                    <p className="mb-7 text-[#9892A6] mt-1">
                      Kindly check your media gallery for confirmation.
                    </p>
                    <Link to="/assets">
                      <button className="text-white bg-[#20AE5C] rounded text-lg font-bold px-7 py-2.5">
                        Continue
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Pixabay;
