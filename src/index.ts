import { app, BrowserWindow } from 'electron';
import * as DiscordRPC from 'discord-rpc';
declare const MAIN_WINDOW_WEBPACK_ENTRY :string;

let mainWindow :any;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1530,
    height: 920,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const clientId = '828553327214198802';

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

async function setActivity() {
  if (!rpc || !mainWindow) {
    return 'Something is Bad! 😢';
  }

  rpc.setActivity({
    details: `IndiGo Virtual`,
    state: 'authenticating with the airline...',
    largeImageKey: 'foxsys-xyz-dark',
    largeImageText: 'v00.015-alpha',
    instance: false,
  });
}

rpc.on('ready', () => {
  setActivity();

  setInterval(() => {
    setActivity();
  }, 15e3);
});

rpc.login({ clientId }).catch(console.error);
