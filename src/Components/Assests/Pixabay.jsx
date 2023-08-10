import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineCloseCircle } from "react-icons/ai";

const Pixabay = ({ closeModal }) => {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    setSelectedImages((prevSelected) =>
      prevSelected.includes(image)
        ? prevSelected.filter((img) => img !== image)
        : [...prevSelected, image]
    );
  };

  useEffect(() => {
    selectedImages.forEach((image) => {
      setFileData((prevData) => [...prevData, image.webformatURL]);
    });
  }, [selectedImages]);

  // Function to load more images when "Load More" button is clicked
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      // If there are more pages to load
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  //   API
  const [fileData, setFileData] = useState([]);

  useEffect(() => {
    selectedImages.forEach((image) => {
      setFileData((prevData) => [...prevData, image.webformatURL]);
    });
  }, [selectedImages]);

  console.log(fileData, "fileData");

  const handleImageUpload = () => {
    // ... (existing code for getContentType)

    const UPLOAD_API_URL =
      "http://192.168.1.219/api/ImageVideoDoc/ImageVideoDocUpload";

    selectedImages.forEach((image) => {
      console.log(image);
      const formData = new FormData();

      const details = "Some Details about the file";

      formData.append("FileType", image.webformatURL);
      formData.append("operation", "Insert");
      formData.append("CategorieType", "Online");
      formData.append("details", details);

      axios
        .post(UPLOAD_API_URL, formData)
        .then((response) => {
          console.log("Upload Success:", response.data);
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
        </div>
      </div>
    </>
  );
};

export default Pixabay;
