import React from 'react'
import PropTypes from "prop-types";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import moment from 'moment';
import { CustomLayout } from '../Common/Common';
import { MdArrowBackIosNew } from 'react-icons/md';
import ElementComposition from './ElementComposition';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';

const CustomComposition = ({ sidebarOpen, setSidebarOpen }) => {
    CustomComposition.propTypes = {
        sidebarOpen: PropTypes.bool.isRequired,
        setSidebarOpen: PropTypes.func.isRequired,
    };

    const { user, token, userDetails } = useSelector((state) => state.root.auth);
    const authToken = `Bearer ${token}`;

    const navigation = useNavigate();
    const dispatch = useDispatch();
    const [rotate, setRotate] = useState(0);
    const [customCompositionName, setCustomCompositionName] = useState(moment(new Date()).format("YYYY-MM-DD hh:mm A"))
    const [saveLoading, setSaveLoading] = useState(false);
    const [selectResolution, setSelectResolution] = useState(0);
    const [LayoutList, setLayoutList] = useState([])

    const updateComponentSizeAndPosition = debounce(
        (id, newWidth, newHeight, newTop, newLeft) => {
          setLayoutList((prevComponents) =>
            prevComponents.map((comp) =>
              comp.id === id
                ? {
                    ...comp,
                    width: newWidth,
                    height: newHeight,
                    top: newTop,
                    left: newLeft,
                  }
                : comp
            )
          );
        },
        100
      );
  
      const resizeElement = (id, currentInfo, handler) => {
  
        let isMoving = true;
  
        const currentDiv = document.getElementById(id);
        const mouseMove = ({ movementX, movementY }) => {
          if (isMoving) {
            handler(currentDiv, movementX, movementY);
          }
        };
  
        const mouseUp = () => {
          isMoving = false;
          window.removeEventListener("mousemove", mouseMove);
          window.removeEventListener("mouseup", mouseUp);
        };
  
        window.addEventListener("mousemove", mouseMove);
        window.addEventListener("mouseup", mouseUp);
      };
  
      const resizeElementbottom_right = (id, currentInfo) => {
        resizeElement(id, currentInfo, (currentDiv, movementX, movementY) => {
          const newWidth = Math.max(
            parseInt(currentDiv.style.width) + movementX,
            50
          );
          const newHeight = Math.max(
            parseInt(currentDiv.style.height) + movementY,
            50
          );
          currentDiv.style.width = `${newWidth}px`;
          currentDiv.style.height = `${newHeight}px`;
          updateComponentSizeAndPosition(
            id,
            newWidth,
            newHeight,
            parseInt(currentDiv.style.top),
            parseInt(currentDiv.style.left)
          );
        });
      };
  
      const resizeElementtop_left = (id, currentInfo) => {
        resizeElement(id, currentInfo, (currentDiv, movementX, movementY) => {
          const newWidth = Math.max(
            parseInt(currentDiv.style.width) - movementX,
            50
          );
          const newHeight = Math.max(
            parseInt(currentDiv.style.height) - movementY,
            50
          );
          const newTop = parseInt(currentDiv.style.top) + movementY;
          const newLeft = parseInt(currentDiv.style.left) + movementX;
          currentDiv.style.width = `${newWidth}px`;
          currentDiv.style.height = `${newHeight}px`;
          currentDiv.style.top = `${newTop}px`;
          currentDiv.style.left = `${newLeft}px`;
          updateComponentSizeAndPosition(id, newWidth, newHeight, newTop, newLeft);
        });
      };
  
      const resizeElementtop_right = (id, currentInfo) => {
        resizeElement(id, currentInfo, (currentDiv, movementX, movementY) => {
          const newWidth = Math.max(
            parseInt(currentDiv.style.width) + movementX,
            50
          );
          const newHeight = Math.max(
            parseInt(currentDiv.style.height) + movementY,
            50
          );
          currentDiv.style.width = `${newWidth}px`;
          currentDiv.style.height = `${newHeight}px`;
          updateComponentSizeAndPosition(
            id,
            newWidth,
            newHeight,
            parseInt(currentDiv.style.top),
            parseInt(currentDiv.style.left)
          );
        });
      };
      const resizeElementbottom_left = (id, currentInfo) => {
        resizeElement(id, currentInfo, (currentDiv, movementX, movementY) => {
          const newWidth = Math.max(
            parseInt(currentDiv.style.width) + movementX,
            50
          );
          const newHeight = Math.max(
            parseInt(currentDiv.style.height) + movementY,
            50
          );
          currentDiv.style.width = `${newWidth}px`;
          currentDiv.style.height = `${newHeight}px`;
          updateComponentSizeAndPosition(
            id,
            newWidth,
            newHeight,
            parseInt(currentDiv.style.top),
            parseInt(currentDiv.style.left)
          );
        });
      };
  
      const moveElement = (id, currentInfo) => {
        resizeElement(id, currentInfo, (currentDiv, movementX, movementY) => {
          const left = parseInt(currentDiv.style.left) || 0;
          const top = parseInt(currentDiv.style.top) || 0;
          currentDiv.style.left = `${left + movementX}px`;
          currentDiv.style.top = `${top + movementY}px`;
          updateComponentSizeAndPosition(
            id,
            parseInt(currentDiv.style.width),
            parseInt(currentDiv.style.height),
            top + movementY,
            left + movementX
          );
        });
      };
  
      const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };
  
      const createShape = (name, type) => {
        const newPosition = { left: 10, top: 10,bottom:30,right:30 };
  
        const style = {
          id: `component-${LayoutList.length + 1}`,
          name,
          type,
          left: `${newPosition.left}px`,
          top: `${newPosition.top}px`,
          bottom: `${newPosition.bottom}px`,
          right: `${newPosition.right}px`,
          opacity: 1,
          width: 200,
          height: 150,
          rotate,
          zIndex: 2,
          color: getRandomColor(),
          resizeElementbottom_right,
          moveElement,
          resizeElementtop_left,
          resizeElementtop_right,
          resizeElementbottom_left
        };
  
        setLayoutList([...LayoutList, style]);
      };

      
    return (
        <>
            <div className="flex bg-white border-b border-gray">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>
            <div className={userDetails?.isTrial && user?.userDetails?.isRetailer === false && !userDetails?.isActivePlan ? "lg:pt-32 md:pt-32 sm:pt-20 xs:pt-20 px-5 page-contain" : "lg:pt-24 md:pt-24 pt-10 px-5 page-contain"}>
                <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                    <div className="lg:mt-5">
                        <div className="flex flex-col w-full gap-2 items-start mb-3">
                            <div className='flex items-center w-full justify-between flex-row'>
                                <input
                                    type="text"
                                    className="w-72 border border-primary rounded-md px-2 py-1"
                                    placeholder="Enter Custom Layout Name"
                                    value={customCompositionName}
                                    onChange={(e) => setCustomCompositionName(e.target.value)}
                                />
                                <div className='flex gap-3'>
                                    <Link to="/apps">
                                        <button className="flex align-middle border-white bg-SlateBlue text-white sm:mt-2  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                                            <MdArrowBackIosNew className="text-2xl text-white p-1" />
                                            Back
                                        </button>
                                    </Link>
                                    <button
                                        className="flex align-middle border-white bg-SlateBlue text-white sm:mt-2 items-center border rounded-full lg:px-6 sm:px-5 py-2.5 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                        disabled={saveLoading}
                                    >
                                        {saveLoading ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white mt-2 rounded-lg'>
                            <div className='flex flex-row gap-4'>
                                <div className="p-8 w-[650px] h-full">
                                    <div className='flex w-full justify-center items-center'>
                                        <div className={`border rounded-xl p-6`}>
                                            <div className={`border ${selectResolution == 0 ? "w-[576px] h-[324px]" : "w-[270px] h-[480px]"} relative overflow-hidden`}>
                                                {LayoutList?.map((component) => {
                                                    return (
                                                        <div
                                                            key={component.id}
                                                            id={component.id}
                                                            style={{
                                                                position: "absolute",
                                                                left: component.left,
                                                                top: component.top,
                                                                bottom: component.bottom,
                                                                right: component.right,
                                                                width: component.width + "px",
                                                                height: component.height + "px",
                                                                backgroundColor: component.color,
                                                                zIndex: component.zIndex,
                                                                transform: component.rotate
                                                                    ? `rotate(${component.rotate}deg)`
                                                                    : "rotate(0deg)",

                                                            }}
                                                            className="absolute group hover:border-[2px] border border-black hover:border-indigo-500"
                                                        >
                                                            <ElementComposition
                                                            id={component.id}
                                                            info={component}
                                                            resizeElementbottom_right={resizeElementbottom_right}
                                                            moveElement={moveElement}
                                                            resizeElementtop_left={resizeElementtop_left}
                                                            resizeElementtop_right={resizeElementtop_right}
                                                            resizeElementbottom_left={resizeElementbottom_left}
                                                            />
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-l-2 border-lightgray px-3"></div>
                                <div className="col-span-5 p-2 w-full">
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-xl font-semibold'>Resolution</label>
                                        <select
                                            className="w-64 border rounded-full p-3 relative"
                                            onChange={(e) => setSelectResolution(e.target.value)}
                                            value={selectResolution}
                                        >
                                            {CustomLayout?.map((item) => {
                                                return (
                                                    <option value={item?.id} key={item?.id}>{item?.value}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className='h-[260px]'>
                                        {LayoutList?.map((item, index) => {
                                            return (
                                                <div className='flex flex-row items-center gap-2 mt-2' key={index}>
                                                    <label className='w-28'>Section:- {index + 1}</label>
                                                    <div className='flex items-center px-2'>
                                                        <div className="flex flex-row gap-2 items-center">
                                                            <h6>Width</h6>
                                                            <h6 className="border border-bg-gray-200k p-1 ml-2 mr-2 rounded-lg w-[60px] flex items-center justify-center">
                                                                {item.width}
                                                            </h6>
                                                        </div>
                                                        <label>Pixels,</label>
                                                    </div>
                                                    <div className='flex items-center px-2'>
                                                        <div className="flex flex-row gap-2 items-center">
                                                            <h6>Height</h6>
                                                            <h6 className="border border-bg-gray-200k p-1 ml-2 mr-2 rounded-lg w-[60px] flex items-center justify-center">
                                                                {item.height}
                                                            </h6>
                                                        </div>
                                                        <label>Pixels</label>
                                                    </div>
                                                     <div className='flex items-center px-2'>
                                                        <div className="flex flex-row gap-2 items-center">
                                                            <h6>Top</h6>
                                                            <h6 className="border border-bg-gray-200k p-1 ml-2 mr-2 rounded-lg w-[60px] flex items-center justify-center">
                                                                {item.top}
                                                            </h6>
                                                        </div>
                                                        <label>Pixels</label>
                                                    </div>
                                                     <div className='flex items-center px-2'>
                                                        <div className="flex flex-row gap-2 items-center">
                                                            <h6>Left</h6>
                                                            <h6 className="border border-bg-gray-200k p-1 ml-2 mr-2 rounded-lg w-[60px] flex items-center justify-center">
                                                                {item.left}
                                                            </h6>
                                                        </div>
                                                        <label>Pixels</label>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className='w-full flex justify-center items-center'>
                                        <div className="my-6">
                                            <h4>
                                                Click
                                                <span
                                                    className="text-blue-500 cursor-pointer underline"
                                                    onClick={() => {
                                                        if (LayoutList?.length < 6) {
                                                            createShape("Shape", "rect")
                                                        } else {
                                                            toast.error("You can only Create 6 Section")
                                                        }
                                                    }}
                                                >
                                                    (Add Section)
                                                </span>
                                                to add a new Section
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default CustomComposition
