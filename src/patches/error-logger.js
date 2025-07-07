// Error logger to help diagnose issues

// Save the original console.error
const originalConsoleError = console.error;

// Override console.error to provide more detailed logging
console.error = function(...args) {
  // Call the original console.error
  originalConsoleError.apply(console, args);
  
  // Log additional information for debugging
  if (args[0] && typeof args[0] === 'object' && args[0] instanceof Error) {
    originalConsoleError('Error details:', {
      name: args[0].name,
      message: args[0].message,
      stack: args[0].stack
    });
  }
  
  // Log environment information
  originalConsoleError('Environment:', {
    process: typeof process !== 'undefined' ? 'defined' : 'undefined',
    browser: typeof browser !== 'undefined' ? 'defined' : 'undefined',
    window: typeof window !== 'undefined' ? 'defined' : 'undefined'
  });
};

// Add a global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', function(event) {
    console.log('Global error caught:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });
  
  console.log('Error logger installed');
}