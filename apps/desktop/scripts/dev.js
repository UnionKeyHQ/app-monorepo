/* eslint-disable no-plusplus */
const path = require('path');
const net = require('net');
const { execSync } = require('child_process');

const launchElectron = process.env.LAUNCH_ELECTRON === 'true';
const projectRoot = path.join(__dirname, '..');

const id = setInterval(checkPort, 1000);

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host: '127.0.0.1' });
    socket.setTimeout(500);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false);
    });
  });
}

async function checkPort() {
  const isOpen = await isPortOpen(3099);
  if (!isOpen) return;

  execSync('yarn run dev:main', {
    cwd: projectRoot,
    stdio: 'inherit',
  });
  clearInterval(id);
}
