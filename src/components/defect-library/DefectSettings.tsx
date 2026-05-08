import React, { useState } from 'react';
import { Save, Plus, Trash2, Settings, List, FolderTree, BookOpen } from 'lucide-react';

interface DefectSettingsProps {
  categories: string[];
  departments: string[];
  standards: string[];
  onSaveCategories: (categories: string[]) => void;
  onSaveDepartments: (departments: string[]) => void;
  onSaveStandards: (standards: string[]) => void;
}

export function DefectSettings({ categories, departments, standards, onSaveCategories, onSaveDepartments, onSaveStandards }: DefectSettingsProps) {
  const [localCategories, setLocalCategories] = useState<string[]>(categories);
  const [localDepartments, setLocalDepartments] = useState<string[]>(departments);
  const [localStandards, setLocalStandards] = useState<string[]>(standards);
  const [newCategory, setNewCategory] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [newStandard, setNewStandard] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() && !localCategories.includes(newCategory.trim())) {
      setLocalCategories([...localCategories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (cat: string) => {
    setLocalCategories(localCategories.filter(c => c !== cat));
  };

  const handleAddDepartment = () => {
    if (newDepartment.trim() && !localDepartments.includes(newDepartment.trim())) {
      setLocalDepartments([...localDepartments, newDepartment.trim()]);
      setNewDepartment('');
    }
  };

  const handleRemoveDepartment = (dept: string) => {
    setLocalDepartments(localDepartments.filter(d => d !== dept));
  };

  const handleAddStandard = () => {
    if (newStandard.trim() && !localStandards.includes(newStandard.trim())) {
      setLocalStandards([...localStandards, newStandard.trim()]);
      setNewStandard('');
    }
  };

  const handleRemoveStandard = (std: string) => {
    setLocalStandards(localStandards.filter(s => s !== std));
  };

  const handleSave = () => {
    onSaveCategories(localCategories);
    onSaveDepartments(localDepartments);
    onSaveStandards(localStandards);
    alert('Settings saved successfully');
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full space-y-6 pb-12">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col">
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" /> System Configuration
          </h2>
          <p className="text-slate-500 font-medium text-sm">Manage global Defect Library properties and options.</p>
        </div>
        <button onClick={handleSave} className="flex flex-row items-center gap-2 px-6 py-2 bg-blue-700 text-white font-bold rounded-lg shadow-sm hover:bg-blue-800 transition-colors">
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
            <List className="w-5 h-5 text-blue-600" /> Defect Categories
          </h3>
          
          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              placeholder="E.g., Packaging, Printing..." 
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <button onClick={handleAddCategory} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold rounded-lg transition-colors flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="space-y-2">
            {localCategories.map(cat => (
              <div key={cat} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-lg group">
                <span className="font-semibold text-slate-700 text-sm">{cat}</span>
                <button onClick={() => handleRemoveCategory(cat)} className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
            <FolderTree className="w-5 h-5 text-blue-600" /> Impacted Departments
          </h3>
          
          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              placeholder="E.g., Final Audit, Dyeing..." 
              value={newDepartment}
              onChange={e => setNewDepartment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddDepartment()}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <button onClick={handleAddDepartment} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold rounded-lg transition-colors flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="space-y-2">
            {localDepartments.map(dept => (
              <div key={dept} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-lg group">
                <span className="font-semibold text-slate-700 text-sm">{dept}</span>
                <button onClick={() => handleRemoveDepartment(dept)} className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 md:col-span-2">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-blue-600" /> Quality Standards
          </h3>
          
          <div className="flex gap-2 mb-6 max-w-md">
            <input 
              type="text" 
              placeholder="E.g., ASTM-D3990, ISO-9001..." 
              value={newStandard}
              onChange={e => setNewStandard(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddStandard()}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <button onClick={handleAddStandard} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold rounded-lg transition-colors flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {localStandards.map(std => (
              <div key={std} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg group">
                <span className="font-semibold text-slate-700 text-sm">{std}</span>
                <button onClick={() => handleRemoveStandard(std)} className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
