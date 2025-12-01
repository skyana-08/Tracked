import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";
import ClassManagementArchive from "../../Components/ClassManagementArchive";
import CreateClass from "../../Components/CreateClass";

import ClassManagementIcon from "../../assets/ClassManagement(Light).svg";
import ArrowDown from "../../assets/ArrowDown(Light).svg";
import Archive from "../../assets/Archive(Light).svg";
import Palette from "../../assets/Palette(Light).svg";
import Add from "../../assets/Add(Light).svg";
import Book from "../../assets/ClassManagementSubject(Light).svg";
import SuccessIcon from '../../assets/Success(Green).svg';

export default function ClassManagement() {
  const [isOpen, setIsOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdSubjectCode, setCreatedSubjectCode] = useState("");
  
  // Archive modal state
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [classToArchive, setClassToArchive] = useState(null);

  // Filter states
  const [selectedFilter, setSelectedFilter] = useState("All Year Levels");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  // Form error state
  const [formError, setFormError] = useState("");

  // Using the same colors as the tab buttons with 10 options
  const bgOptions = [
    "#e6f4ea", // Light Green (Announcement tab color)
    "#e6f0ff", // Light Blue (Classwork tab color)
    "#fff4e6", // Light Orange/Yellow (Attendance tab color)
    "#ffe6e6", // Light Red/Pink (Grade tab color)
    "#f0e6ff", // Light Purple (Analytics tab color)
    "#e6f7f4", // Light Mint Green
    "#f0f6ff", // Light Sky Blue
    "#fff8e6", // Light Cream
    "#f7e6ff", // Light Lavender
    "#ffe6f0", // Light Rose
  ];

  const yearLevels = ["All Year Levels", "1st Year", "2nd Year", "3rd Year", "4th Year"];

  // GET LOGGED-IN USER ID
  const getProfessorId = () => {
    try {
      const userDataString = localStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        return userData.id;
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

  // Load saved colors from localStorage when component mounts
  useEffect(() => {
    const savedColors = localStorage.getItem('classColors');
    if (savedColors) {
      const colors = JSON.parse(savedColors);
      setClasses(prevClasses => 
        prevClasses.map(classItem => ({
          ...classItem,
          bgColor: colors[classItem.subject_code] || classItem.bgColor
        }))
      );
    }
  }, []);

  // Save colors to localStorage when classes change
  useEffect(() => {
    if (classes.length > 0) {
      const colorMap = {};
      classes.forEach(classItem => {
        colorMap[classItem.subject_code] = classItem.bgColor;
      });
      localStorage.setItem('classColors', JSON.stringify(colorMap));
    }
  }, [classes]);

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const professorId = getProfessorId();
      
      if (!professorId) {
        console.error('No professor ID found. User may not be logged in.');
        setLoadingClasses(false);
        return;
      }
      
      const response = await fetch(`https://tracked.6minds.site/Professor/ClassManagementDB/get_classes.php?professor_ID=${professorId}`);
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          // Try to load saved colors first
          const savedColors = localStorage.getItem('classColors');
          const colorMap = savedColors ? JSON.parse(savedColors) : {};
          
          const classesWithColors = result.classes.map((classItem, index) => ({
            ...classItem,
            bgColor: colorMap[classItem.subject_code] || bgOptions[index % bgOptions.length]
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

  // Filter classes based on selected filter
  const filteredClasses = classes.filter(classItem => {
    if (selectedFilter === "All Year Levels") {
      return true;
    }
    return classItem.year_level === selectedFilter;
  });

  // Handle filter selection
  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setFilterDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownOpen && !event.target.closest('.filter-dropdown')) {
        setFilterDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [filterDropdownOpen]);

  // Check if class already exists
  const checkDuplicateClass = (yearLevel, subject, section) => {
    if (!yearLevel || !subject || !section) return null;
    
    const normalizedSubject = subject.trim().toUpperCase();
    const normalizedSection = section.trim().toUpperCase();
    
    // Check if a class with the same year level, subject, and section already exists
    const duplicate = classes.find(classItem => 
      classItem.year_level === yearLevel &&
      classItem.subject.toUpperCase() === normalizedSubject &&
      classItem.section.toUpperCase() === normalizedSection
    );
    
    return duplicate;
  };

  // Handle archive class
  const handleArchive = async (classItem, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setClassToArchive(classItem);
    setShowArchiveModal(true);
  };

  // Confirm archive function to pass to modal
  const confirmArchive = async () => {
    if (!classToArchive) return;

    try {
      const professorId = getProfessorId();
      
      const response = await fetch('https://tracked.6minds.site/Professor/ArchiveClassDB/archive_class.php', {
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
        // Remove class from state
        setClasses(prevClasses => prevClasses.filter(c => c.subject_code !== classToArchive.subject_code));
        
        // Remove color from localStorage
        const savedColors = localStorage.getItem('classColors');
        if (savedColors) {
          const colorMap = JSON.parse(savedColors);
          delete colorMap[classToArchive.subject_code];
          localStorage.setItem('classColors', JSON.stringify(colorMap));
        }
        
        // Close modal
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

  const handlePaletteClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Create a copy of the classes array
    const newClasses = [...classes];
    
    // Find the actual index in the original classes array
    const classItem = filteredClasses[index];
    const originalIndex = classes.findIndex(c => c.subject_code === classItem.subject_code);
    
    if (originalIndex !== -1) {
      // Get current color index
      const currentColor = newClasses[originalIndex].bgColor;
      const currentIndex = bgOptions.indexOf(currentColor);
      
      // Calculate next color (cycle through options)
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % bgOptions.length;
      const newColor = bgOptions[nextIndex];
      
      // Update the class with new color
      newClasses[originalIndex] = {
        ...newClasses[originalIndex],
        bgColor: newColor
      };
      
      // Update state
      setClasses(newClasses);
      
      // Update localStorage immediately
      const savedColors = localStorage.getItem('classColors');
      const colorMap = savedColors ? JSON.parse(savedColors) : {};
      colorMap[classItem.subject_code] = newColor;
      localStorage.setItem('classColors', JSON.stringify(colorMap));
    }
  };

  // Handle create class from modal
  const handleCreateClass = (yearLevel, subject, section) => {
    // Validate inputs
    if (!yearLevel || !subject || !section) {
      setFormError("Please fill in all required fields");
      return;
    }

    // Additional validation for section
    if (section.length !== 1 || !/^[A-Z]$/.test(section)) {
      setFormError("Section must be a single letter (A-Z)");
      return;
    }

    setFormError("");
    
    // Check for duplicate class
    const duplicateClass = checkDuplicateClass(yearLevel, subject, section);
    if (duplicateClass) {
      // Show duplicate warning modal instead of creating
      setFormError(""); // Clear any previous errors
      // The CreateClass will handle showing the duplicate warning
      return { duplicate: duplicateClass };
    }

    // If no duplicate, proceed to create
    createClass(yearLevel, subject, section);
    return { duplicate: null };
  };

  // Handle force create (when user confirms duplicate warning)
  const handleForceCreateClass = (yearLevel, subject, section) => {
    createClass(yearLevel, subject, section);
  };

  // Create class function
  const createClass = async (yearLevel, subject, section) => {
    setLoading(true);

    try {
      const professorId = getProfessorId();

      if (!professorId) {
        alert('User not logged in. Please log in again.');
        setLoading(false);
        return;
      }

      const classData = {
        year_level: yearLevel,
        subject: subject,
        section: section,
        professor_ID: professorId
      };

      const response = await fetch('https://tracked.6minds.site/Professor/ClassManagementDB/create_class.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData)
      });

      const result = await response.json();

      if (result.success) {
        // Get saved colors to maintain consistency
        const savedColors = localStorage.getItem('classColors');
        const colorMap = savedColors ? JSON.parse(savedColors) : {};
        
        const newClass = {
          ...result.class_data,
          bgColor: colorMap[result.class_data.subject_code] || bgOptions[classes.length % bgOptions.length]
        };
        
        setClasses(prevClasses => [...prevClasses, newClass]);
        
        // Reset form
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
    const classesToRender = filteredClasses;

    if (loadingClasses) {
      return (
        <div className="col-span-full text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#00874E] border-r-transparent"></div>
          <p className="mt-3 text-gray-600">Loading classes...</p>
        </div>
      );
    }

    if (classesToRender.length === 0) {
      return (
        <div className="col-span-full text-center py-12">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <img 
              src={Add} 
              alt="No classes" 
              className="h-8 w-8 opacity-50"
            />
          </div>
          <p className="text-gray-500 text-sm sm:text-base">
            {selectedFilter === "All Year Levels" 
              ? "No classes created yet. Click the + button to create your first class."
              : `No classes found for ${selectedFilter}.`
            }
          </p>
        </div>
      );
    }

    return classesToRender.map((classItem, index) => (
      <Link 
        to={`/Class?code=${classItem.subject_code}`} 
        key={classItem.subject_code}
        className="block"
      >
        <div
          className="text-gray-600 rounded-lg p-4 sm:p-5 lg:p-6 space-y-3 border-2 border-transparent hover:border-[#00874E] hover:shadow-xl transition-all duration-200 h-full"
          style={{ backgroundColor: classItem.bgColor }}
        >
          {/* Header with Section and Buttons */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center min-w-0 flex-1">
              <img
                src={Book}
                alt="Subject"
                className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 mr-2 filter brightness-0 opacity-70"
                style={{ filter: "brightness(0) opacity(0.7)" }}
              />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm opacity-70 font-medium">Section:</p>
                <p className="text-sm sm:text-base lg:text-lg font-bold truncate">
                  {classItem.section}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={(e) => handlePaletteClick(e, index)}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-md w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 shadow-md flex items-center justify-center border-2 border-white border-opacity-30 hover:border-[#00874E] hover:scale-105 transition-all duration-200 cursor-pointer backdrop-blur-sm"
                aria-label="Change color"
              >
                <img 
                  src={Palette} 
                  alt="" 
                  className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6" 
                />
              </button>
              <button 
                onClick={(e) => handleArchive(classItem, e)}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-md w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 shadow-md flex items-center justify-center border-2 border-white border-opacity-30 hover:border-[#00874E] hover:scale-105 transition-all duration-200 cursor-pointer backdrop-blur-sm"
                aria-label="Archive class"
              >
                <img 
                  src={Archive} 
                  alt="" 
                  className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6" 
                />
              </button>
            </div>
          </div>

          {/* Subject Details */}
          <div className="space-y-2 pt-2 border-t border-gray-400 border-opacity-30">
            <div>
              <p className="text-xs sm:text-sm opacity-70 mb-0.5 font-medium">Subject:</p>
              <p className="text-sm sm:text-base lg:text-lg font-semibold break-words line-clamp-2">
                {classItem.subject}
              </p>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm lg:text-base">
              <div>
                <span className="opacity-70 font-medium">Year Level: </span>
                <span className="font-bold">{classItem.year_level}</span>
              </div>
              <div>
                <span className="opacity-70 font-medium">Code: </span>
                <span className="font-bold">{classItem.subject_code}</span>
              </div>
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
        <Header setIsOpen={setIsOpen} isOpen={isOpen}/>

        {/* Main Content */}
        <div className="p-4 sm:p-5 md:p-6 lg:p-8">
          
          {/* Page Header */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center mb-2">
              <img
                src={ClassManagementIcon}
                alt="ClassManagementIcon"
                className="h-7 w-7 sm:h-9 sm:w-9 mr-2 sm:mr-3"
              />
              <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl text-[#465746]">
                Class Management
              </h1>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-[#465746]">
              Academic Management
            </p>
          </div>

          <hr className="border-[#465746]/30 mb-5 sm:mb-6" />

          {/* Filter and Action Bar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5 sm:mb-6">
            
            {/* Filter Dropdown */}
            <div className="relative flex-1 sm:flex-initial filter-dropdown">
              <button
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="flex items-center justify-between w-full sm:w-auto font-bold px-4 py-2.5 bg-white rounded-md shadow-md border-2 border-transparent hover:border-[#00874E] transition-all duration-200 text-sm sm:text-base min-w-[140px] sm:min-w-[160px] cursor-pointer"
              >
                <span>{selectedFilter}</span>
                <img
                  src={ArrowDown}
                  alt=""
                  className={`ml-3 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 ${filterDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {filterDropdownOpen && (
                <div className="absolute top-full mt-2 bg-white rounded-md w-full sm:min-w-[200px] shadow-xl border border-gray-200 z-20 overflow-hidden">
                  {yearLevels.map((year) => (
                    <button
                      key={year}
                      className={`block px-4 py-2.5 w-full text-left hover:bg-gray-100 text-sm sm:text-base transition-colors duration-150 cursor-pointer ${
                        selectedFilter === year ? 'bg-gray-50 font-semibold' : ''
                      }`}
                      onClick={() => handleFilterSelect(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 sm:ml-auto">
              <Link to="/ArchiveClass">
                <button className="font-bold py-2.5 bg-white rounded-md w-11 h-11 lg:w-12 lg:h-12 shadow-md flex items-center justify-center border-2 border-transparent hover:border-[#00874E] hover:scale-105 transition-all duration-200 cursor-pointer">
                  <img
                    src={Archive}
                    alt=""
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  />
                </button>
              </Link>
              <button 
                onClick={() => setShowModal(true)}
                className="font-bold py-2.5 bg-white rounded-md w-11 h-11 lg:w-12 lg:h-12 shadow-md flex items-center justify-center border-2 border-transparent hover:border-[#00874E] hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <img
                  src={Add}
                  alt="Add"
                  className="h-6 w-6"
                />
              </button>
            </div>
          </div>

          {/* Class Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {renderClassCards()}
          </div>
        </div>
      </div>

      {/* Create Class Modal Component */}
      <CreateClass
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateClass}
        onForceCreate={handleForceCreateClass}
        loading={loading}
        formError={formError}
        showDuplicateWarning={false}
        onCloseDuplicateWarning={() => {}}
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overlay-fade p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSuccessModal(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white text-gray-600 rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 relative modal-pop">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <img 
                  src={SuccessIcon} 
                  alt="Success" 
                  className="h-8 w-8"
                />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">
                Class Created Successfully!
              </h3>
              
              <div className="mt-4 mb-6 bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Subject Code:</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#00874E]">{createdSubjectCode}</p>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-[#00A15D] hover:bg-[#00874E] text-white font-bold py-3 rounded-md transition-all duration-200 cursor-pointer"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      <ClassManagementArchive
        show={showArchiveModal}
        onClose={() => {
          setShowArchiveModal(false);
          setClassToArchive(null);
        }}
        onConfirm={confirmArchive}
        classToArchive={classToArchive}
      />
    </div>
  );
}