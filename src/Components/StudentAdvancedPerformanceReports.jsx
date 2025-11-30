import React from "react";

import ArrowDown from "../assets/ArrowDown(Light).svg";
import PieIcon from "../assets/Pie(Light).svg";
import TrendingUp from "../assets/TrendingUp.svg";
import TrendingDown from "../assets/TrendingDown.svg";
import AlertTriangleGreen from "../assets/Warning(Green).svg";
import AlertTriangleYellow from "../assets/Warning(Yellow).svg";
import AlertTriangleRed from "../assets/Warning(Red).svg";

export default function StudentAdvancedPerformanceReports({
  calculateAdvancedAnalytics,
  animationProgress,
  attendanceRate,
  attendanceLoading,
  currentSubject,
  submissionRateData,
  expandedInsights,
  setExpandedInsights,
  displayedInsights,
}) {
  // Risk level color coding
  const getRiskColor = (level) => {
    switch (level) {
      case "HIGH":
        return "text-red-800 bg-red-50 border-red-200";
      case "MEDIUM":
        return "text-yellow-800 bg-yellow-50 border-yellow-200";
      case "LOW":
        return "text-green-800 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Get appropriate AlertTriangle icon based on risk level
  const getRiskIcon = (level) => {
    switch (level) {
      case "HIGH":
        return AlertTriangleRed;
      case "MEDIUM":
        return AlertTriangleYellow;
      case "LOW":
        return AlertTriangleGreen;
      default:
        return AlertTriangleYellow;
    }
  };

  // Trend indicator
  const TrendIndicator = ({ trend }) => {
    if (trend === "improving") {
      return (
        <div className="flex items-center text-yellow-600">
          <img src={TrendingUp} alt="Improving" className="w-4 h-4 mr-1" />
          <span className="text-sm">Improving</span>
        </div>
      );
    } else if (trend === "declining") {
      return (
        <div className="flex items-center text-red-600">
          <img src={TrendingDown} alt="Declining" className="w-4 h-4 mr-1" />
          <span className="text-sm">Declining</span>
        </div>
      );
    }
    return (
      <div className="flex items-center text-green-600">
        <span className="text-sm">Stable</span>
      </div>
    );
  };

  // Activity type colors for performance cards
  const getTypeColor = (activityType) => {
    switch (activityType.toLowerCase()) {
      case "activities":
        return {
          bg: "bg-[#B8860B]/10",
          border: "border-[#B8860B]/30",
          text: "text-[#B8860B]",
          progress: "bg-[#B8860B]",
        };
      case "assignments":
        return {
          bg: "bg-[#D2691E]/10",
          border: "border-[#D2691E]/30",
          text: "text-[#D2691E]",
          progress: "bg-[#D2691E]",
        };
      case "quizzes":
        return {
          bg: "bg-[#A0522D]/10",
          border: "border-[#A0522D]/30",
          text: "text-[#A0522D]",
          progress: "bg-[#A0522D]",
        };
      case "laboratories":
        return {
          bg: "bg-[#8B4513]/10",
          border: "border-[#8B4513]/30",
          text: "text-[#8B4513]",
          progress: "bg-[#8B4513]",
        };
      case "projects":
        return {
          bg: "bg-[#5D4037]/10",
          border: "border-[#5D4037]/30",
          text: "text-[#5D4037]",
          progress: "bg-[#5D4037]",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          progress: "bg-gray-600",
        };
    }
  };

  return (
    <div className="bg-[#fff] rounded-lg sm:rounded-xl shadow-md mt-4 sm:mt-5 p-4 sm:p-5 text-[#465746]">
      <div className="flex items-center mb-4">
        <img src={PieIcon} alt="Analytics" className="-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 mr-2 sm:mr-3" />
        <h2 className="text-lg font-bold">Advanced Performance Reports</h2>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Risk Level */}
        <div
          className={`p-4 rounded-lg border transition-all duration-500 ${getRiskColor(
            calculateAdvancedAnalytics.riskLevel
          )}`}
          style={{
            opacity: animationProgress,
            transform: `translateX(${-20 * (1 - animationProgress)}px)`,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Risk Level</p>
              <p className="text-xl font-bold">
                {calculateAdvancedAnalytics.riskLevel}
              </p>
            </div>
            <div
              className={`w-10 h-10 rounded-md border-2 flex items-center justify-center ${
                calculateAdvancedAnalytics.riskLevel === "HIGH"
                  ? "border-red-300"
                  : calculateAdvancedAnalytics.riskLevel === "MEDIUM"
                  ? "border-yellow-300"
                  : "border-green-300"
              }`}
            >
              <img
                src={getRiskIcon(calculateAdvancedAnalytics.riskLevel)}
                alt="Risk Level"
                className="w-6 h-6"
              />
            </div>
          </div>
          <p className="text-xs mt-1 opacity-75">
            {calculateAdvancedAnalytics.missedActivities} missed activities
          </p>
        </div>

        {/* Performance Score */}
        <div
          className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 transition-all duration-500"
          style={{
            opacity: animationProgress,
            transform: `translateY(${-20 * (1 - animationProgress)}px)`,
            transitionDelay: "100ms",
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-green-800 font-medium">
                Performance Score
              </p>
              <p className="text-2xl font-bold text-green-900">
                {calculateAdvancedAnalytics.performanceScore}/100
              </p>
            </div>
            <TrendIndicator trend={calculateAdvancedAnalytics.trend} />
          </div>
          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${
                  calculateAdvancedAnalytics.performanceScore *
                  animationProgress
                }%`,
                transitionDelay: "200ms",
              }}
            ></div>
          </div>
        </div>

        {/* Attendance Rate */}
        <div
          className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 transition-all duration-500"
          style={{
            opacity: animationProgress,
            transform: `translateY(${20 * (1 - animationProgress)}px)`,
            transitionDelay: "200ms",
          }}
        >
          <p className="text-sm text-blue-800 font-medium">Attendance Rate</p>
          <p className="text-2xl font-bold text-blue-900">
            {attendanceLoading ? "..." : `${attendanceRate}%`}
          </p>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${attendanceRate * animationProgress}%`,
                transitionDelay: "300ms",
              }}
            ></div>
          </div>
          <p className="text-xs mt-1 opacity-75">
            {currentSubject ? `${currentSubject.subject}` : "Current subject"}
          </p>
        </div>

        {/* Submission Rate */}
        <div
          className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 transition-all duration-500"
          style={{
            opacity: animationProgress,
            transform: `translateX(${20 * (1 - animationProgress)}px)`,
            transitionDelay: "300ms",
          }}
        >
          <p className="text-sm text-purple-800 font-medium">Submission Rate</p>
          <p className="text-2xl font-bold text-purple-900">
            {submissionRateData.submissionRate}%
          </p>
          <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${
                  submissionRateData.submissionRate * animationProgress
                }%`,
                transitionDelay: "400ms",
              }}
            ></div>
          </div>
          <p className="text-xs mt-1 opacity-75">
            {submissionRateData.displayText} activities
          </p>
        </div>
      </div>

      {/* Performance by Activity Type */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3">
          Performance by Activity Type
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Object.entries(calculateAdvancedAnalytics.typePerformance).map(
            ([type, data], index) => {
              const colors = getTypeColor(type);
              const animationDelay = index * 100;

              return (
                <div
                  key={type}
                  className={`p-3 rounded-lg border ${colors.bg} ${colors.border} transition-all duration-500`}
                  style={{
                    opacity: animationProgress,
                    transform: `translateY(${10 * (1 - animationProgress)}px)`,
                    transition: `opacity 0.5s ease-out ${animationDelay}ms, transform 0.5s ease-out ${animationDelay}ms`,
                  }}
                >
                  <p
                    className={`text-sm font-medium capitalize ${colors.text}`}
                  >
                    {type}
                  </p>
                  <p className={`text-lg font-bold ${colors.text}`}>
                    {data.score}%
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className={`h-1.5 rounded-full ${colors.progress} transition-all duration-800 ease-out`}
                      style={{
                        width: `${data.score * animationProgress}%`,
                        transition: `width 0.8s ease-out ${
                          animationDelay + 200
                        }ms`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Performance Insights with Collapsible Feature */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md font-semibold">Performance Insights</h3>
          {calculateAdvancedAnalytics.insights.length > 2 && (
            <button
              onClick={() => setExpandedInsights(!expandedInsights)}
              className="text-sm text-[#00874E] hover:text-[#006c3d] font-medium flex items-center gap-1"
            >
              {expandedInsights
                ? "Show Less"
                : `Show All (${calculateAdvancedAnalytics.insights.length})`}
              <img
                src={ArrowDown}
                alt={expandedInsights ? "Show Less" : "Show More"}
                className={`w-4 h-4 transition-transform ${
                  expandedInsights ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>

        <div className="space-y-3">
          {displayedInsights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                insight.type === "critical"
                  ? "bg-red-50 border-red-200"
                  : insight.type === "warning"
                  ? "bg-yellow-50 border-yellow-200"
                  : insight.type === "positive"
                  ? "bg-green-50 border-green-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-start">
                {insight.type === "critical" && (
                  <img
                    src={AlertTriangleRed}
                    alt="Critical"
                    className="w-5 h-5 mr-3 mt-0.5 text-red-600 flex-shrink-0"
                  />
                )}
                {insight.type === "warning" && (
                  <img
                    src={AlertTriangleYellow}
                    alt="Warning"
                    className="w-5 h-5 mr-3 mt-0.5 text-yellow-600 flex-shrink-0"
                  />
                )}
                {insight.type === "positive" && (
                  <img
                    src={AlertTriangleGreen}
                    alt="Positive"
                    className="w-5 h-5 mr-3 mt-0.5 text-green-600 flex-shrink-0"
                  />
                )}
                {insight.type === "info" && (
                  <div className="w-5 h-5 mr-3 mt-0.5 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                )}
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      insight.type === "critical"
                        ? "text-red-800"
                        : insight.type === "warning"
                        ? "text-yellow-800"
                        : insight.type === "positive"
                        ? "text-green-800"
                        : "text-blue-800"
                    }`}
                  >
                    {insight.message}
                  </p>
                  <p className="text-sm mt-1 opacity-90">
                    {insight.suggestion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
