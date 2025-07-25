#!/usr/bin/env bun

/**
 * WORKAROUND: use-m ink import with specific path
 * 
 * PROBLEM SOLVED:
 * - Original issue: use-m fails with 'ink@latest'
 * - Solution: Use specific path 'ink@latest/build/index.js'
 * - This bypasses the path resolution bug in use-m
 * 
 * WHAT WORKS:
 * - ✅ Importing React with use-m: react@latest
 * - ✅ Importing ink with specific path: ink@latest/build/index.js  
 * - ✅ Basic React.createElement functionality
 * - ✅ Simple ink Text component rendering
 * 
 * WHAT DOESN'T WORK:
 * - ❌ React hooks (useState, useEffect) - see use-m-react-hooks-bug.mjs
 * - ❌ Complex ink components that rely on hooks
 * 
 * ROOT CAUSE:
 * - use-m loads React and ink in separate contexts
 * - This breaks React's hooks system which relies on shared context
 * - React reconciler in ink can't access the hooks from separately loaded React
 * 
 * ENVIRONMENT:
 * - Runtime: Bun v1.2.16 (macOS arm64)  
 * - use-m: Latest from unpkg
 * - React: latest
 * - ink: latest/build/index.js (specific path)
 */

// Workaround attempt for use-m ink import issue
const { use } = eval(await (await fetch('https://unpkg.com/use-m/use.js')).text());

console.log('Attempting to import ink and react with specific path workaround...');
const React = await use('react@latest');
const { render, Text } = await use('ink@latest/build/index.js');
console.log('Import successful!');

// Simple test
const app = React.createElement(Text, {}, 'Hello from ink!');
render(app);