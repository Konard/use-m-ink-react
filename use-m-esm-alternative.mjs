#!/usr/bin/env bun

/**
 * ALTERNATIVE APPROACH: Direct ESM Imports
 * 
 * STRATEGY:
 * - Bypass use-m completely for React ecosystem packages
 * - Use direct ESM imports from CDN (skypack/esm.sh)
 * - Load React and ink in the same module context
 * 
 * HYPOTHESIS:
 * - If we can import React and ink in the same execution context,
 *   hooks should work normally without use-m's context isolation
 * 
 * BENEFITS:
 * - No use-m context isolation issues
 * - Standard React behavior
 * - Dynamic loading still possible
 * 
 * TRADE-OFFS:
 * - Not using use-m for React ecosystem
 * - Different loading mechanism for different packages
 * 
 * ENVIRONMENT:
 * - Runtime: Bun v1.2.16 (macOS arm64)
 * - CDN: esm.sh for ESM modules
 * - Method: Dynamic import() calls
 */

console.log('🔄 Loading React and ink via direct ESM imports...');

try {
  // Load React and ink using fetch + eval (similar to use-m approach)
  console.log('📦 Loading React via fetch...');
  const reactCode = await (await fetch('https://esm.sh/react@18')).text();
  const React = eval(`(${reactCode})`);
  
  console.log('📦 Loading ink via fetch...');
  const inkCode = await (await fetch('https://esm.sh/ink@4')).text();
  const ink = eval(`(${inkCode})`);
  
  console.log('✅ Both packages loaded in same context');
  console.log('🧪 Testing React hooks with ESM approach...');
  
  const { render, Text } = ink;
  const { useState, useEffect } = React;
  
  function TestApp() {
    console.log('📍 Inside TestApp - testing hooks...');
    
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState('ESM loading...');
    
    useEffect(() => {
      console.log('✅ useEffect working with ESM imports!');
      setMessage('ESM approach successful!');
      
      const timer = setTimeout(() => {
        setCount(prevCount => prevCount + 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }, []);
    
    useEffect(() => {
      if (count > 0) {
        console.log('✅ State updates working!');
        setTimeout(() => {
          console.log('🎉 ESM alternative approach successful!');
          process.exit(0);
        }, 1000);
      }
    }, [count]);
    
    return React.createElement(
      'div', 
      null,
      React.createElement(Text, { color: 'green' }, `✅ ${message}`),
      React.createElement(Text, { color: 'blue' }, `Count: ${count}`)
    );
  }
  
  console.log('🚀 Rendering with ESM approach...');
  render(React.createElement(TestApp));
  
} catch (error) {
  console.error('❌ ESM approach failed:', error.message);
  console.error('Stack:', error.stack);
}