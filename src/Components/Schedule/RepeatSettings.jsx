import React, { useState } from "react";

const RepeatSettings = ({ repeatSettings, onSaveRepeatSettings, onClose }) => {
  // State to store the repeat settings form data
  const [formData, setFormData] = useState(repeatSettings || {});

  // Function to handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Function to handle the save button click
  const handleSave = () => {
    onSaveRepeatSettings(formData);
  };
  return (
    <>
      <div className="p-4 bg-white rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Repeat Settings</h3>
        <div className="mb-2">
          <label className="block font-medium">Repeat Frequency:</label>
          <input
            type="text"
            name="frequency"
            value={formData.frequency || ""}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            placeholder="E.g., Daily, Weekly, Monthly, etc."
          />
        </div>
        {/* Add more repeat settings fields here */}
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="ml-2 border px-4 py-2 rounded"
            onClick={() => onClose()}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default RepeatSettings;
