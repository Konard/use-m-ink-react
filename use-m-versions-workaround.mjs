#!/usr/bin/env bun

/**
 * ATTEMPTED WORKAROUND: Specific React and ink version combinations
 * 
 * HYPOTHESIS:
 * - Maybe specific versions of React and ink are compatible with use-m
 * - Testing React 18.2.0 with ink 4.4.1 for compatibility
 * 
 * RESULT: ❌ FAILED
 * - Same error as with latest versions
 * - "null is not an object (evaluating 'dispatcher.useState')"
 * - Invalid hook call warnings persist
 * 
 * CONCLUSION:
 * - The issue is not version-specific
 * - The problem is architectural: separate loading contexts in use-m
 * - No combination of React + ink versions will work with separate use-m imports
 * 
 * TESTED COMBINATIONS:
 * - ❌ react@18.2.0 + ink@4.4.1/build/index.js
 * - ❌ react@17.0.2 + ink@3.2.0/build/index.js (see use-m-react17.mjs)
 * - ❌ react@latest + ink@latest/build/index.js
 * 
 * TECHNICAL REASON:
 * - React hooks dispatcher is context-dependent
 * - use-m creates isolated module contexts
 * - ink's React reconciler cannot access the hooks from separately loaded React
 * - This is a fundamental limitation of the use-m + React hooks combination
 * 
 * ENVIRONMENT:
 * - Runtime: Bun v1.2.16 (macOS arm64)
 * - use-m: Latest from unpkg
 * - React: 18.2.0 (specific version)
 * - ink: 4.4.1/build/index.js (specific version + path)
 */

// Testing compatible versions for React and ink
const { use } = eval(await (await fetch('https://unpkg.com/use-m/use.js')).text());

console.log('Trying React 18 with ink 4...');
const React = await use('react@18.2.0');
const { render, Text, useApp } = await use('ink@4.4.1/build/index.js');
const { useState } = React;

console.log('Testing React hooks...');

function TestApp() {
  const [count, setCount] = useState(0); // This will still fail
  const { exit } = useApp();
  
  setTimeout(() => {
    setCount(1);
    setTimeout(() => exit(), 1000);
  }, 1000);
  
  return React.createElement(Text, {}, `Count: ${count} - React hooks working!`);
}

render(React.createElement(TestApp));