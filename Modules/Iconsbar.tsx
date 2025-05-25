import React from 'react';
import Image from 'next/image';
import { AiFillHome } from 'react-icons/ai';
import { IoChatbubbleEllipses, IoTicket } from 'react-icons/io5';
import { GoGraph } from 'react-icons/go';
import { MdList } from 'react-icons/md';
import { FaBullhorn } from 'react-icons/fa';
import { TbBinaryTree2 } from "react-icons/tb";
import { FaAddressBook } from 'react-icons/fa6';
import { RiFolderImageFill, RiSettings5Fill } from 'react-icons/ri';
import { MdChecklist } from 'react-icons/md';
import { TbStarsFilled } from "react-icons/tb";
import { ImExit } from "react-icons/im";

const iconClass = "text-gray-500 hover:text-black cursor-pointer";

const Iconsbar: React.FC = () => {
  return (
    <div className="h-screen w-12 bg-white flex flex-col justify-between items-center py-2">
      
      {/* Top and middle icons */}
      <div className="flex flex-col items-center gap-3">
        <Image
          src="/Periskope.png"
          alt="Periskope Logo"
          width={30}
          height={30}
        />
        <AiFillHome size={22} className={iconClass} />
        <div className="w-full border-t border-gray-300 my-1" />
        <IoChatbubbleEllipses size={22} className={iconClass} />
        <IoTicket size={22} className={iconClass} />
        <GoGraph size={22} className={iconClass} />
        <div className="w-full border-t border-gray-300 my-1" />
        <MdList size={22} className={iconClass} />
        <FaBullhorn size={22} className={iconClass} />
        <TbBinaryTree2 size={22} className={iconClass} />
        <div className="w-full border-t border-gray-300 my-1" />
        <FaAddressBook size={22} className={iconClass} />
        <RiFolderImageFill size={22} className={iconClass} />
        <div className="w-full border-t border-gray-300 my-1" />
        <MdChecklist size={22} className={iconClass} />
        <RiSettings5Fill size={22} className={iconClass} />
      </div>

      {/* Bottom two icons */}
      <div className="flex flex-col items-center gap-4">
        <TbStarsFilled size={22} className={iconClass} />
        <ImExit size={22} className={iconClass} />
      </div>
      
    </div>
  );
};

export default Iconsbar;
