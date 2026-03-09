/**
 * Utility functions for Chilean RUT (Rol Único Tributario)
 */

/**
 * Formats a string as a Chilean RUT (XX.XXX.XXX-X)
 * @param value The raw string to format
 * @returns Formatted RUT string
 */
export const formatRut = (value: string): string => {
  // Remove all non-alphanumeric characters
  const cleanValue = value.replace(/[^0-9kK]/g, '');
  
  if (cleanValue.length === 0) return '';
  
  // Split into body and verification digit
  const dv = cleanValue.slice(-1).toUpperCase();
  const body = cleanValue.slice(0, -1);
  
  if (body.length === 0) return dv;
  
  // Format body with dots
  let formattedBody = '';
  for (let i = body.length - 1, j = 0; i >= 0; i--, j++) {
    if (j > 0 && j % 3 === 0) {
      formattedBody = '.' + formattedBody;
    }
    formattedBody = body[i] + formattedBody;
  }
  
  return `${formattedBody}-${dv}`;
};

/**
 * Calculates the verification digit (DV) for a Chilean RUT body
 * @param body The RUT body (without DV)
 * @returns The calculated DV (0-9 or K)
 */
export const calculateDV = (body: string | number): string => {
  let total = 0;
  let multiplier = 2;
  const rutStr = String(body).replace(/[^0-9]/g, '');
  
  for (let i = rutStr.length - 1; i >= 0; i--) {
    total += parseInt(rutStr[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = 11 - (total % 11);
  if (remainder === 11) return '0';
  if (remainder === 10) return 'K';
  return String(remainder);
};

/**
 * Validates a Chilean RUT
 * @param rut The full RUT string (with or without dots/hyphen)
 * @returns boolean indicating if the RUT is valid
 */
export const validateRut = (rut: string): boolean => {
  const cleanRut = rut.replace(/[^0-9kK]/g, '');
  if (cleanRut.length < 2) return false;
  
  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toUpperCase();
  
  return calculateDV(body) === dv;
};

/**
 * Cleans a RUT string to only include numbers and K
 * @param rut The RUT string
 * @returns Cleaned RUT string
 */
export const cleanRut = (rut: string): string => {
  return rut.replace(/[^0-9kK]/g, '').toUpperCase();
};
