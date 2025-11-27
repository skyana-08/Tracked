import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";

import SubjectDetailsIcon from '../../assets/SubjectDetails.svg';
import BackButton from '../../assets/BackButton(Light).svg';
import Search from "../../assets/Search.svg";
import TeacherIcon from '../../assets/Teacher(Light).svg';
import StudentIcon from '../../assets/Student(Light).svg';
import Details from '../../assets/Details(Light).svg';
import PersonIcon from '../../assets/Person.svg';
import ClassManagementIcon from "../../assets/ClassManagement(Light).svg";
import StudentsIcon from "../../assets/ClassManagement(Light).svg";
import Announcement from "../../assets/Announcement(Light).svg";
import Classwork from "../../assets/Classwork(Light).svg";
import Attendance from "../../assets/Attendance(Light).svg";
import Archive from "../../assets/Archive(Light).svg";

export default function StudentListStudent() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subjectCode = searchParams.get('code');
  
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);

  // State for backend data
  const [classInfo, setClassInfo] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentId, setStudentId] = useState('');

  // Dummy data for teachers and students
  const dummyTeachers = [
    {
      id: "PROF001",
      name: "Dr. Maria Santos",
      role: "Head Teacher",
      email: "maria.santos@university.edu",
      department: "Computer Science"
    },
  ];

  const dummyStudents = [
    {
      id: "20230001",
      name: "Juan Dela Cruz",
      email: "juan.delacruz@student.university.edu",
      gender: "Male",
      yearSection: "BSIT 3-1"
    },
    {
      id: "20230002",
      name: "Maria Garcia",
      email: "maria.garcia@student.university.edu", 
      gender: "Female",
      yearSection: "BSIT 3-1"
    },
  ];

  const dummyClassInfo = {
    subject_code: subjectCode || "CS101",
    subject: "Introduction to Programming",
    section: "BSIT 3-1",
    professor_ID: "PROF001",
    professor_name: "Dr. Maria Santos"
  };

  // Get student ID from localStorage
  useEffect(() => {
    const getStudentId = () => {
      try {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setStudentId(userData.id);
          return userData.id;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
      return null;
    };

    getStudentId();
  }, []);

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use dummy data
        setClassInfo(dummyClassInfo);
        setTeachers(dummyTeachers);
        setStudents(dummyStudents);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("Failed to load class data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [subjectCode]);

  // Filter students and teachers based on search
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div>
        <Sidebar role="student" isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className={`transition-all duration-300 ${isOpen ? 'lg:ml-[250px] xl:ml-[280px] 2xl:ml-[300px]' : 'ml-0'}`}>
          <Header setIsOpen={setIsOpen} isOpen={isOpen} />
          <div className="p-5 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#00874E] border-r-transparent"></div>
            <p className="mt-3 text-gray-600">Loading class data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <Sidebar role="student" isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className={`transition-all duration-300 ${isOpen ? 'lg:ml-[250px] xl:ml-[280px] 2xl:ml-[300px]' : 'ml-0'}`}>
          <Header setIsOpen={setIsOpen} isOpen={isOpen} />
          <div className="p-5 text-center">
            <div className="text-red-600 mb-4">
              <p className="text-lg font-semibold">Error Loading Data</p>
              <p className="text-sm">{error}</p>
            </div>
            <Link to="/Subjects">
              <button className="bg-[#00A15D] hover:bg-[#00874E] text-white font-bold py-2 px-4 rounded transition-colors">
                Back to Subjects
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Sidebar role="student" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`transition-all duration-300 ${isOpen ? 'lg:ml-[250px] xl:ml-[280px] 2xl:ml-[300px]' : 'ml-0'}`}>
        <Header setIsOpen={setIsOpen} isOpen={isOpen} />

        {/* Main Content */}
        <div className="p-4 sm:p-5 md:p-6 lg:p-8">
          
          {/* Page Header */}
          <div className="mb-4 sm:mb-4">
            <div className="flex items-center mb-2">
              <img
                src={StudentsIcon}
                alt="Classmates"
                className="h-7 w-7 sm:h-9 sm:w-9 mr-2 sm:mr-3"
              />
              <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl text-[#465746]">
                Classmates
              </h1>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-[#465746]">
              View your classmates and teachers
            </p>
          </div>

          {/* Subject Information */}
          <div className="flex flex-col gap-2 text-sm sm:text-base lg:text-[1.125rem] text-[#465746] mb-4 sm:mb-5">
            <div className="flex flex-wrap items-center gap-1 sm:gap-3">
              <span className="font-semibold">SUBJECT CODE:</span>
              <span>{classInfo?.subject_code || subjectCode || 'Loading...'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-3">
              <span className="font-semibold">SUBJECT:</span>
              <span>{classInfo?.subject || 'Loading...'}</span>
            </div>

            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Section:</span>
                <span>{classInfo?.section || 'Loading...'}</span>
              </div>
              {/* FIXED: Use classInfo instead of undefined classItem */}
              <Link to={`/SubjectAnnouncementStudent?code=${classInfo?.subject_code || subjectCode}`}>
                <img 
                  src={BackButton} 
                  alt="Back" 
                  className="h-6 w-6 cursor-pointer hover:opacity-70 transition-opacity" 
                />
              </Link>
            </div>
          </div>

          <hr className="border-[#465746]/30 mb-5 sm:mb-6" />

          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            <div className="bg-white p-4 sm:p-5 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <img src={TeacherIcon} alt="Teachers" className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Teachers</p>
                  <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 sm:p-5 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <img src={StudentIcon} alt="Students" className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Classmates</p>
                  <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 sm:p-5 rounded-lg shadow-md border border-gray-200 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <img src={PersonIcon} alt="Active" className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Class Members</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teachers.length + students.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search classmates or teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 sm:h-12 rounded-md px-4 py-2.5 pr-12 shadow-md outline-none bg-white text-sm sm:text-base border-2 border-transparent focus:border-[#00874E] transition-colors"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <img
                  src={Search}
                  alt="Search"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                />
              </button>
            </div>
          </div>

          {/* Teachers Section */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <img
                src={TeacherIcon}
                alt="Teachers"
                className="h-6 w-6 sm:h-7 sm:w-7"
              />
              <h2 className="font-bold text-lg sm:text-xl lg:text-2xl text-[#465746]">
                Teachers ({teachers.length})
              </h2>
            </div>

            <div className="space-y-4">
              {filteredTeachers.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-md">
                  No teachers found matching your search
                </div>
              ) : (
                filteredTeachers.map((teacher) => (
                  <div key={teacher.id} className="bg-white p-4 sm:p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <img src={PersonIcon} alt="Person" className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                            {teacher.name}
                          </h3>
                          <p className="text-[#00874E] text-sm font-medium mt-1">
                            {teacher.role}
                          </p>
                          {teacher.email && (
                            <p className="text-gray-500 text-sm mt-1 truncate">
                              {teacher.email}
                            </p>
                          )}
                          {teacher.department && (
                            <p className="text-gray-500 text-sm mt-1">
                              {teacher.department}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Classmates Section */}
          <div>
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <img
                src={StudentIcon}
                alt="Classmates"
                className="h-6 w-6 sm:h-7 sm:w-7"
              />
              <h2 className="font-bold text-lg sm:text-xl lg:text-2xl text-[#465746]">
                Classmates ({students.length})
              </h2>
            </div>

            <div className="space-y-4">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-md">
                  {searchQuery ? "No classmates found matching your search" : "No classmates in this class"}
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div key={student.id} className="bg-white p-4 sm:p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                          <img src={PersonIcon} alt="Person" className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                            {student.name}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">
                            Classmate • {student.yearSection || 'N/A'}
                          </p>
                          {student.email && (
                            <p className="text-gray-500 text-sm mt-1 truncate">
                              {student.email}
                            </p>
                          )}
                          {student.gender && (
                            <p className="text-gray-500 text-sm mt-1">
                              {student.gender}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}