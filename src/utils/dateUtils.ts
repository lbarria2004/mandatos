/**
 * Utility functions for date formatting
 */

/**
 * Formats a date string (YYYY-MM-DD) to Chilean format (DD/MM/YYYY)
 * @param dateStr The date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  
  // Check if it's already in DD/MM/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
  
  // Try to parse YYYY-MM-DD
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    if (year.length === 4) {
      return `${day}/${month}/${year}`;
    }
  }
  
  // Fallback: try native Date parsing if it's not YYYY-MM-DD
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    // Use UTC to avoid timezone shifts for simple date strings
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (e) {
    return dateStr;
  }
};
