#!/usr/bin/env bun

/**
 * BUG REPORT: use-m ink import path resolution issue
 * 
 * PROBLEM:
 * - use-m fails to resolve ink@latest package path correctly
 * - Creates invalid directory name: /path/to/node_modules/ink-v-latest
 * - Should create: /path/to/node_modules/ink@latest or similar valid path
 * 
 * ERROR MESSAGE:
 * "Failed to resolve the path to 'ink@latest' from '/Users/.../node_modules/ink-v-latest'"
 * 
 * REPRODUCTION:
 * 1. Run this script with bun
 * 2. use-m attempts to import ink@latest
 * 3. Fails at path resolution step
 * 
 * EXPECTED BEHAVIOR:
 * - Should successfully import ink package
 * - Should create valid directory structure
 * 
 * ENVIRONMENT:
 * - Runtime: Bun v1.2.16 (macOS arm64)
 * - use-m: Latest from unpkg
 * - Package: ink@latest
 */

// https://github.com/vadimdemedes/ink/blob/ecaf0608e126d485aa2bf1adfc37957784af8120/package.json#L13-L16
// This is why it does not work, exports - default is not used by use-m 

// Minimal reproducible example for use-m ink import issue
const { use } = eval(await (await fetch('https://unpkg.com/use-m/use.js')).text());

console.log('Attempting to import ink with use-m...');
const { render, Text } = await use('ink@latest');
console.log('Import successful!');

// Simple test
const React = { createElement: (type, props, ...children) => ({ type, props, children }) };
const app = React.createElement(Text, {}, 'Hello from ink!');
render(app);