// scripts/verify-assets.js
// Run with: node scripts/verify-assets.js

const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');
const requiredAssets = [
  'icon.png',
  'splash.png',
  'hero.png',
  'og-image.png',
  'screenshot-1.png',
  'screenshot-2.png',
  'screenshot-3.png',
];

console.log('🔍 Checking for required assets...\n');

let allPresent = true;

requiredAssets.forEach(asset => {
  const assetPath = path.join(publicDir, asset);
  const exists = fs.existsSync(assetPath);
  
  if (exists) {
    const stats = fs.statSync(assetPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`✅ ${asset} - ${sizeKB} KB`);
  } else {
    console.log(`❌ ${asset} - MISSING`);
    allPresent = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPresent) {
  console.log('✅ All required assets are present!');
  process.exit(0);
} else {
  console.log('❌ Some assets are missing. Please add them to /public directory.');
  console.log('\nSee ASSETS_REQUIRED.md for requirements.');
  process.exit(1);
}


