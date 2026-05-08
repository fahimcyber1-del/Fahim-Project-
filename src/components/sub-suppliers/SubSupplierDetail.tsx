import React, { useState } from 'react';
import { SubSupplierRecord } from './types';
import { ArrowLeft, Edit3, Building2, MapPin, Mail, Phone, Globe, Calendar, Star, ShieldAlert, ShoppingCart, Clock, CheckCircle2, XCircle, FileText, Activity } from 'lucide-react';
import { useAuditsState } from '../../store';

interface SubSupplierDetailProps {
  record: SubSupplierRecord;
  onBack: () => void;
  onEdit: () => void;
}

export function SubSupplierDetail({ record, onBack, onEdit }: SubSupplierDetailProps) {
  const { audits } = useAuditsState();
  const [showAudits, setShowAudits] = useState(false);
  const supplierAudits = audits.filter(a => a.type === 'SUPPLIER' && a.subSupplier === record.name);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800';
      case 'Inactive': return 'bg-slate-100 text-slate-800';
      case 'Pending Approval': return 'bg-amber-100 text-amber-800';
      case 'Blacklisted': return 'bg-rose-100 text-rose-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'High': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'Critical': return 'text-white bg-rose-600 border-rose-700';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Delayed': return 'bg-amber-100 text-amber-700';
      case 'Cancelled': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
           <button onClick={onBack} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              {record.logoUrl && (
                <img src={record.logoUrl} alt="Logo" className="w-8 h-8 rounded object-cover" />
              )}
              <h1 className="text-2xl font-black text-slate-900">{record.name}</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(record.status)}`}>
                {record.status}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">Supplier ID: {record.id}</p>
          </div>
        </div>
        <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-bold text-sm transition-colors">
          <Edit3 className="w-4 h-4" /> Edit Details
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
               <Building2 className="w-4 h-4 text-blue-600" /> Company Profile
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:p-6">
               <div className="flex items-start gap-3">
                 <Building2 className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Category</p>
                   <p className="text-sm font-semibold text-slate-800">{record.category}</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <Calendar className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Onboarding Date</p>
                   <p className="text-sm font-semibold text-slate-800">{record.joinDate}</p>
                 </div>
               </div>
               <div className="flex items-start gap-3 sm:col-span-2">
                 <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Physical Address</p>
                   <p className="text-sm font-semibold text-slate-800">{record.address}</p>
                   <p className="text-sm font-medium text-slate-500">{record.country}</p>
                 </div>
               </div>
             </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
               <Globe className="w-4 h-4 text-blue-600" /> Contact Information
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:p-6">
               <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                   {record.contactPerson.charAt(0)}
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Primary Contact</p>
                   <p className="text-sm font-semibold text-slate-800">{record.contactPerson}</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <Mail className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Email Address</p>
                   <p className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">{record.email}</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <Phone className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Phone Number</p>
                   <p className="text-sm font-semibold text-slate-800">{record.phone}</p>
                 </div>
               </div>
               {record.website && (
                 <div className="flex items-start gap-3">
                   <Globe className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Website</p>
                     <a href={record.website} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline">{record.website}</a>
                   </div>
                 </div>
               )}
             </div>
          </div>

          {(record.notes) && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Notes & Remarks</h3>
              <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap">{record.notes}</p>
            </div>
          )}

          {record.orders && record.orders.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-blue-600" /> Associated Orders
              </h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-600">Order ID</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">Style No</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">Quantity</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">Delivery Date</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {record.orders.map(order => (
                      <tr key={order.orderId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-blue-600">{order.orderId}</td>
                        <td className="px-4 py-3 text-slate-700 font-medium">{order.styleNo}</td>
                        <td className="px-4 py-3 text-slate-700">{order.quantity.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-500">{order.deliveryDate}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${getOrderStatusColor(order.status)}`}>
                            {order.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {order.status === 'In Progress' && <Clock className="w-3.5 h-3.5" />}
                            {order.status === 'Delayed' && <Clock className="w-3.5 h-3.5" />}
                            {order.status === 'Cancelled' && <XCircle className="w-3.5 h-3.5" />}
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Performance & Risk</h3>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Supplier Rating</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className={`w-5 h-5 ${star <= Math.round(record.rating) ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-lg font-black text-slate-800">{record.rating}<span className="text-sm text-slate-500">/5</span></span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Risk Assessment</p>
                <div className={`px-4 py-3 rounded-lg border flex items-center gap-3 ${getRiskColor(record.riskLevel)}`}>
                  <ShieldAlert className="w-6 h-6" />
                  <div>
                    <p className="font-bold">{record.riskLevel} Risk Profile</p>
                    <p className="text-xs opacity-80 mt-0.5">Based on historical data & audits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Certifications</h3>
            {record.certifications && record.certifications.length > 0 ? (
              <div className="space-y-3">
                {record.certifications.map(cert => (
                  <div key={cert.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center group">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{cert.name}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Valid until: {cert.validUntil}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-center">
                 <p className="text-xs font-medium text-slate-500 italic">No certifications recorded.</p>
              </div>
            )}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" /> Audit History
              </div>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{supplierAudits.length}</span>
            </h3>
            {supplierAudits.length > 0 ? (
              <div className="space-y-4">
                {supplierAudits.map((audit) => (
                  <div key={audit.id} className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold text-slate-800">{audit.id}</p>
                      <p className="text-xs font-semibold text-slate-500">{audit.date}</p>
                    </div>
                    <p className="text-xs font-medium text-slate-600 mb-2">{audit.title}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${audit.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                        {audit.status}
                      </span>
                      {audit.score !== undefined && (
                        <span className="text-xs font-bold text-slate-700">Score: {audit.score}%</span>
                      )}
                    </div>
                    {(audit.findings?.length > 0 || audit.isoQuestions?.length > 0) && (
                      <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-4">
                        {audit.findings && audit.findings.length > 0 && (
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Findings</span>
                            <span className="text-sm font-semibold text-rose-600">{audit.findings.length} Open</span>
                          </div>
                        )}
                        {audit.isoQuestions && audit.isoQuestions.length > 0 && (
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evaluations</span>
                            <span className="text-sm font-semibold text-slate-700">{audit.isoQuestions.length} Checkpoints</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-center">
                 <p className="text-xs font-medium text-slate-500 italic">No audits recorded for this supplier.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
