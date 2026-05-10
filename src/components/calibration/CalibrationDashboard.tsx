import React from 'react';
import { Equipment } from './types';
import { Activity, AlertTriangle, CheckCircle, Scale, Clock, Settings } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface CalibrationDashboardProps {
  equipmentList: Equipment[];
  onViewList: () => void;
}

export function CalibrationDashboard({ equipmentList, onViewList }: CalibrationDashboardProps) {
  const activeCount = equipmentList.filter(e => e.status === 'ACTIVE').length;
  const dueCount = equipmentList.filter(e => e.status === 'CALIBRATION_DUE').length;
  const outOfServiceCount = equipmentList.filter(e => e.status === 'OUT_OF_SERVICE').length;
  
  // Recent calibrations (sort by lastCalibrationDate descending)
  const recentEquipment = [...equipmentList].sort((a, b) => 
    new Date(b.lastCalibrationDate).getTime() - new Date(a.lastCalibrationDate).getTime()
  ).slice(0, 5);

  // Upcoming calibrations (sort by nextCalibrationDate ascending, only active/due)
  const upcomingEquipment = [...equipmentList]
    .filter(e => e.status !== 'OUT_OF_SERVICE' && e.status !== 'INACTIVE')
    .sort((a, b) => 
      new Date(a.nextCalibrationDate).getTime() - new Date(b.nextCalibrationDate).getTime()
    ).slice(0, 5);

  return (
    <div className="flex flex-col gap-4 sm:p-6 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Calibration Dashboard</h2>
          <p className="text-slate-500 font-medium mt-1">Equipment health and calibration schedules.</p>
        </div>
        <button 
          onClick={onViewList}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          View Equipment List
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="flex flex-col">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Equipment</h3>
              <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                <Scale className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-800">{equipmentList.length}</p>
          </CardContent>
        </Card>

        <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active & Ready</h3>
            <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-700">{activeCount}</p>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider">Calibration Due</h3>
            <div className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-700">{dueCount}</p>
        </div>

        <div className="bg-white border border-rose-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider">Out of Service</h3>
            <div className="w-8 h-8 rounded bg-rose-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-700">{outOfServiceCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
        {/* Upcoming Calibrations */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">Timeline: Next Calibrations</h3>
          </div>
          <div className="p-4 flex-1">
            <div className="space-y-4">
              {upcomingEquipment.map(eq => (
                <div key={eq.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100/50">
                  <div className={`p-2 rounded-lg 
                    ${eq.status === 'CALIBRATION_DUE' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}
                  `}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-800">{eq.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{eq.manufacturer} - {eq.model}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                         ID: {eq.id}
                       </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-700">{eq.nextCalibrationDate}</span>
                    <p className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${
                      eq.status === 'CALIBRATION_DUE' ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      {eq.status === 'CALIBRATION_DUE' ? 'OVERDUE / DUE NOW' : 'UPCOMING'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">Recently Calibrated</h3>
          </div>
          <div className="p-4 flex-1">
            <div className="space-y-4">
              {recentEquipment.map(eq => (
                <div key={eq.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100/50">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-800">{eq.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{eq.location}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                         PASS
                       </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-700">{eq.lastCalibrationDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
