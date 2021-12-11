import { app, BrowserWindow, ipcMain } from 'electron';
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
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.on('closeApp', () => {
    mainWindow.close();
  });

  ipcMain.on('minimizeApp', () => {
    mainWindow.minimize();
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
rpc.login({ clientId: clientId }).catch(console.error);

ipcMain.on('set-rpc-state', (_, state: string) => {
    rpc.setActivity({
        details: 'IndiGo Virtual',
        state,
        largeImageKey: 'foxsys-xyz_discord_',
        largeImageText: 'v00.015-alpha',
      });
});
