import React, { useState } from 'react';
import Close from "../assets/Close.svg";
import Add from "../assets/Add(Light).svg";

const StudentActivityDetails = ({ activity, isOpen, onClose, onImageUpload, studentImages }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString || dateString === "No deadline") return "No deadline";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        onImageUpload(activity.id, file);
      }
    };
    input.click();
  };

  const handleViewImage = (image) => {
    setSelectedImage(image);
    setImageViewerOpen(true);
  };

  const handleCloseImageViewer = () => {
    setImageViewerOpen(false);
    setSelectedImage(null);
  };

  const currentStudentImage = studentImages[activity?.id];
  const hasTeacherImage = activity?.teacher_image;

  if (!isOpen || !activity) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex-1 min-w-0 mr-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                {activity.title}
              </h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`px-2 py-1 ${
                  activity.activity_type === 'Assignment' ? 'bg-blue-100 text-blue-800' :
                  activity.activity_type === 'Quiz' ? 'bg-purple-100 text-purple-800' :
                  activity.activity_type === 'Activity' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                } text-xs font-medium rounded flex-shrink-0`}>
                  {activity.activity_type}
                </span>
                <span className="text-sm text-gray-500 flex-shrink-0">#{activity.task_number}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer flex-shrink-0"
            >
              <img src={Close} alt="Close" className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column - Activity Details */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Activity Details</h3>
                
                <div className="space-y-4">
                  {/* Deadline */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Deadline</h4>
                    <p className="text-gray-600 text-sm sm:text-base">{formatDate(activity.deadline)}</p>
                  </div>

                  {/* Points */}
                  {activity.points > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Points</h4>
                      <p className="text-green-600 font-semibold text-sm sm:text-base">{activity.points} points</p>
                    </div>
                  )}

                  {/* Instructions */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 max-h-40 sm:max-h-48 overflow-y-auto">
                      <p className="text-gray-600 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                        {activity.instruction || 'No instructions provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Link */}
                  {activity.link && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Reference Link</h4>
                      <a 
                        href={activity.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 break-words text-sm sm:text-base"
                      >
                        {activity.link}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Image Section */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Submission</h3>
                
                <div className="space-y-4">
                  {/* Teacher Uploaded Image */}
                  {hasTeacherImage && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Teacher's Reference</h4>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                        <p className="text-green-800 text-xs sm:text-sm">
                          Your teacher has provided a reference image for this activity.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Student Image Upload/View */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Your Submission</h4>
                    
                    {currentStudentImage ? (
                      <div className="space-y-3">
                        <div 
                          className="w-full h-40 sm:h-48 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-blue-500"
                          onClick={() => handleViewImage(currentStudentImage)}
                        >
                          <img 
                            src={currentStudentImage.url} 
                            alt="Your submission" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 xs:gap-0">
                          <span className="text-xs sm:text-sm text-gray-600 break-words">{currentStudentImage.name}</span>
                          <button
                            onClick={handleFileUpload}
                            className="px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm rounded hover:bg-blue-700 cursor-pointer w-fit"
                          >
                            Change Image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="w-full h-40 sm:h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors p-4"
                        onClick={handleFileUpload}
                      >
                        <img src={Add} alt="Add" className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-2" />
                        <p className="text-gray-600 font-medium text-sm sm:text-base text-center">Click to upload your work</p>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1 text-center">Supported formats: JPG, PNG</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer w-full xs:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {imageViewerOpen && selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-[60] p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={handleCloseImageViewer}
              className="absolute top-4 right-4 p-2 sm:p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10 cursor-pointer"
            >
              <img src={Close} alt="Close" className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="relative max-w-[95vw] max-h-[85vh] w-auto h-auto mx-4">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm backdrop-blur-sm max-w-[90vw] text-center">
              {selectedImage.name}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentActivityDetails;