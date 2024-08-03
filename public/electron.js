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

  mainWindow.on('closed', () => (mainWindow = null));
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
      const notification = new Notification({
        title: 'Meeting Reminder',
        body: `You have a "${title}" meeting now!`,
        sound: path.join(__dirname, 'alert-sound.mp3'),
        silent: false,
      });
      notification.show();

      // Send a message to the renderer process
      if (mainWindow) {
        mainWindow.webContents.send('show-meeting-alert', { title });
      }
    }, delay);
  }
});

ipcMain.on('play-sound', () => {
  const { shell } = require('electron');
  shell.beep();
});