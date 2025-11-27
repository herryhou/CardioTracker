import { BPRecord } from '../types';

export const syncToGoogleSheets = async (url: string, records: BPRecord[]): Promise<boolean> => {
  try {
    // Format data for the sheet
    const payload = records.map(r => ({
      id: r.id,
      date: new Date(r.timestamp).toLocaleDateString(),
      time: new Date(r.timestamp).toLocaleTimeString(),
      systolic: r.systolic,
      diastolic: r.diastolic,
      pulse: r.pulse,
      note: r.note || ''
    }));

    // Use no-cors mode for simple fire-and-forget or opaque response if needed, 
    // but standard POST usually works if the script handles CORS correctly.
    // However, Google Apps Script Web Apps often require 'no-cors' for simple browser fetch 
    // or correct CORS headers in the script.
    // 'no-cors' means we can't read the response, but the request is sent.
    
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    return true;
  } catch (error) {
    console.error("Sync failed:", error);
    throw error;
  }
};

export const generateScriptCode = () => {
  return `
/* 
   1. Go to extensions > Apps Script in your Google Sheet
   2. Paste this code
   3. Deploy > New Deployment > Select "Web app"
   4. Execute as: "Me"
   5. Who has access: "Anyone" (Required for the app to post data)
   6. Click Deploy and copy the Web App URL
*/

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Clear existing data to perform a full sync/overwrite
    sheet.clear();
    
    // Set Headers
    sheet.appendRow(['ID', 'Date', 'Time', 'Systolic', 'Diastolic', 'Pulse', 'Note']);
    
    // Append all records
    // Note: Data is sent from app sorted newest first, you might want to reverse if you prefer
    data.forEach(function(r) {
      sheet.appendRow([r.id, r.date, r.time, r.systolic, r.diastolic, r.pulse, r.note]);
    });
    
    return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
  `;
};