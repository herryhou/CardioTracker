import { BPRecord, AppSettings } from '../types';

const STORAGE_KEY = 'cardiotrack_data_v1';
const SETTINGS_KEY = 'cardiotrack_settings_v1';

export const getRecords = (): BPRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load records", e);
    return [];
  }
};

export const saveRecord = (record: BPRecord): BPRecord[] => {
  const current = getRecords();
  const updated = [record, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteRecord = (id: string): BPRecord[] => {
  const current = getRecords();
  const updated = current.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const exportToCSV = (records: BPRecord[]): string => {
  const headers = ['Date', 'Time', 'Systolic (mmHg)', 'Diastolic (mmHg)', 'Pulse (bpm)', 'Note'];
  const rows = records.map(r => {
    const date = new Date(r.timestamp);
    return [
      date.toLocaleDateString(),
      date.toLocaleTimeString(),
      r.systolic,
      r.diastolic,
      r.pulse,
      `"${r.note || ''}"`
    ].join(',');
  });
  return [headers.join(','), ...rows].join('\n');
};

export const exportToJSON = (records: BPRecord[]): string => {
  return JSON.stringify(records, null, 2);
};

export const getSettings = (): AppSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

export const saveSettings = (settings: AppSettings): AppSettings => {
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  return updated;
};