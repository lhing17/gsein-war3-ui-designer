// This polyfill ensures the 'browser' global variable is defined

// Create a global browser object if it doesn't exist
if (typeof window !== 'undefined' && typeof window.browser === 'undefined') {
  window.browser = {};
  console.log('Browser polyfill applied: window.browser object created');
}

// Create a global browser variable if it doesn't exist
if (typeof browser === 'undefined') {
  try {
    // In a browser environment
    if (typeof window !== 'undefined') {
      // Use the window.browser we created above
      globalThis.browser = window.browser;
    } else {
      // In a Node.js environment
      globalThis.browser = {};
    }
    console.log('Browser polyfill applied: global browser variable created');
  } catch (e) {
    console.error('Failed to create global browser variable:', e);
  }
}