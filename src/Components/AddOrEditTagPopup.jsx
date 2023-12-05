import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const AddOrEditTagPopup = ({
  setShowTagModal,
  tags,
  setTags,
  handleTagsUpdate,
  from,
  handleUpdateTagsOfComposition,
  setTagUpdateScreeen,
  setUpdateTagComposition,
  handleUpadteScheduleTags,
  setUpdateTagSchedule,
}) => {
  const [tagValue, setTagValue] = useState("");

  const inputRef = useRef(null);

  function handleClickOutside() {
    setShowTagModal(false);
    setTags([]);
    if (from === "screen") {
      setTagUpdateScreeen(null);
    }
    if (from === "composition") {
      setUpdateTagComposition(null);
    }
    if (from === "schedule") {
      setUpdateTagSchedule(null)
    }
  }

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagValue === "") return;
    setTags([...tags, tagValue]);
    setTagValue("");
    if (from === "screen") {
      handleTagsUpdate([...tags, tagValue].join(","));
    }
    if (from === "composition") {
      return handleUpdateTagsOfComposition([...tags, tagValue].join(","));
    }
    if (from === "schedule") {
      return handleUpadteScheduleTags([...tags, tagValue].join(","));
    }
  };

  const handleDeleteTag = (val) => {
    const newTags = tags.filter((tag) => tag !== val);
    setTags(newTags);
    if (from === "screen") {
      handleTagsUpdate(newTags.join(","));
    }
    if (from === "composition") {
      return handleUpdateTagsOfComposition(newTags.join(","));
    }
    if (from === "schedule") {
      return handleUpadteScheduleTags(newTags.join(","));
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // console.log(tags);
  return (
    <>
      <div
        onClick={() => handleClickOutside(false)}
        className="inset-0 fixed z-10 bg-black/20"
      ></div>
      <div className=" bg-white z-40 space-y-3 overflow-y-scroll hide_scrollbar absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  min-w-[50%] min-h-[50%] max-w-[50%] max-h-[50%] p-5 rounded-lg">
        <div className="flex items-center justify-between w-full bg-white sticky -top-3">
          <h3 className="text-left font-semibold text-3xl sticky top-0 bg-white w-full">
            Add Tags
          </h3>
          <AiOutlineClose
            size={30}
            className=" cursor-pointer  bg-black text-white rounded-full w-6 h-6 -right-0 -top-0"
            onClick={() => handleClickOutside(false)}
          />
        </div>
        <div className="flex items-center gap-3 flwro w-full h-full flex-wrap overflow-y-scroll hide_scrollbar">
          <ul className="flex items-center gap-3 flex-wrap flex-initial h-full overflow-y-scroll hide_scrollbar">
            {tags.length > 0 &&
              tags.map((tag, index) => (
                <li
                  key={index}
                  className="flex items-center gap-1 border border-black/40 rounded-lg p-1"
                >
                  {tag}
                  <AiOutlineClose
                    size={10}
                    className=" cursor-pointer text-black w-5 h-5 bg-lightgray p-1"
                    onClick={() => handleDeleteTag(tag)}
                  />
                </li>
              ))}
          </ul>
          <form
            onSubmit={(e) => handleAddTag(e)}
            className="flex-initial w-fit"
          >
            <input
              ref={inputRef}
              type="text"
              className="border h-auto rounded-lg p-1 w-full"
              onChange={(e) => setTagValue(e.target.value)}
              value={tagValue}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default AddOrEditTagPopup;