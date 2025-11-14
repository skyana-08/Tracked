import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Landing Links
import Login from './Pages/Landing/Login.jsx';
import Signup from './Pages/Landing/Signup.jsx';
import VerifyAcc from './Pages/Landing/VerifyAcc.jsx';
import ForgotPass from './Pages/Landing/ForgotPass.jsx';

// Professor Links
import DashboardProf from './Pages/Professor/DashboardProf.jsx';
import ClassManagement from './Pages/Professor/ClassManagement.jsx';
import AnalyticsProf from './Pages/Professor/AnalyticsProf.jsx';
import Announcement from './Pages/Professor/Announcement.jsx';
import NotificationProf from './Pages/Professor/NotificationProf.jsx';
import ProfileProf from './Pages/Professor/ProfileProf.jsx';
import AccountSettingProf from './Pages/Professor/AccountSettingProf.jsx';
import SubjectDetails from './Pages/Professor/SubjectDetails.jsx';
import Attendance from './Pages/Professor/Attendance.jsx';
import AttendanceHistory from './Pages/Professor/AttendanceHistory.jsx';
import AnalyticsIndividualInfo from './Pages/Professor/AnalyticsIndividualInfo.jsx';
import AnalyticsAttendanceInfo from './Pages/Professor/AnalyticsAttendanceInfo.jsx';
import ArchiveClass from './Pages/Professor/ArchiveClass.jsx'; 
import ArchiveActivities from './Pages/Professor/ArchiveActivities.jsx';

// Student Links
import DashboardStudent from './Pages/Student/DashboardStudent.jsx';
import Subjects from './Pages/Student/Subjects.jsx';
import AnalyticsStudent from './Pages/Student/AnalyticsStudent.jsx';
import NotificationStudent from './Pages/Student/NotificationStudent.jsx';
import ProfileStudent from './Pages/Student/ProfileStudent.jsx';
import AccountSetting from './Pages/Student/AccountSetting.jsx';
import AttendanceHistoryStudent from './Pages/Student/AttendanceHistoryStudent.jsx';
import SubjectDetailsStudent from './Pages/Student/SubjectDetailsStudent.jsx';
import ArchiveClassStudent from './Pages/Student/ArchiveClassStudent.jsx';

// Super Admin Links
import SuperAdminAccountList from './Pages/SuperAdmin/SuperAdminAccountList.jsx';
import SuperAdminLanding from './Pages/SuperAdmin/SuperAdminLanding.jsx';
import SuperAdminAdminAccountDetails from './Pages/SuperAdmin/SuperAdminAdminAccountDetails.jsx';
import SuperAdminProfAccountDetails from './Pages/SuperAdmin/SuperAdminProfAccountDetails.jsx';
import SuperAdminStudentAccountDetails from './Pages/SuperAdmin/SuperAdminStudentAccountDetails.jsx';
import SuperAdminAdminAccount from './Pages/SuperAdmin/SuperAdminAdminAccount.jsx';
import SuperAdminProfAccount from './Pages/SuperAdmin/SuperAdminProfAccount.jsx';
import SuperAdminStudentAccount from './Pages/SuperAdmin/SuperAdminStudentAccount.jsx';

function Linking() {
  return (
    <Router>
      <Routes>
        {/* Starting Flow */} 
        <Route path="/" element={<Login />} />  
        
        {/* Navigations for Landing */}
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/VerifyAcc" element={<VerifyAcc />} />
        <Route path="/ForgotPass" element={<ForgotPass />} />

        {/* Navigations for Professor */} 
        <Route path="/DashboardProf" element={<DashboardProf />} />  
        <Route path="/ClassManagement" element={<ClassManagement />} />  
        <Route path="/AnalyticsProf" element={<AnalyticsProf />} />  
        <Route path="/Announcement" element={<Announcement />} />  
        <Route path="/NotificationProf" element={<NotificationProf />} />  
        <Route path="/ProfileProf" element={<ProfileProf/>} />  
        <Route path="/AccountSettingProf" element={<AccountSettingProf/>} />  
        <Route path="/SubjectDetails" element={<SubjectDetails/>} />  
        <Route path="/Attendance" element={<Attendance/>} /> 
        <Route path="/AttendanceHistory" element={<AttendanceHistory/>} /> 
        <Route path="/ArchiveClass" element={<ArchiveClass/>} /> 
        <Route path="/ArchiveActivities" element={<ArchiveActivities/>} /> 
        <Route path="/AnalyticsIndividualInfo" element={<AnalyticsIndividualInfo/>} /> 
        <Route path="/AnalyticsAttendanceInfo" element={<AnalyticsAttendanceInfo/>} /> 

        {/* Navigations for Student */}
        <Route path="/DashboardStudent" element={<DashboardStudent />} />
        <Route path="/Subjects" element={<Subjects />} />
        <Route path="/AnalyticsStudent" element={<AnalyticsStudent />} />
        <Route path="/NotificationStudent" element={<NotificationStudent />} />
        <Route path="/ProfileStudent" element={<ProfileStudent />} />
        <Route path="/AccountSetting" element={<AccountSetting />} />
        <Route path="/AttendanceHistoryStudent" element={<AttendanceHistoryStudent />} />
        <Route path="/SubjectDetailsStudent" element={<SubjectDetailsStudent />} />
        <Route path="/ArchiveClassStudent" element={<ArchiveClassStudent />} />

        {/* Navigations for Super Admin */}
        <Route path="/SuperAdminAccountList" element={<SuperAdminAccountList />} />
        <Route path="/SuperAdminLanding" element={<SuperAdminLanding />} />
        <Route path="/SuperAdminAdminAccountDetails" element={<SuperAdminAdminAccountDetails />} />
        <Route path="/SuperAdminProfAccountDetails" element={<SuperAdminProfAccountDetails />} />
        <Route path="/SuperAdminStudentAccountDetails" element={<SuperAdminStudentAccountDetails />} />
        <Route path="/SuperAdminAdminAccount" element={<SuperAdminAdminAccount />} />
        <Route path="/SuperAdminProfAccount" element={<SuperAdminProfAccount />} />
        <Route path="/SuperAdminStudentAccount" element={<SuperAdminStudentAccount />} />

      </Routes>
    </Router>
  );
}

export default Linking;