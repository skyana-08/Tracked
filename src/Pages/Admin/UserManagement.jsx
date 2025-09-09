import { useState } from "react";
import { Link } from 'react-router-dom';

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";

import ClassManagementLight from '../../assets/ClassManagement(Light).svg';
import Student from '../../assets/Student(Light).svg';
import Professor from '../../assets/Professor(Light).svg';

export default function UserManagement() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <Sidebar role="admin" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`transition-all duration-300 ${isOpen ? 'ml-[300px]' : 'ml-0'}`}>
        <Header setIsOpen={setIsOpen} isOpen={isOpen} />

        {/* content of ADMIN USER MANAGEMENT */}
        <div className="p-5">

          {/* "Header" of ADMIN USER MANAGEMENT */}
          <div className="flex">
            <img src={ClassManagementLight} alt="ClassManagement" className='color-[#465746] h-7 w-7 mr-5 mt-1' />
            <p className="font-bold text-[1.5rem] text-[#465746]">User Management</p>
          </div>

          <div className="flex text-[1.125rem] text-[#465746]">
            <span>Welcome back, </span>
            <span className="font-bold ml-1 mr-1">ADMIN</span>
            <span>ready to manage accounts?</span>
          </div>

          <hr className="opacity-60 border-[#465746] rounded border-1 mt-5" />

          {/* main content of ADMIN USER MANAGEMENT */}

          {/* Professor Accounts Button */}
          <Link to="/UserManagementProfessorAccounts">
            <div className="bg-[#FFFFFF] h-35 rounded-xl shadow-md mt-5 hover:border-2 hover:border-[#00874E]">
              <div className="flex pt-5 pl-5">
                <img src={Professor} alt="Student" className='color-[#465746] h-7 w-7 mr-5 mt-1' />
                <p className="font-bold text-[1.125rem] text-[#465746]">Professor Accounts</p>
              </div>

              <div className="flex">
                <p className="font-bold text-[1.125rem] text-[#465746] pl-17"> Total of Professor Account Created: </p>
                <p className="font-bold text-[1.125rem] text-[#00874E] pl-2"> X </p>
              </div>
            </div>
          </Link>

          {/* Student Accounts Button */}
          <Link to="/UserManagementStudentAccounts">
            <div className="bg-[#FFFFFF] h-35 rounded-xl shadow-md mt-5 hover:border-2 hover:border-[#00874E]">
              <div className="flex pt-5 pl-5">
                <img src={Student} alt="Student" className='color-[#465746] h-7 w-7 mr-5 mt-1' />
                <p className="font-bold text-[1.125rem] text-[#465746]">Student Accounts</p>
              </div>

              <div className="flex">
                <p className="font-bold text-[1.125rem] text-[#465746] pl-17"> Total of Student Account Created: </p>
                <p className="font-bold text-[1.125rem] text-[#00874E] pl-2"> X </p>
              </div>
            </div>
          </Link>

        </div>
      
      </div>
    </div>
  );
}