import React from "react";
import Search from "../assets/Search.svg";
import CheckSubmitted from "../assets/CheckTable(Green).svg";
import CheckPending from "../assets/LateTable(Blue).svg";
import Cross from "../assets/CrossTable(Red).svg";
import ArrowLeft from '../assets/ArrowLeft.svg';
import ArrowRight from '../assets/ArrowRight.svg';

export default function ActivityList({
  displayedList,
  selectedFilter,
  currentSubject,
  subjectCode,
  activitySearchTerm,
  setActivitySearchTerm,
  activityCurrentPage,
  setActivityCurrentPage,
  itemsPerPage = 10
}) {
  // Gradient color palette for activity types
  const activityTypeColors = {
    Overall: { text: "text-[#2c5530]" },
    Activities: { text: "text-[#B8860B]" },
    Assignment: { text: "text-[#D2691E]" },
    Quizzes: { text: "text-[#A0522D]" },
    Laboratory: { text: "text-[#8B4513]" },
    Projects: { text: "text-[#5D4037]" }
  };

  // Get current subject name
  const getCurrentSubjectName = () => {
    if (!currentSubject) {
      return `${subjectCode || 'Loading...'}`;
    }
    return `${currentSubject.subject || 'Unknown Subject'} (${currentSubject.section})`;
  };

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
    } else if (selectedFilter === 'Laboratory') {
      return activityTypeColors.Laboratory.text;
    } else {
      return activityTypeColors.Overall.text;
    }
  };

  const displayedLabel = selectedFilter === '' 
    ? 'All Activities' 
    : selectedFilter || 'Quizzes';

  // Filter activities based on search term
  const filteredActivities = React.useMemo(() => {
    if (!activitySearchTerm.trim()) {
      return displayedList;
    }
    
    const searchTermLower = activitySearchTerm.toLowerCase().trim();
    return displayedList.filter(activity => 
      activity.task.toLowerCase().includes(searchTermLower) ||
      activity.title.toLowerCase().includes(searchTermLower) ||
      activity.deadline.toLowerCase().includes(searchTermLower)
    );
  }, [displayedList, activitySearchTerm]);

  // Pagination calculations for activities
  const activityTotalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const activityStartIndex = (activityCurrentPage - 1) * itemsPerPage;
  const activityEndIndex = activityStartIndex + itemsPerPage;
  const currentActivities = filteredActivities.slice(activityStartIndex, activityEndIndex);

  // Reset pagination when filters or search change
  React.useEffect(() => {
    setActivityCurrentPage(1);
  }, [selectedFilter, activitySearchTerm, setActivityCurrentPage]);

  // Pagination handler
  const handleActivityPageChange = (page) => {
    setActivityCurrentPage(page);
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
          {/* Previous Button */}
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

          {/* Page Numbers */}
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

          {/* Next Button */}
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
    <div className="bg-[#fff] p-4 sm:p-5 rounded-lg sm:rounded-xl shadow-md mt-4 sm:mt-5 text-[#465746]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <p className={`font-bold text-base sm:text-lg lg:text-xl ${getDisplayedLabelColor()}`}>
          {displayedLabel} - {getCurrentSubjectName()}
        </p>
        
        {/* Activity List Search */}
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
            {activitySearchTerm ? `No activities found for "${activitySearchTerm}"` : `No ${displayedLabel.toLowerCase()} found for ${getCurrentSubjectName()}.`}
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
                {currentActivities.map(item => {
                  // Determine status for each item
                  const isSubmitted = item.submitted === 1 || item.submitted === true;
                  const isMissing = item.missing === 1 || item.missing === true;
                  const isAssigned = !isSubmitted && !isMissing;
                  
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-2 sm:p-3 whitespace-nowrap">{item.task}</td>
                      <td className="p-2 sm:p-3">{item.title}</td>
                      
                      {/* Submitted Column */}
                      <td className="p-2 sm:p-3 text-[#00A15D]">
                        {isSubmitted ? (
                          <img src={CheckSubmitted} alt="Submitted" className="w-5 h-5 sm:w-6 sm:h-6" />
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      
                      {/* Assigned Column */}
                      <td className="p-2 sm:p-3 text-[#2196F3]">
                        {isAssigned ? (
                          <img src={CheckPending} alt="Assigned" className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      
                      {/* Missed Column */}
                      <td className="p-2 sm:p-3 text-[#FF6666]">
                        {isMissing ? (
                          <img src={Cross} alt="Missed" className="w-4 h-4 sm:w-5 sm:w-5" />
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      
                      <td className="p-2 sm:p-3 whitespace-nowrap">{item.deadline}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity List Pagination */}
      {currentActivities.length > 0 && (
        <Pagination />
      )}
    </div>
  );
}