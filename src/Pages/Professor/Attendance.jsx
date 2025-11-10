import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";

import AttendanceIcon from '../../assets/Attendance.svg';
import BackButton from '../../assets/BackButton(Light).svg';
import Search from '../../assets/Search.svg';
import SuccessIcon from '../../assets/Success(Green).svg';
import ErrorIcon from '../../assets/Error(Red).svg';
import RemoveIcon from '../../assets/Remove(Red).svg';

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
  
  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);
  const [modalMessage, setModalMessage] = useState('');

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

  // Format name to "Surname, First Name, Middle Initial"
  const formatName = (fullName) => {
    if (!fullName) return '';
    
    // Split the name into parts
    const nameParts = fullName.trim().split(' ');
    
    if (nameParts.length === 1) {
      return nameParts[0]; // Single name
    }
    
    if (nameParts.length === 2) {
      return `${nameParts[1]}, ${nameParts[0]}`; // "First Last" -> "Last, First"
    }
    
    // For names with 3 or more parts, assume the last part is surname
    const surname = nameParts[nameParts.length - 1];
    const givenNames = nameParts.slice(0, nameParts.length - 1);
    
    return `${surname}, ${givenNames.join(' ')}`;
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
      const response = await fetch(`http://localhost/TrackEd/src/Pages/Professor/SubjectDetailsDB/get_class_details.php?subject_code=${subjectCode}&professor_ID=${professorId}`);
      
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
      
      console.log('Fetching enrolled students for class:', subjectCode, 'section:', classInfo.section);
      
      // UPDATED: Include subject_code parameter
      const response = await fetch(
        `http://localhost/TrackEd/src/Pages/Professor/SubjectDetailsDB/get_students_by_section.php?section=${classInfo.section}&subject_code=${subjectCode}`
      );
      
      if (response.ok) {
        const result = await response.json();
        console.log('Enrolled students API response:', result);
        
        if (result.success) {
          const studentsData = result.students;
          console.log('Enrolled students found:', studentsData);
          setStudents(studentsData);
          
          // Initialize attendance status for each student
          const initialAttendance = {};
          studentsData.forEach(student => {
            initialAttendance[student.user_ID] = 'present'; // Default to present
          });
          setAttendance(initialAttendance);
        } else {
          console.error('API returned error:', result.message);
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

      const response = await fetch('http://localhost/TrackEd/src/Pages/Professor/AttendanceDB/save_attendance.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData)
      });

      const result = await response.json();

      if (result.success) {
        setIsEditing(false);
        setModalMessage('Attendance saved successfully!');
        setShowSuccessModal(true);
      } else {
        setModalMessage('Error saving attendance: ' + result.message);
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      setModalMessage('Error saving attendance. Please try again.');
      setShowErrorModal(true);
    }
  };

  // Handle Remove student - show confirmation modal
  const handleRemoveStudent = async (student, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setStudentToRemove(student);
    setShowRemoveModal(true);
  };

  const confirmRemove = async () => {
    if (!studentToRemove) return;

    try {
      const professorId = getProfessorId();
      const response = await fetch('http://localhost/TrackEd/src/Pages/Professor/AttendanceDB/remove_student.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_ID: studentToRemove.user_ID,
          subject_code: subjectCode,
          professor_ID: professorId
        })
      });

      const result = await response.json();

      if (result.success) {
        // Remove student from local state
        setStudents(prev => prev.filter(student => student.user_ID !== studentToRemove.user_ID));
        
        // Remove from attendance state
        setAttendance(prev => {
          const newAttendance = { ...prev };
          delete newAttendance[studentToRemove.user_ID];
          return newAttendance;
        });
        
        setShowRemoveModal(false);
        setStudentToRemove(null);
        
        // Show success message
        setModalMessage('Student removed successfully');
        setShowSuccessModal(true);
      } else {
        setModalMessage('Error removing student: ' + result.message);
        setShowErrorModal(true);
        setShowRemoveModal(false);
      }
    } catch (error) {
      console.error('Error removing student:', error);
      setModalMessage('Error removing student. Please try again.');
      setShowErrorModal(true);
      setShowRemoveModal(false);
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.user_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.user_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.YearandSection && student.YearandSection.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div>
        <Sidebar role="teacher" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[250px] xl:ml-[280px] 2xl:ml-[300px]' : 'ml-0'}`}>
          <Header setIsOpen={setIsSidebarOpen} isOpen={isSidebarOpen}/>
          <div className="p-5 text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Sidebar role="teacher" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[250px] xl:ml-[280px] 2xl:ml-[300px]' : 'ml-0'}`}>
        <Header setIsOpen={setIsSidebarOpen} isOpen={isSidebarOpen}/>

        {/* Main Content */}
        <div className="p-4 sm:p-5 md:p-6 lg:p-8">
          
          {/* Page Header - Updated to match SubjectDetails style */}
          <div className="mb-4 sm:mb-4">
            <div className="flex items-center mb-2">
              <img
                src={AttendanceIcon}
                alt="AttendanceIcon"
                className="h-7 w-7 sm:h-9 sm:w-9 mr-2 sm:mr-3"
              />
              <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl text-[#465746]">
                Attendance
              </h1>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-[#465746]">
              Academic Management
            </p>
          </div>

          {/* Subject Information */}
          <div className="flex flex-col gap-2 text-sm sm:text-base lg:text-[1.125rem] text-[#465746] mb-4 sm:mb-5">
            <div className="flex flex-wrap items-center gap-1 sm:gap-3">
              <span className="font-semibold">SUBJECT CODE:</span>
              <span>{classInfo?.subject_code || 'Loading...'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-3">
              <span className="font-semibold">SUBJECT:</span>
              <span>{classInfo?.subject || 'Loading...'}</span>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
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

          <hr className="border-[#465746]/30 mb-5 sm:mb-6" />

          {/* Search and History Button */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-4 sm:mt-5 gap-3">
            {/* Search input with icon inside */}
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search by name, student number, or year & section..."
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
                  className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
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
              {/* Scroll hint for mobile */}
              <div className="sm:hidden text-xs text-gray-500 py-2 text-center bg-gray-50">
                ← Swipe to see all columns →
              </div>
              
              <div className="p-3 sm:p-4 md:p-5">
                <table className="table-auto w-full border-collapse text-left min-w-[700px]">
                  <thead>
                    <tr className="text-xs sm:text-sm lg:text-[1.125rem] font-semibold">
                      <th className="px-2 sm:px-3 md:px-4 py-2">No.</th>
                      <th className="px-2 sm:px-3 md:px-4 py-2">Student No.</th>
                      <th className="px-2 sm:px-3 md:px-4 py-2">Full Name</th>
                      <th className="px-2 sm:px-3 md:px-4 py-2">Year & Section</th>
                      <th className="px-2 py-2 text-[#EF4444] text-center w-14 sm:w-16 md:w-20">Absent</th>
                      <th className="px-2 py-2 text-[#767EE0] text-center w-14 sm:w-16 md:w-20">Late</th>
                      <th className="px-2 py-2 text-[#00A15D] text-center w-14 sm:w-16 md:w-20">Present</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student, index) => (
                        <tr key={student.user_ID} className="hover:bg-gray-50 text-xs sm:text-sm lg:text-base">
                          <td className="px-2 sm:px-3 md:px-4 py-2">{index + 1}</td>
                          <td className="px-2 sm:px-3 md:px-4 py-2">{student.user_ID}</td>
                          
                          {/* Full Name - Formatted as Surname, First Name, Middle Initial */}
                          <td className="px-2 sm:px-3 md:px-4 py-2">
                            {formatName(student.user_Name)}
                          </td>
                          
                          {/* Year and Section */}
                          <td className="px-2 sm:px-3 md:px-4 py-2">
                            {student.YearandSection || 'N/A'}
                          </td>

                          {/* Absent */}
                          <td className="px-2 py-2 w-14 sm:w-16 md:w-20">
                            <div className="flex justify-center items-center">
                              <input
                                type="radio"
                                name={`attendance-${student.user_ID}`}
                                className="appearance-none w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 border-2 border-[#EF4444] rounded-md checked:bg-[#EF4444] cursor-pointer disabled:cursor-not-allowed"
                                checked={attendance[student.user_ID] === 'absent'}
                                onChange={() => handleAttendanceChange(student.user_ID, 'absent')}
                                disabled={!isEditing}
                              />
                            </div>
                          </td>

                          {/* Late */}
                          <td className="px-2 py-2 w-14 sm:w-16 md:w-20">
                            <div className="flex justify-center items-center">
                              <input
                                type="radio"
                                name={`attendance-${student.user_ID}`}
                                className="appearance-none w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 border-2 border-[#767EE0] rounded-md checked:bg-[#767EE0] cursor-pointer disabled:cursor-not-allowed"
                                checked={attendance[student.user_ID] === 'late'}
                                onChange={() => handleAttendanceChange(student.user_ID, 'late')}
                                disabled={!isEditing}
                              />
                            </div>
                          </td>

                          {/* Present */}
                          <td className="px-2 py-2 w-14 sm:w-16 md:w-20">
                            <div className="flex justify-center items-center">
                              <input
                                type="radio"
                                name={`attendance-${student.user_ID}`}
                                className="appearance-none w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 border-2 border-[#00A15D] rounded-md checked:bg-[#00A15D] cursor-pointer disabled:cursor-not-allowed"
                                checked={attendance[student.user_ID] === 'present'}
                                onChange={() => handleAttendanceChange(student.user_ID, 'present')}
                                disabled={!isEditing}
                              />
                            </div>
                          </td>

                          {/* Remove Button - Changed to Icon */}
                          <td className="px-2 py-2 w-14 sm:w-16 md:w-20">
                            <div className="flex justify-center items-center">
                              <button
                                onClick={(e) => handleRemoveStudent(student, e)}
                                className="bg-white rounded-md w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 shadow-md flex items-center justify-center border-2 border-transparent hover:border-red-500 hover:scale-105 transition-all duration-200 cursor-pointer"
                                title="Remove student"
                              >
                                <img 
                                  src={RemoveIcon} 
                                  alt="Remove student" 
                                  className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6" 
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-4 py-8 text-center text-gray-500 text-sm">
                          {searchTerm ? 'No students found matching your search.' : 'No students found.'}
                      </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* EDIT, MARK ALL, SAVE Buttons - Outside scrollable area */}
            <div className="p-3 sm:p-4 md:p-5 pt-0">
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-[#979797] text-[#fff] font-bold text-sm sm:text-base rounded-md border-transparent border-2 hover:border-[#007846] transition-all cursor-pointer"
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleMarkAllPresent}
                      className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-[#979797] text-[#fff] font-bold text-sm sm:text-base rounded-md border-transparent border-2 hover:border-[#007846] transition-all cursor-pointer"
                    >
                      Mark All as Present
                    </button>
                    <button 
                      onClick={handleSaveAttendance}
                      className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-[#00A15D] text-[#fff] font-bold text-sm sm:text-base rounded-md border-transparent border-2 hover:border-[#007846] transition-all cursor-pointer"
                    >
                      Save
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overlay-fade p-4"
          onClick={() => setShowSuccessModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white text-black rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 relative modal-pop">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <img 
                  src={SuccessIcon} 
                  alt="Success" 
                  className="h-8 w-8"
                />
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-6">{modalMessage}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-[#00A15D] hover:bg-[#00874E] text-white font-bold py-3 rounded-md transition-all duration-200 cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overlay-fade p-4"
          onClick={() => setShowErrorModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white text-black rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 relative modal-pop">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <img 
                  src={ErrorIcon} 
                  alt="Error" 
                  className="h-8 w-8"
                />
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-6">{modalMessage}</p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition-all duration-200 cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {showRemoveModal && studentToRemove && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overlay-fade p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowRemoveModal(false);
              setStudentToRemove(null);
            }
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white text-black rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 relative modal-pop">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <img 
                  src={RemoveIcon} 
                  alt="Remove" 
                  className="h-8 w-8"
                />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Remove Student?
              </h3>
              
              <div className="mt-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">
                  Are you sure you want to remove this student from the class?
                </p>
                <p className="text-sm font-semibold text-red-600 mb-3">
                  This action cannot be undone. The student will be removed from attendance records and activity grades.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                    {formatName(studentToRemove.user_Name)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Student No: {studentToRemove.user_ID}
                  </p>
                  <p className="text-sm text-gray-600">
                    Year & Section: {studentToRemove.YearandSection || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Class: {classInfo?.subject} - {classInfo?.section}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowRemoveModal(false);
                    setStudentToRemove(null);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-md transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemove}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition-all duration-200 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
  );
}