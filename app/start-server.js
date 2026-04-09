#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting TripGuard servers...\n');

// Start backend server
const backend = spawn('node', ['server/index.js'], {
  cwd: __dirname,
  stdio: 'inherit'
});

// Start frontend dev server
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit'
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  backend.kill();
  frontend.kill();
  process.exit(0);
});
