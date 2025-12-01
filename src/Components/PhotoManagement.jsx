import React from 'react';
import Cross from "../assets/Cross(Light).svg";
import Add from "../assets/Add(Light).svg";
import FileIcon from "../assets/File(Light).svg";

const PhotoManagement = ({
  isOpen,
  onClose,
  selectedStudent,
  professorPhoto,
  studentPhoto,
  onProfessorPhotoUpload,
  onViewProfessorPhoto,
  onViewStudentPhoto,
  activity
}) => {
  if (!isOpen || !selectedStudent) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[60] p-2 sm:p-3 md:p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex-1 min-w-0 mr-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              Photo Management - {selectedStudent.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer flex-shrink-0"
          >
            <img src={Cross} alt="Close" className="w-5 h-5" />
          </button>
        </div>

        {/* Instruction at the top */}
        <div className="p-4 sm:p-6">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Instruction:</p>
              <p className="text-sm text-blue-900">Upload photos of graded work or feedback, The student can view photos you upload</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Professor's Photo Section */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Professor's Upload</h3>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                  <span>Your Upload for Student</span>
                  {professorPhoto && (
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                      Uploaded
                    </span>
                  )}
                </h4>
                
                {professorPhoto ? (
                  <div className="space-y-3">
                    <div 
                      className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-green-500"
                      onClick={onViewProfessorPhoto}
                    >
                      <img 
                        src={professorPhoto.url} 
                        alt="Professor's upload" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{professorPhoto.name}</p>
                        <p className="text-xs text-gray-500">
                          Uploaded on {new Date(professorPhoto.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={onViewProfessorPhoto}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 cursor-pointer transition-colors w-fit"
                        >
                          View
                        </button>
                        <button
                          onClick={onProfessorPhotoUpload}
                          className="px-3 py-1 bg-white text-green-600 text-sm rounded border border-green-600 hover:bg-green-50 cursor-pointer transition-colors w-fit"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="w-full h-40 bg-white border-2 border-dashed border-green-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors p-4"
                    onClick={onProfessorPhotoUpload}
                  >
                    <img src={Add} alt="Add" className="w-10 h-10 text-green-400 mb-3" />
                    <p className="text-green-700 font-medium text-sm text-center">Click to upload a photo for the student</p>
                    <p className="text-green-600 text-xs mt-1 text-center">JPG, PNG files supported</p>
                  </div>
                )}
              </div>
            </div>

            {/* Student's Photo Section */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Student's Submission</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Student's Uploaded Work</h4>
                
                {studentPhoto ? (
                  <div className="space-y-3">
                    <div 
                      className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-blue-500"
                      onClick={onViewStudentPhoto}
                    >
                      <img 
                        src={studentPhoto.url} 
                        alt="Student's submission" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{studentPhoto.name}</p>
                        <p className="text-xs text-gray-500">
                          Submitted on {new Date(studentPhoto.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={onViewStudentPhoto}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 cursor-pointer transition-colors w-fit"
                      >
                        View Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <img src={FileIcon} alt="No file" className="w-6 h-6 text-blue-400" />
                    </div>
                    <p className="text-blue-700 text-sm font-medium">No submission from student yet</p>
                    <p className="text-blue-600 text-xs mt-1">
                      The student has not uploaded any photos for this activity.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 cursor-pointer transition-colors"
          >
            Close
          </button>
          {professorPhoto && (
            <button
              onClick={onViewProfessorPhoto}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 cursor-pointer transition-colors"
            >
              View Your Photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoManagement;