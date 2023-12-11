import React from "react";
import DataTable from "react-data-table-component";
import "../../images/DisployImg/india.png";

const RevenueTable = () => {
  const revenueData = [
    {
      id: 1,
      flagImg: (
        <img src="../../../public/DisployImg/india.png" className="h-8 w-8" />
      ),
      country: "India",
      total:'377,620',
      users: "45679(24.3%)",
      transactions: "35(19.7%)",
      revenue: "$5432(16.9%)",
      convRate: "10.23%",
    },
    {
      id: 2,
      flagImg: (
        <img
          src="../../../public/DisployImg/united-states.png"
          className="h-8 w-8"
        />
      ),
      country: "USA",
      users: "92896(41.6%)",
      transactions: "67(34.3%)",
      revenue: "$7560(36.9%)",
      convRate: "14.01%",
    },
    {
      id: 3,
      flagImg: (
        <img
          src="../../../public/DisployImg/australia.png"
          className="h-8 w-8"
        />
      ),
      country: "Australia",
      users: "45679(24.3%)",
      transactions: "35(19.7%)",
      revenue: "$5432(16.9%)",
      convRate: "10.23%",
    },
    {
      id: 4,
      flagImg: (
        <img
          src="../../../public/DisployImg/indonesia.png"
          className="h-8 w-8"
        />
      ),
      country: "Indonesia",
      users: "45679(24.3%)",
      transactions: "35(19.7%)",
      revenue: "$5432(16.9%)",
      convRate: "10.23%",
    },
    {
      id: 5,
      flagImg: (
        <img src="../../../public/DisployImg/japan.png" className="h-8 w-8" />
      ),
      country: "Japan",
      users: "45679(24.3%)",
      transactions: "35(19.7%)",
      revenue: "$5432(16.9%)",
      convRate: "10.23%",
    },
    {
      id: 6,
      flagImg: (
        <img src="../../../public/DisployImg/china.png" className="h-8 w-8" />
      ),
      country: "China",
      users: "45679(24.3%)",
      transactions: "35(19.7%)",
      revenue: "$5432(16.9%)",
      convRate: "10.23%",
    },
    {
      id: 7,
      flagImg: (
        <img src="../../../public/DisployImg/vietnam.png" className="h-8 w-8" />
      ),
      country: "Vietnam",
      users: "45679(24.3%)",
      transactions: "35(19.7%)",
      revenue: "$5432(16.9%)",
      convRate: "10.23%",
    },
    {
      id: 8,
      flagImg: (
        <img src="../../../public/DisployImg/russia.png" className="h-8 w-8" />
      ),
      country: "Russia",
      users: "45679(24.3%)",
      transactions: "35(19.7%)",
      revenue: "$5432(16.9%)",
      convRate: "10.23%",
    },
    {
      id: 9,
      flagImg: (
        <img
          src="../../../public/DisployImg/united-kingdom.png"
          className="h-8 w-8"
        />
      ),
      country: "United Kingdom",
      users: "45679(24.3%)",
      transactions: "35(19.7%)",
      revenue: "$5432(16.9%)",
      convRate: "10.23%",
    },
    {
      id: 10,
      flagImg: (
        <img
          src="../../../public/DisployImg/south-korea.png"
          className="h-8 w-8"
        />
      ),
      country: "South Korea",
      users: "45679(24.3%)",
      transactions: "35(19.7%)",
      revenue: "$5432(16.9%)",
      convRate: "10.23%",
    },
  ];

  const column = [

    {
      name: "COUNTRY",
      cell: (row) => (
        <div className="flex items-center w-[600px]">
            <div className="mr-4">{row.id}</div>
          <div className="mr-3">{row.flagImg}</div>
          <span>{row.country}</span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "USERS",
      selector: (row) => row.users,
      sortable: true,
    },
    {
      name: "TRANSACTIONS",
      selector: (row) => row.transactions,
      sortable: true,
    },
    {
      name: "REVENUE",
      selector: (row) => row.revenue,
      sortable: true,
    },
    {
      name: "CONV.RATE",
      selector: (row) => row.convRate,
      sortable: true,
    },
  ];
  return (
    <>
      <div className="bg-white p-5 rounded-md">
        <div>
          <label className="font-semibold text-xl">
            Top regions by revenue
          </label>
          <div className="mt-2">
            <label className="text-base">
              Where you generated most of the revenue
            </label>
          </div>
        </div>
        <div className="mt-4">
          <DataTable
            columns={column}
            data={revenueData}
            fixedHeader
            pagination
            paginationPerPage={5}
          ></DataTable>
        </div>
      </div>
    </>
  );
};

export default RevenueTable;
