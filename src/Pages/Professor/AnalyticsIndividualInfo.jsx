import React from 'react'

import { useState } from "react";
import { Link } from 'react-router-dom';

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";

import Analytics from '../../assets/Analytics(Light).svg';
import ClassHandled from '../../assets/ClassHandled.svg';
import ActivitiesToGrade from '../../assets/ActivitiesToGrade.svg';
import ID from '../../assets/ID(Light).svg';
import Pie from '../../assets/Pie(Light).svg';
import Details from '../../assets/Details(Light).svg';
import Archive from '../../assets/Archive(Light).svg';

export default function AnalyticsIndividualInfo() {
  const [isOpen, setIsOpen] = useState(false);

  return (

    <div>
      <Sidebar role="teacher" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`
        transition-all duration-300
        ${isOpen ? 'lg:ml-[250px] xl:ml-[280px] 2xl:ml-[300px]' : 'ml-0'}
      `}>
        <Header setIsOpen={setIsOpen} isOpen={isOpen} userName="Jane Doe" />

        {/* content of PROFESSOR DASHBOARD*/}
        <div className="p-3 sm:p-4 md:p-5 lg:p-5 xl:p-5 text-[#465746]">

          {/* "Header" of PROFESSOR DASHBOARD */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2 sm:mb-4">
            <div className="flex">
              <img src={Analytics} alt="Analytics" className='color-[#465746] h-7 w-7 mr-5 mt-1' />
              <p className="font-bold text-[1.5rem]"> Analytics </p>
            </div>

          </div>

          <div className="text-sm sm:text-base md:text-base lg:text-[1.125rem] mb-4 sm:mb-5 ml-2">
            <span>Individual Student Information</span>
          </div>

          <hr className="opacity-60 border-[#465746] rounded border-1 mt-5" />

          {/* main content of PROFESSOR ADMIN */}

          <div className='bg-[#fff]'> 
            <img />
            <p> 01 </p>
            <p> 202210718 </p>
            <p> Lastname, Firstname MI </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button className="font-bold px-4 sm:px-5 py-2 bg-white rounded-md shadow-md hover:border-[#00874E] hover:border-2 text-sm sm:text-base lg:text-[1.125rem] whitespace-nowrap cursor-pointer">
              Download
            </button>
          </div>

          <div className='bg-[#fff]'>
            <p className='font-bold text-red'> Submitted Activities</p>
            <hr />
            <table>
              <th className='font-bold'>Task number</th>
              <th className='font-bold'>Title</th>
              <th className='font-bold'>Submission Date</th>
              <th className='font-bold'>Points</th>
              <td> Activity 1 </td>
              <td> Activity Name </td>
              <td> January 5, 2025</td>
              <td> 10 </td>
            </table>
          </div>

          <div className='bg-[#fff]'>
            <p className='font-bold text-green'> Missed Activities </p>
            <hr />
            <table>
              <th className='font-bold'>Task number</th>
              <th className='font-bold'>Title</th>
              <th className='font-bold'>Submission Date</th>
              <th className='font-bold'>Points</th>
              <td> Activity 1 </td>
              <td> Activity Name </td>
              <td> January 5, 2025</td>
              <td> 10 </td>
            </table>
          </div>

          <div>
            <p> Attendance </p>
            <hr />
            <p> Present: </p>
            <span> 35 </span>
            <p> Late: </p>
            <span> 35 </span>
            <p> Absent: </p>
            <span> 35 </span>
            <p> Total Class Held: </p>
            <span> 35 </span>
          </div>

      </div>

      </div>
    </div>
  )
}
