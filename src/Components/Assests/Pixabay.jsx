import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ALL_FILES_UPLOAD } from "../../Pages/Api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Pixabay = ({ closeModal, pixabayModalRef }) => {
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const API_KEY = "38694421-d79007fafdaa5464faa5f9999";
    const BASE_URL = "https://pixabay.com/api/?key=" + API_KEY;

    let url = `${BASE_URL}&q=${encodeURIComponent(
      searchTerm
    )}&page=${currentPage}`;

    axios
      .get(url)
      .then((response) => {
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
    setUploadInProgress(true);
    selectedImages.forEach((image) => {
      console.log(image, "image");
      const formData = new FormData();
      formData.append("AssetFolderPath", image.webformatURL);
      formData.append("Operation", "Insert");
      formData.append("AssetType", "OnlineImage");
      formData.append("IsActive", "true");
      formData.append("IsDelete", "false");
      formData.append("FolderID", "0");
      formData.append(
        "Resolutions",
        `${image.webformatHeight}*${image.webformatWidth}`
      );
      formData.append("AssetName", image.tags);
      axios
        .post(ALL_FILES_UPLOAD, formData, {
          headers: {
            Authorization: authToken,
            "Content-Type": "multipart/form-data",
          },
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
          navigate(-1);
        })
        .catch((error) => {
          console.error("Upload Error:", error);
        })
        .finally(() => {
          if (
            selectedImages.every((img) => imageUploadProgress[img.id] === 100)
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

  return (
    <>
      <div className="backdrop">
        <div
          ref={pixabayModalRef}
          className="fixed unsplash-model bg-black lg:px-5 md:px-5 sm:px-3 xs:px-2 py-7 rounded-2xl"
        >
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

          <div className="unsplash-section bg-white rounded-lg">
            <div className="grid grid-cols-12 px-3 gap-4 ">
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
                    src={image.largeImageURL}
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
                  className="text-white py-3 px-3 rounded-md fs-3 my-4 flex items-center justify-center mx-auto bg-SlateBlue hover:bg-black"
                >
                  Load More
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={handleImageUpload}
              className="text-white py-3 px-3 rounded-md fs-3  flex items-center border border-SlateBlue justify-center mx-auto bg-SlateBlue hover:bg-black"
            >
              Upload Images
            </button>
          </div>

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
        </div>
      </div>
    </>
  );
};

export default Pixabay;
