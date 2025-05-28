'use client';
import { useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import ChatSidebar from "../../Components/ChatSidebar";
import ChatWindow from "../../Components/ChatWindow";
import Iconsbar from "../../Modules/Iconsbar";
import RightBar from "../../Modules/RightBar";
import TopBar from "../../Modules/TopBar";
import { User } from "../../types";

export default function Home() {
  const currentUser = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter(); 

  useEffect(() => {
    if (currentUser === null) {
      router.push('/login');
      return;
    }

    const init = async () => {
      const res = await fetch('/api/users/fetch');
      const fetched = await res.json();
      setUsers(fetched);
    };

    init();
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-[3.5rem] bg-white border-r border-gray-300 flex flex-col items-center py-2">
        <Iconsbar />
      </div>
      <div className="flex flex-col flex-1">
        <div className="h-12 w-full bg-white border-b border-gray-300 flex items-center justify-between px-4">
          <TopBar />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[24rem] border-r border-gray-300 overflow-y-auto">
            <ChatSidebar data={users} onSelectUser={setSelectedUser} />
          </div>
          <div className="flex-1 bg-[#f0f2f5] overflow-y-auto">
            <ChatWindow user={selectedUser} currentUser={currentUser} />
          </div>
          <div className="w-[3rem] bg-white border-l border-gray-300 flex flex-col items-center py-2">
            <RightBar />
          </div>
        </div>
      </div>
    </div>
  );
}