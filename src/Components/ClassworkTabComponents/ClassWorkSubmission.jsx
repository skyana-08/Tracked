import React, { useState, useEffect, useRef } from 'react';
import ArrowDown from "../../assets/ArrowDown(Light).svg";
import Photo from "../../assets/Photo.svg";
import FolderGreen from "../../assets/Photo(Green).svg";
import EmailIcon from "../../assets/Email(Light).svg";
import Close from "../../assets/Close.svg";
import Cross from "../../assets/Cross(Light).svg";
import DetailsIcon from "../../assets/Details(Light).svg";
import ClockIcon from "../../assets/Deadline.svg";

import StudentActivitiesDetails from '../StudentActivitiesDetails';
import PhotoManagement from '../PhotoManagement';

const ClassWorkSubmission = ({ 
  activity, 
  isOpen, 
  onClose, 
  onSave,
  professorName
}) => {
  console.log('ClassWorkSubmission rendering with:', {
    activityId: activity?.id,
    studentsCount: activity?.students?.length,
    isOpen: isOpen
  });

  const [filter, setFilter] = useState("All");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [localStudents, setLocalStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [setStudentUploadedFiles] = useState({});
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [instructionExpanded, setInstructionExpanded] = useState(false);
  const [activeView, setActiveView] = useState('students');
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedStudentForPhoto, setSelectedStudentForPhoto] = useState(null);
  const [viewingPhoto] = useState(null);
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // File Upload States
  const [uploadedFilesList, setUploadedFilesList] = useState({});
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  
  const scrollContainerRef = useRef(null);

  // Localhost configuration
  const BACKEND_URL = 'https://tracked.6minds.site/Professor/SubjectDetailsDB';

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Clean up dynamically created file inputs
  useEffect(() => {
    return () => {
      const fileInputs = document.querySelectorAll('input[type="file"].dynamic-file-input');
      fileInputs.forEach(input => {
        if (input.parentNode) {
          input.parentNode.removeChild(input);
        }
      });
    };
  }, []);

  // ===========================
  // FETCH SAVED GRADES FUNCTION
  // ===========================
  
  // Fetch saved grades from database
  const fetchSavedGrades = async () => {
    if (!activity?.id) return;
    
    try {
      const response = await fetch(
        `${BACKEND_URL}/get_activity_grades.php?activity_id=${activity.id}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      console.log('Fetched grades from database:', result);
      
      if (result.success && result.grades && Array.isArray(result.grades)) {
        const gradeMap = {};
        result.grades.forEach(grade => {
          gradeMap[grade.student_ID] = {
            grade: grade.grade !== null ? grade.grade.toString() : '',
            submitted: grade.submitted === 1,
            late: grade.late === 1,
            submitted_at: grade.submitted_at,
            uploaded_file_url: grade.uploaded_file_url,
            uploaded_file_name: grade.uploaded_file_name
          };
        });
        
        // Update localStudents with saved grades
        const updatedStudents = activity.students.map(student => {
          const savedGrade = gradeMap[student.user_ID];
          
          if (savedGrade) {
            return {
              ...student,
              grade: savedGrade.grade,
              submitted: savedGrade.submitted,
              late: savedGrade.late,
              submitted_file: savedGrade.uploaded_file_url || student.submitted_file,
              uploaded_file_url: savedGrade.uploaded_file_url,
              uploaded_file_name: savedGrade.uploaded_file_name
            };
          } else {
            return student;
          }
        });
        
        setLocalStudents(updatedStudents);
        
      } else {
        console.log('No saved grades found in database, using initial activity data');
        setLocalStudents([...activity.students]);
      }
    } catch (error) {
      console.error('Error fetching saved grades:', error);
      setLocalStudents([...activity.students]);
    }
  };

  const uploadFileToServer = async (file, studentId, uploadedBy = 'professor') => {
    if (!file) {
      console.error('No file provided');
      return null;
    }

    setIsUploadingFile(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('activity_id', activity.id);
      formData.append('student_id', studentId);
      formData.append('uploaded_by', uploadedBy);

      console.log('Uploading file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        activityId: activity.id,
        studentId: studentId,
        uploadedBy: uploadedBy
      });

      const response = await fetch(`${BACKEND_URL}/upload-file.php`, {
        method: 'POST',
        body: formData
      });

      const responseText = await response.text();
      
      console.log('Response status:', response.status);
      console.log('Response text:', responseText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Parsed JSON result:', result);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned invalid JSON response');
      }
      
      if (result.success) {
        // IMPORTANT: Create the file object with all necessary properties
        const newFile = {
          id: result.file?.id || Date.now(),
          name: result.file?.original_name || file.name,
          fileName: result.file?.file_name || file.name,
          url: result.file?.file_url || result.file?.url || result.url,
          size: result.file?.size || file.size,
          type: result.file?.type || file.type,
          uploaded_at: result.file?.uploaded_at || new Date().toISOString(),
          uploadedBy: uploadedBy
        };

        console.log('Created file object:', newFile);

        // CRITICAL: Update the uploadedFilesList state immediately
        setUploadedFilesList(prev => {
          const currentFiles = prev[studentId] || { professor: [], student: [], all: [] };
          
          // Create updated files object
          const updatedFiles = {
            professor: uploadedBy === 'professor' 
              ? [...currentFiles.professor, newFile] 
              : currentFiles.professor,
            student: uploadedBy === 'student' 
              ? [...currentFiles.student, newFile] 
              : currentFiles.student,
            all: [...currentFiles.all, newFile]
          };
          
          console.log('Updated files for student', studentId, ':', updatedFiles);
          
          return {
            ...prev,
            [studentId]: updatedFiles
          };
        });

        // Also update studentUploadedFiles for backward compatibility
        if (uploadedBy === 'student') {
          setStudentUploadedFiles(prev => ({
            ...prev,
            [studentId]: newFile
          }));
        }

        // Refresh from server to ensure consistency
        setTimeout(() => {
          fetchUploadedFiles(studentId);
        }, 100);

        return newFile;
      } else {
        throw new Error(result.message || result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file: ' + error.message);
      return null;
    } finally {
      setIsUploadingFile(false);
    }
  };

  // Fetch uploaded files for a student
  const fetchUploadedFiles = async (studentId) => {
    try {
      console.log('Fetching files for student', studentId);
      
      const response = await fetch(
        `${BACKEND_URL}/get-uploaded-files.php?activity_id=${activity.id}&student_id=${studentId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        throw new Error('Invalid JSON response');
      }
      
      console.log('Fetched files for student', studentId, ':', result);
      
      if (result.success && result.files) {
        // Organize files by type
        const filesMap = {
          professor: [],
          student: [],
          all: []
        };
        
        result.files.forEach(file => {
          const fileObj = {
            id: file.id,
            name: file.original_name || file.file_name,
            fileName: file.file_name,
            url: file.file_url || file.url,
            size: file.file_size,
            type: file.file_type,
            uploaded_at: file.uploaded_at,
            uploadedBy: file.uploaded_by || 'professor'
          };
          
          filesMap.all.push(fileObj);
          if (file.uploaded_by === 'professor') {
            filesMap.professor.push(fileObj);
          } else if (file.uploaded_by === 'student') {
            filesMap.student.push(fileObj);
          }
        });
        
        console.log('Setting files for student', studentId, ':', filesMap);
        
        // Use functional update to avoid state corruption
        setUploadedFilesList(prev => {
          const newState = {
            ...prev,
            [studentId]: filesMap
          };
          console.log('New uploadedFilesList state:', newState);
          return newState;
        });
        
        // Also update studentUploadedFiles for backward compatibility
        if (filesMap.student.length > 0) {
          setStudentUploadedFiles(prev => {
            const newState = {
              ...prev,
              [studentId]: filesMap.student[0] // Take the latest student file
            };
            console.log('New studentUploadedFiles state:', newState);
            return newState;
          });
        }
      } else {
        console.log('No files found for student', studentId);
        // Set empty structure for this student
        setUploadedFilesList(prev => ({
          ...prev,
          [studentId]: {
            professor: [],
            student: [],
            all: []
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching uploaded files for student', studentId, ':', error);
      // Set empty structure on error
      setUploadedFilesList(prev => ({
        ...prev,
        [studentId]: {
          professor: [],
          student: [],
          all: []
        }
      }));
    }
  };

  // Fetch all uploaded files for this activity
  const fetchAllUploadedFiles = async () => {
    try {
      console.log('Fetching all uploaded files for activity:', activity.id);
      
      const response = await fetch(
        `${BACKEND_URL}/get-uploaded-files.php?activity_id=${activity.id}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log('Raw response for all files:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        throw new Error('Invalid JSON response');
      }
      
      console.log('All files result:', result);
      
      if (result.success && result.files) {
        const filesMap = {};
        result.files.forEach(file => {
          const studentId = file.student_id;
          if (!filesMap[studentId]) {
            filesMap[studentId] = {
              professor: [],
              student: [],
              all: []
            };
          }
          
          const fileObj = {
            id: file.id,
            name: file.original_name || file.file_name,
            fileName: file.file_name,
            url: file.file_url || file.url,
            size: file.file_size,
            type: file.file_type,
            uploaded_at: file.uploaded_at,
            uploadedBy: file.uploaded_by || 'professor'
          };
          
          filesMap[studentId].all.push(fileObj);
          if (file.uploaded_by === 'professor') {
            filesMap[studentId].professor.push(fileObj);
          } else if (file.uploaded_by === 'student') {
            filesMap[studentId].student.push(fileObj);
          }
        });
        
        console.log('Setting all uploaded files:', filesMap);
        setUploadedFilesList(filesMap);
        
        // Update studentUploadedFiles
        const studentFiles = {};
        Object.keys(filesMap).forEach(studentId => {
          if (filesMap[studentId]?.student?.length > 0) {
            studentFiles[studentId] = filesMap[studentId].student[0];
          }
        });
        setStudentUploadedFiles(studentFiles);
      } else {
        console.log('No files found in database');
        // Initialize with empty structure if no files
        setUploadedFilesList({});
        setStudentUploadedFiles({});
      }
    } catch (error) {
      console.error('Error loading uploaded files:', error);
      setUploadedFilesList({});
      setStudentUploadedFiles({});
    }
  };

  // Delete uploaded file
  const handleDeleteFile = async (fileId, studentId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/delete-file.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_id: fileId })
      });

      const responseText = await response.text();
      console.log('Delete response:', responseText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        if (responseText.toLowerCase().includes('success')) {
          result = { success: true, message: 'File deleted successfully' };
        } else {
          throw new Error('Server returned invalid response');
        }
      }
      
      if (result.success) {
        // Remove from local state - FIXED VERSION
        setUploadedFilesList(prev => {
          const studentFiles = prev[studentId];
          if (studentFiles) {
            const updatedFiles = {
              professor: studentFiles.professor.filter(file => file.id !== fileId),
              student: studentFiles.student.filter(file => file.id !== fileId),
              all: studentFiles.all.filter(file => file.id !== fileId)
            };
            
            return {
              ...prev,
              [studentId]: updatedFiles
            };
          }
          return prev;
        });
        
        // Force a refresh
        fetchUploadedFiles(studentId);
        
        alert('File deleted successfully');
      } else {
        alert('Error deleting file: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file. Please try again. Error: ' + error.message);
    }
  };

  useEffect(() => {
    if (activity && activity.students) {
      console.log('Fetching files for activity:', activity.id);
      fetchSavedGrades();
      fetchAllUploadedFiles();
      
      if (isMobile && activity.students.length > 0 && !selectedStudent) {
        const firstStudent = activity.students[0];
        setSelectedStudent({ 
          id: firstStudent.user_ID, 
          name: firstStudent.user_Name 
        });
      }
    }
  }, [activity, isMobile, refreshTrigger]);

  useEffect(() => {
    if (isMobile && selectedStudent && scrollContainerRef.current) {
      setActiveView('analytics');
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            left: scrollContainerRef.current.scrollWidth / 2,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [selectedStudent, isMobile]);

  // ===========================
  // PHOTO MANAGEMENT FUNCTIONS
  // ===========================

  // Format file size helper function
  const formatFileSize = (bytes) => {
    if (bytes === 0 || bytes === undefined || bytes === null) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle view specific file
  const handleViewFile = (file) => {
    if (file?.url) {
      window.open(file.url, '_blank', 'noopener,noreferrer');
    } else {
      alert('No file URL available');
    }
  };

  const handleProfessorFileUpload = async (studentId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.multiple = false;
    input.className = 'dynamic-file-input';
    input.style.display = 'none';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) {
        if (input.parentNode) {
          input.parentNode.removeChild(input);
        }
        return;
      }

      if (file.size > 25 * 1024 * 1024) {
        alert('File size must be less than 25MB');
        if (input.parentNode) {
          input.parentNode.removeChild(input);
        }
        return;
      }

      try {
        console.log('Starting file upload for student:', studentId);
        const uploadedFile = await uploadFileToServer(file, studentId, 'professor');
        if (uploadedFile) {
          console.log('File uploaded successfully:', uploadedFile);
          
          // Show success message but don't close the modal
          alert('File uploaded successfully!');
          
          // Force a refresh of the files for this student
          await fetchUploadedFiles(studentId);
          
          // Also refresh all files
          fetchAllUploadedFiles();
          
          // Force a re-render by updating a dummy state
          setRefreshTrigger(prev => prev + 1);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Upload failed: ' + error.message);
      } finally {
        if (input.parentNode) {
          input.parentNode.removeChild(input);
        }
      }
    };
    
    document.body.appendChild(input);
    input.click();
  };

  const filterOptions = [
    "All",
    "Assigned",
    "Submitted",
    "Missed",
    "Graded",
    "Not Graded"
  ];

  const calculateStudentStatus = (student, activity) => {
    const currentTime = new Date();
    const activityDeadline = activity.deadline ? new Date(activity.deadline) : null;
    
    if (student.submitted) {
      return 'Submitted';
    } else if (activityDeadline && activityDeadline < currentTime) {
      return 'Missed';
    } else {
      return 'Assigned';
    }
  };

  const statusCounts = {
    assigned: localStudents.filter(student => calculateStudentStatus(student, activity) === 'Assigned').length,
    submitted: localStudents.filter(student => 
      calculateStudentStatus(student, activity) === 'Submitted'
    ).length,
    missed: localStudents.filter(student => calculateStudentStatus(student, activity) === 'Missed').length
  };

  const filteredStudents = localStudents.filter(student => {
    const status = calculateStudentStatus(student, activity);
    
    switch (filter) {
      case "Assigned":
        return status === 'Assigned';
      case "Submitted":
        return status === 'Submitted';
      case "Missed":
        return status === 'Missed';
      case "Graded":
        return student.grade != null && student.grade !== '';
      case "Not Graded":
        return status === 'Submitted' && 
               (student.grade == null || student.grade === '');
      default:
        return true;
    }
  });

  const handleGradeChange = (studentId, value) => {
    const maxPoints = activity.points || 100;
    
    let numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue.length > 1) {
      numericValue = numericValue.replace(/^0+/, '');
    }
    
    if (numericValue === '') {
      setLocalStudents(prev => prev.map(student =>
        student.user_ID === studentId
          ? { ...student, grade: '' }
          : student
      ));
      return;
    }
    
    let intValue = parseInt(numericValue, 10);
    
    if (intValue > maxPoints) {
      intValue = maxPoints;
    }
    
    if (intValue < 0) {
      intValue = 0;
    }
    
    setLocalStudents(prev => prev.map(student =>
      student.user_ID === studentId
        ? { ...student, grade: intValue.toString() }
        : student
    ));
  };

  const handleGradeBlur = (studentId, value) => {
    const maxPoints = activity.points || 100;
    
    if (value === '' || value === null || value === undefined) {
      return;
    }
    
    let numericValue = parseInt(value, 10);
    
    if (isNaN(numericValue)) {
      numericValue = 0;
    }
    
    if (numericValue < 0) {
      numericValue = 0;
    }
    
    if (numericValue > maxPoints) {
      numericValue = maxPoints;
    }
    
    numericValue = Math.floor(numericValue);
    
    setLocalStudents(prev => prev.map(student =>
      student.user_ID === studentId
        ? { ...student, grade: numericValue.toString() }
        : student
    ));
  };

  const handleSave = async () => {
    try {
      const saveData = {
        activity_ID: activity.id,
        students: localStudents.map(student => {
          const hasGrade = student.grade && student.grade !== '';
          const shouldMarkAsSubmitted = hasGrade && !student.submitted;
          
          return {
            user_ID: student.user_ID,
            grade: student.grade || null,
            submitted: student.submitted || shouldMarkAsSubmitted,
            late: false
          };
        })
      };

      console.log('Saving grades to database:', saveData);

      const response = await fetch(`${BACKEND_URL}/update_activity_grades.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        const updatedStudents = localStudents.map(student => {
          const hasGrade = student.grade && student.grade !== '';
          const shouldMarkAsSubmitted = hasGrade && !student.submitted;
          
          return {
            ...student,
            submitted: student.submitted || shouldMarkAsSubmitted,
            late: false
          };
        });
        
        setLocalStudents(updatedStudents);
        
        if (onSave) {
          onSave(updatedStudents);
        }
        
        fetchSavedGrades();
        
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2000);
      } else {
        alert('Error saving grades: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving grades:', error);
      alert('Error saving grades. Please try again. Error: ' + error.message);
    }
  };

  const handleEmailStudent = (studentEmail, studentName) => {
    if (studentEmail) {
      const subject = `Regarding ${activity.title}`;
      const professorSurname = professorName ? professorName.split(' ').pop() : 'Professor';
      const body = `Dear ${studentName},\n\nI would like to discuss your submission for "${activity.title}".\n\nBest regards,\nProf. ${professorSurname}`;
      
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(studentEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      window.open(gmailUrl, '_blank', 'noopener noreferrer');
    } else {
      alert('No email address found for this student.');
    }
  };

  const handleOpenPhotoModal = (studentId, studentName) => {
    setSelectedStudentForPhoto({
      id: studentId,
      name: studentName
    });
    
    // Fetch fresh files for this student
    fetchUploadedFiles(studentId);
    setPhotoModalOpen(true);
  };

  // Get total file count for a student
  const getFileCount = (studentId) => {
    if (!uploadedFilesList[studentId]) return 0;
    return (uploadedFilesList[studentId]?.professor?.length || 0) + 
          (uploadedFilesList[studentId]?.student?.length || 0);
  };

  // Get professor file count
  const getProfessorFileCount = (studentId) => {
    return uploadedFilesList[studentId]?.professor?.length || 0;
  };

  // Get student file count
  const getStudentFileCount = (studentId) => {
    return uploadedFilesList[studentId]?.student?.length || 0;
  };

  const getStudentAnalytics = (student) => {
    if (!student) return null;
    
    const totalPoints = activity.points || 100;
    const studentGrade = student.grade ? parseFloat(student.grade) : 0;
    const remainingPoints = Math.max(0, totalPoints - studentGrade);
    const percentage = totalPoints > 0 ? Math.round((studentGrade / totalPoints) * 100) : 0;
    
    let performanceLevel, feedback, color;
    
    if (percentage >= 95) {
      performanceLevel = "Perfect Score!";
      feedback = "Outstanding work! Student has mastered this material.";
      color = "#10B981";
    } else if (percentage >= 85) {
      performanceLevel = "Excellent";
      feedback = "Great job! Minor improvements could make it perfect.";
      color = "#34D399";
    } else if (percentage >= 75) {
      performanceLevel = "Good";
      feedback = "Solid understanding. Focus on details and accuracy.";
      color = "#F59E0B";
    } else if (percentage >= 65) {
      performanceLevel = "Average";
      feedback = "Needs improvement. Review key concepts and practice more.";
      color = "#F97316";
    } else if (percentage >= 50) {
      performanceLevel = "Below Average";
      feedback = "Requires attention. Consider additional support and review.";
      color = "#EF4444";
    } else {
      performanceLevel = "Needs Help";
      feedback = "Significant improvement needed. Schedule a meeting to discuss.";
      color = "#DC2626";
    }
    
    return {
      data: [
        { label: 'Earned', value: studentGrade, color: color },
        { label: 'Remaining', value: remainingPoints, color: '#E5E7EB' }
      ],
      percentage,
      performanceLevel,
      feedback,
      totalPoints
    };
  };

  const renderPieChart = (analytics) => {
    if (!analytics) return null;
    
    const { data, percentage } = analytics;
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    let cumulativePercent = 0;
    const chartSize = isMobile ? 120 : 180;
    const radius = 15.91549430918954;
    
    return (
      <div className="relative">
        <svg width={chartSize} height={chartSize} viewBox="0 0 42 42" className="mx-auto drop-shadow-sm">
          <circle
            cx="21"
            cy="21"
            r={radius}
            fill="transparent"
            stroke="#F3F4F6"
            strokeWidth="3"
          />
          
          {data.map((segment, index) => {
            if (segment.value === 0) return null;
            
            const percent = (segment.value / total) * 100;
            const dashArray = `${percent} ${100 - percent}`;
            const dashOffset = -cumulativePercent;
            cumulativePercent += percent;
            
            return (
              <circle
                key={index}
                cx="21"
                cy="21"
                r={radius}
                fill="transparent"
                stroke={segment.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 21 21)"
                className="transition-all duration-500 ease-out"
              />
            );
          })}
          
          <text 
            x="21" 
            y={isMobile ? "18" : "18"} 
            textAnchor="middle" 
            dominantBaseline="middle" 
            className={`${isMobile ? 'text-[.35rem]' : 'text-[.5rem]'} font-bold fill-gray-700`}
          >
            {percentage}%
          </text>
          <text 
            x="21" 
            y={isMobile ? "23" : "25"} 
            textAnchor="middle" 
            dominantBaseline="middle" 
            className={`${isMobile ? 'text-[.25rem]' : 'text-[.28rem]'} fill-gray-500`}
          >
            Score
          </text>
        </svg>
      </div>
    );
  };

  const handleStatusClick = (status) => {
    setFilter(status);
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return 'No deadline';
    const date = new Date(deadline);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const scrollToStudents = () => {
    if (isMobile && scrollContainerRef.current) {
      setActiveView('students');
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  const scrollToAnalytics = () => {
    if (isMobile && scrollContainerRef.current) {
      setActiveView('analytics');
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth / 2,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (isMobile && scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const containerWidth = scrollContainerRef.current.clientWidth;
      
      if (scrollLeft < containerWidth / 2) {
        setActiveView('students');
      } else {
        setActiveView('analytics');
      }
    }
  };

  if (!isOpen || !activity) return null;

  const studentAnalytics = selectedStudent ? 
    getStudentAnalytics(localStudents.find(s => s.user_ID === selectedStudent.id)) : null;

  const photoManagementProps = {
    isOpen: photoModalOpen,
    onClose: () => {
      console.log('Closing photo modal');
      setPhotoModalOpen(false);
      // Refresh files when modal closes
      if (selectedStudentForPhoto?.id) {
        fetchUploadedFiles(selectedStudentForPhoto.id);
      }
    },
    selectedStudent: selectedStudentForPhoto,
    studentFiles: selectedStudentForPhoto?.id ? (uploadedFilesList[selectedStudentForPhoto.id]?.student || []) : [],
    professorFiles: selectedStudentForPhoto?.id ? (uploadedFilesList[selectedStudentForPhoto.id]?.professor || []) : [],
    onProfessorPhotoUpload: () => {
      console.log('Uploading professor file for student:', selectedStudentForPhoto?.id);
      if (selectedStudentForPhoto?.id) {
        handleProfessorFileUpload(selectedStudentForPhoto.id);
      }
    },
    onViewProfessorFile: handleViewFile,
    onDeleteProfessorFile: (fileId) => {
      console.log('Deleting file:', fileId, 'for student:', selectedStudentForPhoto?.id);
      if (selectedStudentForPhoto?.id) {
        handleDeleteFile(fileId, selectedStudentForPhoto.id);
      }
    },
    onViewStudentFile: handleViewFile,
    activity: activity,
    formatFileSize: formatFileSize,
    isUploadingToDrive: isUploadingFile,
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-2 sm:p-3 md:p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col mx-1 sm:mx-2 md:mx-4 min-w-0">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
                Student Submissions - {activity.title}
              </h2>
              <p className="text-xs sm:text-sm mt-1">
                {activity.activity_type} #{activity.task_number} 
              </p>
              <div className="flex items-center gap-2 mt-1">
                <img 
                  src={ClockIcon} 
                  alt="Deadline" 
                  className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" 
                />
                <span className="text-xs sm:text-sm text-red-600 font-bold">
                  Deadline: {formatDeadline(activity.deadline)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-1 sm:p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer flex-shrink-0 ml-2"
              >
                <img src={Cross} alt="Close" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>

          {/* Mobile View Tabs - Fixed */}
          {isMobile && (
            <div className="flex border-b border-gray-200 flex-shrink-0">
              <button
                onClick={scrollToStudents}
                className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                  activeView === 'students'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Students List
              </button>
              <button
                onClick={scrollToAnalytics}
                className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                  activeView === 'analytics'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                disabled={!selectedStudent}
              >
                Analytics
              </button>
            </div>
          )}

          {/* Main Content Container */}
          <div 
            ref={scrollContainerRef}
            className={`flex-1 overflow-auto ${isMobile ? 'overflow-x-auto snap-x snap-mandatory' : ''}`}
            onScroll={handleScroll}
          >
            <div className={`flex ${isMobile ? 'w-[200%] flex-row' : 'w-full flex-row'} min-h-0`}>
              {/* Left Panel - Students List */}
              <div className={`${isMobile ? 'w-1/2 flex-shrink-0 snap-start' : 'w-1/2'} h-full border-r border-gray-200 flex flex-col overflow-hidden`}>
                {/* Instructions Section */}
                <div className="flex-1 overflow-y-auto">
                  {/* Instructions */}
                  <div className="p-3 sm:p-4 md:p-6">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2">Instructions</h3>
                    <div className="relative">
                      <p className={`text-xs sm:text-sm text-gray-600 whitespace-pre-wrap break-words ${
                        instructionExpanded ? '' : 'max-h-20 overflow-hidden'
                      }`}>
                        {activity.instruction || 'No instructions provided for this activity.'}
                      </p>
                      {activity.instruction && activity.instruction.length > 150 && (
                        <button
                          onClick={() => setInstructionExpanded(!instructionExpanded)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-1 cursor-pointer"
                        >
                          {instructionExpanded ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status Rectangles */}
                  <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
                    <div className="flex gap-2 sm:gap-3 md:gap-4">
                      <button
                        onClick={() => handleStatusClick("Assigned")}
                        className={`flex-1 border rounded-lg p-2 sm:p-3 md:p-4 text-center transition-all duration-200 cursor-pointer ${
                          filter === "Assigned" 
                            ? "bg-yellow-100 border-yellow-300 shadow-md" 
                            : "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
                        }`}
                      >
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-800">{statusCounts.assigned}</div>
                        <div className="text-xs sm:text-sm text-yellow-700">Assigned</div>
                      </button>
                      <button
                        onClick={() => handleStatusClick("Submitted")}
                        className={`flex-1 border rounded-lg p-2 sm:p-3 md:p-4 text-center transition-all duration-200 cursor-pointer ${
                          filter === "Submitted" 
                            ? "bg-green-100 border-green-300 shadow-md" 
                            : "bg-green-50 border-green-200 hover:bg-green-100"
                        }`}
                      >
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-800">{statusCounts.submitted}</div>
                        <div className="text-xs sm:text-sm text-green-700">Submitted</div>
                      </button>
                      <button
                        onClick={() => handleStatusClick("Missed")}
                        className={`flex-1 border rounded-lg p-2 sm:p-3 md:p-4 text-center transition-all duration-200 cursor-pointer ${
                          filter === "Missed" 
                            ? "bg-red-100 border-red-300 shadow-md" 
                            : "bg-red-50 border-red-200 hover:bg-red-100"
                        }`}
                      >
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-800">{statusCounts.missed}</div>
                        <div className="text-xs sm:text-sm text-red-700">Missed</div>
                      </button>
                    </div>
                  </div>

                  {/* Filter Section */}
                  <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="relative">
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mr-2">Filter:</label>
                        <button
                          onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          {filter}
                          <img
                            src={ArrowDown}
                            alt=""
                            className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${filterDropdownOpen ? 'rotate-180' : ''}`}
                          />
                        </button>

                        {filterDropdownOpen && (
                          <div className="absolute top-full left-0 mt-1 w-32 sm:w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                            {filterOptions.map(option => (
                              <button
                                key={option}
                                onClick={() => {
                                  setFilter(option);
                                  setFilterDropdownOpen(false);
                                }}
                                className={`block w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-gray-100 cursor-pointer ${
                                  filter === option ? 'bg-gray-50 font-medium' : ''
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="text-xs sm:text-sm text-gray-600">
                        Showing {filteredStudents.length} of {localStudents.length} students
                      </div>
                    </div>
                  </div>

                  {/* Students List */}
                  <div className="overflow-y-auto flex-1 min-h-0">
                    <div className="w-full">
                      <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr>
                            <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[35%] sm:w-[30%]">
                              Student
                            </th>
                            <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                              Status
                            </th>
                            <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                              Grade
                            </th>
                            <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[35%]">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredStudents.map((student) => {
                            const studentId = student.user_ID;
                            const hasProfessorFiles = getProfessorFileCount(studentId) > 0;
                            const hasStudentFiles = getStudentFileCount(studentId) > 0;
                            const totalFiles = getFileCount(studentId);
                            const isSelected = selectedStudent?.id === studentId;
                            const status = calculateStudentStatus(student, activity);
                            const maxPoints = activity.points || 100;
                            const hasGrade = student.grade && student.grade !== '' && student.grade !== '0';
                            const gradeInputBorderClass = hasGrade 
                              ? 'border-green-500 focus:border-green-600' 
                              : 'border-red-400 focus:border-red-500';

                            return (
                              <tr 
                                key={studentId} 
                                className={`hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                                onClick={() => setSelectedStudent({ id: studentId, name: student.user_Name })}
                              >
                                <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 w-[35%] sm:w-[30%]">
                                  <div className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                                    {student.user_Name}
                                  </div>
                                  <div className="text-xs text-gray-500 break-words">
                                    {student.user_Email || 'No email'}
                                  </div>
                                </td>
                                <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 w-[15%] whitespace-nowrap">
                                  <span className={`inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full ${
                                    (() => {
                                      switch (status) {
                                        case 'Submitted': return 'bg-green-100 text-green-800';
                                        case 'Missed': return 'bg-red-100 text-red-800';
                                        default: return 'bg-gray-100 text-gray-800';
                                      }
                                    })()
                                  }`}>
                                    {status}
                                    {hasStudentFiles && status === 'Submitted' && (
                                      <span className="ml-1">✓</span>
                                    )}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 w-[15%] whitespace-nowrap">
                                  <div className="flex items-center">
                                    <input
                                      type="number"
                                      min="0"
                                      max={maxPoints}
                                      value={student.grade || ''}
                                      onChange={(e) => handleGradeChange(studentId, e.target.value)}
                                      onBlur={(e) => handleGradeBlur(studentId, e.target.value)}
                                      className={`w-12 sm:w-14 px-1.5 sm:px-2 py-0.5 sm:py-1 border rounded text-xs focus:outline-none transition-colors duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${gradeInputBorderClass}`}
                                      onClick={(e) => e.stopPropagation()}
                                      step="1"
                                      placeholder="0"
                                    />
                                    {maxPoints && (
                                      <span className="text-xs text-gray-500 ml-1">/ {maxPoints}</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 w-[35%]" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center justify-start gap-1 sm:gap-1.5 flex-wrap">
                                    {/* Folder/Photo Icon */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleProfessorFileUpload(studentId);
                                      }}
                                      className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
                                      title="Upload file for student"
                                    >
                                      <img 
                                        src={hasProfessorFiles ? FolderGreen : Photo} 
                                        alt="Files" 
                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5" 
                                      />
                                    </button>

                                    {/* Email Icon */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEmailStudent(student.user_Email, student.user_Name);
                                      }}
                                      className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
                                      title="Email Student"
                                    >
                                      <img src={EmailIcon} alt="Email" className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5" />
                                    </button>

                                    {/* Details Icon */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDetailsModalOpen(true);
                                      }}
                                      className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
                                      title="View Details"
                                    >
                                      <img src={DetailsIcon} alt="Details" className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5" />
                                    </button>
                                    
                                    {/* File Count Badge */}
                                    {totalFiles > 0 && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenPhotoModal(studentId, student.user_Name);
                                        }}
                                        className="text-xs text-blue-600 hover:text-blue-800 ml-1 sm:ml-2 cursor-pointer"
                                        title="Manage uploaded files"
                                      >
                                        Files ({totalFiles})
                                        {hasProfessorFiles && (
                                          <span className="ml-1 text-green-600">↑{getProfessorFileCount(studentId)}</span>
                                        )}
                                        {hasStudentFiles && (
                                          <span className="ml-1 text-green-600">↓{getStudentFileCount(studentId)}</span>
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      {filteredStudents.length === 0 && (
                        <div className="text-center py-6 text-xs sm:text-sm text-gray-500">
                          No students found for the selected filter.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Analytics */}
              <div className={`${isMobile ? 'w-1/2 flex-shrink-0 snap-start' : 'w-1/2'} h-full flex flex-col overflow-hidden`}>
                {/* Analytics Content */}
                <div className="flex-1 overflow-y-auto">
                  {selectedStudent ? (
                    <div className="h-full flex flex-col p-3 sm:p-4 md:p-6">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                          Analytics - {selectedStudent.name}
                        </h3>
                        {isMobile && (
                          <button
                            onClick={scrollToStudents}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                          >
                            ← Back to List
                          </button>
                        )}
                      </div>
                      
                      {/* Analytics Content */}
                      <div className="flex flex-col items-center justify-center mb-4 sm:mb-6">
                        {studentAnalytics ? (
                          <>
                            {renderPieChart(studentAnalytics)}
                            
                            <div className="mt-4 sm:mt-6 text-center">
                              <div className={`inline-block px-3 py-2 rounded-lg ${
                                studentAnalytics.percentage >= 85 ? 'bg-green-50 border border-green-200' :
                                studentAnalytics.percentage >= 70 ? 'bg-yellow-50 border border-yellow-200' :
                                studentAnalytics.percentage >= 50 ? 'bg-orange-50 border border-orange-200' :
                                'bg-red-50 border border-red-200'
                              }`}>
                                <p className="text-sm font-semibold text-gray-900">
                                  {studentAnalytics.performanceLevel}
                                </p>
                                <p className="text-xs text-gray-600 max-w-xs">
                                  {studentAnalytics.feedback}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 sm:mt-6 w-full max-w-xs">
                              <div className="grid grid-cols-2 gap-3 text-center">
                                <div className="bg-blue-50 rounded-lg p-3">
                                  <p className="text-xs text-blue-600 font-medium">Current Score</p>
                                  <p className="text-lg font-bold text-blue-800">
                                    {studentAnalytics.data[0].value}/{studentAnalytics.totalPoints}
                                  </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <p className="text-xs text-gray-600 font-medium">Points Available</p>
                                  <p className="text-lg font-bold text-gray-800">
                                    {studentAnalytics.data[1].value}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex justify-center gap-3">
                              {studentAnalytics.data.map((item, index) => (
                                <div key={index} className="flex items-center gap-1">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: item.color }}
                                  ></div>
                                  <span className="text-xs text-gray-600">
                                    {item.label}: {item.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="text-center text-xs sm:text-sm text-gray-500">
                            No grade data available for this student.
                          </div>
                        )}
                      </div>

                      {/* Student Details with Files */}
                      <div className="mt-3 sm:mt-4 md:mt-6 p-2 sm:p-3 md:p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">Student Details</h4>
                        <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                          <p className="break-words">Email: {localStudents.find(s => s.user_ID === selectedStudent.id)?.user_Email || 'N/A'}</p>
                          <p>Status: {calculateStudentStatus(
                            localStudents.find(s => s.user_ID === selectedStudent.id), 
                            activity
                          )}</p>
                          <p>Current Grade: {localStudents.find(s => s.user_ID === selectedStudent.id)?.grade || 'Not graded'}</p>
                          
                          {/* Professor's Files Section */}
                          {getProfessorFileCount(selectedStudent.id) > 0 && (
                            <div className="mt-2">
                              <p className="font-medium">Professor's Files:</p>
                              <ul className="ml-4 list-disc">
                                {uploadedFilesList[selectedStudent.id]?.professor?.slice(0, 2).map((file, index) => (
                                  <li key={index}>
                                    <a
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800"
                                      title={file.name}
                                    >
                                      {file.name.length > 30 ? file.name.substring(0, 27) + '...' : file.name}
                                    </a>
                                  </li>
                                ))}
                                {getProfessorFileCount(selectedStudent.id) > 2 && (
                                  <li className="text-gray-500">
                                    +{getProfessorFileCount(selectedStudent.id) - 2} more files
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}

                          {/* Student's Files Section */}
                          {getStudentFileCount(selectedStudent.id) > 0 && (
                            <div className="mt-2">
                              <p className="font-medium">Student's Submitted Files:</p>
                              <ul className="ml-4 list-disc">
                                {uploadedFilesList[selectedStudent.id]?.student?.slice(0, 2).map((file, index) => (
                                  <li key={index}>
                                    <a
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-green-600 hover:text-green-800"
                                      title={file.name}
                                    >
                                      {file.name.length > 30 ? file.name.substring(0, 27) + '...' : file.name}
                                    </a>
                                  </li>
                                ))}
                                {getStudentFileCount(selectedStudent.id) > 2 && (
                                  <li className="text-gray-500">
                                    +{getStudentFileCount(selectedStudent.id) - 2} more files
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}

                          {/* Manage Files Button */}
                          {(getProfessorFileCount(selectedStudent.id) > 0 || getStudentFileCount(selectedStudent.id) > 0) && (
                            <button
                              onClick={() => handleOpenPhotoModal(selectedStudent.id, selectedStudent.name)}
                              className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                            >
                              Manage all files →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-xs sm:text-sm text-gray-500 p-6">
                      <p className="text-center mb-4">
                        {isMobile ? "Select a student from the list to view their analytics" : "Select a student to view analytics"}
                      </p>
                      {isMobile && (
                        <button
                          onClick={scrollToStudents}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 cursor-pointer"
                        >
                          Go to Students List
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="flex justify-end gap-2 sm:gap-3 p-3 sm:p-4 md:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 cursor-pointer"
            >
              Save Grades
            </button>
          </div>
        </div>
      </div>

      {/* Photo Management Modal */}
      <PhotoManagement {...photoManagementProps} />

      {/* Photo Viewer Modal */}
      {photoViewerOpen && viewingPhoto && (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-[70] p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setPhotoViewerOpen(false)}
              className="absolute top-4 right-4 p-2 sm:p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10 cursor-pointer"
            >
              <img src={Close} alt="Close" className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="relative max-w-[95vw] max-h-[85vh] w-auto h-auto mx-4">
              {viewingPhoto.url && viewingPhoto.url.match(/\.(jpeg|jpg|gif|png|bmp)$/i) ? (
                <img
                  src={viewingPhoto.url}
                  alt={viewingPhoto.name}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <div className="bg-gray-800 p-8 rounded-lg shadow-2xl">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-4">📄</div>
                    <p className="text-lg font-medium">{viewingPhoto.name}</p>
                    <p className="text-sm opacity-75 mt-2">{viewingPhoto.type || 'File'}</p>
                    <a 
                      href={viewingPhoto.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-4 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                    >
                      Open File
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm backdrop-blur-sm max-w-[90vw] text-center">
              {viewingPhoto.name} • {viewingPhoto.uploadedBy === 'Professor' ? 'Professor\'s Upload' : 'Student\'s Submission'}
            </div>
          </div>
        </div>
      )}

      {/* Student Activities Details Modal */}
      <StudentActivitiesDetails
        activity={activity}
        students={localStudents}
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        subjectCode={activity?.subject_code}
        professorName={professorName}
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[70]">
          <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600">Grades saved successfully.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassWorkSubmission;