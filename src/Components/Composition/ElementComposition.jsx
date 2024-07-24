import React from "react";

const ResizeHandle = ({ position, onMouseDown, cursor }) => (
  <div
    onMouseDown={onMouseDown}
    className={`hidden absolute group-hover:block w-[10px] h-[10px] ${cursor} bg-green-500 z-[99999] ${position}`}
  ></div>
);

const ResizeHandleFull = ({ onMouseDown }) => (
  <div
    onMouseDown={onMouseDown}
    className="absolute w-full h-full bg-transparent z-[99999] cursor-move"
  ></div>
);

const ElementComposition = ({ id, info }) => {
  const resizeHandles = [
    { position: "-bottom-[5px] -right-[4px]", cursor: "cursor-nwse-resize", resizeFn: info.resizeElementbottom_right }, // Bottom-right
    { position: "-top-[3px] -right-[3px]", cursor: "cursor-nesw-resize", resizeFn: info.resizeElementtop_right }, // Top-right
    { position: "-bottom-[3px] -left-[3px]", cursor: "cursor-nesw-resize", resizeFn: info.resizeElementbottom_left }, // Bottom-left
    { position: "-top-[3px] -left-[3px]", cursor: "cursor-nwse-resize", resizeFn: info.resizeElementtop_left }, // Top-left
  ];

  return (
    <>
      {resizeHandles.map(({ position, cursor, resizeFn }, index) => (
        <ResizeHandle
          key={index}
          position={position}
          cursor={cursor}
          onMouseDown={(e) => resizeFn(id, info)}
        />
      ))}
      <ResizeHandleFull onMouseDown={(e) => info.moveElement(id, info)} />
    </>
  );
};

export default ElementComposition;
