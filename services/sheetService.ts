import { Refugee } from '../types';
import { GOOGLE_SCRIPT_URL } from '../constants';

// NOTE: Google Apps Scripts Web Apps often have strict CORS policies. 
// A robust implementation often requires 'no-cors' mode for writing.

export const fetchRefugees = async (): Promise<Refugee[]> => {
  try {
    // Append timestamp to avoid caching
    const url = `${GOOGLE_SCRIPT_URL}?t=${new Date().getTime()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // Transform array of arrays (Sheet format) to Objects if necessary, 
    // or assume the App Script returns an array of objects.
    return Array.isArray(data) ? data : (data.data || []);
  } catch (error) {
    console.warn("Failed to fetch from Google Sheet (likely CORS or Script Setup).", error);
    return [];
  }
};

export const submitRefugee = async (refugee: Omit<Refugee, 'id'>): Promise<{ success: boolean; error?: string }> => {
  try {
    // Google Apps Script usually requires a POST request stringified as text/plain
    // Using mode: 'no-cors' is the most reliable way to send data to GAS from client-side
    // without triggering CORS preflight issues.
    // NOTE: With no-cors, we cannot read the response status (it will be opaque/false),
    // but the request usually succeeds if it reaches this point without network error.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(refugee),
    });
    
    // We assume success if fetch didn't throw an error.
    return { success: true };
  } catch (error: any) {
    console.error("Error submitting data:", error);
    return { success: false, error: error.message || "Network Error" };
  }
};