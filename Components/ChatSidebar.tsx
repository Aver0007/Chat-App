'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Search from '../Modules/Search';
import { User, Message } from '../types';
import Chat from './Chat';
import { TbMessageCirclePlus } from 'react-icons/tb';

type Props = {
  data: User[];
  onSelectUser: (user: User) => void;
};

type UserWithMessage = {
  user: User;
  message?: Message;
};

const ChatSidebar: React.FC<Props> = ({ data, onSelectUser }) => {
  const supabase = createClientComponentClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [chatList, setChatList] = useState<UserWithMessage[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserTag, setNewUserTag] = useState('');

  // Step 1: Get the current user’s ID
  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.log('Error getting user:', error);
        return;
      }
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getUser();
  }, [supabase]);

  // Step 2: Load chats for the current user
  useEffect(() => {
    if (!currentUserId || data.length === 0) return;

    const loadChats = async () => {
      // Find all users the current user has chatted with
      const { data: messages, error } = await supabase
        .from('chats')
        .select('*')
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`);

      if (error) {
        console.log('Error loading messages:', error);
        return;
      }

      // Get the list of users the current user has chatted with
      const userIds = new Set<string>();
      messages.forEach((msg: any) => {
        if (msg.sender_id === currentUserId) {
          userIds.add(msg.receiver_id);
        } else if (msg.receiver_id === currentUserId) {
          userIds.add(msg.sender_id);
        }
      });

      // Filter the data to only show users with conversations
      const usersToShow = data.filter(user => userIds.has(user.uid));

      // For each user, get their latest message
      const updatedChatList: UserWithMessage[] = [];
      for (const user of usersToShow) {
        const { data: latestMessage, error: msgError } = await supabase
          .from('chats')
          .select('*')
          .or(
            `and(sender_id.eq.${currentUserId},receiver_id.eq.${user.uid}),and(sender_id.eq.${user.uid},receiver_id.eq.${currentUserId})`
          )
          .order('sent_at', { ascending: false })
          .limit(1);

        if (msgError) {
          console.log('Error getting message for user:', user.uid, msgError);
          updatedChatList.push({ user });
          continue;
        }

        if (latestMessage && latestMessage.length > 0) {
          const message = {
            id: latestMessage[0].id,
            sender_id: latestMessage[0].sender_id,
            receiver_id: latestMessage[0].receiver_id,
            content: latestMessage[0].message,
            created_at: latestMessage[0].sent_at,
          } as Message;
          updatedChatList.push({ user, message });
        } else {
          updatedChatList.push({ user });
        }
      }

      // Sort chats by the latest message
      updatedChatList.sort((a, b) => {
        if (!a.message && !b.message) return 0;
        if (!a.message) return 1;
        if (!b.message) return -1;
        return new Date(b.message.created_at).getTime() - new Date(a.message.created_at).getTime();
      });

      setChatList(updatedChatList);
    };

    loadChats();

    // Step 3: Listen for new messages
    const channel = supabase
      .channel(`chat-updates-${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
          filter: `sender_id=eq.${currentUserId}`,
        },
        (payload) => {
          const newMessage = payload.new as any;
          handleNewMessage(newMessage);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
          filter: `receiver_id=eq.${currentUserId}`,
        },
        (payload) => {
          const newMessage = payload.new as any;
          handleNewMessage(newMessage);
        }
      )
      .subscribe();

    const handleNewMessage = (message: any) => {
      const otherUserId = message.sender_id === currentUserId ? message.receiver_id : message.sender_id;
      const userExists = data.find(user => user.uid === otherUserId);

      if (userExists) {
        const mappedMessage = {
          id: message.id,
          sender_id: message.sender_id,
          receiver_id: message.receiver_id,
          content: message.message,
          created_at: message.sent_at,
        } as Message;

        setChatList(prev => {
          const updatedList = [...prev];
          const userIndex = updatedList.findIndex(item => item.user.uid === otherUserId);

          if (userIndex !== -1) {
            updatedList[userIndex] = { ...updatedList[userIndex], message: mappedMessage };
          } else {
            updatedList.push({ user: userExists, message: mappedMessage });
          }

          updatedList.sort((a, b) => {
            if (!a.message && !b.message) return 0;
            if (!a.message) return 1;
            if (!b.message) return -1;
            return new Date(b.message.created_at).getTime() - new Date(a.message.created_at).getTime();
          });

          return updatedList;
        });
      }
    };

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, data, supabase]);

  // Step 4: Add a new user
  const addNewUser = async () => {
    // Validate: Name is required, and at least phone or email must be provided
    if (!newUserName) {
      alert('Please provide a name for the contact.');
      return;
    }

    if (!newUserPhone && !newUserEmail) {
      alert('Please provide either a phone number or email.');
      return;
    }

    // Step 4.1: Check if the user is registered and has logged in using the RPC function
    const { data: isValidUser, error: checkError } = await supabase
      .rpc('check_user_registration', { p_email: newUserEmail || '', p_phone: newUserPhone || '' });

    if (checkError) {
      console.log('Error checking user registration:', checkError.message);
      alert('Error checking user registration. Please try again.');
      return;
    }

    if (!isValidUser) {
      alert('This user is either not registered or has not logged in yet.');
      setShowDialog(false);
      setNewUserName('');
      setNewUserPhone('');
      setNewUserEmail('');
      setNewUserTag('');
      return;
    }

    // Step 4.2: Check if the user already exists in the users table
    const { data: existingUsers, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .or(`phone.eq.${newUserPhone}${newUserEmail ? `,email.eq.${newUserEmail}` : ''}`);

    if (fetchError) {
      console.log('Error checking if user exists:', fetchError.message);
      alert('Error checking user. Please try again.');
      return;
    }

    let selectedUser: User;

    if (existingUsers && existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      // Update the existing user with new details
      const updatedUser = {
        name: newUserName,
        phone: newUserPhone || existingUser.phone,
        email: newUserEmail || existingUser.email,
        tag: newUserTag || existingUser.tag || 'Personal',
        avatar_url: existingUser.avatar_url || null,
      };

      const { error: updateError } = await supabase
        .from('users')
        .update(updatedUser)
        .eq('id', existingUser.id);

      if (updateError) {
        console.log('Error updating user:', updateError.message);
        alert('Error updating user. Please try again.');
        return;
      }

      selectedUser = {
        uid: existingUser.id,
        name: updatedUser.name,
        image: updatedUser.avatar_url || '',
        phone: updatedUser.phone || null, // Ensure phone can be null
        email: updatedUser.email,
        tag: updatedUser.tag,
      };
    } else {
      // Add the new user to the users table
      const newUser = {
        name: newUserName,
        phone: newUserPhone || null, // Set to null if not provided
        email: newUserEmail || null,
        tag: newUserTag || 'Personal',
        avatar_url: null,
      };

      const { data: newUserData, error: insertError } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .single();

      if (insertError) {
        console.log('Error adding new user:', insertError.message);
        alert('Error adding new user. Please try again.');
        return;
      }

      selectedUser = {
        uid: newUserData.id,
        name: newUserData.name,
        image: newUserData.avatar_url || '',
        phone: newUserData.phone || null, // Ensure phone can be null
        email: newUserData.email,
        tag: newUserData.tag,
      };
    }

    // Add the user to the chat list with a virtual timestamp
    const currentTime = new Date().toISOString();
    const virtualMessage: Message = {
      id: `virtual-${selectedUser.uid}`,
      sender_id: currentUserId || '',
      receiver_id: selectedUser.uid,
      content: '',
      created_at: currentTime,
    };

    setChatList(prev => {
      const updatedList = [...prev];
      const userIndex = updatedList.findIndex(item => item.user.uid === selectedUser.uid);

      if (userIndex !== -1) {
        updatedList[userIndex] = { user: selectedUser, message: virtualMessage };
      } else {
        updatedList.push({ user: selectedUser, message: virtualMessage });
      }

      updatedList.sort((a, b) => {
        if (!a.message && !b.message) return 0;
        if (!a.message) return 1;
        if (!b.message) return -1;
        return new Date(b.message.created_at).getTime() - new Date(a.message.created_at).getTime();
      });

      return updatedList;
    });

    // Close the dialog and open the chat
    setShowDialog(false);
    setNewUserName('');
    setNewUserPhone('');
    setNewUserEmail('');
    setNewUserTag('');
    onSelectUser(selectedUser);
  };

  return (
    <div className="relative h-full w-full">
      {/* Show the chat list */}
      <div className="h-full overflow-y-auto pb-20">
        <Search />
        {chatList.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No chats yet. Start a new conversation!
          </div>
        ) : (
          chatList.map((item) => (
            <div key={item.user.uid} onClick={() => onSelectUser(item.user)}>
              <Chat data={item.user} lastMessage={item.message} />
            </div>
          ))
        )}
      </div>

      {/* Button to open the dialog */}
      <button
        className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg z-10"
        title="New Chat"
        onClick={() => setShowDialog(true)}
      >
        <TbMessageCirclePlus size={20} />
      </button>

      {/* Dialog to add a new user */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-80 max-h-[80vh] flex flex-col">
            <h2 className="text-lg font-medium mb-4">Add New Contact</h2>
            <div className="pt-4">
              <input
                type="text"
                placeholder="Name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-2 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Phone Number (Optional)"
                value={newUserPhone}
                onChange={(e) => setNewUserPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-2 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email (Optional)"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-2 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Tag (e.g., Work, Friend)"
                value={newUserTag}
                onChange={(e) => setNewUserTag(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowDialog(false);
                    setNewUserName('');
                    setNewUserPhone('');
                    setNewUserEmail('');
                    setNewUserTag('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewUser}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add & Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;