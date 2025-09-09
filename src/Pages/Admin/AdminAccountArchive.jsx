import React from 'react'
import { Link } from 'react-router-dom';
import { useState } from "react";

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";
import Popup from "../../Components/Popup";

import BackButton from '../../assets/BackButton(Light).svg';
import Archive from '../../assets/Archive(Light).svg';
import Unarchive from '../../assets/Unarchive.svg';
import ArrowDown from '../../assets/ArrowDown(Light).svg';

export default function AdminAccountArchive() {
  const [isOpen, setIsOpen] = useState(true);
  const [open, setOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <Sidebar role="admin" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`transition-all duration-300 ${isOpen ? 'ml-[300px]' : 'ml-0'}`}>
        <Header setIsOpen={setIsOpen} isOpen={isOpen} />

        {/* main content of ADMIN ACCOUNT ARCHIVE */}
        <div className="p-6">
        
          <div className="flex">
            <img src={Archive} alt="Archive" className='color-[#465746] h-7 w-7 mr-5 mt-1' />
            <p className="font-bold text-[1.5rem] text-[#465746]"> Archives </p>
          </div>

          <div className="flex items-center justify-between text-[1.125rem] text-[#465746]">
            <p>Accounts Archived</p>
            <Link to="/UserManagement">
              <img src={BackButton} alt="BackButton" className="h-7 w-7" />
            </Link>
          </div>

          <hr className="opacity-60 border-[#465746] rounded border-1 mt-5" />

          {/* Filter Import Backup BUTTONS */}
          <button onClick={() => setOpen(!open)} className="flex font-bold px-3 py-2 bg-[#fff] rounded-md w-40 shadow-md hover:border-[#00874E] hover:border-2 mt-5">
            Filter
            <img src={ArrowDown} alt="ArrowDown" className="ml-15 h-7 w-7" />
          </button>

          {/* Filter Button Dropdown */}
          {open && (
            <div className="absolute mt-1 bg-white rounded-md w-40 shadow-md">
              <button className="block px-3 py-2 w-full text-left hover:bg-gray-100">
                Students
              </button>
              <button className="block px-3 py-2 w-full text-left hover:bg-gray-100">
                Professor
              </button>
            </div>
          )}

          {/* Account Archive Main Content */}
          {/* Account Request Table */}
          <div className="mt-5 ">
            <table className="w-full text-left border-separate border-spacing-y-3 text-[1.125rem]">

              {/* Table Header */}
              <thead>
                <tr className="text-[#465746] font-bold">
                  <th className="py-2 px-3">No.</th>
                  <th className="py-2 px-3">Student No.</th>
                  <th className="py-2 px-3">Full Name</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="text-[#465746]">

                <tr className="bg-[#fff] rounded-lg shadow hover:bg-gray-100">
                  <td className="py-2 px-3 rounded-l-lg">1</td>
                  <td className="py-2 px-3">2025001</td>
                  <td className="py-2 px-3">Alice Mendoza</td>
                  <td className="py-2 px-3">alice@example.com</td>
                  <td className="py-2 px-3 font-bold text-[#FF6666]"> Deactivated </td>
                  <td className="py-2 px-3 rounded-r-lg">
                    <img onClick={() => setShowPopup(true)} src={Unarchive} alt="Unarchive" className=" h-7 w-7 cursor-pointer" />
                  </td>
                  
                </tr>

                <tr className="bg-[#fff] rounded-lg shadow hover:bg-gray-100">
                  <td className="py-2 px-3 rounded-l-lg">2</td>
                  <td className="py-2 px-3">2025002</td>
                  <td className="py-2 px-3">Brian Santos</td>
                  <td className="py-2 px-3">brian@example.com</td>
                  <td className="py-2 px-3 font-bold text-[#FF6666]"> Deactivated </td>
                  <td className="py-2 px-3 rounded-r-lg">
                    <img onClick={() => setShowPopup(true)} src={Unarchive} alt="Unarchive" className=" h-7 w-7 cursor-pointer" />
                  </td>
                  
                </tr>

              </tbody>
            </table>

            {/* Popup for Archive */}
            {showPopup && (
              <Popup 
              setOpen={setShowPopup} 
              message="Are you sure you want to Restore this account?" 
              confirmText="Restore" 
              />
            )}

          </div>

        </div>

      </div>
    </div>
  );
}