import React, { useState } from 'react';
import { X, Save, Clock, Calendar } from 'lucide-react';
import { BPRecord } from '../types';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: BPRecord) => void;
}

const AddModal: React.FC<AddModalProps> = ({ isOpen, onClose, onSave }) => {
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [pulse, setPulse] = useState('72');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date(`${date}T${time}`).getTime();
    
    onSave({
      id: crypto.randomUUID(),
      systolic: parseInt(systolic),
      diastolic: parseInt(diastolic),
      pulse: parseInt(pulse),
      timestamp,
      note
    });
    onClose();
    // Reset defaults for next time, but keep reasonable values
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="bg-white w-full sm:w-[400px] rounded-t-3xl sm:rounded-3xl p-6 pb-10 sm:pb-6 shadow-2xl transform transition-transform pointer-events-auto animate-in slide-in-from-bottom-full duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">New Reading</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BP Input Row */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Systolic</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={systolic} 
                  onChange={e => setSystolic(e.target.value)}
                  className="w-full text-3xl font-bold text-slate-800 bg-slate-50 border-none rounded-xl p-3 text-center focus:ring-2 focus:ring-rose-500"
                  pattern="\d*"
                  required
                />
                <span className="absolute top-2 right-2 text-[10px] font-bold text-slate-400">mmHg</span>
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Diastolic</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={diastolic} 
                  onChange={e => setDiastolic(e.target.value)}
                  className="w-full text-3xl font-bold text-slate-800 bg-slate-50 border-none rounded-xl p-3 text-center focus:ring-2 focus:ring-blue-500"
                  pattern="\d*"
                  required
                />
                <span className="absolute top-2 right-2 text-[10px] font-bold text-slate-400">mmHg</span>
              </div>
            </div>
          </div>

          {/* Pulse Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pulse</label>
            <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-3">
              <input 
                type="number" 
                value={pulse} 
                onChange={e => setPulse(e.target.value)}
                className="flex-1 text-2xl font-bold text-slate-800 bg-transparent border-none focus:ring-0"
                pattern="\d*"
                required
              />
              <span className="text-sm font-medium text-slate-400">BPM</span>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="date" 
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium text-slate-700"
                />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="time" 
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium text-slate-700"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Note (Optional)</label>
            <input 
              type="text" 
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g., After workout, Woke up..."
              className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddModal;
