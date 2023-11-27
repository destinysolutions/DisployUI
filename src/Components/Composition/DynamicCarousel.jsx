import React, { useState, useEffect } from "react";

const Carousel = ({ items, compositonData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const slideCount = items.length;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slideCount);
    }, items[currentIndex].duration * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [items, currentIndex]);
  // console.log(items);

  return (
    <>
      <div className="h-full w-full">
        {items?.map((item, index) => {
          if (currentIndex === index) {
            return (
              <div className="h-full w-full" key={index}>
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
                    className="w-full h-full rounded-sm "
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
                {item?.text && (
                  <marquee
                    className="text-lg align-middle h-full flex items-center justify-center"
                    direction={item?.scrollType == 1 ? "left" : "right"}
                  >
                    {item?.text}
                  </marquee>
                )}
              </div>
            );
          }
        })}
      </div>
    </>
  );
};

export default Carousel;
