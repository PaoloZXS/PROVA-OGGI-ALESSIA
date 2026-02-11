import fs from 'fs';
import { createCanvas } from 'canvas';

// Crea icona 192x192
const canvas192 = createCanvas(192, 192);
const ctx192 = canvas192.getContext('2d');
ctx192.fillStyle = '#333333';
ctx192.fillRect(0, 0, 192, 192);
ctx192.fillStyle = '#ffffff';
ctx192.font = 'bold 100px Arial';
ctx192.textAlign = 'center';
ctx192.textBaseline = 'middle';
ctx192.fillText('P', 96, 96);

const buffer192 = canvas192.toBuffer('image/png');
fs.writeFileSync('icon-192.png', buffer192);
console.log('✅ icon-192.png creato');

// Crea icona 512x512
const canvas512 = createCanvas(512, 512);
const ctx512 = canvas512.getContext('2d');
ctx512.fillStyle = '#333333';
ctx512.fillRect(0, 0, 512, 512);
ctx512.fillStyle = '#ffffff';
ctx512.font = 'bold 300px Arial';
ctx512.textAlign = 'center';
ctx512.textBaseline = 'middle';
ctx512.fillText('P', 256, 256);

const buffer512 = canvas512.toBuffer('image/png');
fs.writeFileSync('icon-512.png', buffer512);
console.log('✅ icon-512.png creato');
