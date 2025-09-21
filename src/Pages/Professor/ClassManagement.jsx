import React, { useState } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";

import ClassManagementIcon from "../../assets/ClassManagement(Light).svg";
import ArrowDown from "../../assets/ArrowDown(Light).svg";
import Archive from "../../assets/Archive(Light).svg";
import Palette from "../../assets/Palette(Light).svg";
import Add from "../../assets/Add(Light).svg";
import Book from "../../assets/ClassManagementSubject(Light).svg";

export default function ClassManagement() {
  const [isOpen, setIsOpen] = useState(true);
  const [open, setOpen] = useState(false);

  // background colors
  const bgOptions = [
    "#874040",
    "#4951AA", 
    "#00874E",
    "#374151",
    "#1E3A8A",
  ];

  const [bgIndex1, setBgIndex1] = useState(0);
  const [bgIndex2, setBgIndex2] = useState(1);
  const handlePaletteClick = (e, card) => {
    e.preventDefault();
    if (card === 1) {
      setBgIndex1((prev) => (prev + 1) % bgOptions.length);
    } else if (card === 2) {
      setBgIndex2((prev) => (prev + 1) % bgOptions.length);
    }
  };

  return (
    <div>
      <Sidebar role="teacher" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={`transition-all duration-300 ${
          isOpen ? "ml-[300px]" : "ml-0"
        }`}
      >
        <Header setIsOpen={setIsOpen} isOpen={isOpen} userName="Jane Doe" />

        {/* content of SUBJECTS DETAILS*/}
        <div className="p-5">
          {/* "Header" of SUBJECT DETAILS */}
          <div className="flex">
            <img
              src={ClassManagementIcon}
              alt="Dashboard"
              className="color-[#465746] h-7 w-7 mr-5 mt-1"
            />
            <p className="font-bold text-[1.5rem] text-[#465746]">
              Class Management
            </p>
          </div>

          <div className="flex text-[1.125rem] text-[#465746]">
            <span> Academic Management </span>
          </div>

          <hr className="opacity-60 border-[#465746] rounded border-1 mt-5" />

          <div className="flex flex-col lg:flex-row mt-5 gap-4 justify-between items-center">
            {/* Filter BUTTON */}
            <div className="flex flex-wrap gap-2">
              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center font-bold px-3 py-2 bg-[#fff] rounded-md cursor-pointer shadow-md"
                >
                  Year Level
                  <img
                    src={ArrowDown}
                    alt="ArrowDown"
                    className="ml-15 h-5 w-5 sm:h-6 sm:w-6 md:h-6 md:w-6 lg:h-7 lg:w-7"
                  />
                </button>

                {/* Filter Dropdown SELECTIONS */}
                {open && (
                  <div className="absolute top-full mt-1 bg-white rounded-md w-48 shadow-lg border border-gray-200 z-10">
                    {["1st Year", "2nd Year", "3rd Year", "4th Year"].map(
                      (year) => (
                        <button
                          key={year}
                          className="block px-3 py-2 w-full text-left hover:bg-gray-100 text-xs sm:text-sm md:text-base transition-colors duration-200 cursor-pointer"
                          onClick={() => {
                            setSelectedFilter(year);
                            setOpen(false);
                          }}
                        >
                          {year}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Add and Archive Buttons */}
            <div className="flex items-center gap-2">
              <Link to="/AdminAccountArchive">
                <button className="font-bold py-2 bg-[#fff] rounded-md w-12 shadow-md flex items-center justify-center hover:border-[#00874E] hover:border-2 cursor-pointer">
                  <img
                    src={Archive}
                    alt="Archive"
                    className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                  />
                </button>
              </Link>
              <Link to="/AdminAccountArchive">
                <button className="font-bold py-2 bg-[#fff] rounded-md w-12 shadow-md flex items-center justify-center hover:border-[#00874E] hover:border-2 cursor-pointer">
                  <img
                    src={Add}
                    alt="Add"
                    className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                  />
                </button>
              </Link>
            </div>
          </div>

          {/* 1ST SUBJECT CARD */}
          <Link to={"/SubjectDetails"}>
            <div
              className="text-white text-[1.125rem] rounded-lg p-5 space-y-2 mt-5 hover:border-[#351111] hover:border-2 cursor-pointer shadow-md"
              style={{ backgroundColor: bgOptions[bgIndex1] }}
            >
              <div className="flex items-center font-bold">
                <img
                  src={Book}
                  alt="Subject"
                  className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 mr-2"
                />
                <p className="mr-1">Section:</p>
                <p className="text-[#fff]">X</p>

                {/* BUTTONS */}
                <div className="ml-auto flex gap-3">
                  <button
                    onClick={(e) => handlePaletteClick(e, 1)}
                    className="font-bold py-2 bg-white rounded-md w-12 shadow-md flex items-center justify-center hover:border-[#00874E] hover:border-2 cursor-pointer transition"
                  >
                    <img src={Palette} alt="Palette" className="h-7 w-7" />
                  </button>
                  <button className="font-bold py-2 bg-white rounded-md w-12 shadow-md flex items-center justify-center hover:border-[#00874E] hover:border-2 cursor-pointer transition">
                    <img src={Archive} alt="Archive" className="h-7 w-7" />
                  </button>
                </div>
              </div>

              {/* Subject details */}
              <div className="flex">
                <p className="mr-2 font-bold">Subject:</p>
                <p>ITEC200A CAPSTONE PROJECTS AND RESEARCH</p>
              </div>
              <div className="flex">
                <p className="mr-2 font-bold">Subject Code:</p>
                <p>AJ5610</p>
              </div>
            </div>
          </Link>

          {/* 2ND SUBJECT CARD */}
          <Link to={"/SubjectDetails"}>
            <div
              className="text-white text-[1.125rem] rounded-lg p-5 space-y-2 mt-5 hover:border-[#191e54] hover:border-2 cursor-pointer shadow-md"
              style={{ backgroundColor: bgOptions[bgIndex2] }}
            >
              <div className="flex items-center font-bold">
                <img
                  src={Book}
                  alt="Subject"
                  className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 mr-2"
                />
                <p className="mr-1">Section:</p>
                <p className="text-[#fff]">Y</p>

                {/* BUTTONS */}
                <div className="ml-auto flex gap-3">
                  <button
                    onClick={(e) => handlePaletteClick(e, 2)}
                    className="font-bold py-2 bg-white rounded-md w-12 shadow-md flex items-center justify-center hover:border-[#00874E] hover:border-2 cursor-pointer transition"
                  >
                    <img src={Palette} alt="Palette" className="h-7 w-7" />
                  </button>
                  <button className="font-bold py-2 bg-white rounded-md w-12 shadow-md flex items-center justify-center hover:border-[#00874E] hover:border-2 cursor-pointer transition">
                    <img src={Archive} alt="Archive" className="h-7 w-7" />
                  </button>
                </div>
              </div>

              {/* Subject details */}
              <div className="flex">
                <p className="mr-2 font-bold">Subject:</p>
                <p>ITEC201B SYSTEMS ANALYSIS AND DESIGN</p>
              </div>
              <div className="flex">
                <p className="mr-2 font-bold">Subject Code:</p>
                <p>SD4211</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
