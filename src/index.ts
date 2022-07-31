import { app, BrowserWindow, ipcMain } from 'electron';
import keytar from 'keytar';
import * as DiscordRPC from 'discord-rpc';
import { FsuipcApi } from '@foxsys-xyz/fsuipc-api';

declare const MAIN_WINDOW_WEBPACK_ENTRY :string;

let mainWindow :any;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1530,
    height: 920,
    frame: false,
    icon: __dirname + '/foxsys_xyz.ico',
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
  try {
    rpc.setActivity({
        details: 'KLM Virtual',
        state,
        largeImageKey: 'foxsys-xyz_discord_',
        largeImageText: `v${process.env.npm_package_version}`,
      });
  } catch (error) {
    console.log('discord rpc failed to initialize...')
  }
});

ipcMain.handle('get-token', async (event) => {
  const result = await keytar.getPassword('x-track', 'token');
  return result;
})

ipcMain.on('set-token', (event, token) => {
  event.returnValue = keytar.setPassword('x-track', 'token', token);
  console.log('token set!');
});

ipcMain.on('delete-token', (event) => {
  keytar.deletePassword('x-track', 'token');
  console.log('token deleted!');
});

const fsuipc = new FsuipcApi();

ipcMain.handle('init-acars-tracking', async (event) => {
  console.log('starting connection process...');

  await fsuipc.init().then(() => {
    console.log('link established to fsuipc...');

    fsuipc.listen(1000, [
      'latitude',
      'longitude',
      'gs',
      'lights',
    ]).subscribe((result) => {
      event.sender.send('acars-data', JSON.stringify(result));
    });
  }).catch((error) => {
    console.log('fsuipc recording stopped...');
    event.sender.send('acars-error', error);
  });
});
