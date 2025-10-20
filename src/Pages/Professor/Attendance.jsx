import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";

import ClassManagementLight from '../../assets/ClassManagement(Light).svg';
import BackButton from '../../assets/BackButton(Light).svg';
import Search from '../../assets/Search.svg';

export default function Attendance() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subjectCode = searchParams.get('code');
  
  const [students, setStudents] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Get professor ID from localStorage
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

  // Fetch class details and students
  useEffect(() => {
    if (subjectCode) {
      fetchClassDetails();
    }
  }, [subjectCode]);

  useEffect(() => {
    if (classInfo) {
      fetchStudents();
    }
  }, [classInfo]);

  const fetchClassDetails = async () => {
    try {
      const professorId = getProfessorId();
      const response = await fetch(`http://localhost/TrackEd/src/Pages/Professor/get_class_details.php?subject_code=${subjectCode}&professor_ID=${professorId}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setClassInfo(result.class_data);
        }
      }
    } catch (error) {
      console.error('Error fetching class details:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      if (!classInfo) return;
      
      console.log('Fetching students for section:', classInfo.section);
      
      const response = await fetch(`http://localhost/TrackEd/src/Pages/Professor/get_students_by_section.php?section=${classInfo.section}`);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Students API response:', result);
        
        if (result.success) {
          const studentsData = result.students;
          console.log('Students found:', studentsData);
          setStudents(studentsData);
          
          // Initialize attendance status for each student
          const initialAttendance = {};
          studentsData.forEach(student => {
            initialAttendance[student.user_ID] = 'present'; // Default to present
          });
          setAttendance(initialAttendance);
        }
      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAllPresent = () => {
    const newAttendance = {};
    students.forEach(student => {
      newAttendance[student.user_ID] = 'present';
    });
    setAttendance(newAttendance);
  };

  const handleSaveAttendance = async () => {
    try {
      const professorId = getProfessorId();
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      const attendanceData = {
        subject_code: subjectCode,
        professor_ID: professorId,
        attendance_date: today,
        attendance_records: Object.entries(attendance).map(([student_ID, status]) => ({
          student_ID,
          status
        }))
      };

      const response = await fetch('http://localhost/TrackEd/src/Pages/Professor/save_attendance.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData)
      });

      const result = await response.json();

      if (result.success) {
        setIsEditing(false);
        alert('Attendance saved successfully!');
      } else {
        alert('Error saving attendance: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Error saving attendance. Please try again.');
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.user_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.user_ID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <Sidebar role="teacher" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[250px] xl:ml-[280px] 2xl:ml-[300px]' : 'ml-0'}`}>
          <Header setIsOpen={setIsSidebarOpen} isOpen={isSidebarOpen} userName="Jane Doe" />
          <div className="p-5 text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Sidebar role="teacher" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[250px] xl:ml-[280px] 2xl:ml-[300px]' : 'ml-0'}`}>
        <Header setIsOpen={setIsSidebarOpen} isOpen={isSidebarOpen} userName="Jane Doe" />

        <div className="p-3 sm:p-4 md:p-5 lg:p-5 xl:p-5">
          {/* "Header" of ATTENDANCE */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2 sm:mb-4">
            <div className='flex items-center mb-2 sm:mb-0'>
              <img 
                src={ClassManagementLight} 
                alt="ClassManagement" 
                className='h-7 w-7 sm:h-6 sm:w-7 md:h-7 md:w-7 mr-3 sm:mr-3 mt-0.5 ml-2' 
              />
              <p className="font-bold text-xl sm:text-xl md:text-xl lg:text-[1.5rem] text-[#465746]">
                Class Management
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm sm:text-base lg:text-[1.125rem] text-[#465746] mb-4 sm:mb-5 ml-2">
            <div className="flex flex-wrap items-center gap-1 sm:gap-3">
              <span className="font-semibold">SUBJECT CODE:</span>
              <span>{classInfo?.subject_code || 'Loading...'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-3">
              <span className="font-semibold">SUBJECT:</span>
              <span>{classInfo?.subject || 'Loading...'}</span>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 sm:mr-5">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Section:</span>
                <span>{classInfo?.section || 'Loading...'}</span>
              </div>
              <Link to={`/SubjectDetails?code=${subjectCode}`} className="sm:hidden">
                <img 
                  src={BackButton} 
                  alt="Back" 
                  className="h-6 w-6 cursor-pointer hover:opacity-70 transition-opacity" 
                />
              </Link>
            </div>
          </div>

          <hr className="opacity-60 border-[#465746] rounded border-1 mt-5" />

          {/* Search and History Button */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-4 sm:mt-5 gap-3">
            {/* Search input with icon inside */}
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search by name or student number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 sm:h-10 lg:h-11 rounded-md pl-3 pr-10 shadow-md outline-none text-[#465746] bg-white text-xs sm:text-sm"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#465746]"
              >
                <img
                  src={Search}
                  alt="Search"
                  className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                />
              </button>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Link to={`/AttendanceHistory?code=${subjectCode}`}>
                <button className="font-bold px-4 sm:px-5 py-2 bg-white rounded-md shadow-md border-2 border-transparent hover:border-[#00874E] transition-all duration-200 text-sm sm:text-base lg:text-[1.125rem] whitespace-nowrap cursor-pointer">
                  History
                </button>
              </Link>
            </div>
          </div>

          {/* ATTENDANCE TABLE */}
          <div className="rounded-md overflow-hidden shadow-md mt-4 sm:mt-5 bg-[#fff]">
            <div className="overflow-x-auto">
              <div className="p-3 sm:p-4 md:p-5">
                <table className="table-auto w-full border-collapse text-left min-w-[600px]">
                  <thead>
                    <tr className="text-xs sm:text-sm lg:text-[1.125rem]">
                      <th className="px-2 sm:px-4 py-2">No.</th>
                      <th className="px-2 sm:px-4 py-2">Student No.</th>
                      <th className="px-2 sm:px-4 py-2">Full Name</th>
                      <th className="px-2 py-2 text-[#EF4444] text-center w-16 sm:w-20">Absent</th>
                      <th className="px-2 py-2 text-[#767EE0] text-center w-16 sm:w-20">Late</th>
                      <th className="px-2 py-2 text-[#00A15D] text-center w-16 sm:w-20">Present</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => (
                      <tr key={student.user_ID} className="hover:bg-gray-50 text-xs sm:text-sm lg:text-base">
                        <td className="px-2 sm:px-4 py-2">{index + 1}</td>
                        <td className="px-2 sm:px-4 py-2">{student.user_ID}</td>
                        <td className="px-2 sm:px-4 py-2">{student.user_Name}</td>

                        {/* Absent */}
                        <td className="px-2 py-2 w-16 sm:w-20">
                          <div className="flex justify-center items-center">
                            <input
                              type="radio"
                              name={`attendance-${student.user_ID}`}
                              className="appearance-none w-6 h-6 sm:w-7 sm:h-7 border-2 border-[#EF4444] rounded-md checked:bg-[#EF4444] cursor-pointer disabled:cursor-not-allowed"
                              checked={attendance[student.user_ID] === 'absent'}
                              onChange={() => handleAttendanceChange(student.user_ID, 'absent')}
                              disabled={!isEditing}
                            />
                          </div>
                        </td>

                        {/* Late */}
                        <td className="px-2 py-2 w-16 sm:w-20">
                          <div className="flex justify-center items-center">
                            <input
                              type="radio"
                              name={`attendance-${student.user_ID}`}
                              className="appearance-none w-6 h-6 sm:w-7 sm:h-7 border-2 border-[#767EE0] rounded-md checked:bg-[#767EE0] cursor-pointer disabled:cursor-not-allowed"
                              checked={attendance[student.user_ID] === 'late'}
                              onChange={() => handleAttendanceChange(student.user_ID, 'late')}
                              disabled={!isEditing}
                            />
                          </div>
                        </td>

                        {/* Present */}
                        <td className="px-2 py-2 w-16 sm:w-20">
                          <div className="flex justify-center items-center">
                            <input
                              type="radio"
                              name={`attendance-${student.user_ID}`}
                              className="appearance-none w-6 h-6 sm:w-7 sm:h-7 border-2 border-[#00A15D] rounded-md checked:bg-[#00A15D] cursor-pointer disabled:cursor-not-allowed"
                              checked={attendance[student.user_ID] === 'present'}
                              onChange={() => handleAttendanceChange(student.user_ID, 'present')}
                              disabled={!isEditing}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* EDIT, MARK ALL, SAVE Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-5">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={handleMarkAllPresent}
                        className="w-full sm:w-auto px-4 py-2 bg-[#979797] text-[#fff] font-bold text-sm sm:text-base rounded-md hover:border-2 hover:border-[#007846] transition-all cursor-pointer"
                      >
                        Mark All as Present
                      </button>
                      <button 
                        onClick={handleSaveAttendance}
                        className="w-full sm:w-auto px-4 py-2 bg-[#00A15D] text-[#fff] font-bold text-sm sm:text-base rounded-md hover:border-2 hover:border-[#007846] transition-all cursor-pointer"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto px-4 py-2 bg-[#979797] text-[#fff] font-bold text-sm sm:text-base rounded-md hover:border-2 hover:border-[#007846] transition-all cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}