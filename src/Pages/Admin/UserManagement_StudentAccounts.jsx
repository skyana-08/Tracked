import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";
import Popup from "../../Components/Popup";

import ClassManagementLight from "../../assets/ClassManagement(Light).svg";
import BackButton from "../../assets/BackButton(Light).svg";
import ArrowDown from "../../assets/ArrowDown(Light).svg";
import Search from "../../assets/Search.svg";
import Archive from "../../assets/Archive(Light).svg";
import ArchiveRow from "../../assets/ArchiveRow(Light).svg";
import Details from "../../assets/Details(Light).svg";

export default function UserManagementStudentAccounts() {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch professors from backend
  useEffect(() => {
    fetch("http://localhost/TrackEd/src/Pages/Admin/get_students.php")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error(err));
  }, []);

  // Pagination setup
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentStudents = students.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(students.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Sidebar role="admin" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={`transition-all duration-300 ${
          isOpen ? "lg:ml-[250px] xl:ml-[280px] 2xl:ml-[300px]" : "ml-0"
        }`}
      >
        <Header setIsOpen={setIsOpen} isOpen={isOpen} />

        {/* content of ADMIN USER MANAGEMENT STUDENT ACCOUNT LIST */}
        <div className="p-3 sm:p-4 md:p-5 lg:p-5 xl:p-5">
          {/* "Header" */}
          <div className="flex flex-col sm:flex-row item-start sm:items-center mb-2 sm:mb-4">
            <div className="flex items-center mb-2 sm:mb-0">
              <img
                src={ClassManagementLight}
                alt="ClassManagement"
                className="h-7 w-7 sm:h-6 sm:w-7 md:h-7 md:w-7 mr-3 sm:mr-3 mt-0.5 ml-2"
              />
              <h1 className="font-bold text-xl sm:text-xl md:text-xl lg:text-[1.5rem] text-[#465746]">
                User Management
              </h1>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm sm:text-base md:text-base lg:text-[1.125rem] text-[#465746] mb-4 sm:mb-5 ml-2">
            <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
              <span className="mb-0 sm:mb-0">Student Account Administration</span>
              <Link to="/UserManagement" className="sm:hidden">
                <img src={BackButton} alt="BackButton" className="h-6 w-6" />
              </Link>
            </div>
            <Link to="/UserManagement" className="hidden sm:block">
              <img
                src={BackButton}
                alt="BackButton"
                className="h-6 w-6 sm:h-7 sm:w-7"
              />
            </Link>
          </div>

          <hr className="opacity-60 border-[#465746] rounded border-1 mb-6" />

          {/* BUTTONS */}
          <div className="flex flex-col lg:flex-row mt-4 sm:mt-5 text-sm sm:text-sm md:text-base lg:text-[1.125rem] text-[#465746] gap-4 lg:justify-between lg:items-center">
            <div className="flex flex-wrap gap-2 ">
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
                    {["All", "Active", "Deactivated"].map((f) => (
                      <button
                        key={f}
                        className="block px-3 py-2 w-full text-left hover:bg-gray-100 text-xs sm:text-sm md:text-base transition-colors duration-200 cursor-pointer"
                        onClick={() => {
                          setSelectedFilter(f);
                          setOpen(false);
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="font-bold px-3 py-2 bg-[#fff] rounded-md shadow-md hover:border-[#00874E] hover:border-2 text-xs sm:text-sm lg:text-[1.125rem] whitespace-nowrap cursor-pointer">
                Import Database
              </button>

              <button className="font-bold px-3 py-2 bg-[#fff] rounded-md shadow-md hover:border-[#00874E] hover:border-2 text-xs sm:text-sm lg:text-[1.125rem] cursor-pointer">
                Backup
              </button>
            </div>

            {/* Search and Archive Buttons */}
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

              <Link to="/AdminAccountArchive">
                <button className="font-bold py-2 bg-[#fff] rounded-md w-10 sm:w-11 lg:w-12 shadow-md flex items-center justify-center hover:border-[#00874E] hover:border-2 cursor-pointer">
                  <img
                    src={Archive}
                    alt="Archive"
                    className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                  />
                </button>
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="mt-5">
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2 sm:border-spacing-y-3 text-xs sm:text-sm md:text-base lg:text-lg min-w-[600px]">
                <thead>
                  <tr className="text-[#465746] font-bold">
                    <th className="py-2 px-2 sm:px-3">Student ID No.</th>
                    <th className="py-2 px-2 sm:px-3">Full Name</th>
                    <th className="py-2 px-2 sm:px-3">Email</th>
                    <th className="py-2 px-2 sm:px-3">Year And Section</th>
                    <th className="py-2 px-2 sm:px-3">Status</th>
                    <th className="py-2 px-2 sm:px-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-[#465746]">
                  {currentStudents.map((stud, index) => (
                    <tr
                      key={stud.tracked_ID}
                      className="bg-[#fff] rounded-lg shadow hover:bg-gray-100"
                    >
                      <td className="py-2 px-2 sm:px-3">{stud.tracked_ID}</td>
                      <td className="py-2 px-2 sm:px-3">
                        {stud.tracked_fname} {stud.tracked_mi} {stud.tracked_lname}
                      </td>
                      <td className="py-2 px-2 sm:px-3 break-all sm:break-normal">
                        {stud.tracked_email}
                      </td>
                       <td className="py-2 px-2 sm:px-3 break-all sm:break-normal">
                        {stud.tracked_yearandsec}
                      </td>
                      <td
                        className={`py-2 px-2 sm:px-3 font-bold ${
                          stud.tracked_Status === "Active"
                            ? "text-[#00A15D]"
                            : "text-[#FF6666]"
                        }`}
                      >
                        {stud.tracked_Status}
                      </td>
                      <td className="py-2 px-2 sm:px-3 rounded-r-lg">
                        <div className="flex gap-2">
                          <img
                            onClick={() => setShowPopup(true)}
                            src={ArchiveRow}
                            alt="Archive"
                            className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 cursor-pointer"
                          />
                          <Link to="/UserManagementStudentAccountDetails">
                            <img
                              src={Details}
                              alt="Details"
                              className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                            />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
              {currentStudents.map((stud, i) => (
                <div
                  key={stud.tracked_ID}
                  className="bg-white rounded-lg shadow p-4 text-[#465746]"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        No. {i + 1} | Student ID No.
                      </p>
                      <p className="font-semibold text-sm">{stud.tracked_ID}</p>
                    </div>
                    <div className="flex gap-2">
                      <img
                        onClick={() => setShowPopup(true)}
                        src={ArchiveRow}
                        alt="Archive"
                        className="h-5 w-5 cursor-pointer"
                      />
                      <Link to="/UserManagementStudentAccountsDetails">
                        <img src={Details} alt="Details" className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="font-medium text-sm">
                        {stud.tracked_fname} {stud.tracked_lname}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm break-all">{stud.tracked_email}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p
                        className={`font-bold text-sm ${
                          stud.tracked_Status === "Active"
                            ? "text-[#00A15D]"
                            : "text-[#FF6666]"
                        }`}
                      >
                        {stud.tracked_Status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
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

            {/* Popup */}
            {showPopup && <Popup setOpen={setShowPopup} />}
          </div>
        </div>
      </div>
    </div>
  );
}
