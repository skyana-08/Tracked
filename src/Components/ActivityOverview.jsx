import React, { useMemo, useState, useEffect } from "react";
import ArrowDown from "../assets/ArrowDown(Light).svg";
import PieIcon from "../assets/Pie(Light).svg";
import Search from "../assets/Search.svg";
import CheckSubmitted from "../assets/CheckTable(Green).svg";
import CheckLate from "../assets/PendingTable(Yellow).svg";
import CheckPending from "../assets/LateTable(Blue).svg";
import Cross from "../assets/CrossTable(Red).svg";
import ArrowLeft from '../assets/ArrowLeft.svg';
import ArrowRight from '../assets/ArrowRight.svg';

export default function ActivityOverview({
  quizzesList = [],
  assignmentsList = [],
  activitiesList = [],
  projectsList = [],
  selectedFilter,
  setSelectedFilter,
  selectedSubject = "",
  selectedSection = "",
  getCurrentSubjectName = () => ""
}) {
  // Debug: Check data structure
  useEffect(() => {
    console.log('📊 ActivityOverview Data:', {
      quizzes: quizzesList.length,
      assignments: assignmentsList.length,
      activities: activitiesList.length,
      projects: projectsList.length,
      quizzesSample: quizzesList[0],
      assignmentsSample: assignmentsList[0],
      filter: selectedFilter
    });
  }, [quizzesList, assignmentsList, activitiesList, projectsList, selectedFilter]);

  // counts used for the left "Created Task" panel (number of tasks)
  const quizzesCount = quizzesList.length;
  const assignmentsCount = assignmentsList.length;
  const activitiesCount = activitiesList.length;
  const projectsCount = projectsList.length;
  const totalTasksCount = quizzesCount + assignmentsCount + activitiesCount + projectsCount;

  const [animationProgress, setAnimationProgress] = useState(0);

  // Activity List States
  const [activityCurrentPage, setActivityCurrentPage] = useState(1);
  const [activitySearchTerm, setActivitySearchTerm] = useState("");
  const itemsPerPage = 10;

  // Gradient color palette for activity types
  const activityTypeColors = {
    Overall: { 
      text: "text-[#2c5530]", 
      border: "border-l-[#2c5530]",
      hover: "hover:bg-[#2c5530]/10 hover:border-l-[#2c5530]"
    },
    Quizzes: { 
      text: "text-[#8B4513]", 
      border: "border-l-[#8B4513]",
      hover: "hover:bg-[#8B4513]/10 hover:border-l-[#8B4513]"
    },
    Assignment: { 
      text: "text-[#A0522D]", 
      border: "border-l-[#A0522D]",
      hover: "hover:bg-[#A0522D]/10 hover:border-l-[#A0522D]"
    },
    Activities: { 
      text: "text-[#B8860B]", 
      border: "border-l-[#B8860B]",
      hover: "hover:bg-[#B8860B]/10 hover:border-l-[#B8860B]"
    },
    Projects: { 
      text: "text-[#D2691E]", 
      border: "border-l-[#D2691E]",
      hover: "hover:bg-[#D2691E]/10 hover:border-l-[#D2691E]"
    }
  };

  // FIXED: Simple and reliable utility function to count statuses
  const sumStatusCounts = (list) => {
    if (!Array.isArray(list) || list.length === 0) {
      return { submitted: 0, assigned: 0, missed: 0 };
    }

    let submitted = 0;
    let assigned = 0;
    let missed = 0;
    
    list.forEach(item => {
      // Convert to numbers with safe defaults
      const itemSubmitted = Number(item.submitted) || 0;
      const itemPending = Number(item.pending) || 0;
      const itemMissing = Number(item.missing) || 0;
      
      submitted += itemSubmitted;
      assigned += itemPending;
      missed += itemMissing;
    });
    
    console.log('🔢 sumStatusCounts result:', { submitted, assigned, missed });
    return { submitted, assigned, missed };
  };

  // FIXED: Compute status counts based on selected filter
  const statusCounts = useMemo(() => {
    console.log('📈 Calculating statusCounts for filter:', selectedFilter);
    
    let result;
    
    switch(selectedFilter) {
      case "Quizzes":
        result = sumStatusCounts(quizzesList);
        break;
      case "Assignment":
        result = sumStatusCounts(assignmentsList);
        break;
      case "Activities":
        result = sumStatusCounts(activitiesList);
        break;
      case "Projects":
        result = sumStatusCounts(projectsList);
        break;
      case "":
      default:
        // Combine all lists
        const allActivities = [
          ...quizzesList,
          ...assignmentsList,
          ...activitiesList,
          ...projectsList
        ];
        result = sumStatusCounts(allActivities);
        break;
    }
    
    console.log('📊 Final statusCounts:', result);
    return result;
  }, [selectedFilter, quizzesList, assignmentsList, activitiesList, projectsList]);

  // Combine activities based on filter
  const displayedList = useMemo(() => {
    console.log('📋 Creating displayedList for filter:', selectedFilter);
    
    switch(selectedFilter) {
      case 'Assignment':
        return assignmentsList;
      case 'Activities':
        return activitiesList;
      case 'Projects':
        return projectsList;
      case '':
        // Overall - all activities
        return [
          ...quizzesList,
          ...assignmentsList,
          ...activitiesList,
          ...projectsList
        ];
      default:
        return quizzesList;
    }
  }, [selectedFilter, quizzesList, assignmentsList, activitiesList, projectsList]);

  // Filter activities based on search term
  const filteredActivities = useMemo(() => {
    if (!activitySearchTerm.trim()) {
      return displayedList;
    }
    
    const searchTermLower = activitySearchTerm.toLowerCase().trim();
    return displayedList.filter(activity => 
      activity.task?.toLowerCase().includes(searchTermLower) ||
      activity.title?.toLowerCase().includes(searchTermLower) ||
      activity.deadline?.toLowerCase().includes(searchTermLower)
    );
  }, [displayedList, activitySearchTerm]);

  const displayedLabel = selectedFilter === '' 
    ? 'All Activities' 
    : selectedFilter || 'Quizzes';

  // Get the text color for the current displayed label
  const getDisplayedLabelColor = () => {
    if (selectedFilter === '') {
      return activityTypeColors.Overall.text;
    } else if (selectedFilter === 'Quizzes') {
      return activityTypeColors.Quizzes.text;
    } else if (selectedFilter === 'Assignment') {
      return activityTypeColors.Assignment.text;
    } else if (selectedFilter === 'Activities') {
      return activityTypeColors.Activities.text;
    } else if (selectedFilter === 'Projects') {
      return activityTypeColors.Projects.text;
    } else {
      return activityTypeColors.Overall.text;
    }
  };

  // Pagination calculations
  const activityTotalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const activityStartIndex = (activityCurrentPage - 1) * itemsPerPage;
  const activityEndIndex = activityStartIndex + itemsPerPage;
  const currentActivities = filteredActivities.slice(activityStartIndex, activityEndIndex);

  // Reset pagination when filters or search change
  useEffect(() => {
    setActivityCurrentPage(1);
  }, [selectedFilter, activitySearchTerm]);

  // Pagination handler
  const handleActivityPageChange = (page) => {
    setActivityCurrentPage(page);
  };

  // Get current subject name
  const getCurrentSubjectDisplayName = () => {
    const subjectName = getCurrentSubjectName();
    if (subjectName && selectedSection) {
      return `${subjectName} (Section ${selectedSection})`;
    } else if (subjectName) {
      return subjectName;
    } else if (selectedSubject && selectedSection) {
      return `${selectedSubject} (Section ${selectedSection})`;
    } else if (selectedSubject) {
      return selectedSubject;
    }
    return "All Activities";
  };

  // FIXED: Segments for pie chart with guaranteed numbers
  const segments = useMemo(() => {
    const segmentsData = [
      { 
        label: "Submitted", 
        value: Math.max(0, statusCounts.submitted || 0), 
        color: "#00A15D" 
      },
      { 
        label: "Assigned", 
        value: Math.max(0, statusCounts.assigned || 0), 
        color: "#2196F3" 
      },
      { 
        label: "Missed", 
        value: Math.max(0, statusCounts.missed || 0), 
        color: "#EF4444" 
      },
    ];
    
    console.log('📊 Pie chart segments:', segmentsData);
    return segmentsData;
  }, [statusCounts]);

  // SVG pie chart constants
  const radius = 14;
  const circumference = 2 * Math.PI * radius;

  // Calculate total for segments
  const statusTotal = useMemo(() => {
    const total = segments.reduce((acc, segment) => acc + segment.value, 0);
    console.log('📊 Total for pie chart:', total);
    return total;
  }, [segments]);

  // Animation effect
  useEffect(() => {
    setAnimationProgress(0);
    const duration = 300;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setAnimationProgress(Math.min(1, currentStep / steps));
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [selectedFilter, statusCounts]);

  const toggleFilter = (label) => {
    console.log('🔘 Toggling filter to:', label);
    if (label === "Overall") {
      setSelectedFilter("");
      return;
    }
    setSelectedFilter((prev) => (prev === label ? "" : label));
  };

  // Helper function to get styles for each task item
  const getTaskItemStyles = (label) => {
    const colors = activityTypeColors[label];
    const isSelected = (label === "Overall" && selectedFilter === "") || selectedFilter === label;
    
    if (isSelected) {
      return {
        container: `flex justify-between cursor-pointer p-2 rounded-md transition-all duration-200 border-l-4 ${colors.border} bg-white shadow-sm`,
        text: `${colors.text} font-bold`,
        count: `${colors.text} font-extrabold`
      };
    }
    
    return {
      container: `flex justify-between cursor-pointer p-2 rounded-md transition-all duration-200 border-l-2 border-transparent ${colors.hover}`,
      text: `${colors.text} font-medium`,
      count: `${colors.text} font-semibold`
    };
  };

  // Render the pie chart
  const renderPieChart = () => {
    console.log('🎨 Rendering pie chart with:', {
      statusTotal,
      segments,
      animationProgress
    });

    if (statusTotal === 0) {
      return (
        <svg
          className="w-full h-auto max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]"
          viewBox="0 0 32 32"
        >
          {/* Gray background circle */}
          <circle r={radius} cx="16" cy="16" fill="transparent" stroke="#E5E7EB" strokeWidth="2.5" />
          
          {/* "No Data" text */}
          <text
            x="16"
            y="16"
            textAnchor="middle"
            fontSize=".125rem"
            fill="#666"
            dominantBaseline="middle"
          >
            No Data
          </text>
        </svg>
      );
    }

    let cumulativeAngle = 0;
    
    return (
      <svg
        className="w-full h-auto max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]"
        viewBox="0 0 32 32"
      >
        {/* Gray background circle */}
        <circle r={radius} cx="16" cy="16" fill="transparent" stroke="#E5E7EB" strokeWidth="2.5" />
        
        {/* Pie segments */}
        {segments.map((segment, index) => {
          if (segment.value === 0) return null;
          
          const segmentAngle = (segment.value / statusTotal) * 360;
          const animatedAngle = segmentAngle * animationProgress;
          const startAngle = cumulativeAngle;
          cumulativeAngle += segmentAngle;
          
          // Convert angles to radians for SVG arc
          const startRad = (startAngle - 90) * (Math.PI / 180);
          const endRad = ((startAngle + animatedAngle) - 90) * (Math.PI / 180);
          
          const x1 = 16 + radius * Math.cos(startRad);
          const y1 = 16 + radius * Math.sin(startRad);
          const x2 = 16 + radius * Math.cos(endRad);
          const y2 = 16 + radius * Math.sin(endRad);
          
          const largeArcFlag = animatedAngle > 180 ? 1 : 0;
          
          return (
            <path
              key={index}
              d={`M 16 16 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
              fill={segment.color}
              stroke="white"
              strokeWidth="0.5"
              opacity="0.8"
            />
          );
        })}
        
        {/* Center text */}
        <text
          x="16"
          y="15"
          textAnchor="middle"
          fontSize=".125rem"
          fontWeight="bold"
          fill="#465746"
          dominantBaseline="middle"
        >
          {selectedFilter || "OVERALL"}
        </text>
        
        <text
          x="16"
          y="17"
          textAnchor="middle"
          fontSize=".1rem"
          fill="#465746"
          dominantBaseline="middle"
        >
          {statusTotal} total
        </text>
      </svg>
    );
  };

  // Pagination Component
  const Pagination = () => {
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, activityCurrentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(activityTotalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (activityTotalPages <= 1) return null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-2">
        <div className="text-xs sm:text-sm text-gray-600">
          Showing {((activityCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(activityCurrentPage * itemsPerPage, filteredActivities.length)} of {filteredActivities.length} entries
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleActivityPageChange(activityCurrentPage - 1)}
            disabled={activityCurrentPage === 1}
            className={`flex items-center justify-center w-8 h-8 rounded-md border ${
              activityCurrentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300' 
                : 'bg-white text-[#465746] border-gray-300 hover:bg-gray-50 cursor-pointer'
            }`}
          >
            <img src={ArrowLeft} alt="Previous" className="w-5 h-5" />
          </button>

          {pageNumbers.map(page => (
            <button
              key={page}
              onClick={() => handleActivityPageChange(page)}
              className={`cursor-pointer flex items-center justify-center w-8 h-8 rounded-md border text-sm font-medium ${
                activityCurrentPage === page
                  ? 'bg-[#465746] text-white border-[#465746]'
                  : 'bg-white text-[#465746] border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handleActivityPageChange(activityCurrentPage + 1)}
            disabled={activityCurrentPage === activityTotalPages}
            className={`flex items-center justify-center w-8 h-8 rounded-md border ${
              activityCurrentPage === activityTotalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                : 'bg-white text-[#465746] border-gray-300 hover:bg-gray-50 cursor-pointer'
            }`}
          >
            <img src={ArrowRight} alt="Next" className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Activity Overview Section */}
      <div className="bg-[#fff] rounded-lg sm:rounded-xl shadow-md mt-4 sm:mt-5 p-4 sm:p-5 text-[#465746]">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
          <div className="flex items-center">
            <img src={PieIcon} alt="Pie" className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 mr-2 sm:mr-3" />
            <p className="text-base sm:text-lg lg:text-xl font-bold">Activity Overview</p>
          </div>
        </div>

        <hr className="border-[#465746]/30 mt-3 sm:mt-4 lg:mt-5" />

        {/* Debug information - REMOVE IN PRODUCTION */}
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
          <p className="font-bold text-blue-800">Debug Info:</p>
          <p>Selected Filter: <strong>{selectedFilter || "Overall"}</strong></p>
          <p>Status Counts: 
            Submitted=<strong>{statusCounts.submitted}</strong>, 
            Assigned=<strong>{statusCounts.assigned}</strong>, 
            Missed=<strong>{statusCounts.missed}</strong>
          </p>
          <p>Pie Chart Total: <strong>{statusTotal}</strong></p>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 mt-4 sm:mt-5">
          {/* Created Task List */}
          <div className="bg-[#D4D4D4] p-4 sm:p-5 rounded-md text-sm sm:text-base lg:text-lg w-full lg:w-80 flex-shrink-0 order-2 lg:order-1">
            <p className="font-bold mb-3 text-[#2c5530]">Created Task</p>

            <div
              onClick={() => toggleFilter("Overall")}
              className={getTaskItemStyles("Overall").container}
            >
              <span className={getTaskItemStyles("Overall").text}>Overall:</span>
              <span className={getTaskItemStyles("Overall").count}>{totalTasksCount}</span>
            </div>

            <div
              onClick={() => toggleFilter("Quizzes")}
              className={getTaskItemStyles("Quizzes").container}
            >
              <span className={getTaskItemStyles("Quizzes").text}>Quizzes:</span>
              <span className={getTaskItemStyles("Quizzes").count}>{quizzesCount}</span>
            </div>

            <div
              onClick={() => toggleFilter("Assignment")}
              className={getTaskItemStyles("Assignment").container}
            >
              <span className={getTaskItemStyles("Assignment").text}>Assignment:</span>
              <span className={getTaskItemStyles("Assignment").count}>{assignmentsCount}</span>
            </div>

            <div
              onClick={() => toggleFilter("Activities")}
              className={getTaskItemStyles("Activities").container}
            >
              <span className={getTaskItemStyles("Activities").text}>Activities:</span>
              <span className={getTaskItemStyles("Activities").count}>{activitiesCount}</span>
            </div>

            <div
              onClick={() => toggleFilter("Projects")}
              className={getTaskItemStyles("Projects").container}
            >
              <span className={getTaskItemStyles("Projects").text}>Projects:</span>
              <span className={getTaskItemStyles("Projects").count}>{projectsCount}</span>
            </div>

            <hr className="my-3 border-[#465746] opacity-50" />

            <div className="flex justify-between font-bold text-[#2c5530]">
              <span>Total Created Task:</span>
              <span>{totalTasksCount}</span>
            </div>
          </div>

          {/* PIE CHART SECTION - Fixed */}
          <div className="bg-[#D4D4D4] rounded-md text-sm sm:text-base lg:text-lg flex-1 p-4 sm:p-5 order-1 lg:order-2">
            <div className="flex flex-col items-center">
              {/* Chart Container */}
              <div className="w-full max-w-md flex justify-center mb-6">
                {renderPieChart()}
              </div>

              {/* LEGEND */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-5 w-full">
                {segments.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base">
                    <span
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full inline-block flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.label}:</span>
                    <span className="font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fallback message when no data */}
        {statusTotal === 0 && (
          <div className="text-center py-4 mt-4">
            <p className="text-gray-500 text-sm">
              No activity data available for {selectedFilter === '' ? 'Overall' : selectedFilter}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Create activities in Classwork to see data here
            </p>
          </div>
        )}
      </div>

      {/* ACTIVITY LIST */}
      <div className="bg-[#fff] p-4 sm:p-5 rounded-lg sm:rounded-xl shadow-md mt-4 sm:mt-5 text-[#465746]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <p className={`font-bold text-base sm:text-lg lg:text-xl ${getDisplayedLabelColor()}`}>
            {displayedLabel} - {getCurrentSubjectDisplayName()}
          </p>
          
          <div className="relative w-full sm:w-64 lg:w-80">
            <input
              type="text"
              placeholder="Search activities..."
              value={activitySearchTerm}
              onChange={(e) => setActivitySearchTerm(e.target.value)}
              className="w-full h-9 sm:h-10 rounded-md px-3 py-2 pr-10 shadow-md outline-none bg-white text-xs sm:text-sm text-[#465746] border border-gray-300 focus:border-[#465746]"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <img src={Search} alt="Search" className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {currentActivities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#465746]">
              {activitySearchTerm ? `No activities found for "${activitySearchTerm}"` : `No ${displayedLabel.toLowerCase()} found for ${getCurrentSubjectDisplayName()}.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <table className="min-w-full border-collapse text-xs sm:text-sm lg:text-base">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-2 sm:p-3 font-bold">Task</th>
                    <th className="text-left p-2 sm:p-3 font-bold">Title</th>
                    <th className="text-left p-2 sm:p-3 font-bold text-[#00A15D]">Submitted</th>
                    <th className="text-left p-2 sm:p-3 font-bold text-[#2196F3]">Assigned</th>
                    <th className="text-left p-2 sm:p-3 font-bold text-[#FF6666]">Missed</th>
                    <th className="text-left p-2 sm:p-3 font-bold">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {currentActivities.map((item, index) => (
                    <tr key={item.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-2 sm:p-3 whitespace-nowrap">{item.task}</td>
                      <td className="p-2 sm:p-3">{item.title}</td>
                      <td className="p-2 sm:p-3 text-[#00A15D] font-medium">{item.submitted || 0}</td>
                      <td className="p-2 sm:p-3 text-[#2196F3] font-medium">{item.pending || 0}</td>
                      <td className="p-2 sm:p-3 text-[#FF6666] font-medium">{item.missing || 0}</td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">{item.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentActivities.length > 0 && <Pagination />}
      </div>
    </div>
  );
}