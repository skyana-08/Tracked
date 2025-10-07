import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";
import Popup from "../../Components/Popup";

import ArrowDown from "../../assets/ArrowDown(Light).svg";
import Search from "../../assets/Search.svg";
import ArchiveRow from "../../assets/ArchiveRow(Light).svg";
import Details from "../../assets/Details(Light).svg";
import Import from "../../assets/Import(Light).svg";

export default function AdminImport() {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Fetch Professors and Students
  useEffect(() => {
    fetch("http://localhost/TrackEd/src/Pages/Admin/getUsers.php")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Sidebar role="admin" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={`transition-all duration-300 ${
          isOpen ? "lg:ml-[250px] xl:ml-[280px] 2xl:ml-[300px]" : "ml-0"
        }`}
      >
        <Header setIsOpen={setIsOpen} isOpen={isOpen} />

        {/* content of ADMIN IMPORT */}
        <div className="p-3 sm:p-4 md:p-5 lg:p-5 xl:p-5">
          {/* "Header" */}
          <div className="flex flex-col sm:flex-row item-start sm:items-center mb-2 sm:mb-4">
            <div className="flex items-center mb-2 sm:mb-0">
              <img
                src={Import}
                alt="Import"
                className="h-7 w-7 sm:h-6 sm:w-7 md:h-7 md:w-7 mr-3 sm:mr-3 mt-0.5 ml-2"
              />
              <h1 className="font-bold text-xl sm:text-xl md:text-xl lg:text-[1.5rem] text-[#465746]">
                Import
              </h1>
            </div>
          </div>

          <div className="text-sm sm:text-base md:text-base lg:text-[1.125rem] text-[#465746] mb-4 sm:mb-5 ml-2">
            <span className="mb-0 sm:mb-0">Import Databases for TrackED</span>
          </div>

          <hr className="opacity-60 border-[#465746] rounded border-1 mb-6" />

          {/* BUTTONS */}
          <div className="flex flex-col lg:flex-row mt-4 sm:mt-5 text-sm sm:text-sm md:text-base lg:text-[1.125rem] text-[#465746] gap-4 lg:justify-between lg:items-center">
            {/* Filter Import Backup BUTTONS */}
            <div className="flex flex-wrap gap-2">
              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center font-bold px-3 py-2 bg-[#fff] rounded-md w-32 sm:w-36 md:w-44 lg:w-40 shadow-md hover:border-[#00874E] hover:border-2 text-xs sm:text-sm lg:text-[1.125rem] cursor-pointer"
                >
                  Filter
                  <img
                    src={ArrowDown}
                    alt="ArrowDown"
                    className="ml-15 h-5 w-5 sm:h-6 sm:w-6 md:h-6 md:w-6 lg:h-7 lg:w-7"
                  />
                </button>

                {open && (
                  <div className="absolute top-full mt-1 bg-white rounded-md w-32 sm:w-36 md:w-44 lg:w-40 shadow-lg border border-gray-200 z-10">
                    {["Year", "Section", "Active", "Deactivated"].map((f) => (
                      <button
                        key={f}
                        className="block px-3 py-2 w-full text-left hover:bg-gray-100 text-xs sm:text-sm md:text-base transition-colors duration-200 cursor-pointer"
                        onClick={() => setOpen(false)}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="font-bold px-3 py-2 bg-[#fff] rounded-md shadow-md hover:border-[#00874E] hover:border-2 text-xs sm:text-sm whitespace-nowrap lg:text-[1.125rem] cursor-pointer">
                Import Database
              </button>

              <button className="font-bold px-3 py-2 bg-[#fff] rounded-md shadow-md hover:border-[#00874E] hover:border-2 text-xs sm:text-sm lg:text-[1.125rem] cursor-pointer">
                Backup
              </button>
            </div>

            {/* Search Button */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 lg:w-64 xl:w-80">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-9 sm:h-10 lg:h-11 rounded-md px-3 py-2 pr-10 shadow-md outline-none text-[#465746] bg-white text-xs sm:text-sm"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#465746]">
                  <img
                    src={Search}
                    alt="Search"
                    className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* ACCOUNT Table */}
          <div className="mt-5">
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2 sm:border-spacing-y-3 text-xs sm:text-sm md:text-base lg:text-lg min-w-[600px]">
                <thead>
                  <tr className="text-[#465746] font-bold">
                    <th className="py-2 px-2 sm:px-3">ID No.</th>
                    <th className="py-2 px-2 sm:px-3">Full Name</th>
                    <th className="py-2 px-2 sm:px-3">Email</th>
                    <th className="py-2 px-2 sm:px-3">Role</th>
                    <th className="py-2 px-2 sm:px-3">Gender</th>
                    <th className="py-2 px-2 sm:px-3">Year & Section</th>
                  </tr>
                </thead>

                <tbody className="text-[#465746]">
                  {currentUsers.map((user, index) => (
                    <tr
                      key={index}
                      className="bg-[#fff] rounded-lg shadow hover:bg-gray-100"
                    >
                      <td className="py-2 px-2 sm:px-3">{user.user_ID}</td>
                      <td className="py-2 px-2 sm:px-3">{user.user_Name}</td>
                      <td className="py-2 px-2 sm:px-3 break-all sm:break-normal">
                        {user.user_Email}
                      </td>
                      <td className="py-2 px-2 sm:px-3">{user.user_Role}</td>
                      <td className="py-2 px-2 sm:px-3">{user.user_Gender}</td>
                      <td className="py-2 px-2 sm:px-3">
                        {user.YearandSection}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded-md shadow-md ${
                    currentPage === i + 1
                      ? "bg-[#00874E] text-white font-bold"
                      : "bg-white text-[#465746] hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {showPopup && <Popup setOpen={setShowPopup} />}
          </div>
        </div>
      </div>
    </div>
  );
}
