import React, { useMemo } from 'react';
import { Activity, Heart, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { BPRecord } from '../types';

interface StatsCardsProps {
  records: BPRecord[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ records }) => {
  const latest = records[0];
  
  const averages = useMemo(() => {
    if (records.length === 0) return null;
    const total = records.reduce((acc, curr) => ({
      sys: acc.sys + curr.systolic,
      dia: acc.dia + curr.diastolic,
      pulse: acc.pulse + curr.pulse
    }), { sys: 0, dia: 0, pulse: 0 });
    
    return {
      sys: Math.round(total.sys / records.length),
      dia: Math.round(total.dia / records.length),
      pulse: Math.round(total.pulse / records.length)
    };
  }, [records]);

  const getStatusColor = (sys: number, dia: number) => {
    if (sys > 140 || dia > 90) return 'text-red-600 bg-red-50';
    if (sys > 120 || dia > 80) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  if (!latest || !averages) {
    return (
      <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-center text-slate-500">
        No records yet. Tap + to add one.
      </div>
    );
  }

  const statusClass = getStatusColor(latest.systolic, latest.diastolic);

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {/* Latest BP */}
      <div className={`col-span-2 p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center ${statusClass}`}>
        <div className="flex items-center gap-2 mb-1 opacity-80">
          <Activity className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Latest BP</span>
        </div>
        <div className="text-5xl font-bold tracking-tighter">
          {latest.systolic}<span className="text-3xl opacity-60">/{latest.diastolic}</span>
        </div>
        <div className="text-xs mt-1 font-medium opacity-80">
          {new Date(latest.timestamp).toLocaleDateString()} • {new Date(latest.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Pulse Card */}
      <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-2 text-rose-500 mb-2">
          <Heart className="w-4 h-4 fill-rose-500" />
          <span className="text-xs font-semibold uppercase text-slate-400">Pulse</span>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold text-slate-800">{latest.pulse}</span>
          <span className="text-xs text-slate-400 mb-1">bpm</span>
        </div>
      </div>

      {/* Average Card */}
      <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-2 text-blue-500 mb-2">
          <Activity className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase text-slate-400">Avg BP</span>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-bold text-slate-800">{averages.sys}/{averages.dia}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
