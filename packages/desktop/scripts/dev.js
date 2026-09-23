/* eslint-disable no-plusplus */
const path = require('path');
const net = require('net');
const { execSync } = require('child_process');

const launchElectron = process.env.LAUNCH_ELECTRON === 'true';
const projectRoot = path.join(__dirname, '..');
const desktopDevPort = process.env.DESKTOP_DEV_PORT || '3011';

const id = setInterval(checkPort, 1000);

function checkPort() {
  const socket = net.connect({ host: '127.0.0.1', port: desktopDevPort });
  socket.once('error', () => socket.destroy());
  socket.once('connect', () => {
    socket.end();
    clearInterval(id);
    execSync('yarn run dev:main', {
      cwd: projectRoot,
      stdio: 'inherit',
    });
  });
}
