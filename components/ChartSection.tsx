import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, AreaChart, Area } from 'recharts';
import { BPRecord, TimeRange } from '../types';

interface ChartSectionProps {
  records: BPRecord[];
}

const ChartSection: React.FC<ChartSectionProps> = ({ records }) => {
  const [range, setRange] = useState<TimeRange>('week');

  const data = useMemo(() => {
    if (records.length === 0) return [];
    
    // Reverse because records are new->old, charts need old->new
    const sorted = [...records].reverse();
    const now = new Date();
    
    let cutoff = new Date();
    if (range === 'week') cutoff.setDate(now.getDate() - 7);
    if (range === 'month') cutoff.setMonth(now.getMonth() - 1);
    if (range === 'year') cutoff.setFullYear(now.getFullYear() - 1);

    return sorted.filter(r => new Date(r.timestamp) >= cutoff).map(r => ({
      ...r,
      dateFormatted: new Date(r.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }));
  }, [records, range]);

  if (records.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-700">Trends</h3>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {(['week', 'month', 'year'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                range === r ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="dateFormatted" 
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
              axisLine={false}
              tickLine={false}
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
            />
            {/* Safe zone indicators */}
            <ReferenceLine y={120} stroke="#22c55e" strokeDasharray="3 3" strokeOpacity={0.4} />
            <ReferenceLine y={80} stroke="#22c55e" strokeDasharray="3 3" strokeOpacity={0.4} />
            
            <Line 
              type="monotone" 
              dataKey="systolic" 
              stroke="#ef4444" 
              strokeWidth={3} 
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="diastolic" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-2 text-xs font-medium text-slate-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div> Systolic
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div> Diastolic
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
