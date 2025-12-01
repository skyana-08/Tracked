import React from 'react';
import WarningIcon from '../assets/Warning(Yellow).svg';

const DuplicateClassWarning = ({ 
  show, 
  onClose, 
  onConfirm, 
  duplicateClassInfo 
}) => {
  if (!show || !duplicateClassInfo) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overlay-fade p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-black rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 relative modal-pop">
        <div className="text-center">
          {/* Warning Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <img 
              src={WarningIcon} 
              alt="Warning" 
              className="h-8 w-8"
            />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Class Already Exists!
          </h3>
          
          <div className="mb-6 text-left">
            <p className="text-gray-600 mb-4">
              You already have a class with the same details:
            </p>
            
            {/* Show existing class details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-3">
                <div 
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: duplicateClassInfo.bgColor }}
                ></div>
                <span className="font-semibold">Existing Class</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Year Level:</span>
                  <p className="font-semibold">{duplicateClassInfo.year_level}</p>
                </div>
                <div>
                  <span className="text-gray-500">Section:</span>
                  <p className="font-semibold">{duplicateClassInfo.section}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Subject:</span>
                  <p className="font-semibold truncate">{duplicateClassInfo.subject}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Subject Code:</span>
                  <p className="font-semibold text-[#00874E]">{duplicateClassInfo.subject_code}</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Do you want to create another class with the same year level, subject, and section?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-md transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-[#00A15D] hover:bg-[#00874E] text-white font-bold py-3 rounded-md transition-all duration-200 cursor-pointer"
            >
              Create Anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateClassWarning;