// This patch fixes the 'browser is not defined' error in @react-dnd/invariant

// Create a safer implementation of isProduction
const safeIsProduction = function() {
  try {
    // Avoid using browser variable completely
    return typeof process !== 'undefined' && 
           typeof process.env !== 'undefined' && 
           process.env.NODE_ENV === 'production';
  } catch (e) {
    console.warn('Error checking production environment:', e);
    return false; // Default to development mode if there's an error
  }
};

// Apply the patch when the module is loaded
try {
  // Try to directly modify the module's exports
  const invariantModule = require('@react-dnd/invariant/dist/index.js');
  
  // Define a custom invariant function that doesn't rely on isProduction
  const safeInvariant = function(condition, format, ...args) {
    // Always use the non-production version which includes the full error message
    if (!condition) {
      let error;
      if (format === undefined) {
        error = new Error('Minified exception occurred; use the non-minified dev environment ' + 
                        'for the full error message and additional helpful warnings.');
      } else {
        let argIndex = 0;
        error = new Error(format.replace(/%s/g, function() {
          return args[argIndex++];
        }));
        error.name = 'Invariant Violation';
      }
      error.framesToPop = 1; // we don't care about invariant's own frame
      throw error;
    }
  };
  
  // Try different approaches to patch the module
  if (typeof invariantModule === 'object') {
    // Replace the isProduction function
    if (typeof invariantModule.isProduction === 'function') {
      invariantModule.isProduction = safeIsProduction;
      console.log('Successfully patched @react-dnd/invariant isProduction function');
    }
    
    // Replace the invariant function
    if (typeof invariantModule.invariant === 'function') {
      invariantModule.invariant = safeInvariant;
      console.log('Successfully patched @react-dnd/invariant invariant function');
    }
  }
  
  // Try to patch the module in require.cache
  const modulePath = require.resolve('@react-dnd/invariant/dist/index.js');
  if (require.cache[modulePath] && require.cache[modulePath].exports) {
    const moduleExports = require.cache[modulePath].exports;
    
    // Replace the isProduction function
    if (typeof moduleExports.isProduction === 'function') {
      moduleExports.isProduction = safeIsProduction;
      console.log('Successfully patched cached @react-dnd/invariant isProduction function');
    }
    
    // Replace the invariant function
    if (typeof moduleExports.invariant === 'function') {
      moduleExports.invariant = safeInvariant;
      console.log('Successfully patched cached @react-dnd/invariant invariant function');
    }
  }
  
  console.log('Applied all possible patches to @react-dnd/invariant');
} catch (e) {
  console.error('Failed to apply @react-dnd/invariant patch:', e);
}