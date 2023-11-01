import React, { useState, useEffect } from "react";

const Carousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const slideCount = items.length;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slideCount);
    }, items[currentIndex].PlayDuration * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [items, currentIndex]);

  return (
    <div className="flex h-full w-full relative">
      {items.map((item, index) => {
        if (currentIndex === index) {
          return (
            <div className="flex h-full w-full" key={index}>
              {item.categorieType === "OnlineImage" && (
                <>
                  <img
                    className="w-full h-full object-cover rounded-sm"
                    src={item.fileType}
                    alt={item.name}
                  />
                </>
              )}
              {item.categorieType === "Image" && (
                <img
                  src={item.fileType}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-sm"
                />
              )}
              {item.categorieType === "Video" && (
                <video
                  loop
                  autoPlay
                  controls
                  className="w-full h-full rounded-sm"
                >
                  <source src={item.fileType} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {item.categorieType === "DOC" && (
                <a
                  href={item.fileType}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.name}
                </a>
              )}
            </div>
          );
        }
      })}
    </div>
  );
};

export default Carousel;
