import React from 'react';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { LuRefreshCcwDot } from "react-icons/lu";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { MdCircle } from "react-icons/md";
import { RiExpandUpDownLine } from "react-icons/ri";
import { VscDesktopDownload } from "react-icons/vsc";
import { IoIosNotificationsOff } from "react-icons/io";
import { MdFormatListBulleted } from "react-icons/md";

const TopBar: React.FC = () => {
  return (
    <div className="flex items-center justify-between border-gray-300 px-4 py-2 bg-white w-full z-50 relative">
      
      {/* LEFT: Chats */}
      <div className="flex items-center gap-2 hover:text-black cursor-pointer">
        <IoChatbubbleEllipses className="text-gray-500" size={16} />
        <p className="text-gray-500 font-sans text-sm font-bold">Chats</p>
      </div>

      {/* RIGHT: Grouped Buttons (aligned to far right) */}
      <div className="flex items-center space-x-1">

        <div className="flex items-center gap-1.5 border border-gray-300 rounded px-2 py-1 hover:text-black cursor-pointer">
          <LuRefreshCcwDot className="text-black" size={16} />
          <p className="text-black font-sans text-sm">Refresh</p>
        </div>

        <div className="flex items-center gap-1.5 border border-gray-300 rounded px-2 py-1 hover:text-black cursor-pointer">
          <IoMdHelpCircleOutline className="text-black" size={16} />
          <p className="text-black font-sans text-sm">Help</p>
        </div>

        <div className="flex items-center gap-1.5 border border-gray-300 rounded px-2 py-1 hover:text-black cursor-pointer">
          <MdCircle className="text-yellow-400" size={16} />
          <p className="text-black font-sans text-sm">5/6 Phones</p>
          <RiExpandUpDownLine className="text-black" size={16} />
        </div>

        <div className="flex items-center justify-center border border-gray-300 rounded p-1 hover:text-black cursor-pointer">
          <VscDesktopDownload className="text-black" size={16} />
        </div>

        <div className="flex items-center justify-center border border-gray-300 rounded p-1 hover:text-black cursor-pointer">
          <IoIosNotificationsOff className="text-black" size={16} />
        </div>

        <div className="flex items-center justify-center border border-gray-300 rounded p-1 hover:text-black cursor-pointer">
          <MdFormatListBulleted className="text-black" size={16} />
        </div>

      </div>
    </div>
  );
};

export default TopBar;
