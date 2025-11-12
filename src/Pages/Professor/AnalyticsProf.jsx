import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";
import ActivityOverview from "../../Components/ActivityOverview";

import Analytics from '../../assets/Analytics(Light).svg';
import ArrowDown from '../../assets/ArrowDown(Light).svg';
import Search from "../../assets/Search.svg";
import Details from '../../assets/Details(Light).svg';

export default function AnalyticsProf() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubject, setOpenSubject] = useState(false);
  const [openSection, setOpenSection] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [classes, setClasses] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------- DATA ----------
  const quizzesList = [
    { id: 1, task: "Quiz 1", title: "Algebra Basics", submitted: 28, missing: 2, deadline: "Sept 25, 2025" },
    { id: 2, task: "Quiz 2", title: "Geometry", submitted: 27, missing: 3, deadline: "Oct 2, 2025" },
    { id: 3, task: "Quiz 3", title: "Trigonometry", submitted: 29, missing: 1, deadline: "Oct 10, 2025" },
    { id: 4, task: "Quiz 4", title: "Calculus Intro", submitted: 25, missing: 4, deadline: "Oct 20, 2025" }
  ];
  const assignmentsList = [
    { id: 1, task: "Assign 1", title: "Essay 1", submitted: 20, missing: 8, deadline: "Sept 30, 2025" }
  ];
  const activitiesList = [
    { id: 1, task: "Activity 1", title: "Group Work", submitted: 22, missing: 6, deadline: "Oct 1, 2025" },
    { id: 2, task: "Activity 2", title: "In-class Task", submitted: 18, missing: 10, deadline: "Oct 8, 2025" }
  ];
  const projectsList = [
    { id: 1, task: "Project 1", title: "Final Project", submitted: 15, missing: 5, deadline: "Nov 1, 2025" }
  ];

  const displayedList = selectedFilter === 'Assignment'
    ? assignmentsList
    : selectedFilter === 'Activities'
    ? activitiesList
    : selectedFilter === 'Projects'
    ? projectsList
    : quizzesList;

  const displayedLabel = selectedFilter === '' ? 'Quizzes' : selectedFilter;

  // Colors for charts
  const COLORS = ['#00A15D', '#FF6666', '#FFC107', '#2196F3', '#9C27B0'];

  // Fetch classes for the professor
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const professor_ID = localStorage.getItem('professor_ID') || 'PROF001'; // Replace with actual professor ID
        const response = await fetch(`http://localhost/TrackEd/src/Pages/Professor/ClassManagementDB/get_classes.php?professor_ID=${professor_ID}`);
        const data = await response.json();
        
        if (data.success) {
          setClasses(data.classes);
          if (data.classes.length > 0) {
            setSelectedSubject(data.classes[0].subject_code);
          }
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  // Fetch analytics data when subject changes
  useEffect(() => {
    if (selectedSubject) {
      fetchAnalyticsData();
    }
  }, [selectedSubject]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const professor_ID = localStorage.getItem('professor_ID') || 'PROF001'; // Replace with actual professor ID
      
      // Fetch attendance data
      const attendanceResponse = await fetch(
        `http://localhost/TrackEd/src/Pages/Professor/AttendanceDB/get_attendance_history.php?subject_code=${selectedSubject}&professor_ID=${professor_ID}`
      );
      const attendanceData = await attendanceResponse.json();

      // Fetch activities data
      const activitiesResponse = await fetch(
        `http://localhost/TrackEd/src/Pages/Professor/SubjectDetailsDB/get_activities.php?subject_code=${selectedSubject}`
      );
      const activitiesData = await activitiesResponse.json();

      if (attendanceData.success && activitiesData.success) {
        processAnalyticsData(attendanceData, activitiesData);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (attendanceData, activitiesData) => {
    // Process attendance data
    const attendanceSummary = calculateAttendanceSummary(attendanceData.attendance_history);
    
    // Process activities data
    const activitiesSummary = calculateActivitiesSummary(activitiesData.activities);
    
    // Process student performance
    const studentPerformance = calculateStudentPerformance(attendanceData.attendance_history, activitiesData.activities);

    setAnalyticsData({
      attendanceSummary,
      activitiesSummary,
      studentPerformance,
      rawAttendance: attendanceData.attendance_history,
      rawActivities: activitiesData.activities
    });
  };

  const calculateAttendanceSummary = (attendanceHistory) => {
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalStudents = 0;

    attendanceHistory.forEach(day => {
      day.students.forEach(student => {
        totalStudents++;
        if (student.status === 'present') {
          totalPresent++;
        } else {
          totalAbsent++;
        }
      });
    });

    return {
      present: totalPresent,
      absent: totalAbsent,
      total: totalStudents,
      attendanceRate: totalStudents > 0 ? ((totalPresent / totalStudents) * 100).toFixed(1) : 0
    };
  };

  const calculateActivitiesSummary = (activities) => {
    let totalSubmitted = 0;
    let totalMissing = 0;
    let totalActivities = 0;

    activities.forEach(activity => {
      activity.students.forEach(student => {
        totalActivities++;
        if (student.submitted) {
          totalSubmitted++;
        } else {
          totalMissing++;
        }
      });
    });

    return {
      submitted: totalSubmitted,
      missing: totalMissing,
      total: totalActivities,
      submissionRate: totalActivities > 0 ? ((totalSubmitted / totalActivities) * 100).toFixed(1) : 0
    };
  };

  const calculateStudentPerformance = (attendanceHistory, activities) => {
    const studentMap = new Map();

    // Initialize student data
    if (attendanceHistory.length > 0) {
      attendanceHistory[0].students.forEach(student => {
        studentMap.set(student.student_ID, {
          name: student.user_Name,
          id: student.student_ID,
          presentCount: 0,
          absentCount: 0,
          submittedCount: 0,
          missingCount: 0,
          totalActivities: 0
        });
      });
    }

    // Count attendance
    attendanceHistory.forEach(day => {
      day.students.forEach(student => {
        const studentData = studentMap.get(student.student_ID);
        if (studentData) {
          if (student.status === 'present') {
            studentData.presentCount++;
          } else {
            studentData.absentCount++;
          }
        }
      });
    });

    // Count activity submissions
    activities.forEach(activity => {
      activity.students.forEach(student => {
        const studentData = studentMap.get(student.user_ID);
        if (studentData) {
          studentData.totalActivities++;
          if (student.submitted) {
            studentData.submittedCount++;
          } else {
            studentData.missingCount++;
          }
        }
      });
    });

    return Array.from(studentMap.values());
  };

  // Chart data preparation
  const attendanceChartData = analyticsData ? [
    { name: 'Present', value: analyticsData.attendanceSummary.present },
    { name: 'Absent', value: analyticsData.attendanceSummary.absent }
  ] : [];

  const activitiesChartData = analyticsData ? [
    { name: 'Submitted', value: analyticsData.activitiesSummary.submitted },
    { name: 'Missing', value: analyticsData.activitiesSummary.missing }
  ] : [];

  const performanceChartData = analyticsData ? 
    analyticsData.studentPerformance.slice(0, 10).map(student => ({
      name: student.name,
      Attendance: student.totalActivities > 0 ? (student.presentCount / (student.presentCount + student.absentCount) * 100) : 0,
      Submission: student.totalActivities > 0 ? (student.submittedCount / student.totalActivities * 100) : 0
    })) : [];

  const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div>
      <Sidebar role="teacher" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`
        transition-all duration-300
        ${isOpen ? 'lg:ml-[250px] xl:ml-[280px] 2xl:ml-[300px]' : 'ml-0'}
      `}>
        <Header setIsOpen={setIsOpen} isOpen={isOpen}/>

        <div className="p-4 sm:p-5 md:p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center mb-2">
              <img 
                src={Analytics} 
                alt="Analytics" 
                className="h-6 w-6 sm:h-7 sm:w-7 mr-3" 
              />
              <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl text-[#465746]">
                Analytics
              </h1>
            </div>
            <div className="text-sm sm:text-base lg:text-lg text-[#465746]">
              <span>Student Performance</span>
            </div>
          </div>

          <hr className="border-[#465746]/30 mb-4 sm:mb-5" />

          {/* Filter and Search Section */}
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 justify-between items-stretch lg:items-center mb-4 sm:mb-5">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1">
              <div className="relative w-full sm:w-auto sm:min-w-[200px] lg:min-w-[250px]">
                <button
                  onClick={() => { setOpenSubject(!openSubject); setOpenSection(false); }}
                  className="flex w-full items-center justify-between font-bold px-3 py-2 sm:py-2.5 bg-[#fff] rounded-md cursor-pointer shadow-md text-sm sm:text-base text-[#465746]">
                  <span>{selectedSubject || 'Select Subject'}</span>
                  <img 
                    src={ArrowDown} 
                    alt="ArrowDown" 
                    className="h-4 w-4 sm:h-5 sm:w-5 ml-2" 
                  />
                </button>
                {openSubject && (
                  <div className="absolute top-full mt-1 bg-white rounded-md w-full shadow-lg border border-gray-200 z-10">
                    {classes.map((classItem) => (
                      <button 
                        key={classItem.subject_code}
                        className="block px-3 py-2 w-full text-left hover:bg-gray-100 text-sm sm:text-base text-[#465746]" 
                        onClick={() => { 
                          setSelectedSubject(classItem.subject_code);
                          setOpenSubject(false);
                        }}>
                        {classItem.subject_code} - {classItem.subject_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="relative w-full lg:w-64 xl:w-80">
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-9 sm:h-10 lg:h-11 rounded-md px-3 py-2 pr-10 shadow-md outline-none bg-white text-xs sm:text-sm text-[#465746]"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <img src={Search} alt="Search" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              </button>
            </div>
          </div>

          {/* Analytics Charts Section */}
          {loading ? (
            <div className="bg-[#fff] p-6 rounded-lg shadow-md text-center">
              <p className="text-[#465746]">Loading analytics data...</p>
            </div>
          ) : analyticsData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
              {/* Attendance Pie Chart */}
              <div className="bg-[#fff] p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4 text-[#465746]">Attendance Overview</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendanceChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={CustomPieLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {attendanceChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-2">
                  <p className="text-sm text-[#465746]">
                    Overall Attendance Rate: <strong>{analyticsData.attendanceSummary.attendanceRate}%</strong>
                  </p>
                </div>
              </div>

              {/* Activities Pie Chart */}
              <div className="bg-[#fff] p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4 text-[#465746]">Activities Submission</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activitiesChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={CustomPieLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {activitiesChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-2">
                  <p className="text-sm text-[#465746]">
                    Overall Submission Rate: <strong>{analyticsData.activitiesSummary.submissionRate}%</strong>
                  </p>
                </div>
              </div>

              {/* Student Performance Bar Chart */}
              <div className="bg-[#fff] p-4 sm:p-6 rounded-lg shadow-md lg:col-span-2">
                <h3 className="font-bold text-lg mb-4 text-[#465746]">Top Student Performance</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performanceChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Attendance" fill="#00A15D" name="Attendance Rate" />
                      <Bar dataKey="Submission" fill="#2196F3" name="Submission Rate" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#fff] p-6 rounded-lg shadow-md text-center">
              <p className="text-[#465746]">Select a subject to view analytics</p>
            </div>
          )}

          {/* ActivityOverview component */}
          <ActivityOverview
            quizzesList={quizzesList}
            assignmentsList={assignmentsList}
            activitiesList={activitiesList}
            projectsList={projectsList}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />

          {/* Rest of your existing components... */}
          {/* ACTIVITY LIST */}
          <div className="bg-[#fff] p-4 sm:p-5 rounded-lg sm:rounded-xl shadow-md mt-4 sm:mt-5 text-[#465746]">
            <p className="font-bold mb-3 sm:mb-4 text-base sm:text-lg lg:text-xl">
              {displayedLabel}
            </p>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="min-w-full border-collapse text-xs sm:text-sm lg:text-base">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-2 sm:p-3 font-bold">Task</th>
                      <th className="text-left p-2 sm:p-3 font-bold">Title</th>
                      <th className="text-left p-2 sm:p-3 font-bold text-[#00A15D]">Submitted</th>
                      <th className="text-left p-2 sm:p-3 font-bold text-[#FF6666]">Missing</th>
                      <th className="text-left p-2 sm:p-3 font-bold">Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedList.map(item => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-2 sm:p-3 whitespace-nowrap">{item.task}</td>
                        <td className="p-2 sm:p-3">{item.title}</td>
                        <td className="p-2 sm:p-3 text-[#00A15D]">{item.submitted}</td>
                        <td className="p-2 sm:p-3 text-[#FF6666]">{item.missing}</td>
                        <td className="p-2 sm:p-3 whitespace-nowrap">{item.deadline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Student Attendance Tracking */}
          <div className="bg-[#fff] rounded-lg sm:rounded-xl shadow-md mt-4 sm:mt-5 p-4 sm:p-5 text-[#465746]">
            <p className="text-base sm:text-lg lg:text-xl font-bold">
              Student Attendance Tracking
            </p>
            <hr className="border-[#465746]/30 my-3 sm:my-4" />
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="min-w-full border-collapse text-xs sm:text-sm lg:text-base">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-bold">No.</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-bold whitespace-nowrap">Student No.</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-bold whitespace-nowrap">Student Name</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-bold text-[#00A15D]">Present</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-bold text-[#FF6666]">Absent</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-bold text-[#00A15D]">Submitted</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-bold text-[#FF6666]">Missed</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-bold">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData?.studentPerformance.slice(0, 5).map((student, index) => (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-2 sm:px-4 py-2 sm:py-3">{index + 1}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{student.id}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{student.name}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-[#00A15D]">{student.presentCount}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-[#FF6666]">{student.absentCount}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-[#00A15D]">{student.submittedCount}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-[#FF6666]">{student.missingCount}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                          <Link to={"/AnalyticsIndividualInfo"}>
                            <img src={Details} alt="Details" className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:opacity-70" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}