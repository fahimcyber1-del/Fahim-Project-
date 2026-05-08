import { useApiStorage } from '../../hooks/useApiData';
import React, { useState } from 'react';
import { Bell, Check, Settings, Eye, Trash2, AlertTriangle, Workflow, Inbox } from 'lucide-react';

interface NotificationItem {
  id: string;
  source: string;
  title: string;
  message: string;
  time: string;
  isUnread: boolean;
  type: 'alert' | 'system' | 'workflow' | 'message';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', source: 'Inspection Alert', title: 'Upcoming Final Inspection', message: 'Final inline inspection for H&M Spring Collection (PO: 8820) starts tomorrow at 10:00 AM.', time: '10 min ago', isUnread: true, type: 'workflow' },
  { id: '2', source: 'Audit System', title: 'New Audit Finding', message: 'Major non-conformance recorded during Sedex audit regarding safety protocols in Wash area.', time: '2 hours ago', isUnread: true, type: 'alert' },
  { id: '3', source: 'CAPA Module', title: 'Overdue Action Preventative', message: 'CAPA #409: Implement new lighting in grading area is overdue by 3 days.', time: '1 day ago', isUnread: false, type: 'alert' },
  { id: '4', source: 'Certification', title: 'Expiring Quality Certificate', message: 'Your ISO 9001:2015 certification expires in 30 days. Please initialize the renewal process.', time: '2 days ago', isUnread: false, type: 'system' },
  { id: '5', source: 'Customer Service', title: 'New Customer Complaint', message: 'Zara reported a sizing issue (Claim #ZX-992) for Batch 4A.', time: '3 days ago', isUnread: false, type: 'alert' },
];

export function NotificationsModule() {
  const [notifications, setNotifications] = useApiStorage('aqm_notifications_notifications', INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isUnread: false } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };
  
  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return n.isUnread;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'system': return <Settings className="w-5 h-5 text-slate-500" />;
      case 'workflow': return <Workflow className="w-5 h-5 text-indigo-500" />;
      case 'message': return <Inbox className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col pt-3 sm:pt-6 max-w-4xl mx-auto w-full">
      <div className="px-4 sm:px-6 mb-6 shrink-0 flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
             Notifications <Bell className="w-6 h-6 text-indigo-500" />
           </h1>
           <p className="text-sm text-slate-500 font-medium mt-1">Manage your system alerts and messages</p>
        </div>
        
        <button 
          onClick={() => {
             window.dispatchEvent(new CustomEvent('app-navigate', { detail: { module: 'setting', tab: 'notifications' } }));
          }}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Settings className="w-4 h-4" />
          Notification Options
        </button>
      </div>

      <div className="px-4 sm:px-6 flex-1 overflow-auto pb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
             <div className="flex bg-slate-200/50 p-1 rounded-lg">
                <button 
                  onClick={() => setFilter('all')} 
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${filter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilter('unread')} 
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ${filter === 'unread' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Unread
                  {notifications.filter(n => n.isUnread).length > 0 && (
                    <span className="bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full text-[10px]">
                      {notifications.filter(n => n.isUnread).length}
                    </span>
                  )}
                </button>
             </div>
             
             {notifications.some(n => n.isUnread) && (
               <button 
                 onClick={handleMarkAllAsRead}
                 className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
               >
                 <Check className="w-4 h-4" />
                 Mark all as read
               </button>
             )}
           </div>

           <div className="divide-y divide-slate-100">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map(notif => (
                  <div key={notif.id} className={`p-4 sm:p-6 transition-colors hover:bg-slate-50/80 ${notif.isUnread ? 'bg-indigo-50/30' : ''}`}>
                    <div className="flex gap-4">
                      <div className="mt-1">
                        <div className={`p-2 rounded-full ${notif.isUnread ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'bg-slate-50 border border-slate-100'}`}>
                          {getIcon(notif.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-start justify-between gap-4">
                            <div>
                               <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{notif.source}</span>
                                  {notif.isUnread && <span className="w-2 h-2 rounded-full bg-indigo-500"></span>}
                               </div>
                               <h3 className={`text-base font-bold text-slate-900 ${!notif.isUnread && 'opacity-80'}`}>{notif.title}</h3>
                               <p className={`text-sm mt-1 mb-2 ${notif.isUnread ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>{notif.message}</p>
                               <span className="text-xs text-slate-400 font-medium">{notif.time}</span>
                            </div>
                            
                            <div className="flex flex-col gap-2 shrink-0">
                               {notif.isUnread && (
                                 <button 
                                   onClick={() => handleMarkAsRead(notif.id)}
                                   className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group relative"
                                 >
                                   <Eye className="w-4 h-4" />
                                   <span className="absolute -top-4 sm:p-6 lg:p-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Mark as read</span>
                                 </button>
                               )}
                               <button 
                                 onClick={() => handleDelete(notif.id)}
                                 className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors group relative"
                               >
                                 <Trash2 className="w-4 h-4" />
                                 <span className="absolute -top-4 sm:p-6 lg:p-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Delete message</span>
                               </button>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-lg font-bold text-slate-700">You're all caught up!</p>
                  <p className="text-sm">There are no {filter === 'unread' ? 'unread ' : ''}notifications to display.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
