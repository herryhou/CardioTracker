import React, { useState, useEffect } from 'react';
import { X, Save, Copy, Check, HelpCircle, ExternalLink } from 'lucide-react';
import { AppSettings } from '../types';
import { generateScriptCode } from '../services/syncService';
import * as storage from '../services/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [url, setUrl] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const settings = storage.getSettings();
      setUrl(settings.googleSheetUrl || '');
    }
  }, [isOpen]);

  const handleSave = () => {
    onSave({ googleSheetUrl: url });
    onClose();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateScriptCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative z-10 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <div className="p-2 bg-slate-100 rounded-lg">
              <SettingsIcon className="w-5 h-5 text-slate-600" />
            </div>
            Sync Settings
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-2 space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Google Apps Script URL</label>
            <input 
              type="url" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
            />
            <p className="text-xs text-slate-500">
              Paste the Web App URL from your deployed Google Apps Script here.
            </p>
          </div>

          {/* Help / Accordion */}
          <div className="border border-indigo-100 bg-indigo-50/50 rounded-xl overflow-hidden">
            <button 
              onClick={() => setShowHelp(!showHelp)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-indigo-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-indigo-900 font-semibold text-sm">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                How to set up Google Sheet Sync
              </div>
              <ExternalLink className={`w-4 h-4 text-indigo-400 transition-transform ${showHelp ? 'rotate-180' : ''}`} />
            </button>
            
            {showHelp && (
              <div className="p-4 pt-0 border-t border-indigo-100/50">
                <ol className="list-decimal list-inside space-y-3 text-xs text-slate-600 mt-3 ml-1">
                  <li>Create a new <strong>Google Sheet</strong>.</li>
                  <li>Go to <strong>Extensions &gt; Apps Script</strong>.</li>
                  <li>Clear the editor and paste the code below:</li>
                  <div className="relative mt-2 mb-3">
                    <pre className="bg-slate-800 text-slate-300 p-3 rounded-lg overflow-x-auto text-[10px] leading-relaxed font-mono custom-scrollbar">
                      {generateScriptCode()}
                    </pre>
                    <button 
                      onClick={handleCopyCode}
                      className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors"
                      title="Copy Code"
                    >
                      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <li>Click <strong>Deploy &gt; New deployment</strong>.</li>
                  <li>Click the gear icon next to "Select type" and choose <strong>Web app</strong>.</li>
                  <li>Set <strong>Execute as</strong> to "Me".</li>
                  <li>Set <strong>Who has access</strong> to "Anyone".</li>
                  <li>Click <strong>Deploy</strong> and copy the generated Web App URL.</li>
                  <li>Paste that URL into the field above.</li>
                </ol>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 mt-6">
          <button 
            onClick={handleSave}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-base shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper icon since we can't import Settings from lucide in the props interface file
const SettingsIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default SettingsModal;