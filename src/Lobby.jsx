import React from "react";
import { useState } from "react";

const Lobby = ({ SendMessage }) => {
  const [user, setUser] = useState();
  const [assetURL, setAssetURL] = useState();
  const [type, setType] = useState("Pause");

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          SendMessage(user, assetURL, type);
        }}
      >
        <div className="my-4">
          <input
            className="bg-gray-200 appearance-none border border-[#D5E3FF] rounded  py-2 px-3 mx-2"
            placeholder="name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            className="bg-gray-200 appearance-none border border-[#D5E3FF] rounded  py-2 px-3 mx-2"
            placeholder="assetURL"
            value={assetURL}
            onChange={(e) => setAssetURL(e.target.value)}
          />
          <select
            className="px-2 py-2 border border-[#D5E3FF] bg-white rounded  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mx-2"
            id="Action"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Pause">Pause</option>
            <option value="Play">Play</option>
          </select>
          <button
            type="submit"
            disabled={!user || !assetURL}
            className="bg-primary text-white rounded-full px-5 py-2 hover:bg-SlateBlue ml-3"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Lobby;
