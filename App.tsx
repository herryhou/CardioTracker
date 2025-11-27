import React, { useState, useEffect } from 'react';
import { Plus, FileSpreadsheet, History as HistoryIcon, LayoutDashboard, Settings, Cloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { BPRecord, AppSettings } from './types';
import * as storage from './services/storage';
import { syncToGoogleSheets } from './services/syncService';

// Components
import StatsCards from './components/StatsCards';
import ChartSection from './components/ChartSection';
import AddModal from './components/AddModal';
import Insights from './components/Insights';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [records, setRecords] = useState<BPRecord[]>([]);
  const [settings, setSettings] = useState<AppSettings>({});
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
  
  // Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    setRecords(storage.getRecords());
    setSettings(storage.getSettings());
  }, []);

  const handleSaveRecord = (record: BPRecord) => {
    const updated = storage.saveRecord(record);
    setRecords(updated);
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    const updated = storage.saveSettings(newSettings);
    setSettings(updated);
  };
  
  const handleSync = async () => {
    if (!settings.googleSheetUrl) {
      setIsSettingsOpen(true);
      return;
    }
    
    setIsSyncing(true);
    setSyncStatus('idle');
    
    try {
      await syncToGoogleSheets(settings.googleSheetUrl, records);
      setSyncStatus('success');
      storage.saveSettings({ lastSyncTime: Date.now() });
      setSettings(prev => ({ ...prev, lastSyncTime: Date.now() }));
      
      // Reset success status after 3 seconds
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExport = () => {
    const csv = storage.exportToCSV(records);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cardiotrack_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };
  
  const handleDelete = (id: string) => {
      if(window.confirm("Delete this record?")) {
          const updated = storage.deleteRecord(id);
          setRecords(updated);
      }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-5 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm shadow-rose-200">
              <span className="tracking-tighter text-sm">CT</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">CardioTrack</h1>
          </div>
          
          <div className="flex items-center gap-1">
            {/* Sync Button */}
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className={`p-2 rounded-full transition-all relative ${
                syncStatus === 'success' ? 'text-green-500 bg-green-50' : 
                syncStatus === 'error' ? 'text-red-500 bg-red-50' :
                'text-slate-400 hover:text-blue-500 hover:bg-blue-50'
              }`}
              title={settings.googleSheetUrl ? "Sync to Google Sheets" : "Configure Sync"}
            >
              {isSyncing ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              ) : syncStatus === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : syncStatus === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <Cloud className="w-5 h-5" />
              )}
            </button>

            {/* Settings Button */}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {activeTab === 'dashboard' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <StatsCards records={records} />
            <Insights records={records} />
            <ChartSection records={records} />
            
            <div className="mt-8">
                <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="font-semibold text-slate-700">Recent History</h3>
                    {settings.lastSyncTime && (
                      <span className="text-[10px] text-slate-400">
                        Last synced: {new Date(settings.lastSyncTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    )}
                </div>
                <div className="space-y-3">
                    {records.slice(0, 5).map(record => (
                        <div key={record.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                            <div>
                                <div className="font-bold text-slate-800">
                                    {record.systolic}/{record.diastolic} <span className="text-slate-400 font-normal text-sm">mmHg</span>
                                </div>
                                <div className="text-xs text-slate-400 mt-1">
                                    {new Date(record.timestamp).toLocaleDateString()} • {new Date(record.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                             <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1 text-rose-500 font-semibold">
                                    <span className="text-lg">{record.pulse}</span> <span className="text-xs opacity-70">BPM</span>
                                </div>
                             </div>
                        </div>
                    ))}
                    {records.length === 0 && (
                         <div className="text-center py-8 text-slate-400 text-sm bg-white rounded-xl border border-slate-100 border-dashed">
                            No records yet. Tap + to add.
                         </div>
                    )}
                </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex items-center justify-between mb-4 px-1">
                 <h2 className="text-xl font-bold text-slate-800">All Records</h2>
                 <button 
                   onClick={handleExport}
                   className="text-xs font-medium text-slate-500 flex items-center gap-1 hover:text-slate-800"
                 >
                   <FileSpreadsheet className="w-4 h-4" /> CSV
                 </button>
             </div>
            
            {records.map(record => (
              <div key={record.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-start relative group">
                <div>
                  <div className="font-bold text-lg text-slate-800">
                    {record.systolic}/{record.diastolic}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                     {new Date(record.timestamp).toDateString()} {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {record.note && (
                    <div className="mt-2 text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded-md inline-block">
                      {record.note}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="font-semibold text-rose-500 bg-rose-50 px-2 py-1 rounded-lg text-sm">
                        HR {record.pulse}
                    </div>
                    <button 
                        onClick={() => handleDelete(record.id)}
                        className="text-xs text-red-300 hover:text-red-500 p-1"
                    >
                        Delete
                    </button>
                </div>
              </div>
            ))}
             {records.length === 0 && (
                 <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                     <HistoryIcon className="w-12 h-12 mb-2 opacity-20" />
                     <p>No history available</p>
                 </div>
            )}
          </div>
        )}
      </main>

      {/* FAB - Add Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-slate-900 text-white rounded-full shadow-xl shadow-slate-900/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-30">
        <div className="max-w-md mx-auto grid grid-cols-2 h-16">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'dashboard' ? 'text-rose-500' : 'text-slate-400'}`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'history' ? 'text-rose-500' : 'text-slate-400'}`}
          >
            <HistoryIcon className="w-6 h-6" />
            <span className="text-[10px] font-medium">History</span>
          </button>
        </div>
      </nav>

      <AddModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveRecord} 
      />
      
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </div>
  );
}