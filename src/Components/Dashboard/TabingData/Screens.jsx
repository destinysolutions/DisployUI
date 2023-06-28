import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { AiOutlineSearch } from "react-icons/ai";
import "../../../Styles/dashboard.css";

const Screens = () => {
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
      selector: (row) => row.ipaddress,
      sortable: true,
    },
    {
      name: "Operating System",
      selector: (row) => row.operatingsystem,
      sortable: true,
    },
    {
      name: "Lastseen",
      selector: (row) => row.lastseen,
      sortable: true,
    },
  ];
  const data = [
    {
      id: 1,
      tvmodel: "S01-5000035",
      googlelocation: "132, My Street, Kingston, New York 12401.",
      ipaddress: "192.168.1.1",
      operatingsystem: "Android TV",
      lastseen: "25 May 2023",
    },
    {
      id: 2,
      tvmodel: "S01-5000035",
      googlelocation: "132, My Street, Kingston, New York 12401.",
      ipaddress: "192.168.1.1",
      operatingsystem: "Android TV",
      lastseen: "25 May 2023",
    },
    {
      id: 3,
      tvmodel: "S01-5000035",
      googlelocation: "132, My Street, Kingston, New York 12401.",
      ipaddress: "192.168.1.1",
      operatingsystem: "Android TV",
      lastseen: "25 May 2023",
    },
    {
      id: 4,
      tvmodel: "S01-5000035",
      googlelocation: "132, My Street, Kingston, New York 12401.",
      ipaddress: "192.168.1.1",
      operatingsystem: "Android TV",
      lastseen: "25 May 2023",
    },

    {
      id: 5,
      tvmodel: "S01-5000035",
      googlelocation: "132, My Street, Kingston, New York 12401.",
      ipaddress: "192.168.1.1",
      operatingsystem: "Android TV",
      lastseen: "25 May 2023",
    },
    {
      id: 6,
      tvmodel: "S01-5000035",
      googlelocation: "132, My Street, Kingston, New York 12401.",
      ipaddress: "192.168.1.1",
      operatingsystem: "Android TV",
      lastseen: "25 May 2023",
    },
    {
      id: 7,
      tvmodel: "S01-5000035",
      googlelocation: "132, My Street, Kingston, New York 12401.",
      ipaddress: "192.168.1.1",
      operatingsystem: "Android TV",
      lastseen: "25 May 2023",
    },
    {
      id: 8,
      tvmodel: "S01-5000035",
      googlelocation: "132, My Street, Kingston, New York 12401.",
      ipaddress: "192.168.1.1",
      operatingsystem: "Android TV",
      lastseen: "25 May 2023",
    },
    {
      id: 9,
      tvmodel: "S01-5000035",
      googlelocation: "132, My Street, Kingston, New York 12401.",
      ipaddress: "192.168.1.1",
      operatingsystem: "Android TV",
      lastseen: "25 May 2023",
    },
    {
      id: 10,
      tvmodel: "S01-5000035",
      googlelocation: "132, My Street, Kingston, New York 12401.",
      ipaddress: "192.168.1.1",
      operatingsystem: "Android TV",
      lastseen: "25 May 2023",
    },
    {
      id: 11,
      tvmodel: "S01-5000036",
      googlelocation: "136, My Street, Kingston, New York 12401.",
      ipaddress: "192.168.1.1",
      operatingsystem: "Android TV",
      lastseen: "26 May 2023",
    },
  ];
  const [records, setRecords] = useState(data);

  function handleFilter(event) {
    const newData = data.filter((row) => {
      return row.tvmodel
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    setRecords(newData);
  }
  return (
    <div>
      <div className="text-right mb-5 mr-5 flex items-end justify-end relative sm:mr-0">
        <AiOutlineSearch className="absolute top-[14px] right-[230px] z-10 text-gray searchicon" />
        <input
          type="text"
          placeholder=" Search Users "
          className="border border-gray rounded-full px-7 py-2 search-user"
          onChange={handleFilter}
        />
      </div>
      <DataTable
        columns={column}
        data={records}
        fixedHeader
        pagination
        paginationPerPage={10}
      ></DataTable>
    </div>
  );
};

export default Screens;
