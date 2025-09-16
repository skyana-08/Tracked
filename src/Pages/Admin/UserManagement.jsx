import { useState } from "react";
import { Link } from 'react-router-dom';

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";

import ClassManagementLight from '../../assets/ClassManagement(Light).svg';
import Student from '../../assets/Student(Light).svg';
import Professor from '../../assets/Professor(Light).svg';

export default function UserManagement() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar role="admin" isOpen={isOpen} setIsOpen={setIsOpen} />

      <div
        className={`
          transition-all duration-300
          ${isOpen ? 'lg:ml-[300px]' : 'ml-0'}
        `}
      >
        <Header setIsOpen={setIsOpen} isOpen={isOpen} />

        {/* content of ADMIN USER MANAGEMENT */}
        <div className="p-3 sm:p-4 md:p-5">

          {/* "Header" of ADMIN USER MANAGEMENT */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-3">
            <div className="flex items-center mb-2 sm:mb-0">
              <img
                src={ClassManagementLight}
                alt="ClassManagement"
                className="h-7 w-7 sm:h-7 sm:w-7 mr-4 mt-1"
              />
              <p className="font-bold text-[1.5rem] text-[#465746]">
                User Management
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center text-sm sm:text-base md:text-[1.125rem] text-[#465746] mb-4">
            <span>Welcome back, </span>
            <span className="font-bold mx-1">ADMIN</span>
            <span>ready to manage accounts?</span>
          </div>

          <hr className="opacity-60 border-[#465746] rounded border-1 mb-5" />

          {/* main content of ADMIN USER MANAGEMENT */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">

            {/* Professor Accounts Button */}
            <Link to="/UserManagementProfessorAccounts" className="block">
              <div className="bg-[#FFFFFF] rounded-xl shadow-md hover:border-2 hover:border-[#00874E] transition-all duration-200 p-5">
                <div className="flex items-center mb-3">
                  <img
                    src={Professor}
                    alt="Professor"
                    className="h-7 w-7 mr-4"
                  />
                  <p className="font-bold text-[1.125rem] text-[#465746]">
                    Professor Accounts
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p className="font-bold text-[1.125rem] text-[#465746] mb-1 sm:mb-0">
                    Total of Professor Account Created:
                  </p>
                  <p className="font-bold text-[1.125rem] text-[#00874E] sm:ml-2">
                    X
                  </p>
                </div>
              </div>
            </Link>

            {/* Student Accounts Button */}
            <Link to="/UserManagementStudentAccounts" className="block">
              <div className="bg-[#FFFFFF] rounded-xl shadow-md hover:border-2 hover:border-[#00874E] transition-all duration-200 p-5">
                <div className="flex items-center mb-3">
                  <img
                    src={Student}
                    alt="Student"
                    className="h-7 w-7 mr-4"
                  />
                  <p className="font-bold text-[1.125rem] text-[#465746]">
                    Student Accounts
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p className="font-bold text-[1.125rem] text-[#465746] mb-1 sm:mb-0">
                    Total of Student Account Created:
                  </p>
                  <p className="font-bold text-[1.125rem] text-[#00874E] sm:ml-2">
                    X
                  </p>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}
