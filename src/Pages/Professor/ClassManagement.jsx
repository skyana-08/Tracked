import React, { useState, useEffect } from "react";
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
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // Modal form states
  const [selectedYearLevel, setSelectedYearLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");
  const [formError, setFormError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdSubjectCode, setCreatedSubjectCode] = useState("");
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [classToArchive, setClassToArchive] = useState(null);

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

  const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  // GET LOGGED-IN USER ID
  const getProfessorId = () => {
    try {
      const userDataString = localStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        return userData.id; // This is the ID from login
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return null;
  };

  // Load classes from database on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const professorId = getProfessorId();
      
      if (!professorId) {
        console.error('No professor ID found. User may not be logged in.');
        setLoadingClasses(false);
        return;
      }
      
      const response = await fetch(`http://localhost/TrackEd/src/Pages/Professor/get_classes.php?professor_ID=${professorId}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Add background colors to each class
          const classesWithColors = result.classes.map((classItem, index) => ({
            ...classItem,
            bgColor: bgOptions[index % bgOptions.length]
          }));
          setClasses(classesWithColors);
        } else {
          console.error('Error fetching classes:', result.message);
        }
      } else {
        throw new Error('Failed to fetch classes');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoadingClasses(false);
    }
  };

  // Handle archive class
  const handleArchive = async (classItem, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setClassToArchive(classItem);
    setShowArchiveModal(true);
  };

  const confirmArchive = async () => {
    if (!classToArchive) return;

    try {
      const professorId = getProfessorId();
      
      const response = await fetch('http://localhost/TrackEd/src/Pages/Professor/archive_class.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject_code: classToArchive.subject_code,
          professor_ID: professorId
        })
      });

      const result = await response.json();

      if (result.success) {
        setClasses(prevClasses => prevClasses.filter(c => c.subject_code !== classToArchive.subject_code));
        setShowArchiveModal(false);
        setClassToArchive(null);
      } else {
        alert('Error archiving class: ' + result.message);
        setShowArchiveModal(false);
      }
    } catch (error) {
      console.error('Error archiving class:', error);
      alert('Error archiving class. Please try again.');
      setShowArchiveModal(false);
    }
  };

  // Handle Enter key press in modal inputs
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setYearLevelDropdownOpen(false);
    };

    if (yearLevelDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [yearLevelDropdownOpen]);

  const handlePaletteClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    const newClasses = [...classes];
    const currentIndex = bgOptions.indexOf(newClasses[index].bgColor);
    const nextIndex = (currentIndex + 1) % bgOptions.length;
    newClasses[index].bgColor = bgOptions[nextIndex];
    setClasses(newClasses);
  };

  const handleCreate = async () => {
    if (!selectedYearLevel || !subject || !section) {
      setFormError("Please fill in all required fields");
      return;
    }

    setFormError("");
    setLoading(true);

    try {
      const professorId = getProfessorId();

      if (!professorId) {
        alert('User not logged in. Please log in again.');
        setLoading(false);
        return;
      }

      const classData = {
        year_level: selectedYearLevel,
        subject: subject,
        section: section,
        professor_ID: professorId
      };

      const response = await fetch('http://localhost/TrackEd/src/Pages/Professor/create_class.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData)
      });

      const result = await response.json();

      if (result.success) {
        const newClass = {
          ...result.class_data,
          bgColor: bgOptions[classes.length % bgOptions.length]
        };
        
        setClasses(prevClasses => [...prevClasses, newClass]);
        
        setSelectedYearLevel("");
        setSubject("");
        setSection("");
        setFormError("");
        setShowModal(false);
        
        // Show success modal
        setCreatedSubjectCode(result.class_data.subject_code);
        setShowSuccessModal(true);
      } else {
        alert('Error creating class: ' + result.message);
      }
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Error creating class. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to render class cards
  const renderClassCards = () => {
    if (loadingClasses) {
      return (
        <div className="text-center py-8">
          <p>Loading classes...</p>
        </div>
      );
    }

    return classes.map((classItem, index) => (
      <Link to={`/SubjectDetails?code=${classItem.subject_code}`} key={classItem.subject_code}>
        <div
          className="text-white text-sm sm:text-base lg:text-[1.125rem] rounded-lg p-4 sm:p-5 space-y-2 sm:space-y-3 mt-4 sm:mt-5 border-2 border-transparent hover:border-[#351111] transition-all duration-200"
          style={{ backgroundColor: classItem.bgColor }}
        >
          <div className="flex items-center font-bold flex-wrap gap-2">
            <div className="flex items-center">
              <img
                src={Book}
                alt="Subject"
                className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2"
              />
              <p className="text-xs sm:text-sm lg:text-base mr-1">Section:</p>
              <p className="text-xs sm:text-sm lg:text-base text-[#fff]">{classItem.section}</p>
            </div>

            {/* BUTTONS */}
            <div className="ml-auto flex gap-2 sm:gap-3">
              <button
                onClick={(e) => handlePaletteClick(e, index)}
                className="font-bold py-1 sm:py-2 bg-white rounded-md w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 shadow-md flex items-center justify-center border-2 border-transparent hover:border-[#00874E] transition-all duration-200 cursor-pointer"
              >
                <img 
                  src={Palette} 
                  alt="Change color" 
                  className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" 
                />
              </button>
              <button 
                onClick={(e) => handleArchive(classItem, e)}
                className="font-bold py-1 sm:py-2 bg-white rounded-md w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 shadow-md flex items-center justify-center border-2 border-transparent hover:border-[#00874E] transition-all duration-200 cursor-pointer"
              >
                <img 
                  src={Archive} 
                  alt="Archive class" 
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
                {classItem.subject}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-2">
              <p className="text-xs sm:text-sm lg:text-base font-bold">
                Year Level:
              </p>
              <p className="text-xs sm:text-sm lg:text-base">{classItem.year_level}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-2">
              <p className="text-xs sm:text-sm lg:text-base font-bold">
                Subject Code:
              </p>
              <p className="text-xs sm:text-sm lg:text-base">{classItem.subject_code}</p>
            </div>
          </div>
        </div>
      </Link>
    ));
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
                  {yearLevels.map((year) => (
                    <button
                      key={year}
                      className="block px-3 py-2 w-full text-left hover:bg-gray-100 text-xs sm:text-sm md:text-base transition-colors duration-200 cursor-pointer"
                      onClick={() => setOpen(false)}
                    >
                      {year}
                    </button>
                  ))}
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

          {/* Render dynamic class cards */}
          {renderClassCards()}

          {/* Show message if no classes exist */}
          {!loadingClasses && classes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No classes created yet. Click the + button to create your first class.</p>
            </div>
          )}
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

            {/* Error Message */}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
                {formError}
              </div>
            )}

            {/* Modal Body */}
            <div className="space-y-4">
              {/* Year Level Dropdown */}
              <div className="relative">
                <label className="text-sm font-semibold mb-1 block">Year Level *</label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setYearLevelDropdownOpen(!yearLevelDropdownOpen);
                  }}
                  className="w-full bg-white border border-gray-300 text-black rounded-md px-4 py-2.5 flex items-center justify-between hover:border-[#00874E] transition-colors"
                >
                  <span className="text-sm">{selectedYearLevel || "Select Year Level"}</span>
                  <img src={ArrowDown} alt="Arrow" className="h-4 w-4" />
                </button>
                {yearLevelDropdownOpen && (
                  <div className="absolute top-full mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    {yearLevels.map((year) => (
                      <button
                        key={year}
                        type="button"
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
                <label className="text-sm font-semibold mb-1 block">Subject *</label>
                <input
                  type="text"
                  placeholder="Enter subject name"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none text-sm focus:border-[#00874E] transition-colors"
                />
              </div>

              {/* Section Input */}
              <div>
                <label className="text-sm font-semibold mb-1 block">Section *</label>
                <input
                  type="text"
                  placeholder="Enter section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none text-sm focus:border-[#00874E] transition-colors"
                />
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreate}
                disabled={loading}
                className={`w-full ${
                  loading ? 'bg-gray-400' : 'bg-[#00A15D] hover:bg-[#00874E]'
                } text-white font-bold py-2.5 rounded-md transition-colors text-sm sm:text-base cursor-pointer`}
              >
                {loading ? 'Creating...' : 'Create'}
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50 overlay-fade p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSuccessModal(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white text-black rounded-lg shadow-lg w-full max-w-sm sm:max-w-md p-6 sm:p-8 relative modal-pop">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Class Created Successfully!
              </h3>
              
              <div className="mt-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Subject Code:</p>
                <p className="text-2xl font-bold text-[#00874E]">{createdSubjectCode}</p>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-[#00A15D] hover:bg-[#00874E] text-white font-bold py-3 rounded-md transition-colors cursor-pointer"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {showArchiveModal && classToArchive && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50 overlay-fade p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowArchiveModal(false);
              setClassToArchive(null);
            }
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white text-black rounded-lg shadow-lg w-full max-w-sm sm:max-w-md p-6 sm:p-8 relative modal-pop">
            <div className="text-center">
              {/* Warning Icon */}
              {/* <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                <svg
                  className="h-8 w-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div> */}

              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Archive Class
              </h3>
              
              <div className="mt-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Are you sure you want to archive this class?
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {classToArchive.subject}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Section: {classToArchive.section}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowArchiveModal(false);
                    setClassToArchive(null);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmArchive}
                  className="flex-1 bg-[#00A15D] hover:bg-[#00874E] text-white font-bold py-3 rounded-md transition-colors cursor-pointer"
                >
                  Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}