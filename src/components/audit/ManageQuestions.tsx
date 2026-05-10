import React, { useState } from 'react';
import { IsoQuestionTemplate } from './types';
import { ArrowLeft, Plus, Edit, Trash2, Search } from 'lucide-react';

interface ManageQuestionsProps {
  internalQuestions: IsoQuestionTemplate[];
  supplierQuestions: IsoQuestionTemplate[];
  onUpdateInternal: (questions: IsoQuestionTemplate[]) => void;
  onUpdateSupplier: (questions: IsoQuestionTemplate[]) => void;
  onBack: () => void;
}

export function ManageQuestions({ internalQuestions, supplierQuestions, onUpdateInternal, onUpdateSupplier, onBack }: ManageQuestionsProps) {
  const [activeTab, setActiveTab] = useState<'INTERNAL' | 'SUPPLIER' | 'DESIGNATIONS'>('INTERNAL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<IsoQuestionTemplate>>({ clause: '', question: '' });
  
  const [designations, setDesignations] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('audit_designations');
      return saved ? JSON.parse(saved) : ['Lead Auditor', 'Quality Manager', 'Department Head'];
    } catch {
      return ['Lead Auditor', 'Quality Manager', 'Department Head'];
    }
  });

  const [designationInput, setDesignationInput] = useState('');

  const currentQuestions = activeTab === 'INTERNAL' ? internalQuestions : supplierQuestions;

  const filteredQuestions = currentQuestions.filter(q => 
    q.clause.toLowerCase().includes(searchTerm.toLowerCase()) || 
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (index?: number) => {
    if (index !== undefined) {
      setEditingIndex(index);
      setFormData(filteredQuestions[index]);
    } else {
      setEditingIndex(null);
      setFormData({ clause: '', question: '' });
    }
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      if (activeTab === 'INTERNAL') {
        onUpdateInternal(internalQuestions.filter(q => q.id !== id));
      } else {
        onUpdateSupplier(supplierQuestions.filter(q => q.id !== id));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clause || !formData.question) return;

    if (editingIndex !== null) {
      let updatedQuestions = currentQuestions.map(q => q.id === formData.id ? { ...q, ...formData } as IsoQuestionTemplate : q);
      if (activeTab === 'INTERNAL') {
        onUpdateInternal(updatedQuestions);
      } else {
        onUpdateSupplier(updatedQuestions);
      }
    } else {
      const newQuestion: IsoQuestionTemplate = {
        id: `q-${Date.now()}`,
        clause: formData.clause as string,
        question: formData.question as string
      };
      if (activeTab === 'INTERNAL') {
        onUpdateInternal([...internalQuestions, newQuestion]);
      } else {
        onUpdateSupplier([...supplierQuestions, newQuestion]);
      }
    }
    setIsFormOpen(false);
  };

  const handleAddDesignation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!designationInput.trim()) return;
    const newDesignations = [...designations, designationInput.trim()];
    setDesignations(newDesignations);
    localStorage.setItem('audit_designations', JSON.stringify(newDesignations));
    setDesignationInput('');
  };

  const handleDeleteDesignation = (index: number) => {
    if (window.confirm("Are you sure you want to delete this designation?")) {
      const newDesignations = designations.filter((_, i) => i !== index);
      setDesignations(newDesignations);
      localStorage.setItem('audit_designations', JSON.stringify(newDesignations));
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage Audit Setup</h1>
          <p className="text-sm font-medium text-slate-500">Configure questions and signature designations.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col items-stretch">
        <div className="flex border-b border-slate-200 bg-slate-50 relative">
          <button
            onClick={() => setActiveTab('INTERNAL')}
            className={`flex-1 py-3 px-4 text-center font-bold text-sm transition-colors relative z-10 ${activeTab === 'INTERNAL' ? 'text-blue-600 bg-white border-b border-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 border-b border-transparent hover:bg-slate-100'}`}
          >
            Internal Audit Questions
          </button>
          <button
            onClick={() => setActiveTab('SUPPLIER')}
            className={`flex-1 py-3 px-4 text-center font-bold text-sm transition-colors relative z-10 ${activeTab === 'SUPPLIER' ? 'text-blue-600 bg-white border-b border-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 border-b border-transparent hover:bg-slate-100'}`}
          >
            Sub Supplier Questions
          </button>
          <button
            onClick={() => setActiveTab('DESIGNATIONS')}
            className={`flex-1 py-3 px-4 text-center font-bold text-sm transition-colors relative z-10 ${activeTab === 'DESIGNATIONS' ? 'text-blue-600 bg-white border-b border-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 border-b border-transparent hover:bg-slate-100'}`}
          >
            Signature Designations
          </button>
        </div>
        
        {activeTab !== 'DESIGNATIONS' ? (
          <>
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by clause or question..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button 
                onClick={() => handleOpenForm()}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-bold text-sm transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Add Question
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-600 w-24">Clause</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Question</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 w-24 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((q, index) => (
                      <tr key={q.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-800 align-top"><span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">{q.clause}</span></td>
                        <td className="px-4 py-3 text-slate-600">{q.question}</td>
                        <td className="px-4 py-3 align-top">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleOpenForm(index)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => { if(window.confirm('Are you sure you want to delete this question?')) handleDelete(q.id); }} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                        No questions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 font-medium">
              Total: {filteredQuestions.length} questions
            </div>
          </>
        ) : (
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">E-Signature Designations</h3>
            <p className="text-sm text-slate-600 mb-4">
              Add options that users can select for their designation when signing an audit electronically.
            </p>
            <form onSubmit={handleAddDesignation} className="flex gap-4 mb-6 relative w-full sm:max-w-md">
              <input
                type="text"
                placeholder="E.g., Quality Inspector"
                value={designationInput}
                onChange={(e) => setDesignationInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-bold text-sm transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </form>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-600">Designation Name</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 w-24 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {designations.length > 0 ? (
                    designations.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-800">{item}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => { if(window.confirm('Are you sure you want to delete this designation?')) handleDeleteDesignation(index); }} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-4 py-8 text-center text-slate-500">
                        No designations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800">{editingIndex !== null ? 'Edit Question' : 'Add Question'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Clause</label>
                <input
                  type="text"
                  required
                  value={formData.clause}
                  onChange={e => setFormData({...formData, clause: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="e.g., 4.1"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Question</label>
                <textarea
                  required
                  rows={4}
                  value={formData.question}
                  onChange={e => setFormData({...formData, question: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="Enter the audit question..."
                />
              </div>
              <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-sm font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700 transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
