import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";
import Popup from "../../Components/Popup";

import ClassManagementLight from '../../assets/ClassManagement(Light).svg';
import BackButton from '../../assets/BackButton(Light).svg';

export default function UserManagement_ProfessorAccountDetails() {
  const [isOpen, setIsOpen] = useState(true);  
  const [popupType, setPopupType] = useState(null);

  return (
    <div>
      <Sidebar role="admin" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`transition-all duration-300 ${isOpen ? 'ml-[300px]' : 'ml-0'}`}>
        <Header setIsOpen={setIsOpen} isOpen={isOpen} />

        <div className="p-5">
          {/* Header */}
          <div className="flex">
            <img src={ClassManagementLight} alt="ClassManagement" className='color-[#465746] h-7 w-7 mr-5 mt-1' />
            <p className="font-bold text-[1.5rem] text-[#465746]">User Management</p>
          </div>

          <div className="flex items-center justify-between text-[1.125rem] text-[#465746]">
            <p>Professor Account Details</p>
            <Link to="/UserManagementProfessorAccounts">
              <img src={BackButton} alt="BackButton" className="h-7 w-7" />
            </Link>
          </div>

          <hr className="opacity-60 border-[#465746] rounded border-1 mt-5" />

          {/* Content */}
          <div className="bg-white p-6 rounded-lg space-y-6 mt-5 shadow-md text-[#465746]">
            <h2 className="text-lg font-semibold">Professor Information</h2>
            <div className="grid grid-cols-2 gap-y-2 text-[1.125rem]">
              <span>Professor Name:</span>
              <span>Firstname Middlename Middle Initial Lastname</span>
              <span>Faculty ID (ID Number):</span>
              <span>202210718</span>
              <span>CVSU Email Address:</span>
              <span>Lastname@cvsu.edu.ph</span>
              <span>Phone Number:</span>
              <span>09606584521</span>
              <span>Age:</span>
              <span>X</span>
            </div>

            <h2 className="text-lg font-semibold">Professional Information</h2>
            <div className="grid grid-cols-2 gap-y-2">
              <span>Department:</span>
              <span>Information Technology (IT)</span>
              <span>Subject Handled:</span>
              <span>ITEC100A, ITEC200A</span>
            </div>

            <h2 className="text-lg font-semibold">Account Information</h2>
            <div className="grid grid-cols-2 gap-y-2">
              <span>Date Created:</span>
              <span>September 3, 2025</span>
              <span>Last Login:</span>
              <span>September 3, 2025</span>
              <span>Account Status:</span>
              <span className="text-green-600 font-bold">Active</span>
            </div>

            {/* Reset Password */}
            <button 
              onClick={() => setPopupType("reset")} className="font-bold text-white py-2 bg-[#00874E] rounded-md w-50 shadow-md text-center ml-2 hover:bg-[#465746] hover:border-2">
              Reset Password
            </button>

            {/* Disable Account */}
            <button 
              onClick={() => setPopupType("disable")}  className="font-bold text-white py-2 bg-[#00874E] rounded-md w-50 shadow-md text-center ml-2 hover:bg-[#465746] hover:border-2">
              Disable Account
            </button>

            {/* Popup */}
            {popupType === "reset" && (
              <Popup 
                setOpen={() => setPopupType(null)} 
                message="Do you really want to reset this password?" 
                confirmText="Reset" 
                buttonColor="#00874E" 
                hoverColor="#006F3A" 
              />
            )}

            {popupType === "disable" && (
              <Popup 
                setOpen={() => setPopupType(null)} 
                message="Are you sure you want to disable this account?" 
                confirmText="Disable" 
                buttonColor="#FF6666" 
                hoverColor="#C23535" 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
