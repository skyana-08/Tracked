import React, { useState } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";

import ArchiveIcon from "../../assets/Archive(Light).svg";
import BackButton from "../../assets/BackButton(Light).svg";
import Book from "../../assets/ClassManagementSubject(Light).svg";
import DeleteIcon from "../../assets/Delete.svg";
import UnarchiveIcon from "../../assets/Unarchive.svg";

export default function ArchiveClass() {
  const [isOpen, setIsOpen] = useState(false);

  // Sample archived classes data
  const [archivedClasses, setArchivedClasses] = useState([
    {
      id: 1,
      section: "A",
      subject: "ITEC200A:CAPSTONE PROJECT AND RESEARCH",
      yearLevel: "4th Year"
    },
    {
      id: 2,
      section: "C", 
      subject: "ITEC105:NETWORK MANAGEMENT",
      yearLevel: "3rd Year"
    }
  ]);

  // Handle unarchive
  const handleUnarchive = (id) => {
    if (window.confirm("Are you sure you want to unarchive this class?")) {
      setArchivedClasses(archivedClasses.filter(classItem => classItem.id !== id));
      // In real app, you would restore the class to active classes
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this class? This action cannot be undone.")) {
      setArchivedClasses(archivedClasses.filter(classItem => classItem.id !== id));
    }
  };

  return (
    <div>
      <Sidebar role="teacher" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`
        transition-all duration-300
        ${isOpen ? 'lg:ml-[250px] xl:ml-[280px] 2xl:ml-[300px]' : 'ml-0'}
      `}>
        <Header setIsOpen={setIsOpen} isOpen={isOpen} userName="Jane Doe" />

        {/* content of ARCHIVED CLASSES */}
        <div className="p-3 sm:p-4 md:p-5 lg:p-5 xl:p-5">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2 sm:mb-4">
            <div className="flex items-center mb-2 sm:mb-0">
              <img
                src={ArchiveIcon}
                alt="Archive"
                className="h-7 w-7 sm:h-6 sm:w-7 md:h-7 md:w-7 mr-3 sm:mr-3 mt-0.5 ml-2"
              />
              <h1 className="font-bold text-xl sm:text-xl md:text-xl lg:text-[1.5rem] text-[#465746]">
                Archives
              </h1>
            </div>
          </div>

          {/* Subtitle with mobile back button */}
          <div className="flex items-center justify-between mb-4 sm:mb-5 ml-2">
            <div className="text-sm sm:text-base md:text-base lg:text-[1.125rem] text-[#465746]">
              <span>Classes you've archived</span>
            </div>
            
            {/* Mobile Back Button - Only visible on mobile */}
            <Link to="/ClassManagement" className="sm:hidden">
              <button 
                className="flex items-center justify-center w-8 h-8 cursor-pointer transition-all duration-200"
                aria-label="Back to Classes"
              >
                <img
                  src={BackButton}
                  alt="Back"
                  className="h-6 w-6"
                />
              </button>
            </Link>
          </div>

          <hr className="opacity-60 border-[#465746] rounded border-1 mt-3" />

          {/* ARCHIVED CLASSES LIST */}
          <div className="mt-6 space-y-4 sm:space-y-5">
            {archivedClasses.map((classItem) => (
              <div key={classItem.id} className="bg-white rounded-lg shadow-md p-4 sm:p-5 border border-gray-200">
                <div className="flex items-start justify-between gap-3">
                  {/* Left side - Class info */}
                  <div className="flex-1 min-w-0">
                    {/* Section Header */}
                    <div className="flex items-center mb-2 sm:mb-3">
                      <img
                        src={Book}
                        alt="Subject"
                        className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2 flex-shrink-0"
                      />
                      <p className="text-sm sm:text-base lg:text-lg font-bold text-[#465746]">
                        Section: {classItem.section}
                      </p>
                    </div>

                    {/* Subject details */}
                    <div className="space-y-1 sm:space-y-2 pl-6 sm:pl-7 lg:pl-8">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <p className="text-xs sm:text-sm lg:text-base font-bold text-[#465746] whitespace-nowrap">
                          Subject:
                        </p>
                        <p className="text-xs sm:text-sm lg:text-base text-[#465746] break-words">
                          {classItem.subject}
                        </p>
                      </div>
                      {classItem.yearLevel && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm lg:text-base font-bold text-[#465746] whitespace-nowrap">
                            Year Level:
                          </p>
                          <p className="text-xs sm:text-sm lg:text-base text-[#465746]">
                            {classItem.yearLevel}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side - Action buttons */}
                  <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(classItem.id)}
                      className="text-white rounded-md w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center cursor-pointer"
                      aria-label="Delete class"
                    >
                      <img
                        src={DeleteIcon}
                        alt="Delete"
                        className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6"
                      />
                    </button>

                    {/* Unarchive Button */}
                    <button
                      onClick={() => handleUnarchive(classItem.id)}
                      className="text-white rounded-md w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center cursor-pointer"
                      aria-label="Unarchive class"
                    >
                      <img
                        src={UnarchiveIcon}
                        alt="Unarchive"
                        className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Show message if no archived classes */}
            {archivedClasses.length === 0 && (
              <div className="text-center py-10 sm:py-12 md:py-16">
                <p className="text-gray-500 text-base sm:text-lg md:text-xl">No archived classes found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}