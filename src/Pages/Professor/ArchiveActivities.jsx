import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";

import ArchiveIcon from "../../assets/Archive(Light).svg";
import BackButton from "../../assets/BackButton(Light).svg";
import DeleteIcon from "../../assets/Delete.svg";
import UnarchiveIcon from "../../assets/Unarchive.svg";

// Archived Activity Card Component - Similar to ClassworkTab's SmallActivityCard
const ArchivedActivityCard = ({ activity, onDelete, onUnarchive }) => {
  const formatDate = (dateString) => {
    if (!dateString || dateString === "No deadline") return "No deadline";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getPostedTime = (createdAt) => {
    if (!createdAt) return "Recently";
    
    try {
      const created = new Date(createdAt + 'Z');
      const now = new Date();
      
      if (isNaN(created.getTime())) {
        return "Recently";
      }
      
      const diffMs = now - created;
      const diffSecs = Math.floor(diffMs / 1000);
      
      if (diffSecs < 60) {
        return diffSecs <= 1 ? "Just now" : `${diffSecs}s ago`;
      }
      
      const diffMins = Math.floor(diffSecs / 60);
      if (diffMins < 60) {
        return diffMins === 1 ? "1m ago" : `${diffMins}m ago`;
      }
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) {
        return diffHours === 1 ? "1h ago" : `${diffHours}h ago`;
      }
      
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) {
        return diffDays === 1 ? "1d ago" : `${diffDays}d ago`;
      }
      
      const diffWeeks = Math.floor(diffDays / 7);
      if (diffWeeks < 4) {
        return diffWeeks === 1 ? "1w ago" : `${diffWeeks}w ago`;
      }
      
      return created.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
    } catch (error) {
      console.error('Error parsing date:', error, 'Input:', createdAt);
      return "Recently";
    }
  };

  // Check if deadline is past deadline
  const isDeadlinePassed = (deadline) => {
    if (!deadline || deadline === "No deadline") return false;
    
    try {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      return deadlineDate < now;
    } catch {
      return false;
    }
  };

  // Get activity type color
  const getActivityTypeColor = (type) => {
    const colors = {
      'Assignment': 'bg-blue-100 text-blue-800',
      'Quiz': 'bg-purple-100 text-purple-800',
      'Activity': 'bg-green-100 text-green-800',
      'Project': 'bg-orange-100 text-orange-800',
      'Laboratory': 'bg-red-100 text-red-800',
      'Announcement': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  // Handle card click (can be used for viewing details if needed)
  const handleCardClick = (e) => {
    if (e.target.closest('button')) {
      return;
    }
    // You can add functionality to view activity details if needed
  };

  return (
    <div 
      className={`rounded-lg shadow-md border p-4 hover:shadow-lg transition-shadow cursor-pointer bg-gray-50 border-gray-300`}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        {/* Left Section - Activity Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`px-2 py-1 ${getActivityTypeColor(activity.activity_type)} text-xs font-medium rounded`}>
              {activity.activity_type}
            </span>
            <span className="text-sm text-gray-500">#{activity.task_number}</span>
            
            {/* Archived status badge */}
            <div className="flex items-center gap-1">
              <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded flex items-center gap-1">
                <img src={ArchiveIcon} alt="Archive" className="w-3 h-3" />
                Archived
              </span>
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-900 text-lg mb-3 truncate">
            {activity.title}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-600">
            {/* Deadline with icon */}
            <div className="flex items-center gap-2">
              <svg className={`w-4 h-4 ${
                isDeadlinePassed(activity.deadline) ? 'text-red-600' : 'text-gray-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`font-medium ${
                isDeadlinePassed(activity.deadline) ? 'text-red-600 font-bold' : 'text-gray-600'
              }`}>
                {formatDate(activity.deadline)}
              </span>
            </div>

            {/* Archived time */}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Archived {getPostedTime(activity.archived_at || activity.created_at)}</span>
            </div>

            {/* Points */}
            {activity.points > 0 && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-600 font-bold">{activity.points} pts</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Stats and Actions */}
        <div className="flex flex-col items-end gap-3 ml-4" onClick={(e) => e.stopPropagation()}>
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Delete Button */}
            <div className="relative group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(activity);
                }}
                className="p-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors cursor-pointer"
              >
                <img 
                  src={DeleteIcon} 
                  alt="Delete" 
                  className="w-5 h-5"
                />
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Delete Permanently
              </div>
            </div>

            {/* Restore Button */}
            <div className="relative group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUnarchive(activity);
                }}
                className="p-2 bg-gray-100 hover:bg-green-50 hover:text-green-600 rounded-md transition-colors cursor-pointer"
              >
                <img 
                  src={UnarchiveIcon} 
                  alt="Restore" 
                  className="w-5 h-5"
                />
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Restore Activity
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Instruction preview (collapsed by default) */}
      {activity.instruction && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 font-medium mb-1">Instruction:</p>
          <p className="text-sm text-gray-600 line-clamp-2">
            {activity.instruction}
          </p>
        </div>
      )}
    </div>
  );
};

export default function ArchiveActivities() {
  const [isOpen, setIsOpen] = useState(true);
  const [archivedActivities, setArchivedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [activityToUnarchive, setActivityToUnarchive] = useState(null);
  const [classInfo, setClassInfo] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subjectCode = searchParams.get('code');

  // GET LOGGED-IN USER ID
  const getProfessorId = () => {
    try {
      const userDataString = localStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        return userData.id;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return null;
  };

  // Load archived activities and class details on component mount
  useEffect(() => {
    if (subjectCode) {
      fetchClassDetails();
      fetchArchivedActivities();
    }
  }, [subjectCode]);

  const fetchClassDetails = async () => {
    try {
      const professorId = getProfessorId();
      const response = await fetch(`https://tracked.6minds.site/Professor/SubjectDetailsDB/get_class_details.php?subject_code=${subjectCode}&professor_ID=${professorId}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setClassInfo(result.class_data);
        }
      }
    } catch (error) {
      console.error('Error fetching class details:', error);
    }
  };

  const fetchArchivedActivities = async () => {
    try {
      setLoading(true);
      const professorId = getProfessorId();
      
      if (!professorId || !subjectCode) {
        console.error('No professor ID or subject code found.');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`https://tracked.6minds.site/Professor/ArchiveActivitiesDB/get_archived_activities.php?subject_code=${subjectCode}&professor_ID=${professorId}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setArchivedActivities(result.activities);
        } else {
          console.error('Error fetching archived activities:', result.message);
        }
      } else {
        throw new Error('Failed to fetch archived activities');
      }
    } catch (error) {
      console.error('Error fetching archived activities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle unarchive
  const handleUnarchive = async (activity, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setActivityToUnarchive(activity);
    setShowUnarchiveModal(true);
  };

  const confirmUnarchive = async () => {
    if (!activityToUnarchive) return;

    try {
      const professorId = getProfessorId();
      
      const response = await fetch('https://tracked.6minds.site/Professor/ArchiveActivitiesDB/unarchive_activity.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activity_ID: activityToUnarchive.id,
          professor_ID: professorId
        })
      });

      const result = await response.json();

      if (result.success) {
        setArchivedActivities(prevActivities => 
          prevActivities.filter(activity => activity.id !== activityToUnarchive.id)
        );
        setShowUnarchiveModal(false);
        setActivityToUnarchive(null);
      } else {
        alert('Error unarchiving activity: ' + result.message);
        setShowUnarchiveModal(false);
      }
    } catch (error) {
      console.error('Error unarchiving activity:', error);
      alert('Error unarchiving activity. Please try again.');
      setShowUnarchiveModal(false);
    }
  };

  // Handle delete
  const handleDelete = async (activity, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setActivityToDelete(activity);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!activityToDelete) return;

    try {
      const professorId = getProfessorId();
      
      const response = await fetch('https://tracked.6minds.site/Professor/ArchiveActivitiesDB/delete_activity.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activity_ID: activityToDelete.id,
          professor_ID: professorId
        })
      });

      const result = await response.json();

      if (result.success) {
        setArchivedActivities(prevActivities => 
          prevActivities.filter(activity => activity.id !== activityToDelete.id)
        );
        setShowDeleteModal(false);
        setActivityToDelete(null);
      } else {
        alert('Error deleting activity: ' + result.message);
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Error deleting activity. Please try again.');
      setShowDeleteModal(false);
    }
  };

  // Render archived activity cards in grid
  const renderArchivedActivityCards = () => {
    if (loading) {
      return (
        <div className="col-span-full text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#00874E] border-r-transparent"></div>
          <p className="mt-3 text-gray-600">Loading archived activities...</p>
        </div>
      );
    }

    if (archivedActivities.length === 0) {
      return (
        <div className="col-span-full text-center py-12">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <img 
              src={ArchiveIcon} 
              alt="No archived activities" 
              className="h-8 w-8 opacity-50"
            />
          </div>
          <p className="text-gray-500 text-sm sm:text-base">
            No archived activities found.
          </p>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">
            Activities you archive will appear here.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {archivedActivities.map((activity) => (
          <ArchivedActivityCard
            key={activity.id}
            activity={activity}
            onDelete={handleDelete}
            onUnarchive={handleUnarchive}
          />
        ))}
      </div>
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

        {/* Main Content */}
        <div className="p-4 sm:p-5 md:p-6 lg:p-8">
          
          {/* Page Header */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <img
                  src={ArchiveIcon}
                  alt=""
                  className="h-6 w-6 sm:h-7 sm:w-7 mr-3"
                />
                <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl text-[#465746]">
                  Archived Activities
                </h1>
              </div>
              
              {/* Mobile Back Button */}
              <Link to={`/ClassworkTab?code=${subjectCode}`}>
                <button 
                  className="flex items-center justify-center w-9 h-9 cursor-pointer transition-all duration-200 hover:scale-110"
                  aria-label="Back to Activities"
                >
                  <img
                    src={BackButton}
                    alt="Back"
                    className="h-6 w-6"
                  />
                </button>
              </Link>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-[#465746]/80">
              {classInfo ? `${classInfo.subject} - ${classInfo.section}` : 'Loading...'}
            </p>
          </div>

          <hr className="border-[#465746]/30 mb-5 sm:mb-6" />

          {/* Archived Activities Grid */}
          <div className="mt-4 sm:mt-5">
            {renderArchivedActivityCards()}
          </div>
        </div>
      </div>

      {/* Unarchive Confirmation Modal */}
      {showUnarchiveModal && activityToUnarchive && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overlay-fade p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowUnarchiveModal(false);
              setActivityToUnarchive(null);
            }
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white text-black rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 relative modal-pop">
            <div className="text-center">
              {/* Info Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <img 
                  src={UnarchiveIcon} 
                  alt="Unarchive" 
                  className="h-8 w-8"
                />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Restore Activity?
              </h3>
              
              <div className="mt-4 mb-6">
                <p className="text-sm text-gray-600 mb-3">
                  Are you sure you want to restore this activity?
                </p>
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                    {activityToUnarchive.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Type: {activityToUnarchive.activity_type}
                  </p>
                  <p className="text-sm text-gray-600">
                    Task: {activityToUnarchive.task_number}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowUnarchiveModal(false);
                    setActivityToUnarchive(null);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-md transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUnarchive}
                  className="flex-1 bg-[#00A15D] hover:bg-[#00874E] text-white font-bold py-3 rounded-md transition-all duration-200 cursor-pointer"
                >
                  Restore
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && activityToDelete && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overlay-fade p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDeleteModal(false);
              setActivityToDelete(null);
            }
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white text-black rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 relative modal-pop">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <img 
                  src={DeleteIcon} 
                  alt="Delete" 
                  className="h-8 w-8"
                />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Delete Activity?
              </h3>
              
              <div className="mt-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">
                  Are you sure you want to permanently delete this activity?
                </p>
                <p className="text-sm font-semibold text-red-600 mb-3">
                  This action cannot be undone.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                    {activityToDelete.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Type: {activityToDelete.activity_type}
                  </p>
                  <p className="text-sm text-gray-600">
                    Task: {activityToDelete.task_number}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setActivityToDelete(null);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-md transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition-all duration-200 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .overlay-fade { animation: overlayFade .18s ease-out both; }
        @keyframes overlayFade { from { opacity: 0 } to { opacity: 1 } }

        .modal-pop {
          transform-origin: top center;
          animation: popIn .22s cubic-bezier(.2,.8,.2,1) both;
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(-8px) scale(.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  );
}