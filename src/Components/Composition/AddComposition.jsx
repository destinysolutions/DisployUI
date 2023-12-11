import { useState } from "react";
import PropTypes from "prop-types";
import Footer from "../Footer";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { SELECT_BY_LIST } from "../../Pages/Api";
import { useSelector } from "react-redux";
import { HiArrowLongLeft } from "react-icons/hi2";

const AddComposition = ({ sidebarOpen, setSidebarOpen }) => {
  AddComposition.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;
  const navigation = useNavigate();

  const [allcompositionData, setAllcompositionData] = useState([]);

  const SelectLayout = (data) => {
    navigation(`/addcomposition/${data?.layoutDtlID}`);
  };

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: SELECT_BY_LIST,
      headers: {
        Authorization: authToken,
      },
      // data: "",
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data?.data);
        setAllcompositionData(response.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <div className="flex bg-white py-3 border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-16 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block xs:block  items-center ">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 "></h1>
            <div className="flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap playlistbtn">
              {/* <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <AiOutlineSearch className="w-5 h-5 text-gray " />
                </span>
                <input
                  type="text"
                  placeholder="Search Content "
                  className="border border-primary rounded-full px-7 py-2.5 block w-full p-4 pl-10"
                />
              </div> */}
              {/* <button className="sm:ml-2 xs:ml-1  flex align-middle border-white bg-SlateBlue text-white items-center border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                Add Custom Layout
              </button> */}
            </div>
          </div>
          <div className="rounded-xl mt-8 shadow bg-white p-5">
            <h4
              className="text-lg font-medium mb-5 flex w-fit items-center gap-2 cursor-pointer "
              onClick={() => navigation("/composition")}
            >
              <HiArrowLongLeft size={30} /> Standard
            </h4>
            <div className="grid grid-cols-3 gap-8">
              {allcompositionData.map((item, index) => (
                <div className="relative" key={index}>
                  <div className="layout-card block text-center max-w-xs mx-auto ">
                    <img
                      src={`data:image/svg+xml;utf8,${encodeURIComponent(
                        item.svg
                      )}`}
                      alt="Logo"
                      className=" mx-auto"
                    />
                    <div className="onhover_show">
                      <div className="text">
                        <h4 className="text-lg font-medium">{item?.name}</h4>
                        <p className="text-sm font-normal ">
                          Total Section: {item.lstLayloutModelList.length}
                        </p>
                      </div>
                      <button
                        className="bg-SlateBlue mx-auto text-white rounded-full px-4 py-2 hover:bg-primary hover:text-white text-sm hover:bg-primary-500"
                        onClick={() => SelectLayout(item)}
                      >
                        Use This Layout
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* <div className="relative">
                <div className="layout-card block text-center cursor-pointer max-w-xs mx-auto">
                  <img
                    src="../../../composition/layout-2.png"
                    alt="Logo"
                    className=" mx-auto"
                  />
                  <div className="onhover_show">
                    <div className="text">
                      <h4 className="text-lg font-medium">Layout Name</h4>
                      <p className="text-sm font-normal ">Total Section: 2</p>
                    </div>
                    <button className="bg-SlateBlue mx-auto text-white rounded-full px-4 py-2 hover:bg-primary hover:text-white text-sm hover:bg-primary-500">
                      Use This Layout
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="layout-card block text-center cursor-pointer max-w-xs mx-auto">
                  <img
                    src="../../../composition/layout-6.png"
                    alt="Logo"
                    className=" mx-auto"
                  />
                  <div className="onhover_show">
                    <div className="text">
                      <h4 className="text-lg font-medium">Layout Name</h4>
                      <p className="text-sm font-normal ">Total Section: 1</p>
                    </div>
                    <button className="bg-SlateBlue mx-auto text-white rounded-full px-4 py-2 hover:bg-primary hover:text-white text-sm hover:bg-primary-500">
                      Use This Layout
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative  ">
                <div className="layout-card block text-center cursor-pointer max-w-xs mx-auto">
                  <img
                    src="../../../composition/layout-4.png"
                    alt="Logo"
                    className=" mx-auto"
                  />
                  <div className="onhover_show">
                    <div className="text">
                      <h4 className="text-lg font-medium">Layout Name</h4>
                      <p className="text-sm font-normal ">Total Section: 2</p>
                    </div>
                    <button className="bg-SlateBlue mx-auto text-white rounded-full px-4 py-2 hover:bg-primary hover:text-white text-sm hover:bg-primary-500">
                      Use This Layout
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative  ">
                <div className="layout-card block text-center cursor-pointer max-w-xs mx-auto">
                  <img
                    src="../../../composition/layout-5.png"
                    alt="Logo"
                    className=" mx-auto"
                  />
                  <div className="onhover_show">
                    <div className="text">
                      <h4 className="text-lg font-medium">Layout Name</h4>
                      <p className="text-sm font-normal ">Total Section: 2</p>
                    </div>
                    <button className="bg-SlateBlue mx-auto text-white rounded-full px-4 py-2 hover:bg-primary hover:text-white text-sm hover:bg-primary-500">
                      Use This Layout
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
            {/* <h4 className="text-lg font-medium my-5">Custom</h4>
            <div className="grid grid-cols-3 gap-8">
              <div className="relative">
                <div className="layout-card block text-center cursor-pointer max-w-xs mx-auto">
                  <img
                    src="../../../composition/layout-1.png"
                    alt="Logo"
                    className=" mx-auto"
                  />
                  <div className="onhover_show">
                    <div className="text">
                      <h4 className="text-lg font-medium">Layout Name</h4>
                      <p className="text-sm font-normal ">Total Section: 3</p>
                    </div>
                    <button className="bg-SlateBlue mx-auto text-white rounded-full px-4 py-2 hover:bg-primary hover:text-white text-sm hover:bg-primary-500">
                      Use This Layout
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="layout-card block text-center cursor-pointer max-w-xs mx-auto">
                  <img
                    src="../../../composition/layout-2.png"
                    alt="Logo"
                    className=" mx-auto"
                  />
                  <div className="onhover_show">
                    <div className="text">
                      <h4 className="text-lg font-medium">Layout Name</h4>
                      <p className="text-sm font-normal ">Total Section: 2</p>
                    </div>
                    <button className="bg-SlateBlue mx-auto text-white rounded-full px-4 py-2 hover:bg-primary hover:text-white text-sm hover:bg-primary-500">
                      Use This Layout
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="layout-card block text-center cursor-pointer max-w-xs mx-auto">
                  <img
                    src="../../../composition/layout-6.png"
                    alt="Logo"
                    className=" mx-auto"
                  />
                  <div className="onhover_show">
                    <div className="text">
                      <h4 className="text-lg font-medium">Layout Name</h4>
                      <p className="text-sm font-normal ">Total Section: 1</p>
                    </div>
                    <button className="bg-SlateBlue mx-auto text-white rounded-full px-4 py-2 hover:bg-primary hover:text-white text-sm hover:bg-primary-500">
                      Use This Layout
                    </button>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default AddComposition;

// import React, { useEffect, useState } from "react";
// import { fabric } from "fabric"; // this also installed on your project
// import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
// import "./styles.css";

// const DEFAULT_IMAGE = "";

// export default function App() {
//   const [text, setText] = useState("");
//   const { selectedObjects, editor, onReady } = useFabricJSEditor();

//   const _onReady = (canvas) => {
//     fabric.Image.fromURL(DEFAULT_IMAGE, (img) => {
//       canvas.renderAll();
//       onReady(canvas);
//     });
//   };

//   const onAddCircle = () => {
//     editor.addCircle();
//   };
//   const onAddRectangle = () => {
//     editor.addRectangle();
//   };
//   const onAddText = () => {
//     editor.addText(text);
//     setText("");
//   };
//   const onDeleteAll = () => {
//     editor.deleteAll();
//     setText("");
//   };

//   const onLoadFromDatabase = () => {
//     // Replace 'jsonCanvasData' with the JSON data you want to load
//     const jsonCanvasData = {
//       version: "5.3.0",
//       objects: [
//         {
//           type: "circle",
//           version: "5.3.0",
//           originX: "left",
//           originY: "top",
//           left: 248,
//           top: 61,
//           width: 40,
//           height: 40,
//           fill: "rgba(255, 255, 255, 0.0)",
//           stroke: "#000000",
//           strokeWidth: 1,
//           strokeDashArray: null,
//           strokeLineCap: "butt",
//           strokeDashOffset: 0,
//           strokeLineJoin: "miter",
//           strokeUniform: false,
//           strokeMiterLimit: 4,
//           scaleX: 1,
//           scaleY: 1,
//           angle: 0,
//           flipX: false,
//           flipY: false,
//           opacity: 1,
//           shadow: null,
//           visible: true,
//           backgroundColor: "",
//           fillRule: "nonzero",
//           paintFirst: "fill",
//           globalCompositeOperation: "source-over",
//           skewX: 0,
//           skewY: 0,
//           radius: 20,
//           startAngle: 0,
//           endAngle: 360
//         },
//         {
//           type: "rect",
//           version: "5.3.0",
//           originX: "left",
//           originY: "top",
//           left: 194,
//           top: 170,
//           width: 40,
//           height: 40,
//           fill: "rgba(255, 255, 255, 0.0)",
//           stroke: "#000000",
//           strokeWidth: 1,
//           strokeDashArray: null,
//           strokeLineCap: "butt",
//           strokeDashOffset: 0,
//           strokeLineJoin: "miter",
//           strokeUniform: false,
//           strokeMiterLimit: 4,
//           scaleX: 1,
//           scaleY: 1,
//           angle: 0,
//           flipX: false,
//           flipY: false,
//           opacity: 1,
//           shadow: null,
//           visible: true,
//           backgroundColor: "",
//           fillRule: "nonzero",
//           paintFirst: "fill",
//           globalCompositeOperation: "source-over",
//           skewX: 0,
//           skewY: 0,
//           rx: 0,
//           ry: 0
//         },
//         {
//           type: "image",
//           version: "5.3.0",
//           originX: "left",
//           originY: "top",
//           left: 0,
//           top: 0,
//           width: 1280,
//           height: 797,
//           fill: "rgb(0,0,0)",
//           stroke: null,
//           strokeWidth: 0,
//           strokeDashArray: null,
//           strokeLineCap: "butt",
//           strokeDashOffset: 0,
//           strokeLineJoin: "miter",
//           strokeUniform: false,
//           strokeMiterLimit: 4,
//           scaleX: 0.16,
//           scaleY: 0.16,
//           angle: 0,
//           flipX: false,
//           flipY: false,
//           opacity: 1,
//           shadow: null,
//           visible: true,
//           backgroundColor: "",
//           fillRule: "nonzero",
//           paintFirst: "fill",
//           globalCompositeOperation: "source-over",
//           skewX: 0,
//           skewY: 0,
//           cropX: 0,
//           cropY: 0,
//           src:
//             "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
//           crossOrigin: null,
//           filters: []
//         }
//       ]
//     };

//     // Load the canvas from the JSON data
//     editor.canvas.loadFromJSON(jsonCanvasData, () => {
//       editor.canvas.renderAll();
//     });
//   };

//   const onAddImage = () => {
//     fabric.Image.fromURL(
//       "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
//       (img) => {
//         const container = new fabric.Rect({
//           left: 100,
//           top: 100,
//           width: 200,
//           height: 200,
//           fill: "transparent"
//         });

//         // Set the image's dimensions to fit the container while preserving aspect ratio
//         const imageAspect = img.width / img.height;
//         const containerAspect = container.width / container.height;

//         if (imageAspect > containerAspect) {
//           img.scaleToWidth(container.width);
//         } else {
//           img.scaleToHeight(container.height);
//         }

//         // Center the image within the container
//         img.center();

//         // Add the container and image to the canvas
//         // editor.canvas.add(container);
//         editor.canvas.add(img);

//         editor.canvas.renderAll();
//       }
//     );
//   };

//   const onDeleteSelected = () => {
//     editor.deleteSelected();
//   };

//   const onSave = () => {
//     const canvasData = JSON.stringify(editor.canvas.toJSON());
//     console.log("canvasData", canvasData);
//   };

//   return (
//     <div className="App">
//       <button onClick={onAddCircle}>Add circle</button>
//       <button onClick={onAddRectangle}>Add Rectangle</button>
//       <button onClick={onAddImage}>Add Image</button>
//       <button onClick={onDeleteSelected}>Delete selected</button>
//       <button onClick={onSave}>Save</button>
//       <button onClick={onLoadFromDatabase}>Load from Database</button>

//       <fieldset>
//         <input
//           name={`text`}
//           type={`text`}
//           value={text}
//           onChange={(event) => setText(event.target.value)}
//         />
//         <button onClick={onAddText}>Add Text</button>
//       </fieldset>
//       <button onClick={onDeleteAll}>Reset</button>
//       <div className="sample-container">
//         <FabricJSCanvas className="sample-canvas" onReady={_onReady} />
//       </div>
//     </div>
//   );
// }
