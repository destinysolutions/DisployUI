import React from "react";

const ResizeHandle = ({ position, onMouseDown }) => (
  <div
    onMouseDown={onMouseDown}
    className={`hidden absolute group-hover:block w-[10px] h-[10px] cursor-nwse-resize bg-green-500 z-[99999] ${position}`}
  ></div>
);
const ResizeHandlefull = ({ position, onMouseDown }) => (
  <div
    onMouseDown={onMouseDown}
    className={`hidden absolute group-hover:block w-full h-full bg-transparent z-[99999] ${position}`}
  ></div>
);

const ElementComposition = ({ id, info, exId }) => {
  const resizePositions = [
    "-bottom-[5px] -right-[4px]",
    "-top-[3px] -right-[3px]",
    "-bottom-[3px] -left-[3px]",
    "-top-[3px] -left-[3px]",
  ];

  return (
    <>
      {resizePositions.map((position, index) => (
        <ResizeHandle
          key={index}
          position={position}
          onMouseDown={(e) => info.resizeElement(exId || id, info)}
        />
      ))}

      <ResizeHandle
        position="-top-[3px] -left-[3px]"
        onMouseDown={(e) => info.rotateElement(id, info)}
      />

      <ResizeHandlefull
        position="-top-[px] left-[0%] translate-[-50%,0%]"
        onMouseDown={(e) => info.moveElement(id, info)}
      />
    </>
  );
};

export default ElementComposition;
