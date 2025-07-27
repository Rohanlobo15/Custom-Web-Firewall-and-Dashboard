const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting ThreatGuard Dashboard...\n');

// Start backend server
console.log('📡 Starting backend server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// Wait a moment for backend to start
setTimeout(() => {
  console.log('\n🎨 Starting frontend dashboard...');
  const frontend = spawn('npm', ['start'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  frontend.on('error', (error) => {
    console.error('❌ Frontend error:', error);
  });
}, 3000);

backend.on('error', (error) => {
  console.error('❌ Backend error:', error);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  process.exit(0);
});

console.log('✅ Servers starting...');
console.log('📊 Dashboard will be available at: http://localhost:3000');
console.log('🔗 API will be available at: http://localhost:3001/api');
console.log('🏥 Health check: http://localhost:3001/api/health');
console.log('\nPress Ctrl+C to stop all servers\n'); 