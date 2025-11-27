export interface BPRecord {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  timestamp: number;
  note?: string;
}

export type TimeRange = 'week' | 'month' | 'year';

export interface DailyAverage {
  date: string;
  systolic: number;
  diastolic: number;
  pulse: number;
}

export interface AppSettings {
  googleSheetUrl?: string;
  lastSyncTime?: number;
}