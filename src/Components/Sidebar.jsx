import { useState, useEffect } from "react"; 
import { Link } from "react-router-dom"; 

import Dashboard from "../assets/Dashboard.svg"; 
import Subjects from "../assets/Subjects.svg"; 
import Analytics from "../assets/Analytics.svg"; 
import ClassManagement from "../assets/ClassManagement.svg"; 
import Announcement from "../assets/Announcement.svg"; 
import Report from "../assets/Report.svg"; 
import AccountRequest from "../assets/AccountRequest.svg"; 
import Import from "../assets/Import.svg"; 
import Notification from "../assets/Notification.svg"; 
import Profile from "../assets/Profile.svg"; 
import AccountSettings from "../assets/Settings.svg"; 
import LogOut from "../assets/LogOut.svg"; 
import TextLogo from "../assets/New-FullWhite-TrackEdLogo.svg";

export default function Sidebar({ role, isOpen: isOpenProp, setIsOpen: setIsOpenProp }) {
  const [localOpen, setLocalOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const isControlled = typeof isOpenProp !== "undefined" && typeof setIsOpenProp === "function";
  const isOpen = isControlled ? isOpenProp : localOpen;
  const setIsOpen = isControlled ? setIsOpenProp : setLocalOpen;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isMobile && isOpen && !event.target.closest("aside")) {
        setIsOpen(false);
      }
    };
    if (isMobile && isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [isMobile, isOpen, setIsOpen]);

  // role menus
  const menus = {
    student: {
      main: [
        { label: "Dashboard", icon: Dashboard, path: "/Dashboard" },
        { label: "My Courses", icon: Subjects, path: "/MyCourses" },
        { label: "Grades", icon: Analytics, path: "/Grades" },
      ],
      extras: [
        { label: "Notification", icon: Notification, path: "/Notification" },
        { label: "Profile", icon: Profile, path: "/Profile" },
        { label: "Account Settings", icon: AccountSettings, path: "/AccountSetting" },
      ],
    },

    teacher: {
      main: [
        { label: "Dashboard", icon: Dashboard, path: "/DashboardProf" },
        { label: "Class Management", icon: ClassManagement, path: "/ClassManagement" },
        { label: "Analytics", icon: Analytics, path: "/AnalyticsProf" },
        { label: "Announcement", icon: Announcement, path: "/Announcement" },
      ],
      extras: [
        { label: "Notification", icon: Notification, path: "/NotificationProf" },
        { label: "Profile", icon: Profile, path: "/ProfileProf" },
        { label: "Account Settings", icon: AccountSettings, path: "/AccountSettingProf" },
      ],
    },

    admin: {
      main: [
        { label: "User Management", icon: ClassManagement, path: "/UserManagement" },
        { label: "Report", icon: Report, path: "/Report" },
        { label: "Account Request", icon: AccountRequest, path: "/AccountRequest" },
        { label: "Import", icon: Import, path: "/Import" },
      ],
    },
  };

  const handleLinkClick = () => {
    if (isMobile) setIsOpen(false);
  };

  return (
    <>
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-[#00874E] border-r border-[#acacac] select-none z-50 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        w-[70%] sm:w-[280px] xl:w-[280px] 2xl:w-[300px]`}
      >
        <div className="p-5 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <img
              src={TextLogo}
              alt="TrackEDLogo"
              className="h-12 w-auto mx-auto mb-4 cursor-pointer"
            />
          </div>

          <hr className="border-[#DBDBDB] rounded border-1 opacity-50" />

          {/* Main Menus */}
          <div className="flex flex-col mt-8">

            {menus[role]?.main?.map((item, index) => (
              <Link key={index} to={item.path} onClick={handleLinkClick}>
                <div className="flex mt-3 px-4 py-3 hover:bg-[#00A15D] hover:rounded-xl cursor-pointer">
                  <img src={item.icon} alt={item.label} className="mr-5" />
                  <p className="text-[#FFFFFF] text-[1.125rem]">{item.label}</p>
                </div>
              </Link>
            ))}

          </div>

          {/* Extras Section */}
          {menus[role]?.extras?.length > 0 && (
            <div className="pt-20 lg:pt-40">
              <hr className="border-[#DBDBDB] rounded border-1 mt-6 opacity-50" />

              {menus[role].extras.map((item, index) => (
                <Link key={index} to={item.path} onClick={handleLinkClick}>
                  <div className="flex mt-4 px-4 py-3 hover:bg-[#00A15D] hover:rounded-xl cursor-pointer">
                    <img src={item.icon} alt={item.label} className="mr-5" />
                    <p className="text-[#FFFFFF] text-[1.125rem]">{item.label}</p>
                  </div>
                </Link>
              ))}

            </div>
          )}

          {/* Log Out */}
          <div className="mt-auto">
            <Link to="/Login" onClick={handleLinkClick}>
              <div className="flex px-4 py-3 hover:bg-[#00A15D] hover:rounded-xl cursor-pointer">
                <img src={LogOut} alt="Logout" className="mr-5" />
                <p className="text-[#FFFFFF] text-[1.125rem]">Log out</p>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
