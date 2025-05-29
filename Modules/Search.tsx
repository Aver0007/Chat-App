'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { CiSearch } from 'react-icons/ci';
import { IoFilter } from 'react-icons/io5';
import { RiFolderDownloadFill } from 'react-icons/ri';
import { User, Message } from '../types';

type ChatMessage = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  sent_at: string;
};

type UserWithMessage = {
  user: User;
  message?: Message;
};

type SearchResult = {
  type: 'user' | 'message';
  user?: User;
  message?: Message;
};

type Props = {
  currentUserId: string;
  chatList: UserWithMessage[]; 
  onSelectUser: (user: User) => void;
};

const Search: React.FC<Props> = ({ currentUserId, chatList, onSelectUser }) => {
  const supabase = createClientComponentClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'users' | 'messages'>('users');
  const [showFilter, setShowFilter] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const filterRef = useRef<HTMLDivElement | null>(null);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilter]);

  //search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      if (filter === 'users') {
        const filteredUsers = chatList.filter((item) =>
          item.user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setResults(
          filteredUsers.map((item) => ({
            type: 'user',
            user: item.user,
          }))
        );
      } else if (filter === 'messages') {
        const { data: chatMessages, error } = await supabase
          .from('chats')
          .select('*')
          .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
          .ilike('message', `%${searchQuery}%`);

        if (error) {
          console.error('Error searching chat messages:', error);
          return;
        }

        const chatResults = chatMessages?.map((msg: ChatMessage) => ({
          type: 'message' as const,
          message: {
            id: msg.id,
            sender_id: msg.sender_id,
            receiver_id: msg.receiver_id,
            content: msg.message,
            created_at: msg.sent_at,
          },
        })) || [];

        setResults(chatResults);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, filter, currentUserId, chatList, supabase]);

  const handleResultClick = async (result: SearchResult) => {
    if (result.type === 'user' && result.user) {
      onSelectUser(result.user);
      setSearchQuery('');
      setResults([]);
    } else if (result.type === 'message' && result.message) {
      const otherUserId =
        result.message.sender_id === currentUserId
          ? result.message.receiver_id
          : result.message.sender_id;
      const user = chatList.find((item) => item.user.uid === otherUserId)?.user;
      if (user) {
        onSelectUser(user);
        setSearchQuery('');
        setResults([]);
      }
    }
  };

  return (
    <div className="relative flex items-center justify-between px-2 py-1 border-b border-gray-200 bg-gray-100 h-12 w-full">
      {/* Custom filter*/}
      <div className="flex items-center gap-2">
        <RiFolderDownloadFill className="text-green-600" size={18} />
        <span className="text-green-600 font-semibold text-sm">Custom filter</span>
        <button className="text-sm border px-2 py-1 rounded bg-white text-gray-700 border-gray-300 hover:bg-gray-50">
          Save
        </button>
      </div>

      {/*Search and filter */}
      <div className="flex items-center gap-2">
        {/* Search bar */}
        <div className="flex items-center bg-white px-1 py-1 rounded-md border border-gray-300">
          <CiSearch className="text-gray-900" size={15} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-1 bg-transparent text-sm text-gray-900 placeholder-gray-600 outline-none w-[50px] focus:w-[100px] transition-all"
          />
        </div>

        {/*filter */}
        <div className="relative" ref={filterRef}>
          <div
            className="flex items-center bg-white px-3 py-1 rounded-md border border-gray-300 text-green-600 text-sm font-medium cursor-pointer"
            onClick={() => setShowFilter(!showFilter)}
          >
            <IoFilter size={16} className="mr-1" />
            Filter
          </div>
          {showFilter && (
            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <button
                onClick={() => {
                  setFilter('users');
                  setShowFilter(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                  filter === 'users' ? 'bg-gray-100' : ''
                }`}
              >
                Users
              </button>
              <button
                onClick={() => {
                  setFilter('messages');
                  setShowFilter(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                  filter === 'messages' ? 'bg-gray-100' : ''
                }`}
              >
                Messages
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search result*/}
      {results.length > 0 && (
        <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-64 overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={index}
              onClick={() => handleResultClick(result)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
            >
              {result.type === 'user' && result.user && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">{result.user.name}</span>
                  <span className="text-gray-500 text-sm">{result.user.tag}</span>
                </div>
              )}
              {result.type === 'message' && result.message && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">{result.message.content}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(result.message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(Search);