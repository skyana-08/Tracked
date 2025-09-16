import React from 'react'
import { useState } from "react";
import { Link } from 'react-router-dom';

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";

import Dashboard from '../../assets/DashboardProf(Light).svg';
import Professor from '../../assets/Professor(Light).svg';

export default function DashboardProf() {
  const [isOpen, setIsOpen] = useState(true);

  return (

    <div>
      <Sidebar role="teacher" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`transition-all duration-300 ${isOpen ? 'ml-[300px]' : 'ml-0'}`}>
        <Header setIsOpen={() => {}} userName="Juan Dela Cruz" />

        {/* content of PROFESSOR DASHBOARD*/}
        <div className="p-5">

          {/* "Header" of PROFESSOR DASHBOARD */}
          <div className="flex">
            <img src={Dashboard} alt="ClassManagement" className='color-[#465746] h-7 w-7 mr-5 mt-1' />
            <p className="font-bold text-[1.5rem] text-[#465746]">Dashboard</p>
          </div>

          <div className="flex text-[1.125rem] text-[#465746]">
            <span>Welcome back,</span>
            <span className="font-bold ml-1 mr-1"> Prof. Jane! </span>
            <span>Let’s see how your students are doing.</span>
          </div>

          <hr className="opacity-60 border-[#465746] rounded border-1 mt-5" />

          {/* main content of PROFESSOR ADMIN */}


        </div>

      </div>
    </div>
  )
}
