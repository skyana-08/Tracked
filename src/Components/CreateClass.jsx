import React, { useState } from "react";
import ArrowDown from "../assets/ArrowDown(Light).svg";
import BackButton from "../assets/BackButton(Light).svg";

const CreateClass = ({ 
  show, 
  onClose, 
  onCreate, 
  onForceCreate,
  loading,
  formError,
  showDuplicateWarning,
  duplicateClassInfo,
  onCloseDuplicateWarning
}) => {
  const [selectedYearLevel, setSelectedYearLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");
  const [yearLevelDropdownOpen, setYearLevelDropdownOpen] = useState(false);

  const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  // Handle Enter key press in modal inputs
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  // Handle subject input change - convert to uppercase
  const handleSubjectChange = (e) => {
    setSubject(e.target.value.toUpperCase());
  };

  // Handle section input change - convert to uppercase and limit to one letter
  const handleSectionChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (value === '' || /^[A-Z]$/.test(value)) {
      setSection(value);
    }
  };

  const handleCreate = () => {
    if (!selectedYearLevel || !subject || !section) {
      return;
    }

    // Additional validation for section
    if (section.length !== 1 || !/^[A-Z]$/.test(section)) {
      return;
    }

    onCreate(selectedYearLevel, subject, section);
  };

  const resetForm = () => {
    setSelectedYearLevel("");
    setSubject("");
    setSection("");
    setYearLevelDropdownOpen(false);
  };

  // Close modal and reset form
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Close duplicate warning and reset form
  const handleCloseDuplicateWarning = () => {
    resetForm();
    onCloseDuplicateWarning();
  };

  // Handle force create
  const handleForceCreate = () => {
    onForceCreate(selectedYearLevel, subject, section);
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (yearLevelDropdownOpen && !event.target.closest('.year-level-dropdown')) {
        setYearLevelDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [yearLevelDropdownOpen]);

  if (!show && !showDuplicateWarning) return null;

  return (
    <>
      {/* Create Class Modal */}
      {show && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overlay-fade p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white text-black rounded-lg shadow-2xl w-full max-w-md p-6 sm:p-8 relative modal-pop max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <img
                src={BackButton}
                alt="Backbutton"
                className="w-5 h-5"
              />
            </button>

            <h2 className="text-xl sm:text-2xl font-bold mb-1 pr-10">
              Create Class
            </h2>
            <p className="text-sm text-gray-600 mb-4">Fill in the details to create a new class</p>
            <hr className="border-gray-200 mb-5" />

            {/* Error Message */}
            {formError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-5 text-sm">
                <p className="font-semibold">Error</p>
                <p>{formError}</p>
              </div>
            )}

            {/* Form */}
            <div className="space-y-5">
              {/* Year Level Dropdown */}
              <div className="relative year-level-dropdown">
                <label className="text-sm font-semibold mb-2 block text-gray-700">
                  Year Level <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setYearLevelDropdownOpen(!yearLevelDropdownOpen);
                  }}
                  className="w-full bg-white border-2 border-gray-300 text-black rounded-md px-4 py-3 flex items-center justify-between hover:border-[#00874E] focus:border-[#00874E] focus:outline-none transition-colors cursor-pointer"
                >
                  <span className={`text-sm ${!selectedYearLevel ? 'text-gray-500' : ''}`}>
                    {selectedYearLevel || "Select Year Level"}
                  </span>
                  <img 
                    src={ArrowDown} 
                    alt="" 
                    className={`h-4 w-4 transition-transform ${yearLevelDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                {yearLevelDropdownOpen && (
                  <div className="absolute top-full mt-1 w-full bg-white rounded-md shadow-xl border border-gray-200 z-10 overflow-hidden">
                    {yearLevels.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => {
                          setSelectedYearLevel(year);
                          setYearLevelDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Subject Input */}
              <div>
                <label className="text-sm font-semibold mb-2 block text-gray-700">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter subject name"
                  value={subject}
                  onChange={handleSubjectChange}
                  onKeyPress={handleKeyPress}
                  className="w-full border-2 border-gray-300 rounded-md px-4 py-3 outline-none text-sm focus:border-[#00874E] transition-colors uppercase"
                />
              </div>

              {/* Section Input */}
              <div>
                <label className="text-sm font-semibold mb-2 block text-gray-700">
                  Section <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter section (A-Z)"
                  value={section}
                  onChange={handleSectionChange}
                  onKeyPress={handleKeyPress}
                  maxLength={1}
                  className="w-full border-2 border-gray-300 rounded-md px-4 py-3 outline-none text-sm focus:border-[#00874E] transition-colors uppercase"
                />
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreate}
                disabled={loading || !selectedYearLevel || !subject || !section || section.length !== 1}
                className={`w-full ${
                  (loading || !selectedYearLevel || !subject || !section || section.length !== 1) 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#00A15D] hover:bg-[#00874E] cursor-pointer'
                } text-white font-bold py-3 rounded-md transition-all duration-200 text-base flex items-center justify-center gap-2`}
              >
                {loading && (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                )}
                {loading ? 'Creating...' : 'Create Class'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Class Warning Modal */}
      {showDuplicateWarning && duplicateClassInfo && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overlay-fade p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseDuplicateWarning();
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white text-black rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 relative modal-pop">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.282 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Class Already Exists
              </h3>
              
              <div className="mt-4 mb-6">
                <p className="text-sm text-gray-600 mb-3">
                  A class with the same details already exists:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <p className="text-sm font-semibold text-gray-700">Existing Class:</p>
                  <div className="mt-2 p-3 rounded border" style={{ backgroundColor: duplicateClassInfo.bgColor }}>
                    <p className="text-base font-bold text-gray-900">
                      {duplicateClassInfo.subject} - {duplicateClassInfo.section}
                    </p>
                    <p className="text-sm text-gray-700">
                      Year Level: {duplicateClassInfo.year_level}
                    </p>
                    <p className="text-sm text-gray-700">
                      Subject Code: {duplicateClassInfo.subject_code}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Note: Creating duplicate classes with the same details is not recommended.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCloseDuplicateWarning}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-md transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleForceCreate}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-md transition-all duration-200 cursor-pointer"
                >
                  Create Anyway
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
    </>
  );
};

export default CreateClass;