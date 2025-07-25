#!/usr/bin/env bun

/**
 * ADVANCED WORKAROUND: Context Sharing Approach
 * 
 * STRATEGY:
 * - Load React first and make it globally available
 * - Use eval/global context manipulation to share React between modules
 * - Import ink after React is in global scope
 * 
 * HYPOTHESIS:
 * - If ink can access the same React instance that we're using for hooks,
 *   the context isolation issue might be resolved
 * 
 * APPROACH:
 * 1. Load React via use-m and expose it globally
 * 2. Force ink to use the same React instance
 * 3. Test if hooks work with shared context
 * 
 * ENVIRONMENT:
 * - Runtime: Bun v1.2.16 (macOS arm64)
 * - use-m: Latest from unpkg
 * - Method: Global context manipulation
 */

const { use } = eval(await (await fetch('https://unpkg.com/use-m/use.js')).text());

console.log('🔄 Loading React first and making it globally available...');

// Load React and expose it globally
const React = await use('react@latest');
globalThis.React = React;
globalThis.__REACT_SHARED__ = React;

console.log('✅ React loaded and exposed globally');
console.log('🔄 Loading ink with potential access to shared React...');

// Now load ink - it might use the global React
const { render, Text, useApp } = await use('ink@latest/build/index.js');

console.log('✅ ink loaded');
console.log('🧪 Testing React hooks with context sharing...');

function TestApp() {
  console.log('📍 Inside TestApp - testing useState...');
  
  try {
    // Try to use React hooks - should work if context is shared
    const [count, setCount] = React.useState(0);
    const { exit } = useApp();
    
    console.log('✅ useState worked! Initial count:', count);
    
    // Test state updates
    React.useEffect(() => {
      console.log('✅ useEffect working!');
      const timer = setTimeout(() => {
        console.log('🔄 Updating count...');
        setCount(1);
        setTimeout(() => {
          console.log('✅ Context sharing workaround successful!');
          exit();
        }, 500);
      }, 1000);
      return () => clearTimeout(timer);
    }, []);
    
    return React.createElement(Text, { color: 'green' }, `✅ Count: ${count} - Context sharing works!`);
    
  } catch (error) {
    console.error('❌ Context sharing failed:', error.message);
    return React.createElement(Text, { color: 'red' }, `❌ Error: ${error.message}`);
  }
}

try {
  console.log('🚀 Rendering app with context sharing...');
  render(React.createElement(TestApp));
} catch (error) {
  console.error('❌ Render failed:', error.message);
}