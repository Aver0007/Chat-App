'use client';
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
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

const iconClass = "text-gray-500 hover:text-black cursor-pointer";



const Iconsbar: React.FC = () => {

  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error.message);
    } else {
      router.push('/login'); 
    }
  };

  return (
    <div className="h-screen w-12 bg-white flex flex-col justify-between items-center py-2">
      

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


      <div className="flex flex-col items-center gap-4">
        <TbStarsFilled size={22} className={iconClass} />
        <button className='flex flex-col items-center' onClick={handleLogout}>
          <ImExit
            size={22}
            className="text-gray-600 text-sm hover:text-black cursor-pointer"
            title="Logout"
           />
      </button>
      </div>     
      
    </div>
  );
};

export default Iconsbar;
