import { spawn } from 'child_process';

const p = spawn('npm', ['run', 'dev'], { 
  shell: true,
  stdio: ['pipe', 'inherit', 'inherit'] 
});

const interval = setInterval(() => {
  try {
    p.stdin.write('\n');
  } catch (e) {
    clearInterval(interval);
  }
}, 500);

p.on('exit', (code) => {
  console.log('Process exited with code', code);
  process.exit(code);
});
