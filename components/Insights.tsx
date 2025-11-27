import React, { useState } from 'react';
import { Brain, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { BPRecord } from '../types';
import { analyzeTrends } from '../services/geminiService';

interface InsightsProps {
  records: BPRecord[];
}

const Insights: React.FC<InsightsProps> = ({ records }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await analyzeTrends(records);
      setAnalysis(result);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (records.length < 2) return null;

  return (
    <div className="mb-6">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Brain size={120} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h3 className="font-bold text-lg">AI Health Insights</h3>
          </div>

          {!analysis && !loading && (
            <div>
              <p className="text-indigo-100 text-sm mb-4">
                Get a personalized analysis of your blood pressure trends and potential health tips powered by Gemini.
              </p>
              <button 
                onClick={handleAnalyze}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                Generate Report
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-4">
              <RefreshCw className="w-8 h-8 animate-spin text-white/70 mb-2" />
              <p className="text-xs text-white/70 font-medium">Analyzing your data...</p>
            </div>
          )}

          {analysis && !loading && (
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-sm leading-relaxed border border-white/10">
                {analysis}
              </div>
              <button 
                onClick={handleAnalyze}
                className="mt-3 text-xs text-indigo-200 hover:text-white flex items-center gap-1 opacity-80"
              >
                <RefreshCw className="w-3 h-3" /> Refresh Analysis
              </button>
            </div>
          )}
          
          {error && (
             <div className="flex items-center gap-2 text-red-200 bg-red-900/20 p-2 rounded-lg mt-2">
               <AlertCircle className="w-4 h-4" />
               <span className="text-xs">Failed to generate insights. Try again.</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Insights;
