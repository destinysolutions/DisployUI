import React, { useState } from "react";
import ReactModal from "react-modal";

const RepeatSettings = ({ repeatSettings, onSaveRepeatSettings, onClose }) => {
  const [repeatPattern, setRepeatPattern] = useState(
    repeatSettings?.repeatPattern || "daily"
  );
  const [endDate, setEndDate] = useState(repeatSettings?.endDate || null);
  const [showWeekday, setShowWeekday] = useState(false);
  const [showEndTime, setShowEndTime] = useState(
    repeatSettings?.endTime ? true : false
  );

  // Function to handle the save button click
  const handleSaveSettings = () => {
    // Prepare the repeat settings object
    const repeatSettings = {
      repeatPattern,
      endDate,
    };

    // Add weekday and endTime if applicable
    if (showWeekday) {
      repeatSettings.weekday = document.getElementById("weekday").value;
    }
    if (showEndTime) {
      repeatSettings.endTime = document.getElementById("endTime").value;
    }

    // Pass the repeat settings back to the parent component
    onSaveRepeatSettings(repeatSettings);

    // Close the repeat settings modal
    onClose();
  };

  // Function to toggle showing the end time input
  const toggleShowEndTime = () => {
    setShowEndTime(!showEndTime);
  };

  // Function to handle the repeat pattern change
  const handleRepeatPatternChange = (e) => {
    const selectedPattern = e.target.value;
    setRepeatPattern(selectedPattern);

    // Update the visibility of the fields based on the selected pattern
    if (selectedPattern === "weekly") {
      setShowWeekday(true);
      setShowEndTime(true);
    } else {
      setShowWeekday(false);
      setShowEndTime(true);
    }
  };
  const buttons = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  return (
    <>
      <ReactModal
        isOpen={true} // Always open for RepeatSettings modal
        onRequestClose={onClose}
        contentLabel="Repeat Settings Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            height: "50%",
            width: "50%",
            margin: "auto",
          },
        }}
      >
        <div>
          <label>Repeat :</label>
          <select
            value={repeatPattern}
            onChange={handleRepeatPatternChange}
            className="border border-[#D5E3FF] px-3 py-1 rounded-full ml-3"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            {/* Add more options based on your requirements */}
          </select>
        </div>

        <div className="flex mt-5">
          <div>
            <label className="ml-3">Start Date:</label>
            <div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-[#D5E3FF] px-3 py-1 rounded-full mt-2"
              />
            </div>
          </div>
          <div className="ml-9">
            <label className="ml-3">End Date:</label>
            <div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-[#D5E3FF] px-3 py-1 rounded-full mt-2"
              />
            </div>
          </div>
        </div>

        {repeatPattern === "weekly" && (
          <div className="mt-5 text-black font-medium text-lg">
            <label>Repeat 0 Day</label>
          </div>
        )}
        <div className="flex mt-5">
          <div>
            {showEndTime && (
              <div>
                <label className="ml-2">Start Time</label>
                <div>
                  <input
                    type="time"
                    id="endTime"
                    className="bg-[#E4E6FF] px-3 py-1 rounded-full mt-2"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="ml-9">
            {showEndTime && (
              <div>
                <label className="ml-2">End Time</label>
                <div>
                  <input
                    type="time"
                    id="endTime"
                    className="bg-[#E4E6FF] px-3 py-1 rounded-full mt-2"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {repeatPattern === "weekly" && (
          <div className="mt-5 text-black font-medium text-lg">
            <input type="checkbox" />

            <label className="ml-3">Repeat for All Day</label>
          </div>
        )}
        {showWeekday && (
          <div>
            {/* <label>Weekday:</label> */}

            {buttons.map((label, index) => (
              <button
                className="daysbtn"
                key={index}
                // onClick={() =>
                //   handleButtonClick(index)
                // }
                // style={{
                //   backgroundColor:
                //     buttonStates[index]
                //       ? "#fff"
                //       : " #00072e",
                //   color: buttonStates[index]
                //     ? "#41479b"
                //     : "#fff",
                // }}
              >
                {label}
              </button>
            ))}

            {/* <select id="weekday">
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select> */}
          </div>
        )}

        <div className="flex justify-center mt-9">
          <button
            onClick={handleSaveSettings}
            className="border border-primary px-3 py-1 rounded-full"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="border border-primary px-3 py-1 rounded-full ml-3"
          >
            Cancel
          </button>
        </div>
      </ReactModal>
    </>
  );
};

export default RepeatSettings;
