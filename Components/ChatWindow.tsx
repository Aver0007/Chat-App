'use client';
import React, { useEffect, useRef, useState } from 'react';
import { User as SupaUser } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User, Message } from '../types';
import { HiSparkles } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import { IoSend } from "react-icons/io5";
import { GrAttachment } from "react-icons/gr";
import { VscSmiley } from "react-icons/vsc";
import { LuClock4 } from "react-icons/lu";
import { PiClockClockwiseBold } from "react-icons/pi";
import { HiOutlineSparkles } from "react-icons/hi";
import { PiNoteFill } from "react-icons/pi";
import { FaMicrophone } from "react-icons/fa";
import { RiExpandUpDownLine } from "react-icons/ri";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';


type ChatMessage = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  sent_at: string;
};

type Props = {
  user: User | null;
  currentUser: SupaUser;
};

const ChatWindow: React.FC<Props> = ({ user, currentUser }) => {
  const supabase = createClientComponentClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null); // Ref for the input field

  //Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  //Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  //Fetch messages and setup real-time listener
  useEffect(() => {
    if (!user || !user.uid || !currentUser?.id) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${user.uid}),and(sender_id.eq.${user.uid},receiver_id.eq.${currentUser.id})`
        )
        .order('sent_at', { ascending: true });

      if (!error && data) {
        const mappedMessages = (data as ChatMessage[]).map((msg) => ({
          id: msg.id,
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          content: msg.message,
          created_at: msg.sent_at,
        }));
        setMessages(mappedMessages as Message[]);
      } else if (error) {
        console.error('Error fetching messages:', error.message, error.details);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`realtime:chats:${currentUser.id}:${user.uid}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
        },
        (payload) => {
          const message = payload.new as ChatMessage;
          if (
            (message.sender_id === currentUser.id && message.receiver_id === user.uid) ||
            (message.sender_id === user.uid && message.receiver_id === currentUser.id)
          ) {
            const mappedMessage = {
              id: message.id,
              sender_id: message.sender_id,
              receiver_id: message.receiver_id,
              content: message.message,
              created_at: message.sent_at,
            };
            setMessages((prev) => [...prev, mappedMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, currentUser?.id, supabase]);

  //Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !user || !user.uid || !currentUser?.id) return;

    const payload = {
      sender_id: currentUser.id,
      receiver_id: user.uid,
      message: newMessage.trim(),
      sent_at: new Date().toISOString(),
    };

    console.log("Payload:", payload);

    const { error, data } = await supabase.from("chats").insert(payload).select();

    if (error) {
      console.error("Message send failed:", error.message, error.details);
      alert(`Message send failed: ${error.message || JSON.stringify(error)}`);
    } else {
      console.log("Message sent:", data);
      setNewMessage('');
    }
  };

  //Handle emoji selection
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const input = inputRef.current;
    if (!input) return;

    const cursorPosition = input.selectionStart ?? newMessage.length;
    const newText =
      newMessage.slice(0, cursorPosition) +
      emojiData.emoji +
      newMessage.slice(cursorPosition);

    setNewMessage(newText);

    //Restore cursor position after the emoji
    setTimeout(() => {
      input.focus();
      input.selectionStart = cursorPosition + emojiData.emoji.length;
      input.selectionEnd = cursorPosition + emojiData.emoji.length;
    }, 0);
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
        <div className="flex items-center gap-3">
          {user.image ? (
            <Image src={user.image} alt="avatar" width={32} height={32} className="rounded-full" />
          ) : (
            <FaUserCircle className="w-8 h-8 text-gray-400" />
          )}
          <div className="flex flex-col">
            <p className="font-medium text-sm">{user.name || user.email}</p>
            <p className="text-xs text-gray-500">{user.tag}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 pr-3">
          <HiSparkles className="text-black" />
          <CiSearch size={20} className="text-black" />
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          backgroundImage: "url('/Whatsapp.jpg')",
          backgroundRepeat: 'repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'top left',
        }}
      >
        <div className="px-4 py-2 flex flex-col space-y-2">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`px-4 py-2 rounded-md max-w-xs text-sm break-words whitespace-pre-wrap ${
                msg.sender_id === currentUser.id
                  ? 'bg-green-100 self-end text-right'
                  : 'bg-white self-start text-left'
              }`}
            >
              {msg.content}
              <div className="text-[10px] text-gray-500 mt-1">
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="px-1 py-2 bg-gray-50 relative">
        <div>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              ref={inputRef} 
              type="text"
              placeholder="Message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-2 text-sm bg-white rounded-sm focus:outline-none"
            />
            <button
              type="submit"
              className="text-green-700 bg-gray-50 p-2 rounded-full hover:bg-green-300 transition"
            >
              <IoSend size={20} />
            </button>
          </form>
        </div>
        {/* Emoji bar */}
        <div className='flex flex-row justify-between pt-2'>
          <div className='py-2 flex flex-row items-center pl-4 gap-6 text-gray-700'>
            <GrAttachment size={18}/> 
            <div className="relative">
              <VscSmiley
                size={18}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="cursor-pointer"
                aria-label="Open emoji picker"
              />
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-12 left-0 z-10"
                >
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
            <LuClock4 size={18}/>
            <PiClockClockwiseBold size={18}/>
            <HiOutlineSparkles size={18}/>
            <PiNoteFill size={18}/>
            <FaMicrophone size={18}/>
          </div>
          <div className="flex items-center gap-1 mr-2.5 px-0.5 py-1 bg-white border border-gray-200 rounded-md shadow-sm h-7 text-xs">
            <Image
              src="/Periskope.png"
              alt="Periskope Logo"
              width={14}
              height={14}
              className="rounded-full"
            />
            <p className="font-medium text-gray-800">Periskope</p>
            <div className='w-5'></div>
            <RiExpandUpDownLine size={12} className="text-gray-500 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;