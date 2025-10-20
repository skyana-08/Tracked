import { useState } from "react";
import ArrowDown from "../assets/ArrowDown(Light).svg"; 
import jsPDF from "jspdf";

function AttendanceCard({ date, students }) {
  const [open, setOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'text-[#00A15D]';
      case 'late': return 'text-[#767EE0]';
      case 'absent': return 'text-[#EF4444]';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'present': return 'Present';
      case 'late': return 'Late';
      case 'absent': return 'Absent';
      default: return 'Unknown';
    }
  };

  // Function to get student number - handles both field names
  const getStudentNumber = (student) => {
    return student.student_ID || student.user_ID || student.id || 'N/A';
  };

  // Function to get student name
  const getStudentName = (student) => {
    return student.user_Name || student.name || 'Unknown';
  };

  // Function to download as PDF
  const downloadAttendancePDF = () => {
    if (!students || students.length === 0) {
      alert('No attendance data to download');
      return;
    }

    try {
      // Create PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = margin;
      
      // Add title
      pdf.setFontSize(20);
      pdf.setFont(undefined, 'bold');
      pdf.text('Class Attendance Record', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
      
      // Add date
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Date: ${date}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;
      
      // Calculate summary
      const presentCount = students.filter(s => s.status === 'present').length;
      const lateCount = students.filter(s => s.status === 'late').length;
      const absentCount = students.filter(s => s.status === 'absent').length;
      
      // Add summary
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Attendance Summary:', margin, yPosition);
      yPosition += 7;
      
      pdf.setFont(undefined, 'normal');
      pdf.text(`Total Students: ${students.length}`, margin, yPosition);
      pdf.text(`Present: ${presentCount}`, margin + 50, yPosition);
      pdf.text(`Late: ${lateCount}`, margin + 90, yPosition);
      pdf.text(`Absent: ${absentCount}`, margin + 120, yPosition);
      yPosition += 15;
      
      // Add table headers
      pdf.setFont(undefined, 'bold');
      pdf.text('#', margin, yPosition);
      pdf.text('Student No.', margin + 15, yPosition);
      pdf.text('Full Name', margin + 60, yPosition);
      pdf.text('Status', pageWidth - margin - 20, yPosition);
      
      // Add line under headers
      yPosition += 3;
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 7;
      
      // Add student data
      pdf.setFont(undefined, 'normal');
      const lineHeight = 8;
      
      students.forEach((student, index) => {
        // Check if we need a new page
        if (yPosition > pdf.internal.pageSize.getHeight() - 20) {
          pdf.addPage();
          yPosition = margin;
          
          // Add headers on new page
          pdf.setFont(undefined, 'bold');
          pdf.text('#', margin, yPosition);
          pdf.text('Student No.', margin + 15, yPosition);
          pdf.text('Full Name', margin + 60, yPosition);
          pdf.text('Status', pageWidth - margin - 20, yPosition);
          yPosition += 10;
        }
        
        const studentNumber = getStudentNumber(student);
        const studentName = getStudentName(student);
        const status = getStatusText(student.status);
        
        // Add student data
        pdf.text(`${index + 1}`, margin, yPosition);
        pdf.text(studentNumber, margin + 15, yPosition);
        
        // Truncate long names to fit
        const maxNameWidth = 80;
        let displayName = studentName;
        if (pdf.getTextWidth(studentName) > maxNameWidth) {
          // Simple truncation - you could make this smarter
          displayName = studentName.substring(0, 30) + '...';
        }
        pdf.text(displayName, margin + 60, yPosition);
        
        // Set color based on status
        switch (student.status) {
          case 'present':
            pdf.setTextColor(0, 161, 93); // #00A15D
            break;
          case 'late':
            pdf.setTextColor(118, 126, 224); // #767EE0
            break;
          case 'absent':
            pdf.setTextColor(239, 68, 68); // #EF4444
            break;
          default:
            pdf.setTextColor(0, 0, 0);
        }
        
        pdf.text(status, pageWidth - margin - 20, yPosition, { align: 'right' });
        
        // Reset text color for next row
        pdf.setTextColor(0, 0, 0);
        
        yPosition += lineHeight;
      });
      
      // Add footer with generation date
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text(
        `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
        pageWidth / 2,
        pdf.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
      
      // Save the PDF directly (this will download the file)
      const fileName = `attendance-${date.replace(/\s+/g, '-')}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF file. Please try again.');
    }
  };

  // Handle download
  const handleDownload = () => {
    downloadAttendancePDF();
  };

  return (
    <div className="bg-[#fff] rounded-md shadow-md mt-5">
      {/* ATTENDANCE CARD component*/}
      <div className="flex items-center justify-between p-5 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center justify-between w-full">
          <span>
            Class Attendance for <span className="font-bold">{date}</span>
            <span className="ml-2 text-sm text-gray-500">
              ({students ? students.length : 0} students)
            </span>
          </span>
          <div className="flex items-center gap-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="px-4 py-2 bg-[#00A15D] text-white font-semibold text-sm rounded-lg hover:bg-[#00874E] transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
            >
              Download PDF
            </button>
            <img
              src={ArrowDown}
              alt="Expand"
              className={`h-6 w-6 transform transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {open && (
        <div className="p-5">
          <table className="table-auto w-full bg-[#fff] border-collapse text-left rounded-md overflow-hidden">
            <thead>
              <tr className="text-sm sm:text-base">
                <th className="px-4 py-2">No.</th>
                <th className="px-4 py-2">Student No.</th>
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {students && students.length > 0 ? (
                students.map((student, index) => {
                  const studentNumber = getStudentNumber(student);
                  const studentName = getStudentName(student);
                  
                  return (
                    <tr key={studentNumber + index} className="hover:bg-gray-50 text-sm sm:text-base">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{studentNumber}</td>
                      <td className="px-4 py-2">{studentName}</td>
                      <td className={`px-4 py-2 text-right font-bold ${getStatusColor(student.status)}`}>
                        {getStatusText(student.status)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                    No student data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AttendanceCard;