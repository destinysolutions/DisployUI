import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineClose, AiOutlineCloseCircle } from "react-icons/ai";

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
  handleUpdateTagsYoutube,
  handleUpdateTagsTextScroll,
  handleUpdateTagsDitigitalMenu,
  setUpdateTextscrollTag,
  setUpdateTagYoutube,
  handleUpdateTagsWeather,
  setUpdateTagWeather,
  setUpdateDigitalMenuTag,
  action,
}) => {
  const [tagValue, setTagValue] = useState("");

  const inputRef = useRef(null);

  function handleClickOutside() {
    setShowTagModal(false);
    if (action !== "create") {
      setTags([]);
    }
    if (from === "screen") {
      setTagUpdateScreeen(null);
    }
    if (from === "composition") {
      setUpdateTagComposition(null);
    }
    if (from === "youtube") {
      setUpdateTagYoutube(null);
    }
    if (from === "weather") {
      setUpdateTagWeather(null);
    }
    if (from === "textscroll") {
      setUpdateTextscrollTag(null);
    }
    if(from === "digitalMenu"){
      setUpdateDigitalMenuTag(null);
    }
  }

  const handleAddTag = (e) => {
    e.preventDefault();

    if (!tagValue.replace(/\s/g, "").length) {
      toast.remove();
      return toast.error("Please enter some text.");
    }
    toast.remove();
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
    if (from === "youtube") {
      return handleUpdateTagsYoutube([...tags, tagValue].join(","));
    }
    if (from === "weather") {
      return handleUpdateTagsWeather([...tags, tagValue].join(","));
    }
    if (from === "textscroll") {
      return handleUpdateTagsTextScroll([...tags, tagValue].join(","));
    }
    if(from === "digitalMenu"){
      return handleUpdateTagsDitigitalMenu([...tags, tagValue].join(","))
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
    if (from === "youtube") {
      return handleUpdateTagsYoutube(newTags.join(","));
    }
    if (from === "weather") {
      return handleUpdateTagsWeather(newTags.join(","));
    }
    if (from === "textscroll") {
      return handleUpdateTagsTextScroll(newTags.join(","));
    }
    if(from === "digitalMenu"){
      return handleUpdateTagsDitigitalMenu(newTags.join(","))
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <>
      <div
        onClick={() => handleClickOutside(false)}
        className="inset-0 fixed z-9990 bg-black/20"
      ></div>
      <div className=" bg-white z-9999 space-y-3 overflow-y-scroll hide_scrollbar fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 min-w-80vw max-h-[50vh] max-w-[50vw] min-h-[50vh] min-w-[50vw] p-5 rounded-lg">
        <div className="flex items-center justify-between w-full bg-white sticky -top-6 p-2">
          <h3 className="text-left font-semibold text-3xl sticky top-0 bg-white w-full">
            Add Tags
          </h3>
          <button onClick={() => handleClickOutside(false)}>
            <AiOutlineCloseCircle className="text-2xl" />
          </button>
        </div>
        <div className="flex items-center gap-3 flwro w-full h-full flex-wrap overflow-y-scroll hide_scrollbar">
          <ul className="flex items-center gap-3 flex-wrap flex-initial h-full overflow-y-scroll hide_scrollbar">
            {tags?.length > 0 &&
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
