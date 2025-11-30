import React from "react";
import PieIcon from "../assets/Pie(Light).svg";

export default function StudentActivityOverview({
  quizzesCount,
  assignmentsCount,
  activitiesCount,
  projectsCount,
  laboratoriesCount,
  totalTasksCount,
  selectedFilter,
  setSelectedFilter,
  animationProgress,
  segments,
  statusTotal
}) {
  // Gradient color palette for activity types
  const activityTypeColors = {
    Overall: { 
      text: "text-[#2c5530]", 
      border: "border-l-[#2c5530]",
      hover: "hover:bg-[#2c5530]/10 hover:border-l-[#2c5530]"
    },
    Activities: { 
      text: "text-[#B8860B]", 
      border: "border-l-[#B8860B]",
      hover: "hover:bg-[#B8860B]/10 hover:border-l-[#B8860B]"
    },
    Assignment: { 
      text: "text-[#D2691E]", 
      border: "border-l-[#D2691E]",
      hover: "hover:bg-[#D2691E]/10 hover:border-l-[#D2691E]"
    },
    Quizzes: { 
      text: "text-[#A0522D]", 
      border: "border-l-[#A0522D]",
      hover: "hover:bg-[#A0522D]/10 hover:border-l-[#A0522D]"
    },
    Laboratory: {
      text: "text-[#8B4513]", 
      border: "border-l-[#8B4513]",
      hover: "hover:bg-[#8B4513]/10 hover:border-l-[#8B4513]"
    },
    Projects: { 
      text: "text-[#5D4037]", 
      border: "border-l-[#5D4037]",
      hover: "hover:bg-[#5D4037]/10 hover:border-l-[#5D4037]"
    }
  };

  const toggleFilter = (label) => {
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

  // For SVG pie
  const radius = 14;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="bg-[#fff] rounded-lg sm:rounded-xl shadow-md mt-4 sm:mt-5 p-4 sm:p-5 text-[#465746]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
        <div className="flex items-center">
          <img src={PieIcon} alt="Pie" className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 mr-2 sm:mr-3" />
          <p className="text-base sm:text-lg lg:text-xl font-bold">Activity Overview</p>
        </div>
      </div>

      <hr className="border-[#465746]/30 mt-3 sm:mt-4 lg:mt-5" />

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 mt-4 sm:mt-5">
        {/* Created Task List */}
        <div className="bg-[#D4D4D4] p-4 sm:p-5 rounded-md text-sm sm:text-base lg:text-lg w-full lg:w-80 flex-shrink-0 order-2 lg:order-1">
          <p className="font-bold mb-3 text-[#2c5530]">Created Task</p>

          {/* Overall */}
          <div
            onClick={() => toggleFilter("Overall")}
            className={getTaskItemStyles("Overall").container}
          >
            <span className={getTaskItemStyles("Overall").text}>Overall:</span>
            <span className={getTaskItemStyles("Overall").count}>{totalTasksCount}</span>
          </div>

          {/* Activities */}
          <div
            onClick={() => toggleFilter("Activities")}
            className={getTaskItemStyles("Activities").container}
          >
            <span className={getTaskItemStyles("Activities").text}>Activities:</span>
            <span className={getTaskItemStyles("Activities").count}>{activitiesCount}</span>
          </div>

          {/* Assignment */}
          <div
            onClick={() => toggleFilter("Assignment")}
            className={getTaskItemStyles("Assignment").container}
          >
            <span className={getTaskItemStyles("Assignment").text}>Assignments:</span>
            <span className={getTaskItemStyles("Assignment").count}>{assignmentsCount}</span>
          </div>

          {/* Quizzes */}
          <div
            onClick={() => toggleFilter("Quizzes")}
            className={getTaskItemStyles("Quizzes").container}
          >
            <span className={getTaskItemStyles("Quizzes").text}>Quizzes:</span>
            <span className={getTaskItemStyles("Quizzes").count}>{quizzesCount}</span>
          </div>

          {/* Laboratories */}
          <div
            onClick={() => toggleFilter("Laboratory")}
            className={getTaskItemStyles("Laboratory").container}
          >
            <span className={getTaskItemStyles("Laboratory").text}>Laboratories:</span>
            <span className={getTaskItemStyles("Laboratory").count}>{laboratoriesCount}</span>
          </div>

          {/* Projects */}
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

        {/* PIE CHART */}
        <div className="bg-[#D4D4D4] rounded-md text-sm sm:text-base lg:text-lg flex-1 p-4 sm:p-5 order-1 lg:order-2">
          <div className="flex flex-col items-center">
            {/* Chart Container */}
            <div className="w-full max-w-md flex justify-center">
              <svg
                className="w-full h-auto max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]"
                viewBox="0 0 32 32"
              >
                {/* base ring */}
                <circle r={radius} cx="16" cy="16" fill="transparent" stroke="#E5E7EB" strokeWidth="2.5" />

                {statusTotal === 0 ? (
                  // No-data fallback: just show base ring
                  null
                ) : (
                  (() => {
                    let cum = 0;
                    return segments.map((seg, i) => {
                      if (!seg || seg.value === 0) return null;
                      const len = (seg.value / statusTotal) * circumference;
                      const animatedLen = len * animationProgress;
                      const dash = `${animatedLen} ${Math.max(0, circumference - animatedLen)}`;
                      const dashOffset = -cum * animationProgress;
                      cum += len;
                      return (
                        <circle
                          key={i}
                          r={radius}
                          cx="16"
                          cy="16"
                          fill="transparent"
                          stroke={seg.color}
                          strokeWidth="2.5"
                          strokeDasharray={dash}
                          strokeDashoffset={dashOffset}
                          strokeLinecap="butt"
                          transform="rotate(-90 16 16)"
                          style={{
                            transition: 'stroke-dasharray 0.2s ease-out, stroke-dashoffset 0.2s ease-out'
                          }}
                        />
                      );
                    });
                  })()
                )}

                {/* center labels */}
                <text
                  x="16"
                  y="15"
                  textAnchor="middle"
                  fontSize=".125rem"
                  fontWeight="bold"
                  fill="#465746"
                >
                  {selectedFilter ? selectedFilter.toUpperCase() : "OVERALL:"}
                </text>

                <text
                  x="16"
                  y="18"
                  textAnchor="middle"
                  fontSize=".125rem"
                  fill="#465746"
                >
                  {statusTotal === 0 ? "No activities found" : "Overview"}
                </text>
              </svg>
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
    </div>
  );
}