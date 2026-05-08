import React, { useState } from 'react';
import { MessageSquare, Megaphone, Users, Search, Plus } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { Announcements } from './Announcements';
import { ContactsList } from './ContactsList';

export function CommunicationPortalModule() {
  const [activeTab, setActiveTab] = useState<'chat' | 'announcements' | 'contacts'>('chat');
  const [chatTarget, setChatTarget] = useState<any>(null);

  const handleStartChat = (user: any) => {
    setChatTarget(user);
    setActiveTab('chat');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex-none p-4 lg:p-6 pb-0 border-b border-slate-200 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              Communication Portal
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Internal messaging, announcements, and team directory</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto hide-scrollbar">
          <div className="flex space-x-1 min-w-max pb-px">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors relative ${
                activeTab === 'chat' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Direct Messages
              {activeTab === 'chat' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors relative ${
                activeTab === 'announcements' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              Announcements
              {activeTab === 'announcements' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors relative ${
                activeTab === 'contacts' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg'
              }`}
            >
              <Users className="w-4 h-4" />
              Directory
              {activeTab === 'contacts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-slate-50">
        {activeTab === 'chat' && <ChatInterface initialTarget={chatTarget} />}
        {activeTab === 'announcements' && <Announcements />}
        {activeTab === 'contacts' && <ContactsList onMessageClick={handleStartChat} />}
      </div>
    </div>
  );
}
