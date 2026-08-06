const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("Checking browser automation packages...");
try {
  const puppeteer = require('puppeteer');
  console.log("Puppeteer is installed!");
} catch (e) {
  console.log("Puppeteer not installed, installing puppeteer...");
  execSync('npm install --no-save puppeteer', { stdio: 'inherit' });
}
