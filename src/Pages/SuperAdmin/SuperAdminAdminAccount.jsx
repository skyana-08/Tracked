import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";

import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";

import ClassManagementLight from "../../assets/ClassManagement(Light).svg";
import BackButton from "../../assets/BackButton(Light).svg";
import ArrowDown from "../../assets/ArrowDown(Light).svg";
import Search from "../../assets/Search.svg";
import Details from "../../assets/Details(Light).svg";
import Kick from "../../assets/Kick.svg";
import KickWarningIcon from "../../assets/Warning(Red).svg";
import BackupIcon from "../../assets/Backup(Light).svg";
import RestoreIcon from "../../assets/Restore(Light).svg"; 

// Import the Lottie animation JSON file
import loadingAnimation from "../../assets/system-regular-716-spinner-three-dots-loop-expand.json";

export default function SuperAdminAdminAccount() {
  const [isOpen, setIsOpen] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showKickModal, setShowKickModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [admins, setAdmins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // New state for backup/restore modals
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [backupModalContent, setBackupModalContent] = useState(null);
  const [restoreModalContent, setRestoreModalContent] = useState(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Lottie animation options
  const defaultLottieOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  // Fetch admins from backend
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = () => {
    setLoading(true);
    fetch("https://tracked.6minds.site/SuperAdmin/SuperAdminDB/get_admins.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAdmins(data.admins || []);
        } else {
          console.error("Error fetching admins:", data.message);
          setAdmins([]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  // Backup function
  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      const response = await fetch("https://tracked.6minds.site/SuperAdmin/SuperAdminDB/backup_admins.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const filename = `admins_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setBackupModalContent({
          type: 'success',
          title: 'Backup Successful',
          message: `Backup created and downloaded to your computer!`,
          filename: filename
        });
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Backup failed');
      }
    } catch (error) {
      console.error("Error creating backup:", error);
      setBackupModalContent({
        type: 'error',
        title: 'Backup Failed',
        message: error.message || 'Network error during backup. Please check if the server is running.'
      });
    } finally {
      setIsBackingUp(false);
      setShowBackupModal(true);
    }
  };

  // Restore function
  const handleRestore = async () => {
    setRestoreModalContent({
      type: 'confirmation',
      title: 'Confirm Restore',
      message: 'Are you sure you want to restore admin accounts from the latest backup? This will overwrite existing data.',
      confirmText: 'Restore',
      cancelText: 'Cancel'
    });
    setShowRestoreModal(true);
  };

  const confirmRestore = async () => {
    setIsRestoring(true);
    setShowRestoreModal(false);
    
    try {
      const response = await fetch("https://tracked.6minds.site/SuperAdmin/SuperAdminDB/restore_admins.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setRestoreModalContent({
          type: 'success',
          title: 'Restore Successful',
          message: `Admins restored successfully!`,
          filename: data.filename
        });
        fetchAdmins();
      } else {
        setRestoreModalContent({
          type: 'error',
          title: 'Restore Failed',
          message: data.message
        });
      }
    } catch (error) {
      console.error("Error restoring backup:", error);
      setRestoreModalContent({
        type: 'error',
        title: 'Network Error',
        message: 'Network error during restore. Please check if the server is running.'
      });
    } finally {
      setIsRestoring(false);
      setShowRestoreModal(true);
    }
  };

  // Close backup modal
  const closeBackupModal = () => {
    setShowBackupModal(false);
    setBackupModalContent(null);
  };

  // Close restore modal
  const closeRestoreModal = () => {
    setShowRestoreModal(false);
    setRestoreModalContent(null);
  };

  // Filter admins based on selected filter and search term
  const filteredAdmins = admins.filter(admin => {
    if (selectedFilter !== "All" && admin.tracked_Status !== selectedFilter) {
      return false;
    }

    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      const fullName = `${admin.tracked_firstname} ${admin.tracked_middlename} ${admin.tracked_lastname}`.toLowerCase();
      const adminId = admin.tracked_ID?.toLowerCase();
      const email = admin.tracked_email?.toLowerCase();

      if (!fullName.includes(searchLower) && 
          !adminId.includes(searchLower) && 
          !email.includes(searchLower)) {
        return false;
      }
    }

    return true;
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Pagination setup
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleKickClick = (admin) => {
    setSelectedAdmin(admin);
    setShowKickModal(true);
  };

  const confirmKick = () => {
    console.log("Kicking admin:", selectedAdmin);
    setShowKickModal(false);
    setSelectedAdmin(null);
  };

  return (
    <div>
      <Sidebar role="superadmin" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={`transition-all duration-300 ${
          isOpen ? "lg:ml-[250px] xl:ml-[280px] 2xl:ml-[300px]" : "ml-0"
        }`}
      >
        <Header setIsOpen={setIsOpen} isOpen={isOpen} />

        {/* content of ADMIN USER MANAGEMENT PROFESSOR ACCOUNT LIST */}
        <div className="p-4 sm:p-5 md:p-6 lg:p-8">
          {/* "Header" */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center mb-2">
              <img
                src={ClassManagementLight}
                alt="ClassManagement"
                className="h-6 w-6 sm:h-7 sm:w-7 mr-3"
              />
              <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl text-[#465746]">
                User Management
              </h1>
            </div>
            <div className="flex items-center justify-between text-sm sm:text-base lg:text-lg text-[#465746]">
              <span>Admin Account Administration</span>
              <Link to="/SuperAdminAccountList">
                <img
                  src={BackButton}
                  alt="BackButton"
                  className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 hover:opacity-70 transition-opacity"
                />
              </Link>
            </div>
          </div>

          <hr className="border-[#465746]/30 mb-5 sm:mb-6" />

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="w-24 h-24 mb-4">
                <Lottie 
                  {...defaultLottieOptions}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <p className="text-[#465746] text-lg font-medium">Loading admins...</p>
            </div>
          )}

          {!loading && (
            <>
              {/* BUTTONS - New Responsive Layout */}
              <div className="flex flex-col lg:flex-row text-[#465746] gap-3 sm:gap-4">
                {/* Left side: Filter Dropdown */}
                <div className="flex flex-col gap-3 flex-shrink-0">
                  {/* Spacer div to push filter down on desktop */}
                  <div className="hidden lg:block h-[42px]"></div>
                  
                  <div className="relative">
                    <button
                      onClick={() => setOpen(!open)}
                      className="flex items-center justify-between font-bold px-3 sm:px-4 py-2 bg-[#fff] rounded-md w-28 sm:w-36 lg:w-40 h-9 sm:h-10 lg:h-11 shadow-md border-2 border-transparent hover:border-[#00874E] text-xs sm:text-sm lg:text-base transition-all duration-200 cursor-pointer"
                    >
                      <span>Filter</span>
                      <img
                        src={ArrowDown}
                        alt="ArrowDown"
                        className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ml-2"
                      />
                    </button>

                    {open && (
                      <div className="absolute top-full mt-1 bg-white rounded-md w-28 sm:w-36 lg:w-40 shadow-lg border border-gray-200 z-10">
                        {["All", "Active", "Deactivated"].map((f) => (
                          <button
                            key={f}
                            className="block px-3 sm:px-4 py-2 w-full text-left hover:bg-gray-100 text-xs sm:text-sm lg:text-base transition-colors duration-200 cursor-pointer"
                            onClick={() => {
                              setSelectedFilter(f);
                              setOpen(false);
                              setCurrentPage(1);
                            }}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: Backup/Restore buttons and Search Bar */}
                <div className="flex-1 flex flex-col gap-3">
                  {/* Backup and Restore Buttons Row */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 lg:justify-end h-9 sm:h-10 lg:h-[42px]">
                    {/* Backup Button with Icon and Lighter Green Background */}
                    <button 
                      onClick={handleBackup}
                      disabled={isBackingUp}
                      className={`font-bold px-3 sm:px-4 py-2 bg-[#4CAF50] text-white rounded-md shadow-md border-2 border-transparent hover:bg-[#45a049] hover:border-[#00874E] text-xs sm:text-sm lg:text-base transition-all duration-200 cursor-pointer flex items-center justify-center min-w-[100px] sm:min-w-[110px] ${
                        isBackingUp ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isBackingUp ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 mr-2">
                            <Lottie 
                              {...defaultLottieOptions}
                              style={{ width: '100%', height: '100%' }}
                            />
                          </div>
                          Backing up...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <img 
                            src={BackupIcon} 
                            alt="Backup" 
                            className="h-4 w-4 sm:h-5 sm:w-5 mr-2" 
                          />
                          Backup
                        </div>
                      )}
                    </button>

                    {/* Restore Button with Icon and Lighter Green Background */}
                    <button 
                      onClick={handleRestore}
                      disabled={isRestoring}
                      className={`font-bold px-3 sm:px-4 py-2 bg-[#4CAF50] text-white rounded-md shadow-md border-2 border-transparent hover:bg-[#45a049] hover:border-[#00874E] text-xs sm:text-sm lg:text-base transition-all duration-200 cursor-pointer flex items-center justify-center min-w-[100px] sm:min-w-[110px] ${
                        isRestoring ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isRestoring ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 mr-2">
                            <Lottie 
                              {...defaultLottieOptions}
                              style={{ width: '100%', height: '100%' }}
                            />
                          </div>
                          Restoring...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <img 
                            src={RestoreIcon} 
                            alt="Restore" 
                            className="h-4 w-4 sm:h-5 sm:w-5 mr-2" 
                          />
                          Restore
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Search Bar Row */}
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search by name, admin ID, or email..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full h-9 sm:h-10 lg:h-11 rounded-md px-3 py-2 pr-10 shadow-md outline-none text-[#465746] bg-white text-xs sm:text-sm border-2 border-transparent focus:border-[#00874E] transition-all duration-200"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                      {searchTerm && (
                        <button
                          onClick={handleClearSearch}
                          className="text-gray-500 hover:text-[#465746] mr-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      <button className="text-gray-500 hover:text-[#465746]">
                        <img
                          src={Search}
                          alt="Search"
                          className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="mt-4 sm:mt-5">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-y-2 sm:border-spacing-y-3 text-xs sm:text-sm lg:text-base">
                    <thead>
                      <tr className="text-[#465746] font-bold">
                        <th className="py-2 px-2 sm:px-3">Admin No.</th>
                        <th className="py-2 px-2 sm:px-3">Full Name</th>
                        <th className="py-2 px-2 sm:px-3">Email</th>
                        <th className="py-2 px-2 sm:px-3">Status</th>
                        <th className="py-2 px-2 sm:px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#465746]">
                      {currentAdmins.map((admin) => (
                        <tr
                          key={admin.tracked_ID}
                          className="bg-[#fff] rounded-lg shadow hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="py-3 px-2 sm:px-3 rounded-l-lg">{admin.tracked_ID}</td>
                          <td className="py-3 px-2 sm:px-3">
                            {admin.tracked_firstname} {admin.tracked_middlename} {admin.tracked_lastname}
                          </td>
                          <td className="py-3 px-2 sm:px-3 break-all sm:break-normal">
                            {admin.tracked_email}
                          </td>
                          <td
                            className={`py-3 px-2 sm:px-3 font-bold ${
                              admin.tracked_Status === "Active"
                                ? "text-[#00A15D]"
                                : "text-[#FF6666]"
                            }`}
                          >
                            {admin.tracked_Status}
                          </td>
                          <td className="py-3 px-2 sm:px-3 rounded-r-lg">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleKickClick(admin)}
                                className="hover:opacity-70 transition-opacity"
                              >
                                <img
                                  src={Kick}
                                  alt="Kick"
                                  className="h-5 w-5 sm:h-6 sm:w-6"
                                />
                              </button>
                              <Link to={`/SuperAdminAdminAccountDetails?id=${admin.tracked_ID}`}>
                                <img
                                  src={Details}
                                  alt="Details"
                                  className="h-5 w-5 sm:h-6 sm:w-6 hover:opacity-70 transition-opacity"
                                />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {currentAdmins.map((admin, i) => (
                    <div
                      key={admin.tracked_ID}
                      className="bg-white rounded-lg shadow p-4 text-[#465746]"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            No. {indexOfFirst + i + 1} | Admin No.
                          </p>
                          <p className="font-semibold text-sm">{admin.tracked_ID}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleKickClick(admin)}
                            className="hover:opacity-70 transition-opacity"
                          >
                            <img src={Kick} alt="Kick" className="h-5 w-5" />
                          </button>
                          <Link to={`/SuperAdminAdminAccountDetails?id=${admin.tracked_ID}`}>
                            <img src={Details} alt="Details" className="h-5 w-5" />
                          </Link>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500">Full Name</p>
                          <p className="font-medium text-sm">
                            {admin.tracked_firstname} {admin.tracked_lastname}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm break-all">{admin.tracked_email}</p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <p
                            className={`font-bold text-sm ${
                              admin.tracked_Status === "Active"
                                ? "text-[#00A15D]"
                                : "text-[#FF6666]"
                            }`}
                          >
                            {admin.tracked_Status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* No results message */}
                {currentAdmins.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm || selectedFilter !== "All" 
                      ? "No admins found matching the current filters." 
                      : "No admins found."}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap justify-center mt-5 sm:mt-6 gap-2">
                    {/* Previous Button */}
                    {currentPage > 1 && (
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md shadow-md bg-white text-[#465746] hover:bg-gray-100 font-medium text-xs sm:text-sm transition-colors duration-200"
                      >
                        Previous
                      </button>
                    )}

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md shadow-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                              currentPage === pageNum
                                ? "bg-[#00874E] text-white"
                                : "bg-white text-[#465746] hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                        </button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return (
                          <span key={pageNum} className="px-2 py-1.5 sm:py-2 text-[#465746]">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}

                    {/* Next Button */}
                    {currentPage < totalPages && (
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md shadow-md bg-white text-[#465746] hover:bg-gray-100 font-medium text-xs sm:text-sm transition-colors duration-200"
                      >
                        Next
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Kick Confirmation POPUP */}
          {showKickModal && selectedAdmin && (
            <div
              className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overlay-fade p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowKickModal(false);
                  setSelectedAdmin(null);
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
                      src={KickWarningIcon} 
                      alt="Warning" 
                      className="h-8 w-8" 
                    />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Kick Admin?
                  </h3>
                  
                  <div className="mt-4 mb-6">
                    <p className="text-sm text-gray-600 mb-3">
                      Are you sure you want to kick this admin account? This action cannot be undone.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 text-left">
                      <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                        {selectedAdmin.tracked_firstname} {selectedAdmin.tracked_lastname}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        ID: {selectedAdmin.tracked_ID}
                      </p>
                      <p className="text-sm text-gray-600">
                        Email: {selectedAdmin.tracked_email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        setShowKickModal(false);
                        setSelectedAdmin(null);
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-md transition-all duration-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmKick}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition-all duration-200 cursor-pointer"
                    >
                      Kick
                    </button>
                  </div>
                </div>
              </div>

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
          )}

          {/* Backup Modal */}
          {showBackupModal && (
            <div
              className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overlay-fade p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  closeBackupModal();
                }
              }}
              role="dialog"
              aria-modal="true"
            >
              <div className="bg-white text-black rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 relative modal-pop">
                <div className="text-center">
                  <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${
                    backupModalContent?.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                  } mb-4`}>
                    <img 
                      src={backupModalContent?.type === 'success' ? BackupIcon : KickWarningIcon} 
                      alt={backupModalContent?.type} 
                      className="h-8 w-8" 
                    />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {backupModalContent?.title}
                  </h3>
                  
                  <div className="mt-4 mb-6">
                    <p className="text-sm text-gray-600 mb-3">
                      {backupModalContent?.message}
                    </p>
                    {backupModalContent?.filename && (
                      <div className="bg-gray-50 rounded-lg p-4 text-left">
                        <p className="text-sm text-gray-600">
                          File: {backupModalContent.filename}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={closeBackupModal}
                      className={`flex-1 ${
                        backupModalContent?.type === 'success' 
                          ? 'bg-[#00A15D] hover:bg-[#00874E]' 
                          : 'bg-[#FF6666] hover:bg-[#FF5555]'
                      } text-white font-bold py-3 rounded-md transition-all duration-200 cursor-pointer`}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Restore Modal */}
          {showRestoreModal && (
            <div
              className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overlay-fade p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  closeRestoreModal();
                }
              }}
              role="dialog"
              aria-modal="true"
            >
              <div className="bg-white text-black rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 relative modal-pop">
                <div className="text-center">
                  {restoreModalContent?.type === 'confirmation' ? (
                    <>
                      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                        <img 
                          src={KickWarningIcon} 
                          alt="Warning" 
                          className="h-8 w-8" 
                        />
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        {restoreModalContent?.title}
                      </h3>
                      
                      <div className="mt-4 mb-6">
                        <p className="text-sm text-gray-600 mb-3">
                          {restoreModalContent?.message}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={closeRestoreModal}
                          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-md transition-all duration-200 cursor-pointer"
                        >
                          {restoreModalContent?.cancelText || 'Cancel'}
                        </button>
                        <button
                          onClick={confirmRestore}
                          className="flex-1 bg-[#00A15D] hover:bg-[#00874E] text-white font-bold py-3 rounded-md transition-all duration-200 cursor-pointer"
                        >
                          {restoreModalContent?.confirmText || 'Restore'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${
                        restoreModalContent?.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                      } mb-4`}>
                        <img 
                          src={restoreModalContent?.type === 'success' ? RestoreIcon : KickWarningIcon} 
                          alt={restoreModalContent?.type} 
                          className="h-8 w-8" 
                        />
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        {restoreModalContent?.title}
                      </h3>
                      
                      <div className="mt-4 mb-6">
                        <p className="text-sm text-gray-600 mb-3">
                          {restoreModalContent?.message}
                        </p>
                        {restoreModalContent?.filename && (
                          <div className="bg-gray-50 rounded-lg p-4 text-left">
                            <p className="text-sm text-gray-600">
                              File: {restoreModalContent.filename}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={closeRestoreModal}
                          className={`flex-1 ${
                            restoreModalContent?.type === 'success' 
                              ? 'bg-[#00A15D] hover:bg-[#00874E]' 
                              : 'bg-[#FF6666] hover:bg-[#FF5555]'
                          } text-white font-bold py-3 rounded-md transition-all duration-200 cursor-pointer`}
                        >
                          OK
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}