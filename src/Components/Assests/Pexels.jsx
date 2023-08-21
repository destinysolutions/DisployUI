import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../../Styles/assest.css";
import { BiLoaderCircle } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ALL_FILES_UPLOAD } from "../../Pages/Api";
import { FiCheckCircle } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
const Pexels = ({ closeModal }) => {
  const [photos, setPhotos] = useState([]);
  const [media, setMedia] = useState([]);
  const [searchQuery, setSearchQuery] = useState("Nature");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const [selectedMedia, setSelectedMedia] = useState({
    images: [],
    videos: [],
  });
  const [uploadedMedia, setUploadedMedia] = useState({
    images: [],
    videos: [],
  });
  const [selectedMediaType, setSelectedMediaType] = useState("images");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const API_KEY = "t8fp87NsuBPGQQ0c1LBDCTnPj02F509RretM2yQfaGBEEBzkGs022PCy";

    if (selectedMediaType === "images") {
      axios
        .get(
          `https://api.pexels.com/v1/search?query=${searchQuery}&page=${currentPage}`,
          {
            headers: {
              Authorization: API_KEY,
            },
          }
        )
        .then((response) => {
          setPhotos((prevPhotos) => [...prevPhotos, ...response.data.photos]);
        })
        .catch((error) => {
          console.error("Error fetching images:", error);
        });
    } else if (selectedMediaType === "videos") {
      axios
        .get(
          `https://api.pexels.com/videos/search?query=${searchQuery}&page=${currentPage}`,
          {
            headers: {
              Authorization: API_KEY,
            },
          }
        )
        .then((response) => {
          setMedia((prevMedia) => [...prevMedia, ...response.data.videos]);
        })
        .catch((error) => {
          console.error("Error fetching videos:", error);
        });
    }
  }, [searchQuery, selectedMediaType, currentPage]);
  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSelectMedia = (mediaType, media) => {
    setSelectedMedia((prevSelected) => {
      const prevSelectedMedia = prevSelected[mediaType];
      if (prevSelectedMedia.includes(media)) {
        return {
          ...prevSelected,
          [mediaType]: prevSelectedMedia.filter(
            (mediaImg) => mediaImg !== media
          ),
        };
      } else {
        return {
          ...prevSelected,
          [mediaType]: [...prevSelectedMedia, media],
        };
      }
    });
  };

  const handleMediaUpload = () => {
    selectedMedia.images.forEach((image) => {
      const formData = new FormData();
      const details = "Some Details about the file";
      formData.append("FileType", image.src.original);
      formData.append("operation", "Insert");
      formData.append("CategorieType", "Online");
      formData.append("details", details);
      formData.append("name", image.alt);
      formData.append("resolutions", `${image.height}*${image.width}`);

      axios
        .post(ALL_FILES_UPLOAD, formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress); // Fix here: Use setUploadProgress instead of setShowSpinner
          },
        })
        .then((response) => {
          console.log("Upload Success:", response.data);
          setUploadSuccess(true);
          setShowSuccessMessage(false);
          navigate("/assets", {
            state: {
              uploadProgress,
              uploadSuccess: true,
            },
          });
        })
        .catch((error) => {
          console.error("Upload Error:", error);
        });
    });

    selectedMedia.videos.forEach((video) => {
      // Split the URL by '/'
      const urlParts = video.image.split("/");

      // Get the last part of the URL which contains the filename
      const filenameWithQuery = urlParts[urlParts.length - 1];

      // Remove any query parameters from the filename
      const filename = filenameWithQuery.split("?")[0];

      // Extract the name from the filename by removing the file extension
      const name = filename.split(".")[0];
      const formData = new FormData();
      const details = "Some Details about the file";
      formData.append("FileType", video.video_files[0].link);
      formData.append("operation", "Insert");
      formData.append("CategorieType", "Online");
      formData.append("details", "Video");
      formData.append(
        "resolutions",
        `${video.video_files[0].height}*${video.video_files[0].width}`
      );
      formData.append("durations", video.duration);
      formData.append("name", name);
      axios
        .post(ALL_FILES_UPLOAD, formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress); // Fix here: Use setUploadProgress instead of setShowSpinner
          },
        })
        .then((response) => {
          console.log("Upload Success:", response.data);
          navigate("/assets", {
            state: {
              uploadProgress,
              uploadSuccess: true,
            },
          });
        })
        .catch((error) => {
          console.error("Upload Error:", error);
        });
    });

    localStorage.setItem("uploadSuccess", "true");
  };

  return (
    <>
      <div className="backdrop">
        <div className="fixed unsplash-model bg-black lg:px-5 md:px-5 sm:px-3 xs:px-2 py-7 rounded-2xl ">
          <button
            onClick={closeModal}
            className=" absolute right-3 top-3 text-2xl rounded-lg"
          >
            <AiOutlineCloseCircle className=" text-SlateBlue" />
          </button>
          <div className="text-center mb-5">
            <h1 className=" text-SlateBlue lg:text-3xl md:text-3xl sm:lg:text-xl xs:text-lg lg:mb-5 md:mb-5 sm:mb-3 xs:mb-2 font-medium">
              Media from Pexels
            </h1>
            <div className="border rounded-full bg-white max-w-sm  mx-auto flex items-center pexels-input">
              <select
                value={selectedMediaType}
                onChange={(e) => setSelectedMediaType(e.target.value)}
                className="py-2 bg-[#ebe7e7] mr-2 rounded-tl-3xl rounded-bl-3xl px-2"
              >
                <option value="images">Images</option>
                <option value="videos">Videos</option>
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Enter search query..."
                className=" bg-[transparent] form-control-sm py-2 fs-4 text-capitalize w-full"
              />
            </div>
          </div>
          {/* Conditional rendering based on selected media type */}
          <div className="container mx-auto">
            <div>
              {selectedMediaType === "images" ? (
                <div className="grid grid-cols-12 px-3 gap-4 unsplash-section bg-white rounded-lg">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="lg:col-span-3 md:col-span-3 sm:col-span-6 xs:col-span-12 relative unsplash-box"
                      onClick={() => handleSelectMedia("images", photo)}
                      style={{
                        border: selectedMedia.images.includes(photo)
                          ? "2px solid blue"
                          : "2px solid white",
                      }}
                    >
                      <img
                        src={photo.src.original}
                        alt={photo.photographer}
                        className="relative unsplash-img"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-12 px-3 gap-4 unsplash-section bg-white rounded-lg">
                  {media.map((item, index) => (
                    <div
                      key={index}
                      className="lg:col-span-3 md:col-span-3 sm:col-span-6 xs:col-span-12 relative unsplash-box"
                      onClick={() => handleSelectMedia("videos", item)}
                      style={{
                        border: selectedMedia.videos.includes(item)
                          ? "2px solid blue"
                          : "2px solid white",
                      }}
                    >
                      <video
                        width="100%"
                        height="200px"
                        controls
                        className="relative unsplash-img"
                      >
                        <source
                          src={item.video_files[0].link}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-center mt-5">
                <button
                  onClick={handleLoadMore}
                  className="text-[#8d8c8c] fs-3 my-4 flex items-center justify-center mx-auto"
                >
                  <BiLoaderCircle /> Load More
                </button>
              </div>

              <div className="text-center mt-5">
                <Link to="/assets">
                  <button
                    onClick={handleMediaUpload}
                    className="bg-primary text-center p-2 rounded-md text-white fs-3"
                  >
                    Upload Media
                  </button>
                </Link>
              </div>

              <div className="">
                {uploadProgress > 0 && (
                  <div className="progress-container">
                    <div>
                      <h1>Uploading... </h1>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -mt-4 -ml-2 h-8 w-4 text-indigo-700">
                      <div className="absolute z-10 -ml-2 h-8 w-8 animate-bounce">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="animate-spin"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth={0}
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 4c2.209 0 4 1.791 4 4s-1.791 4-4 4-4-1.791-4-4 1.791-4 4-4zM12.773 12.773c-1.275 1.275-2.97 1.977-4.773 1.977s-3.498-0.702-4.773-1.977-1.977-2.97-1.977-4.773c0-1.803 0.702-3.498 1.977-4.773l1.061 1.061c0 0 0 0 0 0-2.047 2.047-2.047 5.378 0 7.425 0.992 0.992 2.31 1.538 3.712 1.538s2.721-0.546 3.712-1.538c2.047-2.047 2.047-5.378 0-7.425l1.061-1.061c1.275 1.275 1.977 2.97 1.977 4.773s-0.702 3.498-1.977 4.773z"></path>
                        </svg>
                      </div>
                      <div className="absolute top-4 h-5 w-4 animate-bounce border-l-2 border-gray-200 -rotate-90"></div>
                      <div className="absolute top-4 h-5 w-4 animate-bounce border-r-2 border-gray-200 rotate-90"></div>
                    </div>
                  </div>
                )}
              </div>

              {uploadSuccess && (
                <div className="backdrop">
                  <div className="success-popup">
                    <div className="relative w-full max-w-xl max-h-full">
                      <div className="relative bg-white rounded-lg shadow">
                        <div className="lg:p-6 md:p-6 sm:p-3 xs:p-2 text-center">
                          <FiCheckCircle className="mx-auto mb-4 text-[#20AE5C] w-14 h-14" />
                          <h3 className="mb-5 text-2xl font-bold text-[#20AE5C]">
                            Image Upload successfully
                          </h3>
                          <p>Thank you for your request.</p>
                          <p>
                            We are working hard to find the best service and
                            deals for you.
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
                </div>
              )}

              {/* Display selected media as uploaded */}
              {uploadedMedia.images.length > 0 && (
                <div>
                  <h2>Uploaded Photos</h2>
                  <ul>
                    {uploadedMedia.images.map((photoId) => {
                      const photo = photos.find(
                        (photo) => photo.id === photoId
                      );
                      return (
                        <li key={photo.id}>
                          <img
                            src={photo.src.original}
                            alt={photo.photographer}
                          />
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
                            <source
                              src={video.video_files[0].link}
                              type="video/mp4"
                            />
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
