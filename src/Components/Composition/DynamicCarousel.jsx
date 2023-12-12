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

  // console.log(items);

  return (
    <>
      <div className="h-full w-full">
        {items?.map((item, index) => {
          // console.log(item);
          if (currentIndex === index) {
            return (
              <div className="h-full w-full" key={index}>
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
                    // alt={item.assetName}
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
                  item?.assetType === "Youtube") && (
                  <ReactPlayer
                    url={item?.assetFolderPath}
                    className="w-full relative z-20 videoinner object-fill"
                    controls={true}
                    playing={true}
                  />
                  // <video
                  //   loop
                  //   autoPlay
                  //   controls
                  //   className={`w-full h-full ${
                  //     item.assetType !== "Video" && "hidden"
                  //   } rounded-sm `}
                  // >
                  //   <source
                  //     itemType="video/youtube"
                  //     src={item.assetFolderPath}
                  //     type="video/mp4"
                  //   />
                  //   Your browser does not support the video tag.
                  // </video>
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
                    playing={true}
                  />
                  // <video
                  //   loop
                  //   autoPlay
                  //   controls
                  //   className={`w-full h-full rounded-sm `}
                  // >
                  //   <source src={item.fileType} type="video/mp4" />
                  //   Your browser does not support the video tag.
                  // </video>
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
                {(item?.assetType === "Text" || item?.mediaType === "Text") && (
                  <marquee
                    className="text-lg align-middle h-full flex items-center justify-center bg-lightgray"
                    direction={
                      item?.direction == "Left to Right" ? "left" : "right"
                    }
                  >
                    {item?.assetFolderPath ?? item?.fileType}
                  </marquee>
                )}
                {item?.text !== undefined && (
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
