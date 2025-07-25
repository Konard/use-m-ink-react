#!/usr/bin/env bun

/**
 * ATTEMPTED WORKAROUND: Using ink's bundled React hooks
 * 
 * HYPOTHESIS:
 * - Maybe ink bundles its own React hooks that work in its context
 * - Avoid loading React separately, use only ink's exports
 * 
 * RESULT: ❌ FAILED  
 * - ink@4.4.1 does not export useState, useEffect as separate exports
 * - Attempting to destructure these from ink returns undefined
 * - Even when using React objects manually, still get rendering errors
 * 
 * ERROR ENCOUNTERED:
 * - "Objects are not valid as a React child"
 * - This indicates we're not creating proper React elements
 * 
 * INVESTIGATION FINDINGS:
 * - ink does not re-export React hooks directly
 * - ink expects you to import React separately for hooks
 * - ink only exports its own components (Text, Box, etc.) and utilities (render, useApp, etc.)
 * - The fundamental issue remains: need shared React context for hooks
 * 
 * TECHNICAL INSIGHT:
 * - ink is designed to work with a separate React import
 * - ink does not bundle/re-export React hooks
 * - This approach cannot solve the context isolation problem
 * 
 * CONCLUSION:
 * - This workaround is not viable
 * - Need to find a way to load React and ink in the same context
 * - Or use ink without React hooks (class components or simple functions)
 * 
 * ENVIRONMENT:
 * - Runtime: Bun v1.2.16 (macOS arm64)
 * - use-m: Latest from unpkg  
 * - ink: 4.4.1/build/index.js
 */

// Try using ink's bundled React instead of loading separately
const { use } = eval(await (await fetch('https://unpkg.com/use-m/use.js')).text());

console.log('Using ink bundled React...');
const ink = await use('ink@4.4.1/build/index.js');
const { render, Text, useApp, useState, useEffect } = ink;

console.log('Testing React hooks with bundled React...');
console.log('useState from ink:', typeof useState); // This will be undefined
console.log('useEffect from ink:', typeof useEffect); // This will be undefined

function TestApp() {
  // These will be undefined since ink doesn't export React hooks
  const [count, setCount] = useState ? useState(0) : [0, () => {}];
  const { exit } = useApp();
  
  if (useEffect) {
    useEffect(() => {
      const timer = setTimeout(() => {
        setCount(1);
        setTimeout(() => exit(), 1000);
      }, 1000);
      return () => clearTimeout(timer);
    }, []);
  }
  
  return { type: Text, props: {}, children: [`Count: ${count} - Bundled React working!`] };
}

render({ type: TestApp, props: {}, children: [] });