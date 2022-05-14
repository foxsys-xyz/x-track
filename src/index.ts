import { app, BrowserWindow, ipcMain } from 'electron';
import keytar from 'keytar';
import * as DiscordRPC from 'discord-rpc';
import fsuipc = require('fsuipc');
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
    rpc.setActivity({
        details: 'IndiGo Virtual',
        state,
        largeImageKey: 'foxsys-xyz_discord_',
        largeImageText: 'v00.015-alpha',
      });
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

const obj = new fsuipc.FSUIPC();

ipcMain.handle('start-recording', async (event) => {
  console.log('Starting recording...');
  await obj.open()
    .then(() => {
      console.log('Link is open');

      obj.add('clockHour', 0x238, fsuipc.Type.Byte);
      obj.add('aircraftType', 0x3D00, fsuipc.Type.String, 256);
      obj.add('latitude', 0x560, fsuipc.Type.Int64);
      obj.add('longitude', 0x568, fsuipc.Type.Int64);
      obj.process()
        .then(value => {
          event.sender.send('mainprocess-response', value);
        })
        .catch(err => {
          event.sender.send('mainprocess-response', err);
          return obj.close();
        });

      console.log('Recording has started');
    })
    .catch(err => {
      console.error(err);

      console.log('Recording has stopped');
      event.sender.send('mainprocess-response', err);

      return obj.close();
    });
});

ipcMain.on('stop-recording', (event) => {
  console.log('Stopping recording...');
  obj.close().catch(err => console.error(err));
});
