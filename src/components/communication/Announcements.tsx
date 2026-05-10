import { apiStorage } from '../../utils/apiStorage';
import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar as CalendarIcon, Clock, AlertCircle, Plus, Send, X, Users, User, ArrowLeft } from 'lucide-react';

export function Announcements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    targetType: 'all', // 'all', 'group', 'user'
    targetId: ''
  });

  useEffect(() => {
    try {
      const storedUser = apiStorage.getItem('userProfile') || apiStorage.getItem('aqm_current_user');
      if (storedUser) setCurrentUser(JSON.parse(storedUser));
      
      const storedUsers = apiStorage.getItem('aqm_users');
      if (storedUsers) setUsers(JSON.parse(storedUsers));

      const storedRoles = apiStorage.getItem('aqm_roles');
      if (storedRoles) setRoles(JSON.parse(storedRoles));

      const storedAnnouncements = apiStorage.getItem('aqm_announcements');
      if (storedAnnouncements) {
        setAnnouncements(JSON.parse(storedAnnouncements));
      } else {
        const MOCK = [
          {
            id: '1',
            title: 'New ISO 9001:2015 Audit Schedule',
            content: 'Please be informed that the external ISO audit has been scheduled for next month. All departments are required to complete their internal checklist by Friday.',
            date: new Date().toLocaleDateString(),
            time: '09:00 AM',
            author: 'Admin Team',
            category: 'important',
            targetType: 'all',
            targetId: ''
          }
        ];
        setAnnouncements(MOCK);
        apiStorage.setItem('aqm_announcements', JSON.stringify(MOCK));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    
    const newAnnouncement = {
      id: Date.now().toString(),
      ...formData,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: currentUser?.name || currentUser?.username || 'System Admin',
    };

    const newAnns = [newAnnouncement, ...announcements];
    setAnnouncements(newAnns);
    apiStorage.setItem('aqm_announcements', JSON.stringify(newAnns));
    
    // Also simulate sending a direct message if targeted
    if (formData.targetType === 'user' && formData.targetId) {
      sendDirectMessage(formData.targetId, `Announcement: ${formData.title}\n\n${formData.content}`);
    } else if (formData.targetType === 'group' && formData.targetId) {
      // Find all users in this role
      const roleUsers = users.filter(u => u.role === formData.targetId);
      roleUsers.forEach(u => {
        sendDirectMessage(u.email, `Announcement: ${formData.title}\n\n${formData.content}`);
      });
    }

    setIsCreating(false);
    setFormData({ title: '', content: '', category: 'general', targetType: 'all', targetId: '' });
  };

  const sendDirectMessage = (targetEmail: string, text: string) => {
    if (!currentUser || targetEmail === currentUser.email) return;
    try {
      const rawConvos = apiStorage.getItem('aqm_conversations');
      const allConvos = rawConvos ? JSON.parse(rawConvos) : [];
      let convo = allConvos.find((c: any) => !c.isGroup && c.participants.includes(currentUser.email) && c.participants.includes(targetEmail));
      
      if (!convo) {
        convo = {
          id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          isGroup: false,
          participants: [currentUser.email, targetEmail],
          name: '',
          lastMessage: '',
          lastMessageTime: new Date().toISOString()
        };
        allConvos.push(convo);
      }
      convo.lastMessage = 'Announcement Sent';
      convo.lastMessageTime = new Date().toISOString();
      apiStorage.setItem('aqm_conversations', JSON.stringify(allConvos));

      const rawMsgs = apiStorage.getItem('aqm_messages');
      const allMsgs = rawMsgs ? JSON.parse(rawMsgs) : [];
      allMsgs.push({
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversationId: convo.id,
        senderEmail: currentUser.email,
        senderName: currentUser.name || currentUser.email,
        text: text,
        time: new Date().toISOString()
      });
      apiStorage.setItem('aqm_messages', JSON.stringify(allMsgs));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this announcement?')) {
      const filtered = announcements.filter(a => a.id !== id);
      setAnnouncements(filtered);
      apiStorage.setItem('aqm_announcements', JSON.stringify(filtered));
    }
  };

  if (isCreating) {
    return (
      <div className="p-4 lg:p-6 max-w-3xl mx-auto h-full overflow-y-auto">
        <button onClick={() => setIsCreating(false)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Announcements
        </button>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-blue-600" />
              Create Announcement
            </h2>
          </div>
          <form onSubmit={handleCreate} className="p-4 sm:p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Announcement Title" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="general">General</option>
                  <option value="important">Important</option>
                  <option value="alert">Alert</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Send To</label>
                <div className="flex gap-2">
                  <select name="targetType" value={formData.targetType} onChange={handleChange} className="w-1/3 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option value="all">All</option>
                    <option value="group">Group</option>
                    <option value="user">User</option>
                  </select>
                  
                  {formData.targetType === 'group' && (
                    <select name="targetId" required value={formData.targetId} onChange={handleChange} className="w-2/3 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option value="">Select Group...</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  )}
                  
                  {formData.targetType === 'user' && (
                    <select name="targetId" required value={formData.targetId} onChange={handleChange} className="w-2/3 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option value="">Select User...</option>
                      {users.filter(u => u.email !== currentUser?.email).map(u => (
                        <option key={u.id} value={u.email}>{u.name || u.email}</option>
                      ))}
                    </select>
                  )}
                  
                  {formData.targetType === 'all' && (
                    <div className="w-2/3 px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg flex items-center">
                      All Company Users
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Message Content</label>
              <textarea name="content" required rows={6} value={formData.content} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Write your announcement here..." />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                <Send className="w-4 h-4" /> Publish Announcement
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Company Announcements</h2>
          <p className="text-sm text-slate-500">Stay updated with the latest news, updates, and maintenance schedules.</p>
        </div>
        <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative group">
            {currentUser?.role === 'Super Admin' && (
              <button onClick={() => { if(window.confirm('Are you sure you want to delete this announcement?')) handleDelete(announcement.id); }} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded opacity-0 group-hover:opacity-100 transition-all">
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-start justify-between gap-4 mb-3 pr-8">
              <div className="flex items-center gap-2 flex-wrap">
                {announcement.category === 'important' && <span className="flex items-center px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider rounded">Important</span>}
                {announcement.category === 'alert' && <span className="flex items-center px-2 py-1 bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider rounded">Alert</span>}
                {announcement.category === 'general' && <span className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider rounded">General</span>}
                
                {announcement.targetType === 'group' && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded">
                    <Users className="w-3 h-3" /> {announcement.targetId}
                  </span>
                )}
                {announcement.targetType === 'user' && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 text-[10px] font-bold uppercase tracking-wider rounded">
                    <User className="w-3 h-3" /> Direct
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 whitespace-nowrap">
                <span className="flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5" /> {announcement.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {announcement.time}</span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{announcement.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{announcement.content}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Posted by <span className="font-bold text-slate-700">{announcement.author}</span></span>
              <button className="text-blue-600 hover:text-blue-700 font-bold">Read more &rarr;</button>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
            <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Announcements</h3>
            <p className="text-slate-500 mt-1">There are no announcements currently published.</p>
          </div>
        )}
      </div>
    </div>
  );
}

