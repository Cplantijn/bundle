const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, 'icons/icon_64.png'),
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (process.env.NODE_ENV === 'production') {
    win.loadFile(path.resolve(__dirname, './dist/index.html'));
  } else {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
    win.loadURL(`http://localhost:${process.env.DEV_SERVER_PORT}`);
  }

  win.on('closed', () => {
    win = null;
  });

  win.webContents.once('dom-ready', () => {
    win.webContents.openDevTools();
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
