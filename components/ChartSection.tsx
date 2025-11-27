import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
  ScatterChart, Scatter, Cell, ReferenceArea, Label
} from 'recharts';
import { Activity, BarChart2 } from 'lucide-react';
import { BPRecord, TimeRange } from '../types';

interface ChartSectionProps {
  records: BPRecord[];
}

// Helper to determine BP category based on standard guidelines
const getCategory = (sys: number, dia: number) => {
  if (sys > 180 || dia > 120) return { label: 'Severe', color: '#be123c', bg: 'bg-rose-800' }; // Hypertensive Crisis
  if (sys >= 140 || dia >= 90) return { label: 'Stage 2', color: '#e11d48', bg: 'bg-rose-600' };
  if (sys >= 130 || dia >= 80) return { label: 'Stage 1', color: '#f97316', bg: 'bg-orange-500' };
  if (sys >= 120 && dia < 80) return { label: 'Elevated', color: '#eab308', bg: 'bg-yellow-500' };
  return { label: 'Normal', color: '#22c55e', bg: 'bg-green-500' };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const category = getCategory(data.systolic, data.diastolic);
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl text-xs z-50 relative">
        <p className="font-semibold text-slate-700 mb-1">{data.dateFormatted}</p>
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${category.bg}`}></div>
          <span className="font-medium text-slate-600">{category.label}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span className="text-slate-400">BP:</span>
          <span className="font-bold text-slate-800">{data.systolic}/{data.diastolic}</span>
          <span className="text-slate-400">Pulse:</span>
          <span className="font-bold text-slate-800">{data.pulse}</span>
        </div>
        {data.note && (
          <div className="mt-2 pt-2 border-t border-slate-50 text-slate-500 italic max-w-[150px] truncate">
            "{data.note}"
          </div>
        )}
      </div>
    );
  }
  return null;
};

const ChartSection: React.FC<ChartSectionProps> = ({ records }) => {
  const [range, setRange] = useState<TimeRange>('week');
  const [viewMode, setViewMode] = useState<'trend' | 'distribution'>('trend');

  const data = useMemo(() => {
    if (records.length === 0) return [];
    
    const sorted = [...records].reverse(); // Oldest first for charts
    const now = new Date();
    
    let cutoff = new Date();
    if (range === 'week') cutoff.setDate(now.getDate() - 7);
    if (range === 'month') cutoff.setMonth(now.getMonth() - 1);
    if (range === 'year') cutoff.setFullYear(now.getFullYear() - 1);

    return sorted
      .filter(r => new Date(r.timestamp) >= cutoff)
      .map(r => ({
        ...r,
        dateFormatted: new Date(r.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      }));
  }, [records, range]);

  if (records.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            {viewMode === 'trend' ? <Activity className="w-4 h-4 text-rose-500" /> : <BarChart2 className="w-4 h-4 text-blue-500" />}
            {viewMode === 'trend' ? 'BP Trends' : 'BP Distribution'}
          </h3>
          
          {/* View Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('trend')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'trend' ? 'bg-white shadow-sm text-rose-500' : 'text-slate-400'}`}
              title="Trend View"
            >
              <Activity className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('distribution')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'distribution' ? 'bg-white shadow-sm text-blue-500' : 'text-slate-400'}`}
              title="Distribution View"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="flex bg-slate-50 p-1 rounded-lg w-full">
          {(['week', 'month', 'year'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                range === r ? 'bg-white text-slate-800 shadow-sm ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="h-80 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'trend' ? (
            <LineChart data={data} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="dateFormatted" 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
                axisLine={false}
                tickLine={false}
                minTickGap={30}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Threshold Lines */}
              <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.3} label={{ value: '140', fill: '#ef4444', fontSize: 10, position: 'right' }} />
              <ReferenceLine y={120} stroke="#22c55e" strokeDasharray="3 3" strokeOpacity={0.3} label={{ value: '120', fill: '#22c55e', fontSize: 10, position: 'right' }} />
              <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.3} />
              <ReferenceLine y={80} stroke="#22c55e" strokeDasharray="3 3" strokeOpacity={0.3} />
              
              <Line 
                type="monotone" 
                dataKey="systolic" 
                stroke="#ef4444" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#ef4444' }}
              />
              <Line 
                type="monotone" 
                dataKey="diastolic" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
              />
            </LineChart>
          ) : (
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis 
                type="number" 
                dataKey="systolic" 
                name="Systolic" 
                unit=" mmHg"
                domain={[90, 200]}
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              >
                <Label value="Systolic (X)" offset={0} position="insideBottom" style={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} />
              </XAxis>
              <YAxis 
                type="number" 
                dataKey="diastolic" 
                name="Diastolic" 
                unit=" mmHg"
                domain={[50, 130]}
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              >
                <Label value="Diastolic (Y)" angle={-90} position="insideLeft" style={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} />
              </YAxis>
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              
              {/* 
                  Color Zones using Painter's Algorithm (Back to Front)
                  Guidelines:
                  - Severe: >180 Sys OR >120 Dia
                  - Stage 2: >=140 Sys OR >=90 Dia
                  - Stage 1: 130-139 Sys OR 80-89 Dia
                  - Elevated: 120-129 Sys AND <80 Dia
                  - Normal: <120 Sys AND <80 Dia
              */}

              {/* Layer 1: Severe/Crisis (Background Base) */}
              <ReferenceArea x1={0} x2={300} y1={0} y2={200} fill="#ffe4e6" fillOpacity={1} />

              {/* Layer 2: Stage 2 (Limits: <180/120) */}
              <ReferenceArea x1={0} x2={180} y1={0} y2={120} fill="#fee2e2" fillOpacity={1} />
              
              {/* Layer 3: Stage 1 (Limits: <140/90) */}
              <ReferenceArea x1={0} x2={140} y1={0} y2={90} fill="#ffedd5" fillOpacity={1} />
              
              {/* Layer 4: Elevated (Limits: <130/80) - Yellow Strip */}
              <ReferenceArea x1={0} x2={130} y1={0} y2={80} fill="#fef9c3" fillOpacity={1} />
              
              {/* Layer 5: Normal (Limits: <120/80) - Green */}
              <ReferenceArea x1={0} x2={120} y1={0} y2={80} fill="#dcfce7" fillOpacity={1} />

              {/* Guidelines for key thresholds */}
              <ReferenceLine x={120} stroke="#16a34a" strokeDasharray="3 3" strokeOpacity={0.3} />
              <ReferenceLine y={80} stroke="#16a34a" strokeDasharray="3 3" strokeOpacity={0.3} />
              <ReferenceLine x={140} stroke="#dc2626" strokeDasharray="3 3" strokeOpacity={0.3} />
              <ReferenceLine y={90} stroke="#dc2626" strokeDasharray="3 3" strokeOpacity={0.3} />

              <Scatter name="Records" data={data}>
                {data.map((entry, index) => {
                  const { color } = getCategory(entry.systolic, entry.diastolic);
                  return <Cell key={`cell-${index}`} fill={color} stroke="#fff" strokeWidth={2} />;
                })}
              </Scatter>
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend / Info Footer */}
      <div className="mt-4 pt-4 border-t border-slate-50">
        {viewMode === 'trend' ? (
          <div className="flex justify-center gap-6 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Systolic
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Diastolic
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-[10px] font-medium text-slate-500">
             <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full border border-green-200 text-green-800">
              <div className="w-2 h-2 rounded-full bg-green-500"></div> Normal
            </div>
            <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full border border-yellow-200 text-yellow-800">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Elevated
            </div>
             <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full border border-orange-200 text-orange-800">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div> Stage 1
            </div>
             <div className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded-full border border-red-200 text-red-800">
              <div className="w-2 h-2 rounded-full bg-red-500"></div> Stage 2
            </div>
             <div className="flex items-center gap-1 bg-rose-200 px-2 py-1 rounded-full border border-rose-300 text-rose-900">
              <div className="w-2 h-2 rounded-full bg-rose-800"></div> Severe
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartSection;