const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  ).catch(err => console.log('Error loading URL:', err));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('schedule-notification', (event, { title, dateTime }) => {
  const currentTime = new Date().getTime();
  const notificationTime = new Date(dateTime).getTime();
  const delay = notificationTime - currentTime;

  if (delay > 0) {
    setTimeout(() => {
      new Notification({
        title: 'Meeting Reminder',
        body: title,
      }).show();
    }, delay);
  }
});