import React, { useState } from 'react';
import { Settings, Plus, Trash2 } from 'lucide-react';

interface ManageProps {
  sections: string[];
  setSections: (s: string[]) => void;
  lines: string[];
  setLines: (l: string[]) => void;
  units: string[];
  setUnits: (u: string[]) => void;
  shifts: string[];
  setShifts: (s: string[]) => void;
}

export function ProductionQualityManage({ sections, setSections, lines, setLines, units, setUnits, shifts, setShifts }: ManageProps) {
  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-xl font-bold text-slate-900">Module Configuration</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:p-6">
        <ManageGroup title="Sections" items={sections} setItems={setSections} />
        <ManageGroup title="Units" items={units} setItems={setUnits} />
        <ManageGroup title="Lines" items={lines} setItems={setLines} />
        <ManageGroup title="Shifts" items={shifts} setItems={setShifts} />
      </div>
    </div>
  );
}

function ManageGroup({ title, items, setItems }: { title: string, items: string[], setItems: (items: string[]) => void }) {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem && !items.includes(newItem)) {
      setItems([...items, newItem]);
      setNewItem('');
    }
  };

  const removeItem = (item: string) => {
    if (window.confirm(`Are you sure you want to delete this ${title.slice(0, -1)}?`)) {
      setItems(items.filter(i => i !== item));
    }
  };

  return (
    <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-4 sm:p-6">
      <div className="mb-4">
        <h3 className="text-sm font-bold uppercase">{title}</h3>
      </div>
      <div className="space-y-4">
        <div className="flex gap-2">
          <input 
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
            placeholder={`Add new ${title.slice(0, -1)}`}
          />
          <button onClick={addItem} className="p-2 bg-blue-600 text-white rounded"><Plus className="w-4 h-4" /></button>
        </div>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item} className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100 text-sm">
              {item}
              <button onClick={() => removeItem(item)} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
