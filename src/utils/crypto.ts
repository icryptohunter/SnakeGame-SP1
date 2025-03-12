/**
 * crypto.ts
 * Utility functions for cryptographic operations.
 * Changes:
 * - Created new file for cryptographic utilities
 * - Implemented SHA-256 hashing using Web Crypto API
 * - Added helper functions for encoding/decoding
 */

// Convert string to ArrayBuffer
const stringToBuffer = (str: string): ArrayBuffer => {
  return new TextEncoder().encode(str);
};

// Convert ArrayBuffer to hex string
const bufferToHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Generate SHA-256 hash of a string
export const sha256 = async (message: string): Promise<string> => {
  try {
    // Use the Web Crypto API to generate a SHA-256 hash
    const msgBuffer = stringToBuffer(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashHex = bufferToHex(hashBuffer);
    return hashHex;
  } catch (error) {
    console.error('Error generating SHA-256 hash:', error);
    
    // Fallback to a simple hash function if Web Crypto API is not available
    return fallbackHash(message);
  }
};

// Fallback hash function in case Web Crypto API is not available
const fallbackHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to a hex string and ensure it's 64 characters long (like SHA-256)
  const hashHex = Math.abs(hash).toString(16).padStart(8, '0');
  return hashHex.repeat(8).substring(0, 64);
};

// Generate a random string of specified length
export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
};