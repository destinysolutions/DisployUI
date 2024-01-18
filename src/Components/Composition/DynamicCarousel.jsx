import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";

const Carousel = ({ items, compositonData, from }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const slideCount = items.length;
    let interval;
    if (from === "screen") {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slideCount);
      }, items[currentIndex]?.durationInSecond * 1000);
    } else {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slideCount);
      }, items[currentIndex]?.duration * 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [items, currentIndex]);

  return (
    <>
      <div className="h-full w-full p-1 bg-white">
        {items?.map((item, index) => {
          if (currentIndex === index) {
            return (
              <div
                className="h-full w-full text-[#5A5881] font-semibold rounded shadow"
                key={index}
              >
                {item.assetType === "OnlineImage" && (
                  <img
                    className="w-full h-full object-fill rounded-sm"
                    src={item.assetFolderPath}
                    alt={item.assetName}
                  />
                )}
                {item.mediaType === "OnlineImage" && (
                  <img
                    className="w-full h-full rounded-sm object-fill "
                    src={item.fileType}
                  />
                )}
                {item.assetType === "Image" && (
                  <img
                    src={item.assetFolderPath}
                    alt={item.assetName}
                    className={`w-full h-full ${
                      item.assetType !== "Image" && "hidden"
                    } rounded-sm object-fill`}
                  />
                )}
                {item.mediaType === "Image" && (
                  <img
                    src={item.fileType}
                    className={`w-full h-full ${
                      !item.fileType && "hidden"
                    } rounded-sm object-fill`}
                  />
                )}
                {(item?.assetType === "Video" ||
                  item?.assetType === "Youtube" ||
                  item?.assetType === "OnlineVideo") && (
                  <ReactPlayer
                    url={item?.assetFolderPath}
                    className="w-full relative z-20 videoinner object-fill"
                    controls={true}
                    playing={true}
                    loop={true}
                  />
                )}
                {(item.mediaType === "Video" ||
                  item.mediaType === "Youtube") && (
                  <ReactPlayer
                    url={
                      item?.assetFolderPath
                        ? item?.assetFolderPath
                        : item?.fileType
                    }
                    className="w-full relative z-20 videoinner"
                    controls={true}
                    loop={true}
                    playing={true}
                  />
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
                {item.mediaType === "DOC" && (
                  <a
                    href={item.fileType}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.assetName}
                  </a>
                )}
                {(item?.assetType === "Text" ||
                  item?.mediaType === "Text" ||
                  item?.text !== undefined) && (
                  <marquee
                    className="text-3xl w-full h-full flex items-center text-black"
                    direction={
                      item?.scrollType == 1 ||
                      item?.direction == "Left to Right"
                        ? "right"
                        : "left"
                    }
                    scrollamount="10"
                  >
                    {item?.assetFolderPath || item?.fileType || item?.text}
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
