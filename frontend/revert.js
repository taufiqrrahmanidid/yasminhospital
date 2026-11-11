import { execSync } from 'child_process';
try {
  const status = execSync('git status', { encoding: 'utf8' });
  console.log('Git Status:\n', status);
} catch (e) {
  console.error('Error running git:', e.message);
}
