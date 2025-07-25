#!/usr/bin/env bun

/**
 * ATTEMPTED WORKAROUND: React 17 with ink 3 (older versions)
 * 
 * HYPOTHESIS:
 * - Maybe older versions of React and ink work better together with use-m
 * - React 17.0.2 + ink 3.2.0 might have different context handling
 * 
 * RESULT: ❌ FAILED
 * - Same fundamental error as newer versions
 * - "Invalid hook call" and resolveDispatcher() failures
 * - Error location: react@17.0.2/cjs/react.development.js:1476:13
 * 
 * ERROR DETAILS:
 * - resolveDispatcher() returns null
 * - useState() fails when calling dispatcher.useState()
 * - Warning: "Invalid hook call. Hooks can only be called inside of the body of a function component"
 * - Warning: "You might have more than one copy of React in the same app"
 * 
 * TECHNICAL ANALYSIS:
 * - The error message about "more than one copy of React" is key
 * - use-m creates isolated contexts, effectively creating multiple React instances
 * - ink 3.2.0 has its own bundled React reconciler
 * - Our separately loaded React 17.0.2 can't communicate with ink's reconciler
 * 
 * VERSION COMPATIBILITY TESTED:
 * - ❌ react@17.0.2 + ink@3.2.0/build/index.js
 * - This confirms the issue exists across React/ink version ranges
 * - The problem is architectural, not version-specific
 * 
 * ENVIRONMENT:
 * - Runtime: Bun v1.2.16 (macOS arm64)
 * - use-m: Latest from unpkg
 * - React: 17.0.2 (older stable)
 * - ink: 3.2.0/build/index.js (older stable)
 */

// Try React 17 with ink 3
const { use } = eval(await (await fetch('https://unpkg.com/use-m/use.js')).text());

console.log('Trying React 17 with ink 3...');
const React = await use('react@17.0.2');
const { render, Text, useApp } = await use('ink@3.2.0/build/index.js');
const { useState, useEffect } = React;

console.log('Testing React hooks...');

function TestApp() {
  const [count, setCount] = useState(0); // This will fail
  const { exit } = useApp();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setCount(c => c + 1);
      setTimeout(() => exit(), 1000);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  return React.createElement(Text, {}, `Count: ${count} - React 17 + ink 3!`);
}

render(React.createElement(TestApp));