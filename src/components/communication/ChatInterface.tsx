import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, File, Image as ImageIcon, Smile, Phone, Video, Users, Plus, X, UserCircle, Trash2 } from 'lucide-react';

export function ChatInterface({ initialTarget }: { initialTarget?: any }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  const [showNewChatOverlay, setShowNewChatOverlay] = useState(false);
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [groupName, setGroupName] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Load User Data
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userProfile') || localStorage.getItem('aqm_current_user');
      if (storedUser) setCurrentUser(JSON.parse(storedUser));
      
      const storedUsers = localStorage.getItem('aqm_users');
      if (storedUsers) setUsers(JSON.parse(storedUsers));
    } catch (e) {
      console.error('Failed to load user data', e);
    }
  }, []);

  // Load Data
  useEffect(() => {
    if (!currentUser) return;
    
    try {
      const rawConvos = localStorage.getItem('aqm_conversations');
      const allConvos = rawConvos ? JSON.parse(rawConvos) : [];
      // Only show conversations where current user is a participant
      const myConvos = allConvos.filter((c: any) => c.participants.includes(currentUser.email));
      setConversations(myConvos);

      const rawMsgs = localStorage.getItem('aqm_messages');
      if (rawMsgs) setMessages(JSON.parse(rawMsgs));
    } catch (e) {
      console.error('Failed to load chat data', e);
    }
  }, [currentUser]);

  // Handle Initial Target
  useEffect(() => {
    if (initialTarget && currentUser) {
      openDirectMessage(initialTarget);
    }
  }, [initialTarget, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeConversationId]);

  const isSuperAdmin = currentUser?.role === 'Super Admin';

  const openDirectMessage = (targetUser: any) => {
    if (!currentUser || targetUser.email === currentUser.email) return;

    // Check if conversation already exists
    const rawConvos = localStorage.getItem('aqm_conversations');
    const allConvos = rawConvos ? JSON.parse(rawConvos) : [];
    
    let existingConvo = allConvos.find((c: any) => 
      !c.isGroup && 
      c.participants.includes(currentUser.email) && 
      c.participants.includes(targetUser.email)
    );

    let convoId = existingConvo?.id;

    if (!existingConvo) {
      const newConvo = {
        id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        isGroup: false,
        participants: [currentUser.email, targetUser.email],
        name: '',
        lastMessage: '',
        lastMessageTime: new Date().toISOString()
      };
      
      allConvos.push(newConvo);
      localStorage.setItem('aqm_conversations', JSON.stringify(allConvos));
      existingConvo = newConvo;
      convoId = newConvo.id;
      
      setConversations(allConvos.filter((c: any) => c.participants.includes(currentUser.email)));
    }
    
    setActiveConversationId(convoId);
    setShowNewChatOverlay(false);
  };

  const createGroupChat = () => {
    if (!currentUser || selectedUsers.length === 0 || !groupName.trim()) return;

    const rawConvos = localStorage.getItem('aqm_conversations');
    const allConvos = rawConvos ? JSON.parse(rawConvos) : [];

    const newConvo = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isGroup: true,
      participants: [currentUser.email, ...selectedUsers.map(u => u.email)],
      name: groupName.trim(),
      lastMessage: '',
      lastMessageTime: new Date().toISOString()
    };

    allConvos.push(newConvo);
    localStorage.setItem('aqm_conversations', JSON.stringify(allConvos));
    
    setConversations(allConvos.filter((c: any) => c.participants.includes(currentUser.email)));
    setActiveConversationId(newConvo.id);
    
    // Reset state
    setShowNewChatOverlay(false);
    setIsGroupMode(false);
    setSelectedUsers([]);
    setGroupName('');
  };

  const handleSend = () => {
    if (!newMessage.trim() || !currentUser || !activeConversationId) return;
    
    const newMsg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId: activeConversationId,
      senderEmail: currentUser.email,
      senderName: currentUser.name || currentUser.username || currentUser.email,
      text: newMessage,
      time: new Date().toISOString()
    };

    try {
      const rawMsgs = localStorage.getItem('aqm_messages');
      const allMsgs = rawMsgs ? JSON.parse(rawMsgs) : [];
      allMsgs.push(newMsg);
      localStorage.setItem('aqm_messages', JSON.stringify(allMsgs));
      setMessages(allMsgs);
      
      // Update last message in conversation
      const rawConvos = localStorage.getItem('aqm_conversations');
      if (rawConvos) {
        const allConvos = JSON.parse(rawConvos);
        const convoIndex = allConvos.findIndex((c: any) => c.id === activeConversationId);
        if (convoIndex !== -1) {
          allConvos[convoIndex].lastMessage = newMessage;
          allConvos[convoIndex].lastMessageTime = new Date().toISOString();
          localStorage.setItem('aqm_conversations', JSON.stringify(allConvos));
          setConversations(allConvos.filter((c: any) => c.participants.includes(currentUser.email)));
        }
      }

      setNewMessage('');
    } catch(e) {
      console.error(e);
    }
  };

  const deleteGroupChat = (id: string) => {
    try {
      const rawConvos = localStorage.getItem('aqm_conversations');
      if (rawConvos) {
        let allConvos = JSON.parse(rawConvos);
        allConvos = allConvos.filter((c: any) => c.id !== id);
        localStorage.setItem('aqm_conversations', JSON.stringify(allConvos));
        setConversations(allConvos.filter((c: any) => c.participants.includes(currentUser.email)));
      }
      
      const rawMsgs = localStorage.getItem('aqm_messages');
      if (rawMsgs) {
        let allMsgs = JSON.parse(rawMsgs);
        allMsgs = allMsgs.filter((m: any) => m.conversationId !== id);
        localStorage.setItem('aqm_messages', JSON.stringify(allMsgs));
        setMessages(allMsgs);
      }
      
      setActiveConversationId(null);
    } catch(e) {
      console.error(e);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser || !activeConversationId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Image = event.target?.result as string;
      
      const newMsg = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversationId: activeConversationId,
        senderEmail: currentUser.email,
        senderName: currentUser.name || currentUser.username || currentUser.email,
        text: 'Sent an image',
        imageUrl: base64Image,
        time: new Date().toISOString()
      };

      try {
        const rawMsgs = localStorage.getItem('aqm_messages');
        const allMsgs = rawMsgs ? JSON.parse(rawMsgs) : [];
        allMsgs.push(newMsg);
        localStorage.setItem('aqm_messages', JSON.stringify(allMsgs));
        setMessages(allMsgs);
        
        // Update last message in conversation
        const rawConvos = localStorage.getItem('aqm_conversations');
        if (rawConvos) {
          const allConvos = JSON.parse(rawConvos);
          const convoIndex = allConvos.findIndex((c: any) => c.id === activeConversationId);
          if (convoIndex !== -1) {
            allConvos[convoIndex].lastMessage = '📷 Image';
            allConvos[convoIndex].lastMessageTime = new Date().toISOString();
            localStorage.setItem('aqm_conversations', JSON.stringify(allConvos));
            setConversations(allConvos.filter((c: any) => c.participants.includes(currentUser.email)));
          }
        }
      } catch(e) {
        console.error(e);
      }
    };
    reader.readAsDataURL(file);
    if (imageInputRef.current) {
        imageInputRef.current.value = '';
    }
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeMessages = messages.filter(m => m.conversationId === activeConversationId);

  // Helper to format time
  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper to get chat display details
  const getChatDetails = (convo: any) => {
    if (convo.isGroup) {
      return {
        name: convo.name || 'Group Chat',
        avatarText: (convo.name || 'G').charAt(0),
        subtitle: `${convo.participants.length} participants`,
      };
    }
    const otherEmail = convo.participants.find((p: string) => p !== currentUser?.email);
    const otherUser = users.find(u => u.email === otherEmail);
    return {
      name: otherUser ? otherUser.name : otherEmail || 'Unknown',
      avatarText: otherUser ? (otherUser.name ? otherUser.name.charAt(0) : 'U') : 'U',
      avatarUrl: otherUser?.imageUrl,
      subtitle: otherUser ? otherUser.role : '',
      online: otherUser?.status === 'Active' || otherUser?.status === 'Online'
    };
  };

  return (
    <div className="flex h-full bg-white relative">
      {/* Sidebar - Conversations List */}
      <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col bg-white h-full ${activeConversationId && !showNewChatOverlay ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-slate-900">Conversations</h2>
            <button 
              onClick={() => { setShowNewChatOverlay(true); setIsGroupMode(false); setSelectedUsers([]); }}
              className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 sm:p-6 text-center text-slate-500 text-sm">
              No conversations yet. <br/> Click + to start a new chat.
            </div>
          ) : (
            conversations.sort((a, b) => new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime()).map(convo => {
              const details = getChatDetails(convo);
              return (
                <button
                  key={convo.id}
                  onClick={() => { setActiveConversationId(convo.id); setShowNewChatOverlay(false); }}
                  className={`w-full p-4 flex items-start gap-3 border-b border-slate-100 hover:bg-slate-50 transition-colors text-left ${
                    activeConversationId === convo.id ? 'bg-blue-50/50 border-l-2 border-l-blue-600' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    {details.avatarUrl && !convo.isGroup ? (
                      <img src={details.avatarUrl} alt={details.name} className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${convo.isGroup ? 'bg-indigo-500' : 'bg-blue-500'}`}>
                        {convo.isGroup ? <Users className="w-5 h-5" /> : details.avatarText}
                      </div>
                    )}
                    {details.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{details.name}</h3>
                      {convo.lastMessageTime && <span className="text-xs text-slate-400 shrink-0 ml-2">{formatTime(convo.lastMessageTime)}</span>}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{convo.lastMessage || 'No messages yet'}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col min-w-0 h-full ${!activeConversationId && !showNewChatOverlay ? 'hidden md:flex items-center justify-center bg-slate-50' : 'flex'}`}>
        {!activeConversationId && !showNewChatOverlay ? (
          <div className="text-center text-slate-500">
            <UserCircle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-semibold text-slate-700">Select a conversation</p>
            <p className="text-sm mt-1">Or start a new one from the menu</p>
          </div>
        ) : showNewChatOverlay ? (
          // New Chat / Group Chat Overlay
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center shrink-0">
              <h2 className="font-bold text-slate-900">{isGroupMode ? 'Create Group Chat' : 'New Message'}</h2>
              <button onClick={() => setShowNewChatOverlay(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-4 border-b border-slate-100 flex flex-col gap-4 shrink-0">
              {isSuperAdmin && (
                <div className="flex justify-start">
                  <button 
                    onClick={() => { setIsGroupMode(!isGroupMode); setSelectedUsers([]); setGroupName(''); }}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isGroupMode ? 'Switch to Direct Message' : <><Users className="w-4 h-4"/> Create Group Chat</>}
                  </button>
                </div>
              )}
              
              {isGroupMode && (
                <div>
                  <input 
                    type="text" 
                    placeholder="Group Name" 
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}
              
              {isGroupMode && selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map(u => (
                    <span key={u.email} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1 font-medium">
                      {u.name}
                      <button onClick={() => setSelectedUsers(selectedUsers.filter(user => user.email !== u.email))} className="hover:text-blue-900"><X className="w-3 h-3"/></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">All Contacts</h3>
              {users.filter(u => u.email !== currentUser?.email).map(user => {
                const isSelected = selectedUsers.some(u => u.email === user.email);
                return (
                  <button
                    key={user.email}
                    onClick={() => {
                      if (isGroupMode) {
                        if (isSelected) {
                          setSelectedUsers(selectedUsers.filter(u => u.email !== user.email));
                        } else {
                          setSelectedUsers([...selectedUsers, user]);
                        }
                      } else {
                        openDirectMessage(user);
                      }
                    }}
                    className="w-full flex items-center p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100 mb-2 gap-3"
                  >
                    {isGroupMode && (
                      <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                        {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    )}
                    {user.imageUrl ? (
                      <img src={user.imageUrl} alt={user.name} className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                        {user.name ? user.name.charAt(0) : 'U'}
                      </div>
                    )}
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-bold text-slate-900 text-sm truncate">{user.name}</div>
                      <div className="text-xs text-slate-500 truncate">{user.role}</div>
                    </div>
                  </button>
                )
              })}
            </div>
            
            {isGroupMode && (
              <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0">
                <button 
                  onClick={createGroupChat}
                  disabled={selectedUsers.length === 0 || !groupName.trim()}
                  className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Create Group Chat
                </button>
              </div>
            )}
          </div>
        ) : activeConversation && (
          // Active Chat View
          <div className="flex flex-col h-full overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 flex items-center justify-between bg-white border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveConversationId(null)}
                  className="p-1 -ml-2 text-slate-400 hover:text-slate-600 md:hidden"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="relative">
                  {getChatDetails(activeConversation).avatarUrl && !activeConversation.isGroup ? (
                    <img src={getChatDetails(activeConversation).avatarUrl} alt="" className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
                  ) : (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${activeConversation.isGroup ? 'bg-indigo-500' : 'bg-blue-500'}`}>
                      {activeConversation.isGroup ? <Users className="w-5 h-5"/> : getChatDetails(activeConversation).avatarText}
                    </div>
                  )}
                  {getChatDetails(activeConversation).online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{getChatDetails(activeConversation).name}</h2>
                  <p className="text-xs text-slate-500">{getChatDetails(activeConversation).subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                {activeConversation.isGroup && isSuperAdmin && (
                  <button 
                    onClick={() => deleteGroupChat(activeConversation.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex"
                    title="Delete Group Chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors hidden sm:flex">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors hidden sm:flex">
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 flex flex-col gap-4 min-h-0">
              {activeMessages.length === 0 ? (
                <div className="text-center text-slate-500 text-sm my-auto">
                  Say hi to start the conversation!
                </div>
              ) : (
                activeMessages.map((msg: any) => {
                  const isMine = msg.senderEmail === currentUser?.email;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      {!isMine && activeConversation.isGroup && (
                        <div className="text-xs font-semibold text-slate-500 ml-1 mb-1">{msg.senderName}</div>
                      )}
                      <div 
                         className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                          isMine 
                            ? 'bg-blue-600 text-white rounded-br-sm' 
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm'
                        }`}
                      >
                        {msg.imageUrl ? (
                          <div className="flex flex-col gap-2">
                            <img src={msg.imageUrl} alt="Uploaded image" className="max-w-full rounded-lg max-h-64 object-contain bg-black/5" />
                            {msg.text !== 'Sent an image' && <span>{msg.text}</span>}
                          </div>
                        ) : (
                          msg.text
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 mx-1 font-medium">{formatTime(msg.time)}</span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 sm:p-4 border-t border-slate-200 bg-white shrink-0">
              <div className="flex items-end gap-2">
                <div className="flex items-center gap-1 shrink-0 pb-1 hidden sm:flex">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <File className="w-5 h-5" />
                  </button>
                  <label className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                    <ImageIcon className="w-5 h-5" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={imageInputRef}
                      onChange={handleImageUpload} 
                    />
                  </label>
                </div>
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type a message..."
                    className="w-full bg-transparent border-none focus:outline-none resize-none text-sm text-slate-900 placeholder:text-slate-400 min-h-[24px] max-h-32"
                    rows={1}
                  />
                </div>
                <button 
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 flex items-center justify-center shadow-sm"
                >
                  <Send className="w-4 h-4 sm:ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
