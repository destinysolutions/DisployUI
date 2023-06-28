import React, { useState } from "react";
import DataTable from "react-data-table-component";
import "../../../Styles/dashboard.css";
import { AiOutlineSearch } from "react-icons/ai";
import { CiMenuKebab } from "react-icons/ci";
import { NavLink } from "react-router-dom";
const Users = () => {
  const column = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "PhoneNo",
      selector: (row) => row.phoneno,
      sortable: true,
    },
    {
      name: "Brand",
      selector: (row) => row.brand,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <button onClick={() => handleActionClick(row.name)}>
          <CiMenuKebab />
        </button>
      ),
    },
  ];
  const data = [
    {
      id: 1,
      name: "Dhara Patel",
      email: "dharapatel123@gmail.com",
      phoneno: "+91 9856325741",
      brand: "ABC Brand",
    },
    {
      id: 2,
      name: "Hetal Prajapati",
      email: "Hetal123@gmail.com",
      phoneno: "+91 7556325741",
      brand: "hetal Brand",
    },
    {
      id: 3,
      name: "Bhumi Patel",
      email: "bhumi123@gmail.com",
      phoneno: "+91 6356325741",
      brand: "bhumi Brand",
    },
    {
      id: 4,
      name: "Bhavik Patel",
      email: "bhavik123@gmail.com",
      phoneno: "+91 9956325741",
      brand: "XYZ Brand",
    },
    {
      id: 5,
      name: "Palash Patel",
      email: "palash123@gmail.com",
      phoneno: "+91 9556325741",
      brand: "ABC Brand",
    },
    {
      id: 6,
      name: "Vishmay Patel",
      email: "vishmay123@gmail.com",
      phoneno: "+91 9356325741",
      brand: "vish Brand",
    },
    {
      id: 7,
      name: "Vruksha Ballar",
      email: "vru123@gmail.com",
      phoneno: "+91 6326325741",
      brand: "Vru Brand",
    },
    {
      id: 8,
      name: "Akshay Patel",
      email: "Akshay123@gmail.com",
      phoneno: "+91 9985325741",
      brand: "Sundari Brand",
    },
    {
      id: 9,
      name: "Hely Thummar",
      email: "hely123@gmail.com",
      phoneno: "+91 9285325741",
      brand: "Hely Brand",
    },
    {
      id: 10,
      name: "Henil Thummar",
      email: "henil123@gmail.com",
      phoneno: "+91 9285325141",
      brand: "Hely Brand",
    },
    {
      id: 11,
      name: "Akshay Patel",
      email: "Akshay123@gmail.com",
      phoneno: "+91 9985325741",
      brand: "Sundari Brand",
    },
    {
      id: 12,
      name: "Hely Thummar",
      email: "hely123@gmail.com",
      phoneno: "+91 9285325741",
      brand: "Hely Brand",
    },
    {
      id: 13,
      name: "Henil Thummar",
      email: "henil123@gmail.com",
      phoneno: "+91 9285325141",
      brand: "Hely Brand",
    },
  ];
  const [records, setRecords] = useState(data);

  function handleFilter(event) {
    const newData = data.filter((row) => {
      return row.name.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setRecords(newData);
  }

  const [showActionBox, setShowActionBox] = useState(false);
  const handleActionClick = (e) => {
    setShowActionBox(!showActionBox);
  };

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
        fixedHeaderScrollHeight="500px"
        pagination
        paginationPerPage={10}
      ></DataTable>
      {showActionBox && (
        <>
          <div className="absolute top-[27%] right-[18%]  bg-white rounded-lg shadow-2xl z-10">
            <div className="block text-sm p-2 relative actionpopup">
              <div className="w-full mb-1">
                <NavLink to={""}>Edit</NavLink>
              </div>
              <div className="w-full mb-1">
                <NavLink to={""}>View Profile</NavLink>
              </div>
              <div className="w-full mb-1 text-green">
                <NavLink to={""}>Active User</NavLink>
              </div>
              <div className="w-full mb-1 text-red">
                <NavLink to={""}>Delete</NavLink>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;
