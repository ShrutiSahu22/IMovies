import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════════');
console.log('\x1b[35m%s\x1b[0m', '   🍿 Starting IMovies Cinema Full-Stack Application...       ');
console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════════');
console.log('\x1b[32m%s\x1b[0m', ' • Backend API:  http://localhost:5001');
console.log('\x1b[34m%s\x1b[0m', ' • Frontend Web: http://localhost:5173');
console.log('\x1b[33m%s\x1b[0m', ' • Demo User:    user@imovies.dev  / User@1234');
console.log('\x1b[33m%s\x1b[0m', ' • Demo Admin:   admin@imovies.dev / Admin@1234');
console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════════\n');

const serverProc = spawn('npm', ['run', 'dev'], {
  cwd: path.join(rootDir, 'server'),
  stdio: 'inherit',
  shell: true,
});

const clientProc = spawn('npm', ['run', 'dev'], {
  cwd: path.join(rootDir, 'client'),
  stdio: 'inherit',
  shell: true,
});

const shutdown = () => {
  console.log('\n\x1b[31m%s\x1b[0m', 'Shutting down IMovies development servers...');
  serverProc.kill('SIGTERM');
  clientProc.kill('SIGTERM');
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
