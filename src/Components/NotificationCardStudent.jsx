import React, { useState } from "react";
import ArrowDown from "../assets/ArrowDown(Light).svg";

export default function NotificationCardStudent({
  title,
  description,
  date,
  isRead = false,
  onMarkAsRead,
  onMarkAsUnread,
  type
}) {
  const [open, setOpen] = useState(false);
  const [readStatus, setReadStatus] = useState(isRead);

  const handleCardClick = () => {
    if (!readStatus) {
      setReadStatus(true);
      if (onMarkAsRead) onMarkAsRead();
    }
    setOpen(!open);
  };

  const handleMarkAsUnreadClick = (e) => {
    e.stopPropagation();
    setReadStatus(false);
    if (onMarkAsUnread) onMarkAsUnread();
  };

  // Function to calculate time ago with better error handling
  const getTimeAgo = (dateInput) => {
    try {
      const notificationDate = new Date(dateInput);
      const now = new Date();
      
      // Check if date is valid
      if (isNaN(notificationDate.getTime())) {
        console.error('Invalid date received:', dateInput);
        return 'recently';
      }
      
      const diffInMs = now - notificationDate;
      
      // If the date is in the future, return 'just now'
      if (diffInMs < 0) {
        return 'just now';
      }
      
      const diffInSeconds = Math.floor(diffInMs / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      const diffInWeeks = Math.floor(diffInDays / 7);
      const diffInMonths = Math.floor(diffInDays / 30);
      const diffInYears = Math.floor(diffInDays / 365);

      if (diffInYears > 0) {
        return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
      } else if (diffInMonths > 0) {
        return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
      } else if (diffInWeeks > 0) {
        return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
      } else if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else if (diffInMinutes > 0) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      } else if (diffInSeconds > 30) {
        return `${diffInSeconds} seconds ago`;
      } else {
        return 'just now';
      }
    } catch (error) {
      console.error('Error calculating time ago:', error);
      return 'recently';
    }
  };

  // Function to format date and time with better error handling
  const formatDateTime = (dateInput) => {
    try {
      const date = new Date(dateInput);
      
      if (isNaN(date.getTime())) {
        console.error('Invalid date for formatting:', dateInput);
        return 'Date unavailable';
      }
      
      const datePart = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const timePart = date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      
      return `${datePart} at ${timePart}`;
    } catch (error) {
      console.error('Error formatting date time:', error);
      return 'Date unavailable';
    }
  };

  // Check if this is a failing subject notification
  const isFailingSubject = type === 'failing_subject';

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pr-24 sm:pr-28">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1 min-w-0">
            <span className={`font-bold text-sm sm:text-base break-words ${
              isFailingSubject ? 'text-red-600' : 'text-inherit'
            }`}>
              {title}
            </span>
            {!readStatus && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                New
              </span>
            )}
          </div>
        </div>

        {/* Time indicator */}
        <div className="mt-2 sm:mt-0">
          <p className="text-xs sm:text-sm text-gray-600">{getTimeAgo(date)}</p>
        </div>

        {/* Action Icons */}
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

      {/* Expanded Content */}
      {open && (
        <div className="p-3 sm:p-5 border-t border-gray-200">
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-semibold mb-2 text-sm sm:text-base">Details:</p>
              <p className={`text-xs sm:text-sm whitespace-pre-wrap break-words ${
                isFailingSubject ? 'text-red-600 font-medium' : 'text-gray-700'
              }`}>
                {description}
              </p>
            </div>
            
            {/* Date and time in lower right corner */}
            <div className="flex justify-end items-center pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {formatDateTime(date)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}