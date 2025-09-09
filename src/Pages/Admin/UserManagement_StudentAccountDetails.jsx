import React from 'react'
import { useState } from "react";
import { Link } from 'react-router-dom';

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";

import ClassManagementLight from '../../assets/ClassManagement(Light).svg';
import BackButton from '../../assets/BackButton(Light).svg';

export default function UserManagement_StudentAccountDetails() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <Sidebar role="admin" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`transition-all duration-300 ${isOpen ? 'ml-[300px]' : 'ml-0'}`}>
        <Header setIsOpen={setIsOpen} isOpen={isOpen} />

        {/* content of ADMIN USER MANAGEMENT STUDENT ACCOUNT DETAILS */}
        <div className="p-5">

          {/* "Header" of ADMIN USER MANAGEMENT STUDENT ACCOUNT DETAILS */}
          <div className="flex">
            <img src={ClassManagementLight} alt="ClassManagement" className='color-[#465746] h-7 w-7 mr-5 mt-1' />
            <p className="font-bold text-[1.5rem] text-[#465746]">User Management</p>
          </div>

          <div className="flex items-center justify-between text-[1.125rem] text-[#465746]">
            <p>Student Account Details</p>
            <Link to="/UserManagementStudentAccounts">
              <img src={BackButton} alt="BackButton" className="h-7 w-7" />
            </Link>
          </div>

          <hr className="opacity-60 border-[#465746] rounded border-1 mt-5" />

          {/* main content of ADMIN STUDENT ACCOUNT DETAILS */}

          {/* Student Account Details */}

          <div className="bg-white p-6 rounded-lg space-y-6 mt-5 shadow-md text-[#465746]">
            <h2 className="text-lg font-semibold">Student Information</h2>

            <div className="grid grid-cols-2 gap-y-2 text-[1.125rem]">
              <span >Student Name:</span>
              <span>Firstname Middlename Middle Initial Lastname</span>

              <span>Student Number (ID Number):</span>
              <span>202210718</span>

              <span>CVSU Email Address:</span>
              <span>Lastname@cvsu.edu.ph</span>

              <span>Program:</span>
              <span>Bachelor in Information Technology (IT)</span>

              <span className="">Section:</span>
              <span>X</span>

              <span className="">Year Level:</span>
              <span>2nd Year</span>

              <span className="">Semester:</span>
              <span>2nd Semester 2024-2025</span>
            </div>

            <h2 className="text-lg font-semibold">Account Information</h2>

            <div className="grid grid-cols-2 gap-y-2">
              <span className="">Date Created:</span>
              <span>September 3, 2025</span>

              <span className="">Last Login:</span>
              <span>September 3, 2025</span>

              <span className="">Account Status:</span>
              <span className="text-green-600 font-bold">Active</span>
            </div>

            <button className="font-bold text-[#fff] py-2 bg-[#00874E] rounded-md w-50 shadow-md text-center ml-2 hover:bg-[#465746] hover:border-2"> Edit </button>

            <button className="font-bold text-[#fff] py-2 bg-[#00874E] rounded-md w-50 shadow-md text-center ml-2 hover:bg-[#465746] hover:border-2">Reset Password </button>

            <button className="font-bold text-[#fff] py-2 bg-[#00874E] rounded-md w-50 shadow-md text-center ml-2 hover:bg-[#465746] hover:border-2"> Disable Account </button>

          </div>

          

        </div>

      </div>
    </div>
  );
}
