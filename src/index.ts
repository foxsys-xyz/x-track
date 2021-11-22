import { app, BrowserWindow, ipcMain } from 'electron';
import * as DiscordRPC from 'discord-rpc';
import { useState } from 'react';
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

async function setActivity() {
  if (!rpc || !mainWindow) {
    return 'Something is Bad! 😢';
  }

  let status = 'starting u...';

  ipcMain.on('appLogin', () => {
    return status = 'security check...';
  });

  ipcMain.on('appDashboard', () => {
    return status = 'briefing with dispatcher...';
  });

  rpc.setActivity({
    details: 'IndiGo Virtual',
    state: status,
    largeImageKey: 'foxsys-xyz_discord_',
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
