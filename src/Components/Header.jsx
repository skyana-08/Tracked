import React, { useEffect, useState } from 'react';
import Menu from '../assets/MenuLine(Light).svg';
import Notification from '../assets/NotificationIcon.svg';
import ProfilePhoto from '../assets/ProfilePhoto.svg';

function Header({ setIsOpen, userName = "User" }) {
  const [weekday, setWeekday] = useState("");
  const [fullDate, setFullDate] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    const today = new Date();
    setWeekday(today.toLocaleDateString("en-US", { weekday: "long" }));
    setFullDate(today.toLocaleDateString("en-US", { month: "long", day: "numeric" }));
    setYear(today.getFullYear());
  }, []);

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-3">
        {/* Left: Menu + Date */}
        <div className="flex items-center gap-2 sm:gap-4">
          <img
            src={Menu}
            alt="Menu"
            className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer flex-shrink-0"
            onClick={() => setIsOpen(prev => !prev)}
          />

          <div className="flex flex-wrap items-center text-xs sm:text-base md:text-lg">
            <p className="text-[#465746] font-bold mr-2">{weekday}</p>
            <p className="text-[#465746] mr-2 hidden sm:block">|</p>
            <p className="text-[#465746] mr-1">{fullDate}{","}</p>
            <p className="text-[#465746]">{year}</p>
          </div>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <img 
              src={Notification}
              alt="Notification"
              className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <p className="text-[#00874E] font-bold text-sm sm:text-base md:text-lg">X</p>
            <p className="text-[#465746] font-bold text-sm sm:text-base md:text-lg">New</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src={ProfilePhoto}
              alt="Profile Photo"
              className="h-6 w-6 sm:h-7 sm:w-7 mr-1 sm:mr-3 flex-shrink-0 rounded-full"
            />
            <div className="hidden md:flex items-center">
              <p className="text-[#465746]  text-sm sm:text-base md:text-lg mr-1 sm:mr-2 hidden lg:block">{userName}</p>
            </div>
          </div>
        </div>
      </div>

      <hr className="mx-4 opacity-60 border-[#465746] rounded border-1" />
    </div>
  );
}

export default Header;
