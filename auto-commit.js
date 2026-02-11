import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const WATCH_DIRS = ['.', 'api'];
const IGNORE_FILES = ['node_modules', '.git', '.gitignore', 'auto-commit.js'];
let commitTimeout;

function isIgnored(filePath) {
  return IGNORE_FILES.some(ignore => filePath.includes(ignore));
}

async function runCommand(cmd, args = []) {
  return new Promise((resolve, reject) => {
    const process = spawn(cmd, args, {
      shell: true,
      cwd: process.cwd()
    });
    
    let output = '';
    process.stdout.on('data', (data) => output += data);
    process.on('close', (code) => {
      if (code === 0) resolve(output);
      else reject(output);
    });
  });
}

async function autoCommitAndPush() {
  try {
    console.log('📝 Staginng e committando modifiche...');
    await runCommand('git', ['add', '.']);
    
    const status = await runCommand('git', ['status', '--porcelain']);
    if (status.trim().length === 0) {
      console.log('✅ Nessuna modifica da committare');
      return;
    }
    
    const timestamp = new Date().toLocaleString('it-IT');
    const message = `Auto-commit: ${timestamp}`;
    
    await runCommand('git', ['commit', '-m', message]);
    console.log('✅ Commit effettuato');
    
    console.log('🚀 Pushing...');
    await runCommand('git', ['push']);
    console.log('✅ Push effettuato!\n');
  } catch (error) {
    console.error('❌ Errore:', error.toString().slice(0, 100));
  }
}

function watchFiles() {
  WATCH_DIRS.forEach(dir => {
    fs.watch(dir, { recursive: true }, (eventType, filename) => {
      if (!filename || isIgnored(filename) || filename.startsWith('.')) return;
      
      console.log(`📦 Rilevate modifiche: ${filename}`);
      
      clearTimeout(commitTimeout);
      commitTimeout = setTimeout(autoCommitAndPush, 3000); // Attende 3 secondi
    });
  });
  
  console.log('👀 Monitor avviato - in ascolto di modifiche...\n');
}

watchFiles();

console.log('🔄 Auto-commit e push attivo!');
console.log('Premi Ctrl+C per fermare\n');
