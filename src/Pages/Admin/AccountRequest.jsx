import React from 'react'
import { useState } from "react";

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";
import AccountRequestLight from '../../assets/AccountRequest(Light).svg';

export default function AccountRequest() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <Sidebar role="admin" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`transition-all duration-300 ${isOpen ? 'ml-[300px]' : 'ml-0'}`}>
        <Header setIsOpen={setIsOpen} isOpen={isOpen} />

        {/* main content of ADMIN ACCOUNT REQUEST */}
        <div className="p-6">
        
          <div className="flex">
            <img src={AccountRequestLight} alt="ClassManagement" className='color-[#465746] h-7 w-7 mr-5 mt-1' />
            <p className="font-bold text-[1.5rem] text-[#465746]"> Account Request </p>
          </div>

          <p className="text-[1.125rem] text-[#465746]"> Account creation request </p>

          <hr className="opacity-60 border-[#465746] rounded border-1 mt-5" />

          {/* Account Request Main Content */}
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
                  <td className="py-2 px-3 font-bold text-[#00A15D]">[Accept]</td>
                  <td className="py-2 px-3 font-bold text-[#FF6666] rounded-r-lg">[Decline]</td>
                  
                </tr>

                <tr className="bg-[#fff] rounded-lg shadow hover:bg-gray-100">
                  <td className="py-2 px-3 rounded-l-lg">2</td>
                  <td className="py-2 px-3">2025002</td>
                  <td className="py-2 px-3">Brian Santos</td>
                  <td className="py-2 px-3">brian@example.com</td>
                  <td className="py-2 px-3 font-bold text-[#00A15D]">[Accept]</td>
                  <td className="py-2 px-3 font-bold text-[#FF6666] rounded-r-lg">[Decline]</td>
                  
                </tr>

              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}