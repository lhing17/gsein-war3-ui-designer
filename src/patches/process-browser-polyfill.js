// This file provides a polyfill for the browser variable in process/browser

// Create a global browser object if it doesn't exist
if (typeof window !== 'undefined' && typeof browser === 'undefined') {
  window.browser = {
    // Add any browser properties needed
    // This is a minimal implementation to fix the error
  };
  
  console.log('Applied browser polyfill');
}