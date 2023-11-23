import React, { useState, useEffect } from "react";

const Carousel = ({ items, compositonData }) => {
  // console.log("items", items);
  console.log(compositonData);
  // const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect(() => {
  //   const slideCount = items.length;

  //   const interval = setInterval(() => {
  //     setCurrentIndex((prevIndex) => (prevIndex + 1) % slideCount);
  //   }, items[currentIndex].PlayDuration * 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [items, currentIndex]);

  return (
    <>
      <div className="grid h-full w-full relative grid-cols-3 grid-rows-3 justify-center place-items-center items-center">
        <div className="w-full col-span-full text-center row-span-2 bg-red h-full ">
          asd
        </div>
        {/* <div className="w-full col-span-1 text-center row-span-2 bg-yellow-500 h-full">
          asd
        </div> */}
        <div className="w-full col-span-full text-center row-span-1 bg-green h-full">
          {" "}
          asd
        </div>
        {/* {items.map((item, index) => {
        if (currentIndex === index) {
          return (
            <div className="flex h-full w-full" key={index}>
              {item.assetType === "OnlineImage" && (
                <>
                  <img
                    className="w-full h-full object-cover rounded-sm"
                    src={item.assetFolderPath}
                    alt={item.assetName}
                  />
                </>
              )}
              {item.assetType === "Image" && (
                <img
                  src={item.assetFolderPath}
                  alt={item.assetName}
                  className="w-full h-full object-cover rounded-sm"
                />
              )}
              {item.assetType === "Video" && (
                <video
                  loop
                  autoPlay
                  controls
                  className="w-full h-full rounded-sm"
                >
                  <source src={item.assetFolderPath} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {item.assetType === "DOC" && (
                <a
                  href={item.assetFolderPath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.assetName}
                </a>
              )}
            </div>
          );
        }
      })} */}
      </div>
    </>
  );
};

export default Carousel;
