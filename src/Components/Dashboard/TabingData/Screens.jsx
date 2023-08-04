import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { AiOutlineSearch } from "react-icons/ai";
import "../../../Styles/dashboard.css";
import axios from "axios";
import { ALL_SCREEN_URL } from "../../../Pages/Api";

const Screens = () => {
  const [screenData, setScreenData] = useState([]);
  useEffect(() => {
    axios
      .get(ALL_SCREEN_URL)
      .then((response) => {
        const fetchedData = response.data.data;
        setScreenData(fetchedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const column = [
    {
      name: "TV Model",
      selector: (row) => row.tvmodel,
      sortable: true,
    },
    {
      name: "Google Location",
      selector: (row) => row.googlelocation,
      sortable: true,
    },
    {
      name: "IP Address",
      selector: (row) => row.ipAddress,
      sortable: true,
    },
    {
      name: "Operating System",
      selector: (row) => row.operatingsystem,
      sortable: true,
    },
    {
      name: "Lastseen",
      selector: (row) => {
        const lastSeenDate = new Date(row.lastseen);
        const formattedDate = lastSeenDate.toLocaleDateString();
        const formattedTime = lastSeenDate.toLocaleTimeString();
        return `${formattedDate} ${formattedTime}`;
      },
      sortable: true,
    },
  ];

  function handleFilter(event) {
    const newData = screenData.filter((row) => {
      return row.tvmodel
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    setScreenData(newData);
  }
  return (
    <div className="bg-white p-3 rounded-md">
      <div className="text-right mb-5 mr-5 flex items-end justify-end relative sm:mr-0">
        <AiOutlineSearch className="absolute top-[13px] right-[220px] z-10 text-gray searchicon" />
        <input
          type="text"
          placeholder=" Search Users "
          className="border border-gray rounded-full px-7 py-2 search-user"
          onChange={handleFilter}
        />
      </div>
      <DataTable
        columns={column}
        data={screenData}
        fixedHeader
        pagination
        paginationPerPage={10}
      ></DataTable>
    </div>
  );
};

export default Screens;
