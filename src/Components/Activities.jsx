import React, { useState } from "react";
import ArrowDown from "../assets/ArrowDown(Light).svg";

export default function ActivityCard({ 
  activity, 
  isEditing, 
  onGradeChange, 
  onSubmissionChange, 
  onSave, 
  onMarkAllSubmitted, 
  onEditToggle 
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Debug logging
  console.log('ActivityCard props:', {
    activity,
    students: activity.students,
    isEditing,
    hasStudents: activity.students?.length > 0,
    studentCount: activity.students?.length || 0
  });

  // Determine status based on student submissions
  const allSubmitted = activity.students?.every(student => student.submitted) || false;
  const status = allSubmitted ? "All Submitted" : "Not All Submitted";

  const handleSave = () => {
    if (onSave && activity.students) {
      onSave(activity.students);
    }
  };

  const handleMarkAllSubmitted = () => {
    if (onMarkAllSubmitted) {
      onMarkAllSubmitted();
    }
  };

  const handleEditToggle = () => {
    if (onEditToggle) {
      onEditToggle();
    }
  };

  const handleGradeInputChange = (studentId, value) => {
    if (onGradeChange) {
      // Remove .0 from whole numbers when typing
      let processedValue = value;
      if (value && value.includes('.')) {
        const num = parseFloat(value);
        if (num === Math.floor(num)) {
          processedValue = Math.floor(num).toString();
        }
      }
      onGradeChange(studentId, processedValue);
      
      // Auto-mark as submitted when a grade is entered
      if (value && value > 0) {
        if (onSubmissionChange) {
          onSubmissionChange(studentId, 'submitted');
        }
      }
    }
  };

  const handleStatusChange = (studentId, statusType) => {
    if (onSubmissionChange) {
      onSubmissionChange(studentId, statusType);
    }
  };

  const getStudentStatus = (student) => {
    if (student.late) return 'late';
    if (student.submitted) return 'submitted';
    return 'missed';
  };

  // Format grade for display - remove .0 from whole numbers
  const formatGrade = (grade) => {
    if (grade === null || grade === undefined || grade === '') return '';
    
    const num = parseFloat(grade);
    if (isNaN(num)) return grade;
    
    // If it's a whole number, display without decimals
    if (num === Math.floor(num)) {
      return Math.floor(num).toString();
    }
    
    // Otherwise display with decimals
    return num.toString();
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      // If date parsing fails, return the original string
      return dateString;
    }
  };

  return (
    <div className={`bg-[#fff] rounded-md shadow-md p-4 mb-4 w-full mt-5 border-2 ${
      !isEditing ? 'border-transparent' : 'border-[#00874E]'
    }`}>
      {/* Card Header */}
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex flex-col text-[1.125rem] max-w-[250px]">
          <span className="font-bold">{activity.title || activity.task_number}</span>
          <span className="text-sm text-gray-600 mt-1">{activity.instruction || activity.description}</span>
        </div>

        {/* Fixed Status and Deadline section - reduced gaps and improved alignment */}
        <div className="flex items-center gap-4 text-[1.125rem]">
          <div className="flex items-center gap-2">
            <p className="font-bold whitespace-nowrap">Status:</p>
            <p className={`whitespace-nowrap ${allSubmitted ? 'text-[#00A15D]' : 'text-[#EF4444]'}`}>
              {status}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-[#EF4444] whitespace-nowrap">Deadline:</p>
            <p className="whitespace-nowrap">{formatDate(activity.deadline)}</p>
          </div>
        </div>

        {/* Right: Arrow */}
        <img
          src={ArrowDown}
          alt="Expand"
          className={`h-6 w-6 transform transition-transform duration-300 ml-4 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="mt-3 pt-3 text-[1.125rem] space-y-4">
          {/* Student Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-[1.125rem] font-semibold">
                  <th className="p-2">Student No.</th>
                  <th className="p-2">Student Name</th>
                  <th className="p-2 text-center">Score</th>
                  <th className="p-2 text-center text-[#00A15D]">Submitted</th>
                  <th className="p-2 text-center text-[#767EE0]">Late</th>
                  <th className="p-2 text-center text-[#EF4444]">Missed</th>
                </tr>
              </thead>
              <tbody>
                {activity.students?.length > 0 ? (
                  activity.students.map((student) => {
                    console.log('Rendering student:', student); // Debug log for each student
                    const currentStatus = getStudentStatus(student);
                    return (
                      <tr key={student.user_ID || student.id} className="hover:bg-gray-50">
                        <td className="p-2">{student.user_ID || student.no}</td>
                        <td className="p-2">{student.user_Name || student.name}</td>
                        <td className="p-2 text-center">
                          <input
                            type="number"
                            className={`w-16 rounded border px-2 py-1 text-sm text-center ${
                              !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                            }`}
                            placeholder="0"
                            value={formatGrade(student.grade)}
                            onChange={(e) => {
                              const value = e.target.value;
                              handleGradeInputChange(student.user_ID || student.id, value);
                            }}
                            onBlur={(e) => {
                              // Auto-submit when grade is entered and field loses focus
                              const value = e.target.value;
                              if (value && value > 0 && !student.submitted) {
                                handleStatusChange(student.user_ID || student.id, 'submitted');
                              }
                            }}
                            disabled={!isEditing}
                            max={activity.points}
                            min="0"
                            step="1" // Allow only whole numbers
                          />
                        </td>
                        
                        {/* Submitted */}
                        <td className="p-2 text-center w-10">
                          <input
                            type="radio"
                            name={`status-${student.user_ID || student.id}`}
                            className="appearance-none w-6 h-6 border-2 border-[#00A15D] rounded-md checked:bg-[#00A15D] cursor-pointer disabled:cursor-not-allowed"
                            checked={currentStatus === 'submitted'}
                            onChange={() => handleStatusChange(student.user_ID || student.id, 'submitted')}
                            disabled={!isEditing}
                          />
                        </td>
                        
                        {/* Late */}
                        <td className="p-2 text-center w-10">
                          <input
                            type="radio"
                            name={`status-${student.user_ID || student.id}`}
                            className="appearance-none w-6 h-6 border-2 border-[#767EE0] rounded-md checked:bg-[#767EE0] cursor-pointer disabled:cursor-not-allowed"
                            checked={currentStatus === 'late'}
                            onChange={() => handleStatusChange(student.user_ID || student.id, 'late')}
                            disabled={!isEditing}
                          />
                        </td>
                        
                        {/* Missed */}
                        <td className="p-2 text-center w-10">
                          <input
                            type="radio"
                            name={`status-${student.user_ID || student.id}`}
                            className="appearance-none w-6 h-6 border-2 border-[#EF4444] rounded-md checked:bg-[#EF4444] cursor-pointer disabled:cursor-not-allowed"
                            checked={currentStatus === 'missed'}
                            onChange={() => handleStatusChange(student.user_ID || student.id, 'missed')}
                            disabled={!isEditing}
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No students found for this activity. Students: {activity.students?.length || 0}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* EDIT, MARK ALL, SAVE Buttons */}
          <div className="flex justify-end space-x-3">
            {!isEditing ? (
              <>
                <button 
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-[#979797] text-[#fff] font-bold rounded-md hover:border-2 hover:border-[#007846] transition-all duration-200 cursor-pointer"
                >
                  Edit
                </button>
                {!allSubmitted && (
                  <button 
                    onClick={handleMarkAllSubmitted}
                    className="px-4 py-2 bg-[#979797] text-[#fff] font-bold rounded-md hover:border-2 hover:border-[#007846] transition-all duration-200 cursor-pointer"
                  >
                    Mark All Submitted
                  </button>
                )}
              </>
            ) : (
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-[#00A15D] text-[#fff] font-bold rounded-md hover:border-2 hover:border-[#007846] transition-all duration-200 cursor-pointer"
              >
                Save
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}