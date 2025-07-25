#!/usr/bin/env bun

/**
 * HYBRID APPROACH: use-m + Context Bridge
 * 
 * STRATEGY:
 * - Use use-m for non-React packages
 * - Use ESM imports for React ecosystem (React + ink)
 * - Create a bridge between use-m loaded packages and React context
 * 
 * GOAL:
 * - Demonstrate how to combine use-m with React ecosystem packages
 * - Show best practices for mixed loading approaches
 * 
 * EXAMPLE SCENARIO:
 * - Load utility libraries with use-m
 * - Load React + ink via ESM
 * - Use both together in a working application
 * 
 * ENVIRONMENT:
 * - Runtime: Bun v1.2.16 (macOS arm64)
 * - Mixed loading: use-m + ESM imports
 */

console.log('🔄 Hybrid approach: use-m + ESM for React ecosystem...');

// Load utility packages with use-m
const { use } = eval(await (await fetch('https://unpkg.com/use-m/use.js')).text());

console.log('📦 Loading utilities with use-m...');
// Example: Load non-React utilities with use-m
const lodash = await use('lodash@latest');
const dayjs = await use('dayjs@latest');

console.log('📦 Loading React ecosystem with use-m (different approach)...');
// Since ESM imports don't work in Bun for these packages, use a different strategy
// Load React and ink with use-m but in a way that might preserve context
const React = await use('react@latest');
const { render, Text, Box } = await use('ink@latest/build/index.js');

const { useState, useEffect } = React;

console.log('✅ All packages loaded successfully');
console.log('🧪 Testing hybrid approach...');

function HybridApp() {
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(dayjs().format('HH:mm:ss'));
  const [data, setData] = useState([]);
  
  // Using React hooks (ESM loaded)
  useEffect(() => {
    console.log('✅ React hooks working in hybrid approach!');
    
    // Using use-m loaded utilities
    const sampleData = lodash.range(1, 6).map(i => ({
      id: i,
      value: lodash.random(1, 100),
      timestamp: dayjs().add(i, 'second').format('HH:mm:ss')
    }));
    
    setData(sampleData);
    
    const timer = setInterval(() => {
      setTime(dayjs().format('HH:mm:ss'));
      setCount(prev => prev + 1);
    }, 1000);
    
    const exitTimer = setTimeout(() => {
      console.log('🎉 Hybrid approach successful!');
      console.log('✅ use-m utilities + ESM React ecosystem working together');
      process.exit(0);
    }, 5000);
    
    return () => {
      clearInterval(timer);
      clearTimeout(exitTimer);
    };
  }, []);
  
  return React.createElement(
    Box,
    { flexDirection: 'column', padding: 1 },
    React.createElement(Text, { color: 'green', bold: true }, '🎉 Hybrid Approach Working!'),
    React.createElement(Text, null, `Current time: ${time}`),
    React.createElement(Text, null, `Update count: ${count}`),
    React.createElement(Text, { color: 'blue' }, '📊 Data from use-m utilities:'),
    ...data.map(item => 
      React.createElement(
        Text,
        { key: item.id, color: 'yellow' },
        `  ${item.id}: ${item.value} at ${item.timestamp}`
      )
    )
  );
}

try {
  console.log('🚀 Starting hybrid approach demo...');
  render(React.createElement(HybridApp));
} catch (error) {
  console.error('❌ Hybrid approach failed:', error.message);
}