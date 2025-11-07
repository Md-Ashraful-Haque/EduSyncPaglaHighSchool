// utils/debug.js
export function debugLog(...args) {
  const stack = new Error().stack;
  const callerInfo = stack.split('\n')[2]; // Get the caller's stack frame
  const match = callerInfo.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) || 
                callerInfo.match(/at\s+(.*):(\d+):(\d+)/); // Handle different stack formats
  if (match) {
    const [, , file, line] = match;
    const fileName = file.split('/').pop(); // Extract file name from path
    console.log(`[${fileName}:${line}]`, ...args);
  } else {
    console.log('[Unknown Source]', ...args);
  }
}