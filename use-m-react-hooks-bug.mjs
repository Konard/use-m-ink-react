#!/usr/bin/env bun

/**
 * BUG REPORT: React hooks incompatibility with use-m when loading React and ink separately
 * 
 * PROBLEM:
 * - React hooks fail when React and ink are loaded via separate use-m calls
 * - Error: "null is not an object (evaluating 'resolveDispatcher().useState')"
 * - Also shows "Invalid hook call" warnings
 * 
 * ROOT CAUSE ANALYSIS:
 * - use-m loads each package in its own context/module space
 * - React hooks rely on a shared dispatcher context between React and React reconciler
 * - When React is loaded separately from ink, they don't share the same context
 * - ink's internal React reconciler can't access the hooks dispatcher from separately loaded React
 * 
 * TECHNICAL DETAILS:
 * - React's useState calls resolveDispatcher() to get the current hooks dispatcher
 * - This dispatcher is set by React reconciler during component rendering
 * - With separate loading, ink's reconciler and the React hooks are in different contexts
 * - The dispatcher remains null, causing the error
 * 
 * TESTED COMBINATIONS:
 * - ❌ react@latest + ink@latest/build/index.js
 * - ❌ react@18.2.0 + ink@4.4.1/build/index.js  
 * - ❌ react@17.0.2 + ink@3.2.0/build/index.js
 * 
 * ERROR DETAILS:
 * - TypeError: null is not an object (evaluating 'resolveDispatcher().useState')
 * - Location: react.development.js:1221:32 in resolveDispatcher().useState()
 * - Warning: Invalid hook call (multiple copies of React detected)
 * 
 * ENVIRONMENT:
 * - Runtime: Bun v1.2.16 (macOS arm64)
 * - use-m: Latest from unpkg
 * - Multiple React/ink version combinations tested
 */

// Minimal reproducible example for React hooks compatibility issue with use-m
const { use } = eval(await (await fetch('https://unpkg.com/use-m/use.js')).text());

console.log('Importing React and ink...');
const React = await use('react@latest');
const { render, Text, useApp } = await use('ink@latest/build/index.js');
const { useState } = React;

console.log('Testing React hooks...');

function TestApp() {
  const [count, setCount] = useState(0); // This will fail
  const { exit } = useApp();
  
  return React.createElement(Text, {}, `Count: ${count}`);
}

render(React.createElement(TestApp));