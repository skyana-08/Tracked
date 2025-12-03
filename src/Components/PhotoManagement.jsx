import React, { useState, useEffect } from 'react';
import Cross from "../assets/Cross(Light).svg";
import Add from "../assets/Add(Light).svg";
import FileIcon from "../assets/File(Light).svg";

const PhotoManagement = ({
  isOpen,
  onClose,
  selectedStudent,
  studentFiles = [],
  professorFiles = [],
  onProfessorPhotoUpload,
  onDeleteProfessorFile,
  activity,
  formatFileSize,
  isUploadingToDrive = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [localProfessorFiles, setLocalProfessorFiles] = useState([]);
  const [localStudentFiles, setLocalStudentFiles] = useState([]);

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen && selectedStudent) {
      console.log('PhotoManagement opened with:', {
        student: selectedStudent.name,
        professorFilesCount: professorFiles?.length || 0,
        studentFilesCount: studentFiles?.length || 0
      });
      
      // Reset and update files
      setLocalProfessorFiles(professorFiles || []);
      setLocalStudentFiles(studentFiles || []);
    }
  }, [isOpen, selectedStudent, professorFiles, studentFiles]);

  const handleUploadClick = async () => {
    if (onProfessorPhotoUpload && typeof onProfessorPhotoUpload === 'function') {
      setUploading(true);
      try {
        console.log('Starting upload for student:', selectedStudent?.id);
        await onProfessorPhotoUpload();
        
        // The parent component should refresh the files and pass them as props
        // We'll show a success message
        alert('File uploaded successfully! Please refresh the file list if needed.');
        
      } catch (error) {
        console.error('Upload error:', error);
        alert('Upload failed: ' + error.message);
      } finally {
        setUploading(false);
      }
    } else {
      console.error('Upload function not available');
      alert('Upload function is not configured properly.');
    }
  };

  // Get the latest files
  const getLatestProfessorFile = () => {
    return localProfessorFiles.length > 0 
      ? localProfessorFiles[localProfessorFiles.length - 1]
      : null;
  };

  const getLatestStudentFile = () => {
    return localStudentFiles.length > 0 
      ? localStudentFiles[localStudentFiles.length - 1]
      : null;
  };

  const latestProfessorFile = getLatestProfessorFile();
  const latestStudentFile = getLatestStudentFile();

  // Format file size fallback
  const defaultFormatFileSize = (bytes) => {
    if (bytes === 0 || bytes === undefined || bytes === null) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatSize = formatFileSize || defaultFormatFileSize;

  // Handle view file
  const handleViewFileClick = (file) => {
    console.log('Viewing file:', file);
    
    if (!file) {
      alert('No file to view');
      return;
    }
    
    const fileUrl = file.url || file.file_url;
    
    if (fileUrl && (fileUrl.startsWith('http://') || fileUrl.startsWith('https://'))) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('File URL is not available or invalid');
    }
  };

  // Handle delete professor file
  const handleDeleteFileClick = async (fileId, fileIndex) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        if (onDeleteProfessorFile && typeof onDeleteProfessorFile === 'function' && fileId) {
          await onDeleteProfessorFile(fileId);
          // Remove from local state
          setLocalProfessorFiles(prev => prev.filter(file => file.id !== fileId));
          alert('File deleted successfully!');
        } else if (fileIndex !== undefined) {
          // Fallback: remove from local state by index
          setLocalProfessorFiles(prev => {
            const newFiles = [...prev];
            newFiles.splice(fileIndex, 1);
            return newFiles;
          });
          alert('File removed from view.');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting file: ' + error.message);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Render file preview
  const renderFilePreview = (file) => {
    const fileUrl = file.url || file.file_url;
    const fileName = file.name || file.fileName || file.original_name || 'Unknown file';
    const fileType = file.type || file.file_type || '';
    
    if (fileType.startsWith('image/') && fileUrl) {
      return (
        <div className="relative w-full h-40">
          <img 
            src={fileUrl} 
            alt={fileName}
            className="w-full h-full object-contain rounded-lg"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div class="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4">
                  <div class="text-3xl mb-2">📷</div>
                  <p class="text-center text-sm font-medium text-gray-700 truncate w-full px-2">${fileName}</p>
                  <p class="text-xs text-gray-500 mt-1">Image failed to load</p>
                </div>
              `;
            }}
          />
        </div>
      );
    } else if (fileType.includes('pdf') || fileName.toLowerCase().endsWith('.pdf')) {
      return (
        <div className="w-full h-40 flex flex-col items-center justify-center bg-red-100 rounded-lg p-4">
          <div className="text-3xl mb-2">📕</div>
          <p className="text-center text-sm font-medium text-gray-700 truncate w-full px-2">{fileName}</p>
          <p className="text-xs text-gray-500 mt-1">PDF Document</p>
        </div>
      );
    } else if (fileType.includes('word') || fileType.includes('document') || 
               fileName.toLowerCase().endsWith('.doc') || fileName.toLowerCase().endsWith('.docx')) {
      return (
        <div className="w-full h-40 flex flex-col items-center justify-center bg-blue-100 rounded-lg p-4">
          <div className="text-3xl mb-2">📄</div>
          <p className="text-center text-sm font-medium text-gray-700 truncate w-full px-2">{fileName}</p>
          <p className="text-xs text-gray-500 mt-1">Document</p>
        </div>
      );
    } else {
      return (
        <div className="w-full h-40 flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4">
          <div className="text-3xl mb-2">📁</div>
          <p className="text-center text-sm font-medium text-gray-700 truncate w-full px-2">
            {fileName}
          </p>
          <p className="text-xs text-gray-500 mt-1">{fileType || 'File'}</p>
        </div>
      );
    }
  };

  if (!isOpen || !selectedStudent) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[60] p-2 sm:p-3 md:p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex-1 min-w-0 mr-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              File Management - {selectedStudent?.name || 'Student'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {activity?.title || 'Activity'} • {activity?.activity_type || 'Type'} #{activity?.task_number || 'Number'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer flex-shrink-0"
          >
            <img src={Cross} alt="Close" className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Professor's Files Section */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Professor's Files</h3>
                <button
                  onClick={handleUploadClick}
                  disabled={uploading || isUploadingToDrive}
                  className={`flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors cursor-pointer ${(uploading || isUploadingToDrive) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {uploading || isUploadingToDrive ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <img src={Add} alt="Add" className="w-4 h-4" />
                      Upload File
                    </>
                  )}
                </button>
              </div>
              
              {/* File Count */}
              <div className="text-sm text-gray-600">
                {localProfessorFiles.length} file{localProfessorFiles.length !== 1 ? 's' : ''}
              </div>
              
              {/* Latest File Preview */}
              {latestProfessorFile ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                    <span>Latest Upload</span>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                      Professor's File
                    </span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div 
                      className="cursor-pointer"
                      onClick={() => handleViewFileClick(latestProfessorFile)}
                    >
                      {renderFilePreview(latestProfessorFile)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {latestProfessorFile.name || latestProfessorFile.fileName || 'Unnamed file'}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {latestProfessorFile.size && (
                              <>
                                <p className="text-xs text-gray-500">
                                  {formatSize(latestProfessorFile.size)}
                                </p>
                                <span className="text-gray-300">•</span>
                              </>
                            )}
                            <p className="text-xs text-gray-500">
                              {formatDate(latestProfessorFile.uploaded_at)}
                            </p>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              Professor
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewFileClick(latestProfessorFile)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 cursor-pointer transition-colors"
                        >
                          <span className="text-lg">👁️</span>
                          View File
                        </button>
                        <button
                          onClick={() => handleDeleteFileClick(latestProfessorFile.id, localProfessorFiles.length - 1)}
                          className="px-3 py-2 bg-white text-red-600 text-sm rounded border border-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                          title="Delete file"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="w-full h-40 bg-white border-2 border-dashed border-green-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors p-4"
                  onClick={handleUploadClick}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <img src={Add} alt="Add" className="w-6 h-6" />
                  </div>
                  <p className="text-green-700 font-medium text-sm text-center">
                    {uploading ? 'Uploading...' : 'Upload files for student'}
                  </p>
                  <p className="text-green-600 text-xs mt-1 text-center">
                    Students can download these files
                  </p>
                </div>
              )}

              {/* All Professor Files List */}
              {localProfessorFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-3 text-sm">
                    All Professor's Files ({localProfessorFiles.length})
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {localProfessorFiles.map((file, index) => {
                      const isLatest = index === localProfessorFiles.length - 1;
                      return (
                        <div 
                          key={file.id || `prof-file-${index}`} 
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded ${isLatest ? 'bg-green-100' : 'bg-blue-100'}`}>
                              <span className={`${isLatest ? 'text-green-600' : 'text-blue-600'}`}>
                                📄
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p 
                                className="text-sm font-medium text-gray-800 truncate cursor-pointer hover:text-blue-600"
                                onClick={() => handleViewFileClick(file)}
                              >
                                {file.name || file.fileName || 'Unnamed file'}
                                {isLatest && (
                                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                    Latest
                                  </span>
                                )}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                {file.size && <span>{formatSize(file.size)}</span>}
                                {file.size && file.uploaded_at && <span>•</span>}
                                {file.uploaded_at && <span>{formatDate(file.uploaded_at)}</span>}
                                <span>•</span>
                                <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                                  Professor
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewFileClick(file)}
                              className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer px-2 py-1 hover:bg-blue-50 rounded"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteFileClick(file.id, index)}
                              className="text-red-600 hover:text-red-800 text-sm cursor-pointer px-2 py-1 hover:bg-red-50 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Student's Submission Section */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Student's Submission</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                  <span>Student's Uploaded Work</span>
                  {localStudentFiles.length > 0 && (
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                      {localStudentFiles.length} file{localStudentFiles.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </h4>
                
                {localStudentFiles.length > 0 ? (
                  <div className="space-y-3">
                    {/* Latest student file preview */}
                    {latestStudentFile && (
                      <>
                        <div 
                          className="cursor-pointer"
                          onClick={() => handleViewFileClick(latestStudentFile)}
                        >
                          {renderFilePreview(latestStudentFile)}
                        </div>
                        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {latestStudentFile.name || latestStudentFile.fileName || 'Student file'}
                            </p>
                            {latestStudentFile.uploaded_at && (
                              <p className="text-xs text-gray-500">
                                Submitted on {formatDate(latestStudentFile.uploaded_at)}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleViewFileClick(latestStudentFile)}
                            className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 cursor-pointer transition-colors whitespace-nowrap"
                          >
                            View File
                          </button>
                        </div>
                      </>
                    )}
                    
                    {/* All Student Files List */}
                    {localStudentFiles.length > 1 && (
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-700 mb-2 text-sm">
                          All Student Files ({localStudentFiles.length})
                        </h5>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                          {localStudentFiles.map((file, index) => {
                            const isLatest = index === localStudentFiles.length - 1;
                            return (
                              <div 
                                key={file.id || `student-file-${index}`} 
                                className="flex items-center justify-between bg-white p-2 rounded border border-blue-100 hover:bg-blue-50 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`p-1.5 rounded ${isLatest ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                    <span className={isLatest ? 'text-blue-600' : 'text-gray-600'}>
                                      📄
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p 
                                      className="text-xs font-medium text-gray-800 truncate cursor-pointer hover:text-blue-700"
                                      onClick={() => handleViewFileClick(file)}
                                    >
                                      {file.name || file.fileName || 'Student file'}
                                      {isLatest && (
                                        <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded-full">
                                          Latest
                                        </span>
                                      )}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      {file.size && <span>{formatSize(file.size)}</span>}
                                      {file.size && file.uploaded_at && <span>•</span>}
                                      {file.uploaded_at && <span>{formatDate(file.uploaded_at)}</span>}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleViewFileClick(file)}
                                  className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 hover:bg-blue-50 rounded"
                                >
                                  View
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <img src={FileIcon} alt="No file" className="w-6 h-6" />
                    </div>
                    <p className="text-blue-700 text-sm font-medium">No submission from student yet</p>
                    <p className="text-blue-600 text-xs mt-1">
                      The student has not uploaded any files for this activity.
                    </p>
                  </div>
                )}
              </div>

              {/* Statistics Box */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-medium text-green-900 mb-2">File Statistics</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-800">Professor Files:</span>
                    <span className="text-sm font-medium text-green-900">{localProfessorFiles.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-800">Student Files:</span>
                    <span className="text-sm font-medium text-green-900">{localStudentFiles.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-800">Total Files:</span>
                    <span className="text-sm font-medium text-green-900">
                      {localProfessorFiles.length + localStudentFiles.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Close
          </button>
          {latestProfessorFile && (
            <button
              onClick={() => handleViewFileClick(latestProfessorFile)}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 cursor-pointer transition-colors"
            >
              View Latest Professor File
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoManagement;