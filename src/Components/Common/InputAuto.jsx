import React, { useState } from "react";
import { FiMapPin } from "react-icons/fi";

const InputAuto = ({  pholder, data, onSelected, onChange,handleKeyPress,selectedVal,setSelectedVal }) => {
  const [suggestions, setSugesstions] = useState([]);
  const [isHideSuggs, setIsHideSuggs] = useState(false);

  const handler = (e) => {
    const inputValue = e.target.value.toLowerCase();
    setSugesstions(data.filter((i) => i.toLowerCase().includes(inputValue)));
  };

  const handleChange = (e) => {
    const input = e.target.value;
    setIsHideSuggs(false);
    setSelectedVal(input);
    onChange(input);
  };

  const hideSuggs = (value) => {
    onSelected(value);
    // setSelectedVal(value);
    setIsHideSuggs(true);
  };

  return (
    <div className="sugesstion-auto">
      <div className="relative col-span-2">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FiMapPin className="w-5 h-5 text-black " />
        </span>
        <input
          placeholder={pholder}
          type="search"
          value={selectedVal}
          onChange={handleChange}
          onKeyUp={handler}
          // onKeyPress={handleKeyPress}
          className="border border-primary rounded-lg px-7 pl-10 py-2 w-full"
        />
      </div>

      <div
        className="suggestions"
        style={{ display: isHideSuggs ? "none" : "block" }}
      >
        {suggestions.map((item, idx) => (
          <div
            key={"" + item + idx}
            onClick={() => {
              hideSuggs(item);
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputAuto;
