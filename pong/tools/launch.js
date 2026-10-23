/* Opens the game in Chrome (falling back to the default browser).
     node tools/launch.js
   Windows-first, since that is where this project lives, but it will do
   something sensible on macOS and Linux too. */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'index.html');
const url = 'file:///' + file.replace(/\\/g, '/');

const candidates = process.platform === 'win32' ? [
  path.join(process.env['ProgramFiles'] || '', 'Google/Chrome/Application/chrome.exe'),
  path.join(process.env['ProgramFiles(x86)'] || '', 'Google/Chrome/Application/chrome.exe'),
  path.join(process.env['LOCALAPPDATA'] || '', 'Google/Chrome/Application/chrome.exe')
] : process.platform === 'darwin'
  ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
  : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];

const chrome = candidates.find(p => p && fs.existsSync(p));

if (chrome) {
  spawn(chrome, [url], { detached: true, stdio: 'ignore' }).unref();
  console.log('launched in Chrome: ' + url);
} else if (process.platform === 'win32') {
  spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();
  console.log('Chrome not found - opened in the default browser');
} else {
  const opener = process.platform === 'darwin' ? 'open' : 'xdg-open';
  spawn(opener, [url], { detached: true, stdio: 'ignore' }).unref();
  console.log('Chrome not found - opened in the default browser');
}
