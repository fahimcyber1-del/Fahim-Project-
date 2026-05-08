import { apiStorage } from '../../utils/apiStorage';
import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, MapPin, Building2, UserCircle } from 'lucide-react';

export function ContactsList({ onMessageClick }: { onMessageClick?: (user: any) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [directory, setDirectory] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = apiStorage.getItem('aqm_users');
      if (stored) {
        const users = JSON.parse(stored);
        if (Array.isArray(users)) {
          setDirectory(users);
        }
      }
    } catch (e) {
      console.error('Failed to load users for directory', e);
    }
  }, []);

  const filteredDirectory = directory.filter(contact => 
    contact?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    contact?.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact?.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6 h-full flex flex-col max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Company Directory</h2>
          <p className="text-sm text-slate-500">Find and contact colleagues across departments.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, role, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
          {filteredDirectory.map((contact) => (
            <div key={contact.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {contact.imageUrl ? (
                    <img src={contact.imageUrl} alt={contact.name} className="w-12 h-12 rounded-full border border-slate-200" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold relative">
                      {contact.name?.charAt(0)}
                      {contact.status === 'Active' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>}
                      {contact.status === 'on-leave' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-amber-500 border-2 border-white rounded-full"></div>}
                      {contact.status === 'offline' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-slate-300 border-2 border-white rounded-full"></div>}
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">{contact.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{contact.role}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{contact.department || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`mailto:${contact.email}`} className="truncate hover:text-blue-600 transition-colors">{contact.email}</a>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  {contact.phone ? (
                    <a href={`tel:${contact.phone}`} className="truncate hover:text-blue-600 transition-colors">{contact.phone}</a>
                  ) : (
                    <span className="truncate text-slate-400">Not specified</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{contact.location || 'Not specified'}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <button 
                  onClick={() => onMessageClick && onMessageClick(contact)}
                  className="flex-1 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredDirectory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <Search className="w-12 h-12 mb-4 text-slate-300" />
            <p className="font-semibold text-slate-900">No contacts found</p>
            <p className="text-sm">We couldn't find anyone matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
