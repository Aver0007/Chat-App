import React from 'react';
import {
  MdSync,
  MdShare,
  MdGroups,
  MdAlternateEmail,
  MdTune
} from "react-icons/md";
import { LuPanelRightOpen } from "react-icons/lu";
import { LuPencilLine } from "react-icons/lu";
import { VscListSelection } from "react-icons/vsc";
import { AiTwotoneAppstore } from "react-icons/ai";
import { RiFolderImageFill } from 'react-icons/ri';


const iconClass = "text-gray-500 hover:text-black cursor-pointer";

const RightBar: React.FC = () => {
  return (
    <div className=" w-12 bg-white flex flex-col items-center py-6 fixed right-0 top-0 border-l border-gray-300">
      
      {/* Icons grouped with spacing */}
      <div className="flex flex-col items-center gap-6 pt-20 flex-1">

        <LuPanelRightOpen size={22} className={iconClass} />
        <MdSync size={22} className={iconClass} />
        <LuPencilLine size={22} className={iconClass} />

        <VscListSelection size={22} className={iconClass} />
        <AiTwotoneAppstore size={22} className={iconClass} />

        <MdGroups size={22} className={iconClass} />
        <MdAlternateEmail size={22} className={iconClass} />
        <RiFolderImageFill size={22} className={iconClass} />

        <MdTune size={22} className={iconClass} />
      </div>
    </div>
  );
};

export default RightBar;
