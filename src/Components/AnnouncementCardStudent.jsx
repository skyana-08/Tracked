import React, { useState, useEffect } from "react";

import ArrowDown from "../assets/ArrowDown(Light).svg";

export default function AnnouncementCardStudent({
  subject,
  title,
  postedBy,
  datePosted,
  deadline,
  instructions,
  link = "#",
  isRead = false,
  onMarkAsRead,
  onMarkAsUnread
}) {
  const [open, setOpen] = useState(false);
  const [readStatus, setReadStatus] = useState(isRead);
  const [showFullInstructions, setShowFullInstructions] = useState(false);
  const [relativeTime, setRelativeTime] = useState("");

  // Function to calculate relative time
  const getRelativeTime = (dateString) => {
    if (!dateString || dateString === "No deadline" || dateString === "N/A") return "N/A";
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) {
        return `${diffInSeconds}s ago`;
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}m ago`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h ago`;
      } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}d ago`;
      } else if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000);
        return `${months}mo ago`;
      } else {
        const years = Math.floor(diffInSeconds / 31536000);
        return `${years}y ago`;
      }
    } catch {
      return dateString;
    }
  };

  // Update relative time periodically
  useEffect(() => {
    if (datePosted) {
      setRelativeTime(getRelativeTime(datePosted));
      
      // Update every minute for recent posts
      const interval = setInterval(() => {
        setRelativeTime(getRelativeTime(datePosted));
      }, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [datePosted]);

  // Format deadline for display
  const formatDeadline = (dateString) => {
    if (!dateString || dateString === "No deadline" || dateString === "N/A") return "N/A";
    
    try {
      const date = new Date(dateString);
      
      // Format date: Month Day, Year | Time
      const dateFormatted = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      
      // Format time: 00:00 AM/PM
      const timeFormatted = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      return `${dateFormatted} | ${timeFormatted}`;
    } catch {
      return dateString;
    }
  };

  const handleCardClick = () => {
    if (!readStatus) {
      // Mark as read when card is opened for the first time
      setReadStatus(true);
      if (onMarkAsRead) onMarkAsRead();
    }
    setOpen(!open);
  };

  const handleMarkAsUnreadClick = (e) => {
    e.stopPropagation();
    setReadStatus(false);
    setOpen(false); // Close the card when marking as unread
    if (onMarkAsUnread) onMarkAsUnread();
  };

  // Check if instructions are long (more than 150 characters)
  const isInstructionsLong = instructions && instructions.length > 150;
  const displayInstructions = showFullInstructions 
    ? instructions 
    : (isInstructionsLong ? instructions.substring(0, 150) + '...' : instructions);

  // Format the deadline for display
  const formattedDeadline = formatDeadline(deadline);

  // Check if deadline is urgent (within 24 hours) or passed
  const isDeadlineUrgent = (deadline) => {
    if (!deadline || deadline === "No deadline" || deadline === "N/A") return false;
    
    try {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const timeDiff = deadlineDate.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      return hoursDiff <= 24 && hoursDiff > 0; // Within 24 hours but not passed
    } catch {
      return false;
    }
  };

  // Check if deadline is passed
  const isDeadlinePassed = (deadline) => {
    if (!deadline || deadline === "No deadline" || deadline === "N/A") return false;
    
    try {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      return deadlineDate.getTime() < now.getTime();
    } catch {
      return false;
    }
  };

  // Get deadline text color class
  const getDeadlineColorClass = (deadline) => {
    if (isDeadlinePassed(deadline)) {
      return 'text-red-600 font-bold';
    } else if (isDeadlineUrgent(deadline)) {
      return 'text-red-500 font-semibold';
    }
    return 'text-gray-600 font-medium';
  };

  return (
    <div 
      className={`shadow-md rounded-md mt-5 w-full transition-all duration-200 ${
        readStatus 
          ? 'bg-white' 
          : 'bg-green-50 border-l-4 border-green-500'
      } hover:shadow-lg`}
    >
      {/* Header */}
      <div 
        className="relative p-3 sm:p-5 cursor-pointer" 
        onClick={handleCardClick}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pr-20 sm:pr-24">
          {/* Title section - Removed section from header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1 min-w-0 text-sm sm:text-base">
            <span className="font-bold">{subject}:</span>
            <span className="break-words">{title}</span>
            {/* Removed section display from header */}
            {!readStatus && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                New
              </span>
            )}
          </div>
        </div>

        {/* Action Icons - absolute positioned on upper right */}
        <div className="absolute top-3 sm:top-5 right-3 sm:right-5 flex items-center gap-2 sm:gap-4">
          {readStatus && (
            <button
              onClick={handleMarkAsUnreadClick}
              className="text-xs text-green-600 hover:text-green-800 font-medium hover:underline transition-colors cursor-pointer"
              title="Mark as unread"
            >
              Mark Unread
            </button>
          )}
          <img
            src={ArrowDown}
            alt="Expand"
            className={`h-5 w-5 sm:h-6 sm:w-6 transform transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Content */}
      {open && (
        <div className="p-3 sm:p-5 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            {/* Left side */}
            <div className="mb-3 sm:mb-0">
              <p className="font-semibold text-base sm:text-lg">{title}</p>
              {/* Posted By now comes formatted from backend */}
              <p className="text-xs sm:text-sm text-gray-600">
                Posted By: {postedBy}
              </p>
              {/* Removed section display inside card */}
            </div>

            {/* Right side */}
            <div className="text-xs sm:text-sm text-gray-600 sm:text-right">
              {/* Date Posted in green with relative time */}
              <p className="text-green-600 font-medium">
                Date Posted: {relativeTime}
              </p>
              {deadline && deadline !== "N/A" && (
                <p className={`mt-1 ${getDeadlineColorClass(deadline)}`}>
                  Deadline: {formattedDeadline}
                  {(isDeadlinePassed(deadline) || isDeadlineUrgent(deadline)) && (
                    <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      {isDeadlinePassed(deadline) ? 'Deadline Passed' : 'Deadline Approaching'}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Instructions with Show More/Less */}
          <div className="mt-4">
            <p className="font-semibold mb-2 text-sm sm:text-base">Instructions:</p>
            <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap break-words">
              {displayInstructions}
            </p>
            {isInstructionsLong && (
              <button
                onClick={() => setShowFullInstructions(!showFullInstructions)}
                className="mt-2 text-[#00A15D] font-medium hover:underline text-xs sm:text-sm cursor-pointer"
              >
                {showFullInstructions ? 'Show less' : 'Show more'}
              </button>
            )}
            {link && link !== "#" && link !== null && link !== "" && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-[#00A15D] font-semibold hover:underline text-xs sm:text-sm break-all"
              >
                🔗 View Link
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}