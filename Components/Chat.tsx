import React from 'react';
import Image from 'next/image';
import { FaPhoneAlt, FaUserCircle } from 'react-icons/fa';
import { User, Message } from '../types';

type Props = {
  data: User;
  lastMessage?: Message | null;
};

const Chat: React.FC<Props> = ({ data, lastMessage }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const messageDate = new Date(dateString);
    const today = new Date('2025-05-28T21:33:00+05:30');
    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      return 'Today';
    }

    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex items-center justify-between py-1.5 pr-2 px-3 bg-white border-b border-gray-100 hover:bg-gray-100 cursor-pointer">

      {/* Profile picture */}
      <div className="flex-shrink-0">
        {data.image ? 
        (
          <Image
            src={data.image}
            alt="user"
            width={36}
            height={36}
            className="rounded-full"
          />
        ) : (
          <FaUserCircle className="w-9 h-9 text-gray-400" />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-center ml-3 flex-grow overflow-hidden gap-[2px]">
        <p className="font-medium text-[13px] text-black truncate">
          {data.name}
        </p>
        <p className="text-[12px] text-gray-600 truncate w-full">
          {lastMessage ? lastMessage.content : ''} 
        </p>
        <p className="flex flex-row gap-1 items-center text-[10px] text-gray-500 bg-gray-100 rounded-md w-fit px-1.5 py-[2px]">
          <FaPhoneAlt size={8} />
          {data.phone || 'N/A'} 
        </p>
      </div>

      {/* rightside */}
      <div className="flex flex-col items-end justify-between h-full gap-[2px] ml-2">
        {/* tag */}
        <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-[2px] rounded-sm font-medium">
          {data.tag || ''} 
        </span>

        {/* mini*/}
        {data.image ? (
          <Image
            src={data.image}
            alt="mini-avatar"
            width={16}
            height={16}
            className="rounded-full"
          />
        ) : (
          <FaUserCircle className="w-4 h-4 text-gray-400" />
        )}

        {/* Date */}
        <p className="text-[10px] text-gray-500">
          {lastMessage ? formatDate(lastMessage.created_at) : 'N/A'} 
        </p>
      </div>
    </div>
  );
};

export default Chat;