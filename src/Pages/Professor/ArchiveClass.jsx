import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";

import ArchiveIcon from "../../assets/Archive(Light).svg";
import BackButton from "../../assets/BackButton(Light).svg";
import Book from "../../assets/ClassManagementSubject(Light).svg";
import DeleteIcon from "../../assets/Delete.svg";
import UnarchiveIcon from "../../assets/Unarchive.svg";

export default function ArchiveClass() {
  const [isOpen, setIsOpen] = useState(false);
  const [archivedClasses, setArchivedClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // background colors (same as ClassManagement.jsx)
  const bgOptions = [
    "#874040",
    "#4951AA", 
    "#00874E",
    "#374151",
    "#1E3A8A",
  ];

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

  // Load archived classes from database on component mount
  useEffect(() => {
    fetchArchivedClasses();
  }, []);

  const fetchArchivedClasses = async () => {
    try {
      setLoading(true);
      const professorId = getProfessorId(); // CHANGED: Get dynamic ID
      
      if (!professorId) {
        console.error('No professor ID found. User may not be logged in.');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`http://localhost/TrackEd/src/Pages/Professor/get_archived_classes.php?professor_ID=${professorId}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Add background colors to each class (same as ClassManagement.jsx)
          const classesWithColors = result.classes.map((classItem, index) => ({
            ...classItem,
            bgColor: bgOptions[index % bgOptions.length]
          }));
          setArchivedClasses(classesWithColors);
        } else {
          console.error('Error fetching archived classes:', result.message);
        }
      } else {
        throw new Error('Failed to fetch archived classes');
      }
    } catch (error) {
      console.error('Error fetching archived classes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle unarchive
  const handleUnarchive = async (classItem, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to unarchive "${classItem.subject}"?`)) {
      try {
        const professorId = getProfessorId(); // CHANGED: Get dynamic ID
        
        const response = await fetch('http://localhost/TrackEd/src/Pages/Professor/unarchive_class.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject_code: classItem.subject_code,
            professor_ID: professorId // CHANGED: Use dynamic ID
          })
        });

        const result = await response.json();

        if (result.success) {
          // Remove class from archived list
          setArchivedClasses(prevClasses => 
            prevClasses.filter(c => c.subject_code !== classItem.subject_code)
          );
          alert('Class unarchived successfully!');
        } else {
          alert('Error unarchiving class: ' + result.message);
        }
      } catch (error) {
        console.error('Error unarchiving class:', error);
        alert('Error unarchiving class. Please try again.');
      }
    }
  };

  // Handle delete
  const handleDelete = async (classItem, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to permanently delete "${classItem.subject}"? This action cannot be undone.`)) {
      try {
        const professorId = getProfessorId(); // CHANGED: Get dynamic ID
        
        const response = await fetch('http://localhost/TrackEd/src/Pages/Professor/delete_class.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject_code: classItem.subject_code,
            professor_ID: professorId // CHANGED: Use dynamic ID
          })
        });

        const result = await response.json();

        if (result.success) {
          // Remove class from archived list
          setArchivedClasses(prevClasses => 
            prevClasses.filter(c => c.subject_code !== classItem.subject_code)
          );
          alert('Class deleted successfully!');
        } else {
          alert('Error deleting class: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting class:', error);
        alert('Error deleting class. Please try again.');
      }
    }
  };

  // Function to render archived class cards
  const renderArchivedClassCards = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <p>Loading archived classes...</p>
        </div>
      );
    }

    return archivedClasses.map((classItem) => (
      <div 
        key={classItem.subject_code}
        className="text-white text-sm sm:text-base lg:text-[1.125rem] rounded-lg p-4 sm:p-5 space-y-2 sm:space-y-3 mt-4 sm:mt-5 border-2 border-transparent hover:border-[#351111] transition-all duration-200 relative"
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
            {/* Delete Button */}
            <button
              onClick={(e) => handleDelete(classItem, e)}
              className="font-bold py-1 sm:py-2 bg-white rounded-md w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 shadow-md flex items-center justify-center border-2 border-transparent hover:border-red-500 transition-all duration-200 cursor-pointer"
              title="Delete permanently"
            >
              <img 
                src={DeleteIcon} 
                alt="Delete class" 
                className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" 
              />
            </button>

            {/* Unarchive Button */}
            <button
              onClick={(e) => handleUnarchive(classItem, e)}
              className="font-bold py-1 sm:py-2 bg-white rounded-md w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 shadow-md flex items-center justify-center border-2 border-transparent hover:border-[#00874E] transition-all duration-200 cursor-pointer"
              title="Restore class"
            >
              <img 
                src={UnarchiveIcon} 
                alt="Unarchive class" 
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

        {/* content of ARCHIVED CLASSES */}
        <div className="p-3 sm:p-4 md:p-5 lg:p-5 xl:p-5">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2 sm:mb-4">
            <div className="flex items-center mb-2 sm:mb-0">
              <img
                src={ArchiveIcon}
                alt="Archive"
                className="h-7 w-7 sm:h-6 sm:w-7 md:h-7 md:w-7 mr-3 sm:mr-3 mt-0.5 ml-2"
              />
              <h1 className="font-bold text-xl sm:text-xl md:text-xl lg:text-[1.5rem] text-[#465746]">
                Archives
              </h1>
            </div>
          </div>

          {/* Subtitle with mobile back button */}
          <div className="flex items-center justify-between mb-4 sm:mb-5 ml-2">
            <div className="text-sm sm:text-base md:text-base lg:text-[1.125rem] text-[#465746]">
              <span>Classes you've archived</span>
            </div>
            
            {/* Mobile Back Button - Only visible on mobile */}
            <Link to="/ClassManagement" className="sm:hidden">
              <button 
                className="flex items-center justify-center w-8 h-8 cursor-pointer transition-all duration-200"
                aria-label="Back to Classes"
              >
                <img
                  src={BackButton}
                  alt="Back"
                  className="h-6 w-6"
                />
              </button>
            </Link>
          </div>

          <hr className="opacity-60 border-[#465746] rounded border-1 mt-3" />

          {/* ARCHIVED CLASSES CARDS */}
          <div className="mt-4 sm:mt-5">
            {renderArchivedClassCards()}

            {/* Show message if no archived classes */}
            {!loading && archivedClasses.length === 0 && (
              <div className="text-center py-10 sm:py-12 md:py-16">
                <p className="text-gray-500 text-base sm:text-lg md:text-xl">No archived classes found.</p>
                <p className="text-gray-400 text-sm mt-2">Classes you archive will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}