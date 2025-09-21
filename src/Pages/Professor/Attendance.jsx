import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";

import ClassManagementLight from '../../assets/ClassManagement(Light).svg';
import BackButton from '../../assets/BackButton(Light).svg';
import Search from '../../assets/Search.svg';

export default function Attendance() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);  

  return (
    <div>
      <Sidebar role="teacher" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-[300px]' : 'ml-0'}`}>
        <Header setIsOpen={setIsSidebarOpen} isOpen={isSidebarOpen} userName="Jane Doe" />

        <div className="p-5 text-[#465746]">
          {/* "Header" of SUBJECT DETAILS PROF */}
          <div className="flex">
            <img src={ClassManagementLight} alt="ClassManagement" className='h-7 w-7 mr-5 mt-1' />
            <p className="font-bold text-[1.5rem]"> Class Management </p>
          </div>

          <div className="flex items-center justify-between text-[1.125rem]">
            <div className="flex space-x-3">
              <span>SUBJECTCODE:</span>
              <span>Attendance</span>
            </div>

            <div className="flex items-center space-x-3 mr-5">
              <span>Section:</span>
              <span>A</span>
              <Link to={"/ClassManagement"}>
                <img src={BackButton} alt="ClassManagement" className="h-7 w-7 cursor-pointer" />
              </Link>
            </div>
          </div>

          <hr className="opacity-60-[#465746] rounded-1 mt-5" />

          {/* ATTENDANCE content */}

          {/* Search and History Button */}
          <div className="flex justify-between items-center mt-5">
            {/* Search input with icon inside */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-[400px] h-9 sm:h-10 lg:h-11 rounded-md pl-3 pr-10 shadow-md outline-none text-[#465746] bg-white text-xs sm:text-sm"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#465746]"
              >
                <img
                  src={Search}
                  alt="Search"
                  className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                />
              </button>
            </div>

            {/* Import button aligned to the right */}
            <button className="font-bold px-3 py-2 bg-white rounded-md shadow-md hover:border-[#00874E] hover:border-2 text-[1.125rem] whitespace-nowrap cursor-pointer ml-3">
              History
            </button>
          </div>




        </div>
      </div>
    </div>
  )
}
