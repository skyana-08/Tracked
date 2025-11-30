import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Lottie from "lottie-react";

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";
import Popup from "../../Components/Popup";

import ClassManagementLight from "../../assets/ClassManagement(Light).svg";
import BackButton from "../../assets/BackButton(Light).svg";

// Import the Lottie animation JSON file
import loadingAnimation from "../../assets/system-regular-716-spinner-three-dots-loop-expand.json";

export default function SuperAdminStudentAccountDetails() {
  const [isOpen, setIsOpen] = useState(true);
  const [popupType, setPopupType] = useState(null);
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [studentClasses, setStudentClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(false);

  const location = useLocation();

  // Lottie animation options
  const defaultLottieOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  // Get ID from query parameters
  const getStudentId = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get("id");
  };

  useEffect(() => {
    const studentId = getStudentId();
    if (studentId) {
      fetchStudentData(studentId);
      fetchStudentClasses(studentId);
    }
  }, [location.search]);

  const fetchStudentData = (studentId) => {
    setIsLoading(true);
    fetch(
      `https://tracked.6minds.site/Admin/StudentAccountsDB/get_students.php?id=${studentId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.student) {
          setStudent(data.student);
        } else {
          console.error("Student not found:", data.message);
          setPopupType("error");
        }
      })
      .catch((err) => {
        console.error("Error fetching student data:", err);
        setPopupType("error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchStudentClasses = (studentId) => {
    setClassesLoading(true);
    fetch(
      `https://tracked.6minds.site/Admin/StudentAccountsDB/get_student_classes.php?student_id=${studentId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStudentClasses(data.classes || []);
        } else {
          console.error("Error fetching student classes:", data.message);
          setStudentClasses([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching student classes:", err);
        setStudentClasses([]);
      })
      .finally(() => {
        setClassesLoading(false);
      });
  };

  const handleResetPassword = async () => {
    try {
      const studentId = getStudentId();
      const response = await fetch(`https://tracked.6minds.site/Admin/StudentAccountsDB/reset_student_password.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: studentId })
      });
      const data = await response.json();
      if (data.success) {
        alert('Password reset successfully!');
        setPopupType(null);
        // Refresh student data to get updated temporary password
        fetchStudentData(studentId);
      } else {
        alert('Failed to reset password: ' + data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert('Error resetting password');
    }
  };

  const handleToggleAccount = async () => {
    try {
      const studentId = getStudentId();
      const response = await fetch(`https://tracked.6minds.site/Admin/StudentAccountsDB/update_student_status.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: studentId, 
          status: student?.tracked_Status === 'Active' ? 'Deactivated' : 'Active'
        })
      });
      const data = await response.json();
      if (data.success) {
        alert(`Account ${student?.tracked_Status === 'Active' ? 'deactivated' : 'activated'} successfully!`);
        setPopupType(null);
        fetchStudentData(studentId);
      } else {
        alert('Failed to update account status: ' + data.message);
      }
    } catch (error) {
      console.error("Error updating account status:", error);
      alert('Error updating account status');
    }
  };

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Extract year level from yearandsec (e.g., "4D" -> "4th Year")
  const getYearLevel = (yearAndSec) => {
    if (!yearAndSec) return "N/A";
    const yearMatch = yearAndSec.match(/^(\d+)/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1]);
      const suffixes = ["", "st", "nd", "rd", "th"];
      const suffix = year <= 4 ? suffixes[year] || "th" : "th";
      return `${year}${suffix} Year`;
    }
    return yearAndSec;
  };

  // Extract section from yearandsec (e.g., "4D" -> "D")
  const getSection = (yearAndSec) => {
    if (!yearAndSec) return "N/A";
    const sectionMatch = yearAndSec.match(/[A-Za-z]+$/);
    return sectionMatch ? sectionMatch[0] : yearAndSec;
  };

  // Format classes for display
  const formatClassesDisplay = () => {
    if (classesLoading) {
      return (
        <div className="flex items-center text-gray-500">
          <div className="w-4 h-4 mr-2">
            <Lottie 
              {...defaultLottieOptions}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          Loading classes...
        </div>
      );
    }
    
    if (studentClasses.length === 0) {
      return "No classes enrolled";
    }

    return studentClasses.map(cls => 
      `${cls.subject} (${cls.subject_code}) - ${cls.section}`
    ).join(", ");
  };

  if (!student) {
    return (
      <div>
        <Sidebar role="superadmin" isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className={`
          transition-all duration-300
          ${isOpen ? "lg:ml-[250px] xl:ml-[280px] 2xl:ml-[300px]" : "ml-0"}
        `}>
          <Header setIsOpen={setIsOpen} isOpen={isOpen} />
          <div className="p-4 sm:p-5 md:p-6 lg:p-8">
            <div className="flex flex-col justify-center items-center h-64">
              <div className="w-24 h-24 mb-4">
                <Lottie 
                  {...defaultLottieOptions}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <p className="text-[#465746] text-lg font-medium">Loading student details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Sidebar role="superadmin" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={`
        transition-all duration-300
        ${isOpen ? "lg:ml-[250px] xl:ml-[280px] 2xl:ml-[300px]" : "ml-0"}
      `}
      >
        <Header setIsOpen={setIsOpen} isOpen={isOpen} />

        <div className="p-4 sm:p-5 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center mb-2">
              <img
                src={ClassManagementLight}
                alt="ClassManagement"
                className="h-6 w-6 sm:h-7 sm:w-7 mr-3"
              />
              <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl text-[#465746]">
                User Management
              </h1>
            </div>
            <div className="flex items-center justify-between text-sm sm:text-base lg:text-lg text-[#465746]">
              <span>Student Account Details - {student.tracked_ID}</span>
              <Link to="/SuperAdminStudentAccount">
                <img
                  src={BackButton}
                  alt="BackButton"
                  className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 hover:opacity-70 transition-opacity"
                />
              </Link>
            </div>
          </div>

          <hr className="border-[#465746]/30 mb-5 sm:mb-6" />

          {/* Loading State for Student Data */}
          {isLoading && (
            <div className="flex flex-col justify-center items-center py-12 bg-white rounded-lg shadow-md">
              <div className="w-20 h-20 mb-4">
                <Lottie 
                  {...defaultLottieOptions}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <p className="text-[#465746] text-lg font-medium">Loading student information...</p>
            </div>
          )}

          {/* Content */}
          {!isLoading && (
            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl space-y-5 sm:space-y-6 shadow-md text-[#465746]">
              {/* Student Information Section */}
              <div>
                <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-[#465746]">
                  Student Information
                </h2>
                <div className="space-y-3 sm:space-y-2">
                  {/* First Name */}
                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 text-sm sm:text-base md:text-lg">
                    <span className="font-medium text-gray-600">
                      First Name :
                    </span>
                    <span>{student.tracked_firstname || "N/A"}</span>
                  </div>

                  {/* Middle Name */}
                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 text-sm sm:text-base md:text-lg">
                    <span className="font-medium text-gray-600">
                      Middle Name :
                    </span>
                    <span>{student.tracked_middlename || "N/A"}</span>
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 text-sm sm:text-base md:text-lg">
                    <span className="font-medium text-gray-600">Last Name :</span>
                    <span>{student.tracked_lastname || "N/A"}</span>
                  </div>

                  {/* Sex */}
                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 text-sm sm:text-base md:text-lg">
                    <span className="font-medium text-gray-600">Sex :</span>
                    <span>{student.tracked_gender || "N/A"}</span>
                  </div>

                  {/* Date of Birth */}
                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 text-sm sm:text-base md:text-lg">
                    <span className="font-medium text-gray-600">
                      Date of Birth :
                    </span>
                    <span>{formatDate(student.tracked_bday)}</span>
                  </div>

                  {/* Student ID */}
                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 text-sm sm:text-base md:text-lg">
                    <span className="font-medium text-gray-600">
                      Student ID :
                    </span>
                    <span>{student.tracked_ID || "N/A"}</span>
                  </div>

                  {/* CVSU Email Address */}
                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 text-sm sm:text-base md:text-lg">
                    <span className="font-medium text-gray-600">
                      CVSU Email Address :
                    </span>
                    <span className="break-all">
                      {student.tracked_email || "N/A"}
                    </span>
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 text-sm sm:text-base md:text-lg">
                    <span className="font-medium text-gray-600">
                      Phone Number :
                    </span>
                    <span>{student.tracked_phone || "N/A"}</span>
                  </div>

                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 text-sm sm:text-base md:text-lg">
                    <span className="font-medium text-gray-600">
                      Temporary Password :
                    </span>
                    <span className="font-semibold">
                      {student.temporary_password || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <hr className="opacity-10 border-[#465746] rounded border-1 mb-6" />

              {/* Academic Information Section */}
              <div>
                <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-[#465746]">
                  Academic Information
                </h2>
                <div className="space-y-3 sm:space-y-2">
                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 text-sm sm:text-base md:text-lg">
                    <span className="font-medium text-gray-600">
                      Program :
                    </span>
                    <span>{student.tracked_program || "N/A"}</span>
                  </div>

                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 text-sm sm:text-base md:text-lg">
                    <span className="font-medium text-gray-600">
                      Year Level :
                    </span>
                    <span>{getYearLevel(student.tracked_yearandsec)}</span>
                  </div>

                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 text-sm sm:text-base md:text-lg">
                    <span className="font-medium text-gray-600">Section :</span>
                    <span>{getSection(student.tracked_yearandsec)}</span>
                  </div>

                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 text-sm sm:text-base md:text-lg">
                    <span className="font-medium text-gray-600">Semester :</span>
                    <span>{student.tracked_semester || "N/A"}</span>
                  </div>

                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 text-sm sm:text-base md:text-lg">
                    <span className="font-medium text-gray-600">
                      Classes Enrolled :
                    </span>
                    <span className={classesLoading ? "text-gray-400 italic" : ""}>
                      {formatClassesDisplay()}
                    </span>
                  </div>
                </div>
              </div>

              <hr className="opacity-10 border-[#465746] rounded border-1 mb-6" />

              {/* Account Information Section */}
              <div>
                <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-[#465746]">
                  Account Information
                </h2>
                <div className="space-y-3 sm:space-y-2">
                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 text-sm sm:text-base md:text-lg">
                    <span className="font-medium text-gray-600">
                      Date Created :
                    </span>
                    <span>{formatDate(student.created_at)}</span>
                  </div>

                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 text-sm sm:text-base md:text-lg">
                    <span className="font-medium text-gray-600">
                      Last Login :
                    </span>
                    <span>{formatDate(student.updated_at)}</span>
                  </div>

                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 text-sm sm:text-base md:text-lg">
                    <span className="font-medium text-gray-600">
                      Account Status :
                    </span>
                    <span
                      className={`font-semibold ${
                        student.tracked_Status === "Active"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {student.tracked_Status || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 sm:pt-5 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Reset Password */}
                  <button 
                    onClick={() => setPopupType("reset")} 
                    className="font-bold text-white py-2.5 px-4 sm:px-6 bg-[#00874E] rounded-md shadow-md text-center hover:bg-[#006F3A] text-sm sm:text-base w-full sm:w-auto transition-colors duration-200 cursor-pointer"
                  >
                    Reset Password
                  </button>

                  {/* Toggle Account Status */}
                  <button 
                    onClick={() => setPopupType("toggle")}  
                    className={`font-bold text-white py-2.5 px-4 sm:px-6 rounded-md shadow-md text-center text-sm sm:text-base w-full sm:w-auto transition-colors duration-200 cursor-pointer ${
                      student.tracked_Status === 'Active' 
                        ? 'bg-[#FF6666] hover:bg-[#E55555]' 
                        : 'bg-[#00874E] hover:bg-[#006F3A]'
                    }`}
                  >
                    {student.tracked_Status === 'Active' ? 'Disable Account' : 'Enable Account'}
                  </button>
                </div>
              </div>

              {/* Popup */}
              {popupType === "reset" && (
                <Popup 
                  setOpen={() => setPopupType(null)} 
                  message="Do you really want to reset this password? The default password will be 'password123'." 
                  confirmText="Reset" 
                  buttonColor="#00874E" 
                  hoverColor="#006F3A"
                  onConfirm={handleResetPassword}
                />
              )}

              {popupType === "toggle" && (
                <Popup 
                  setOpen={() => setPopupType(null)} 
                  message={`Are you sure you want to ${student.tracked_Status === 'Active' ? 'disable' : 'enable'} this account?`} 
                  confirmText={student.tracked_Status === 'Active' ? 'Disable' : 'Enable'} 
                  buttonColor={student.tracked_Status === 'Active' ? '#FF6666' : '#00874E'} 
                  hoverColor={student.tracked_Status === 'Active' ? '#C23535' : '#006F3A'}
                  onConfirm={handleToggleAccount}
                />
              )}

              {popupType === "error" && (
                <Popup
                  setOpen={() => setPopupType(null)}
                  message="Failed to load student information. Please try again."
                  confirmText="OK"
                  buttonColor="#FF6666"
                  hoverColor="#C23535"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}