import React from 'react';
import SuccessIcon from '../assets/Success(Green).svg';

const ClassWorkSuccess = ({ 
  isOpen, 
  onClose,
  message = "Operation completed successfully!",
  type = "success" // Add type prop: "success" or "duplicate"
}) => {
  if (!isOpen) return null;

  const isDuplicate = type === "duplicate";

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overlay-fade p-3 sm:p-4 md:p-6">
      <div className="bg-white text-black rounded-lg shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md mx-2 sm:mx-4 p-4 sm:p-6 md:p-8 relative modal-pop">
        <div className="text-center">
          {/* Icon - Success or Warning */}
          {isDuplicate ? (
            <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full bg-red-100 mb-3 sm:mb-4">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full bg-green-100 mb-3 sm:mb-4">
              <img 
                src={SuccessIcon} 
                alt="Success" 
                className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8"
              />
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
            {isDuplicate ? "Duplicate Task Number" : "Success!"}
          </h3>
          
          {/* Message */}
          <div className={`mb-4 sm:mb-5 md:mb-6 ${isDuplicate ? 'text-sm text-gray-600 whitespace-pre-line' : 'text-xs sm:text-sm md:text-base text-gray-600 px-2 sm:px-0'}`}>
            {message}
          </div>

          {/* Button */}
          <button
            onClick={onClose}
            className={`w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 font-medium rounded-md transition-colors duration-200 cursor-pointer text-sm sm:text-base ${
              isDuplicate 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isDuplicate ? "OK" : "Continue"}
          </button>
        </div>
      </div>

      <style>{`
        .overlay-fade { 
          animation: overlayFade .18s ease-out both; 
        }
        @keyframes overlayFade { 
          from { opacity: 0 } 
          to { opacity: 1 } 
        }

        .modal-pop {
          transform-origin: top center;
          animation: popIn .22s cubic-bezier(.2,.8,.2,1) both;
        }
        @keyframes popIn {
          from { 
            opacity: 0; 
            transform: translateY(-8px) scale(.98); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1);    
          }
        }

        /* Mobile-specific optimizations */
        @media (max-width: 640px) {
          .modal-pop {
            margin: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ClassWorkSuccess;