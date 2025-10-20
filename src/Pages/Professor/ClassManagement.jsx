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
import BackButton from "../../assets/BackButton(Light).svg";

export default function ClassManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Modal form states
  const [selectedYearLevel, setSelectedYearLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");

  // Dropdown state for modal
  const [yearLevelDropdownOpen, setYearLevelDropdownOpen] = useState(false);

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

  const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  
  const handlePaletteClick = (e, card) => {
    e.preventDefault();
    if (card === 1) {
      setBgIndex1((prev) => (prev + 1) % bgOptions.length);
    } else if (card === 2) {
      setBgIndex2((prev) => (prev + 1) % bgOptions.length);
    }
  };

  const handleCreate = () => {
    // Validate required fields
    if (!selectedYearLevel || !subject || !section) {
      alert("Please fill in all required fields");
      return;
    }

    // Here you would add logic to create the new class
    console.log("Creating class:", { selectedYearLevel, subject, section });
    
    // Reset form and close modal
    setSelectedYearLevel("");
    setSubject("");
    setSection("");
    setShowModal(false);
  };

  return (
    <div>
      <Sidebar role="teacher" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`
        transition-all duration-300
        ${isOpen ? 'lg:ml-[250px] xl:ml-[280px] 2xl:ml-[300px]' : 'ml-0'}
      `}>
        <Header setIsOpen={setIsOpen} isOpen={isOpen} userName="Jane Doe" />

        {/* content of CLASS MANAGEMENT*/}
        <div className="p-3 sm:p-4 md:p-5 lg:p-5 xl:p-5">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2 sm:mb-4">
            <div className="flex items-center mb-2 sm:mb-0">
              <img
                src={ClassManagementIcon}
                alt="Class Management"
                className="h-7 w-7 sm:h-6 sm:w-7 md:h-7 md:w-7 mr-3 sm:mr-3 mt-0.5 ml-2"
              />
              <h1 className="font-bold text-xl sm:text-xl md:text-xl lg:text-[1.5rem] text-[#465746]">
                Class Management
              </h1>
            </div>
          </div>

          <div className="text-sm sm:text-base md:text-base lg:text-[1.125rem] text-[#465746] mb-4 sm:mb-5 ml-2">
            <span>Academic Management</span>
          </div>

          <hr className="opacity-60 border-[#465746] rounded border-1 mt-5" />

          {/* Filter and Action Buttons */}
          <div className="flex flex-row mt-4 sm:mt-5 gap-4 justify-between items-center">
            
            {/* Filter BUTTON */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center font-bold px-3 py-2 bg-[#fff] rounded-md cursor-pointer shadow-md border-2 border-transparent hover:border-[#00874E] transition-all duration-200 text-xs sm:text-sm lg:text-base min-w-[100px] sm:min-w-[140px]"
              >
                <span className="flex-1 text-left">Year Level</span>
                <img
                  src={ArrowDown}
                  alt="ArrowDown"
                  className="ml-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-6 lg:w-6"
                />
              </button>

              {/* Filter Dropdown SELECTIONS */}
              {open && (
                <div className="absolute top-full mt-1 bg-white rounded-md w-full sm:w-48 shadow-lg border border-gray-200 z-10">
                  {["1st Year", "2nd Year", "3rd Year", "4th Year"].map(
                    (year) => (
                      <button
                        key={year}
                        className="block px-3 py-2 w-full text-left hover:bg-gray-100 text-xs sm:text-sm md:text-base transition-colors duration-200 cursor-pointer"
                        onClick={() => {
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

            {/* Add and Archive Buttons */}
            <div className="flex items-center gap-2">
              <Link to="/ArchiveClass">
                <button className="font-bold py-2 bg-[#fff] rounded-md w-10 sm:w-12 h-10 sm:h-12 shadow-md flex items-center justify-center border-2 border-transparent hover:border-[#00874E] transition-all duration-200 cursor-pointer">
                  <img
                    src={Archive}
                    alt="Archive"
                    className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
                  />
                </button>
              </Link>
              <button 
                onClick={() => setShowModal(true)}
                className="font-bold py-2 bg-[#fff] rounded-md w-10 sm:w-12 h-10 sm:h-12 shadow-md flex items-center justify-center border-2 border-transparent hover:border-[#00874E] transition-all duration-200 cursor-pointer">
                <img
                  src={Add}
                  alt="Add"
                  className="h-6 w-6 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
                />
              </button>
            </div>
          </div>

          {/* 1ST SUBJECT CARD */}
          <Link to={"/SubjectDetails"}>
            <div
              className="text-white text-sm sm:text-base lg:text-[1.125rem] rounded-lg p-4 sm:p-5 space-y-2 sm:space-y-3 mt-4 sm:mt-5 border-2 border-transparent hover:border-[#351111] transition-all duration-200"
              style={{ backgroundColor: bgOptions[bgIndex1] }}
            >
              <div className="flex items-center font-bold flex-wrap gap-2">
                <div className="flex items-center">
                  <img
                    src={Book}
                    alt="Subject"
                    className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2"
                  />
                  <p className="text-xs sm:text-sm lg:text-base mr-1">Section:</p>
                  <p className="text-xs sm:text-sm lg:text-base text-[#fff]">X</p>
                </div>

                {/* BUTTONS */}
                <div className="ml-auto flex gap-2 sm:gap-3">
                  <button
                    onClick={(e) => handlePaletteClick(e, 1)}
                    className="font-bold py-1 sm:py-2 bg-white rounded-md w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 shadow-md flex items-center justify-center border-2 border-transparent hover:border-[#00874E] transition-all duration-200 cursor-pointer"
                  >
                    <img 
                      src={Palette} 
                      alt="Palette" 
                      className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" 
                    />
                  </button>
                  <button className="font-bold py-1 sm:py-2 bg-white rounded-md w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 shadow-md flex items-center justify-center border-2 border-transparent hover:border-[#00874E] transition-all duration-200 cursor-pointer">
                    <img 
                      src={Archive} 
                      alt="Archive" 
                      className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" 
                    />
                  </button>
                </div>
              </div>

              {/* Subject details */}
              <div className="space-y-1 sm:space-y-2">
                <div className="flex flex-wrap items-center gap-x-2">
                  <p className="text-xs sm:text-sm lg:text-base font-bold">
                    Subject:
                  </p>
                  <p className="text-xs sm:text-sm lg:text-base break-words">
                    ITEC200A CAPSTONE PROJECTS AND RESEARCH
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-2">
                  <p className="text-xs sm:text-sm lg:text-base font-bold">
                    Subject Code:
                  </p>
                  <p className="text-xs sm:text-sm lg:text-base">AJ5610</p>
                </div>
              </div>
            </div>
          </Link>

          {/* 2ND SUBJECT CARD */}
          <Link to={"/SubjectDetails"}>
            <div
              className="text-white text-sm sm:text-base lg:text-[1.125rem] rounded-lg p-4 sm:p-5 space-y-2 sm:space-y-3 mt-4 sm:mt-5 border-2 border-transparent hover:border-[#191e54] transition-all duration-200"
              style={{ backgroundColor: bgOptions[bgIndex2] }}
            >
              <div className="flex items-center font-bold flex-wrap gap-2">
                <div className="flex items-center">
                  <img
                    src={Book}
                    alt="Subject"
                    className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2"
                  />
                  <p className="text-xs sm:text-sm lg:text-base mr-1">Section:</p>
                  <p className="text-xs sm:text-sm lg:text-base text-[#fff]">Y</p>
                </div>

                {/* BUTTONS */}
                <div className="ml-auto flex gap-2 sm:gap-3">
                  <button
                    onClick={(e) => handlePaletteClick(e, 2)}
                    className="font-bold py-1 sm:py-2 bg-white rounded-md w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 shadow-md flex items-center justify-center border-2 border-transparent hover:border-[#00874E] transition-all duration-200 cursor-pointer"
                  >
                    <img 
                      src={Palette} 
                      alt="Palette" 
                      className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" 
                    />
                  </button>
                  <button className="font-bold py-1 sm:py-2 bg-white rounded-md w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 shadow-md flex items-center justify-center border-2 border-transparent hover:border-[#00874E] transition-all duration-200 cursor-pointer">
                    <img 
                      src={Archive} 
                      alt="Archive" 
                      className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" 
                    />
                  </button>
                </div>
              </div>

              {/* Subject details */}
              <div className="space-y-1 sm:space-y-2">
                <div className="flex flex-wrap items-center gap-x-2">
                  <p className="text-xs sm:text-sm lg:text-base font-bold">
                    Subject:
                  </p>
                  <p className="text-xs sm:text-sm lg:text-base break-words">
                    ITEC201B SYSTEMS ANALYSIS AND DESIGN
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-2">
                  <p className="text-xs sm:text-sm lg:text-base font-bold">
                    Subject Code:
                  </p>
                  <p className="text-xs sm:text-sm lg:text-base">SD4211</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Create Class Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50 overlay-fade p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white text-black rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg p-4 sm:p-6 md:p-8 relative modal-pop max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 sm:right-6 md:right-8 top-5 sm:hidden cursor-pointer"
            >
              <img
                src={BackButton}
                alt="BackButton"
                className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6"
              />
            </button>

            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 pr-8">
              Create class
            </h2>
            <hr className="border-gray-300 mb-3 sm:mb-4" />

            {/* Modal Body */}
            <div className="space-y-4">
              {/* Year Level Dropdown */}
              <div className="relative">
                <label className="text-sm font-semibold mb-1 block">Year Level</label>
                <button
                  onClick={() => setYearLevelDropdownOpen(!yearLevelDropdownOpen)}
                  className="w-full bg-white border border-gray-300 text-black rounded-md px-4 py-2.5 flex items-center justify-between hover:border-[#00874E] transition-colors"
                >
                  <span className="text-sm">{selectedYearLevel || "Year Level"}</span>
                  <img src={ArrowDown} alt="Arrow" className="h-4 w-4" />
                </button>
                {yearLevelDropdownOpen && (
                  <div className="absolute top-full mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    {yearLevels.map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          setSelectedYearLevel(year);
                          setYearLevelDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Subject Input */}
              <div>
                <label className="text-sm font-semibold mb-1 block">Subject:</label>
                <input
                  type="text"
                  placeholder=""
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none text-sm focus:border-[#00874E] transition-colors"
                />
              </div>

              {/* Section Input */}
              <div>
                <label className="text-sm font-semibold mb-1 block">Section:</label>
                <input
                  type="text"
                  placeholder=""
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none text-sm focus:border-[#00874E] transition-colors"
                />
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreate}
                className="w-full bg-[#00A15D] text-white font-bold py-2.5 rounded-md hover:bg-[#00874E] transition-colors text-sm sm:text-base cursor-pointer"
              >
                Create
              </button>
            </div>
          </div>

          <style>{`
            .overlay-fade { animation: overlayFade .18s ease-out both; }
            @keyframes overlayFade { from { opacity: 0 } to { opacity: 1 } }

            .modal-pop {
              transform-origin: top center;
              animation: popIn .22s cubic-bezier(.2,.8,.2,1) both;
            }
            @keyframes popIn {
              from { opacity: 0; transform: translateY(-8px) scale(.98); }
              to   { opacity: 1; transform: translateY(0)   scale(1);    }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}