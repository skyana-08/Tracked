import React, { useState } from "react";
import ArrowDown from "../assets/ArrowDown(Light).svg";

export default function ActivityCardStudent({ activity, formatDate }) {
  const [open, setOpen] = useState(false);

  const isSubmitted = activity.submitted === 1 || activity.submitted === true;
  const isLate = activity.late === 1 || activity.late === true;

  const getStatusText = () => {
    if (isSubmitted && isLate) return "Submitted Late";
    if (isSubmitted) return "Submitted";
    return "Not Submitted";
  };

  const getStatusColor = () => {
    if (isSubmitted && isLate) return "text-yellow-600";
    if (isSubmitted) return "text-green-600";
    return "text-[#FF6666]";
  };

  return (
    <div className="bg-white rounded-md shadow-md p-4 sm:p-5 border-2 border-transparent hover:border-[#00874E] transition-all duration-200 cursor-pointer">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="min-w-0 flex-1">
            <div className="text-lg font-semibold">
              {activity.title}
            </div>
            <div className="text-md text-gray-600">
              {activity.activity_type} • {activity.task_number} • Posted {formatDate(activity.created_at)}
            </div>
            
            {/* Activity details */}
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
              {activity.points && (
                <span>Points: {activity.points}</span>
              )}
              {activity.deadline && (
                <span className={`${new Date(activity.deadline) < new Date() && !isSubmitted ? 'text-red-600 font-semibold' : ''}`}>
                  Deadline: {formatDate(activity.deadline)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: status, expand */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-sm">
            <span className={`font-semibold ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          <button
            onClick={() => setOpen(prev => !prev)}
            aria-label={open ? "Collapse" : "Expand"}
            className={`p-2 rounded-md transform transition-transform ${open ? "rotate-180" : ""}`}
            title={open ? "Collapse" : "Expand"}
          >
            <img src={ArrowDown} alt="Toggle" className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {open && (
        <div className="mt-3 border-t pt-3 text-sm text-gray-700">
          {activity.instruction && (
            <div className="mb-3">
              <p className="font-semibold mb-1">Instructions:</p>
              <p className="whitespace-pre-wrap">{activity.instruction}</p>
            </div>
          )}
          
          {activity.link && (
            <div className="mb-3">
              <p className="font-semibold mb-1">Link:</p>
              <a 
                href={activity.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline break-words"
              >
                {activity.link}
              </a>
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            <p>Activity Type: {activity.activity_type}</p>
            <p>Task Number: {activity.task_number}</p>
            {activity.submitted_at && (
              <p>Submitted: {formatDate(activity.submitted_at)}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}