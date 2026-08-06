/* eslint-disable no-plusplus */
const path = require('path');
const { exec, execSync, spawnSync } = require('child_process');
const net = require('net');

const launchElectron = process.env.LAUNCH_ELECTRON === 'true';
const projectRoot = path.join(__dirname, '..');
const devServerPort = Number(process.env.WEB_PORT || 3002);

const id = setInterval(checkPort, 1000);

function checkPort() {
  const socket = net.connect(devServerPort, '127.0.0.1');
  socket.setTimeout(1000);
  socket
    .on('connect', () => {
      socket.destroy();
      clearInterval(id);
      execSync('yarn run dev:main', {
        cwd: projectRoot,
        stdio: 'inherit',
      });
    })
    .on('timeout', () => {
      socket.destroy();
    })
    .on('error', () => {});
}
