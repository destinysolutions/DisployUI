import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";

const Carousel = ({ items, compositonData, from, isPlay }) => {
  console.log('items', items)
  const [currentIndex, setCurrentIndex] = useState(0);
  const marqueeRef = useRef(null);
  useEffect(() => {
    const slideCount = items?.length;
    let interval;
    if (from === "screen") {
      if (isPlay) {
        interval = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % slideCount);
        }, items[currentIndex]?.durationInSecond * 1000);
      } else {
        clearInterval(interval);
      }
    } else {
      if (isPlay) {
        interval = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % slideCount);
        }, items[currentIndex]?.duration * 1000);
      } else {
        clearInterval(interval);
      }
    }
    return () => {
      clearInterval(interval);
    };
  }, [items, currentIndex, isPlay]);

  return (
    <>
      <div className="h-full w-full p-1 bg-black">
        {items?.map((item, index) => {
          let viewerSrc = "";
          if (
            item?.fileExtention === ".pdf" ||
            item?.fileExtention === ".txt"
          ) {
            viewerSrc = item?.assetFolderPath
              ? item?.assetFolderPath
              : item?.fileType;
          } else if (item?.fileExtention === ".csv") {
            viewerSrc = `https://docs.google.com/gview?url=${item?.assetFolderPath ? item?.assetFolderPath : item?.fileType
              }&embedded=true`;
          } else if (
            item?.fileExtention === ".pptx" ||
            item?.fileExtention === ".ppt" ||
            item?.fileExtention === ".docx" ||
            item?.fileExtention === ".doc" ||
            item?.fileExtention === ".xlsx" ||
            item?.fileExtention === ".xls"
          ) {
            // viewerSrc = `https://view.officeapps.live.com/op/embed.aspx?src=${item?.assetFolderPath ? item?.assetFolderPath : item?.fileType
            //   }`;

            viewerSrc = `https://docs.google.com/viewer?url=${item?.assetFolderPath ? item?.assetFolderPath : item?.fileType}&embedded=true`

          }
          if (currentIndex === index) {
            return (
              <div
                className="w-full h-full text-[#5A5881] font-semibold rounded shadow"
                key={index}
              >
                {item?.assetType === "OnlineImage" && (
                  <img
                    className="w-full h-full object-fill rounded-sm"
                    src={item?.assetFolderPath}
                    alt={item?.assetName}
                  />
                )}
                {item?.mediaType === "OnlineImage" && (
                  <img
                    className="w-full h-full rounded-sm object-fill "
                    src={item?.fileType}
                  />
                )}
                {item?.assetType === "Image" && (
                  <img
                    src={item?.assetFolderPath}
                    alt={item?.assetName}
                    className={`w-full h-full ${item?.assetType !== "Image" && "hidden"
                      } rounded-sm object-fill`}
                  />
                )}
                {item?.mediaType === "Image" && (
                  <img
                    src={item?.fileType}
                    className={`w-full h-full ${!item?.fileType && "hidden"
                      } rounded-sm object-fill`}
                  />
                )}
                {(item?.assetType === "Video" ||
                  item?.assetType === "Youtube" ||
                  item?.assetType === "OnlineVideo") && (
                    <ReactPlayer
                      url={item?.assetFolderPath}
                      className="w-full h-full relative z-20 videoinner object-fill"
                      width={"100%"}
                      height={"100%"}
                      controls={true}
                      playing={isPlay ? true : false}
                      loop={true}
                    />
                  )}
                {(item?.mediaType === "Video" ||
                  item?.mediaType === "Youtube") && (
                    <ReactPlayer
                      url={
                        item?.assetFolderPath
                          ? item?.assetFolderPath
                          : item?.fileType
                      }
                      className="w-full h-full relative z-20 videoinner object-fill"
                      controls={true}
                      width={"100%"}
                      height={"100%"}
                      loop={true}
                      playing={isPlay ? true : false}
                    />
                  )}
                {item.assetType === "DOC" && (
                  <iframe
                    className='w-full h-full'
                    title="Document Viewer"
                    src={viewerSrc}
                  ></iframe>
                )}
                {item.assetType === "DOC" && (
                  <iframe
                    className='w-full h-full'
                    title="Document Viewer"
                    src={viewerSrc}
                  ></iframe>
                )}
                {item.mediaType === "Pdf" && (
                  <iframe
                    className='w-full h-full'
                    title="Document Viewer"
                    src={item?.fileType}
                  ></iframe>
                )}
                {(item?.assetType === "Text" ||
                  item?.mediaType === "Text" ||
                  item?.text !== undefined) && (
                    // <marquee
                    //   className="text-3xl w-full h-full flex items-center text-white bg-black"
                    //   direction={
                    //     item?.scrollType == 1 ||
                    //       item?.direction == "Left to Right"
                    //       ? "right"
                    //       : "left"
                    //   }
                    //   scrollamount="10"
                    // >
                    //   {item?.assetFolderPath || item?.fileType || item?.text}
                    // </marquee>

                    <>
                      {isPlay ? (
                        <marquee
                          ref={marqueeRef}
                          className="text-3xl w-full h-full flex items-center text-white bg-black"
                          direction={
                            item?.scrollType === 1 ||
                              item?.direction === "Left to Right"
                              ? "right"
                              : "left"
                          }
                        >
                          {item?.assetFolderPath || item?.fileType || item?.text}
                        </marquee>
                      ) : (
                        <div className="text-3xl w-full h-full flex items-center justify-center text-white bg-black line-clamp-1">
                          {item?.assetFolderPath || item?.fileType || item?.text}
                        </div>
                      )}
                    </>
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
