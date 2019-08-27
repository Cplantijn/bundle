const { app, BrowserWindow, ipcMain } = require('electron');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const cheerio = require('cheerio');
const rp = require('request-promise');
const sanitizeHtml = require('sanitize-html');

let win;

const execPromise = util.promisify(exec);

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

ipcMain.on('GET_OUTDATED', async (event, arg) => {
  await exec(`cd ${arg.projectPath}`);

  try {
    await exec('yarn outdated');
  } catch (e) {
    const { stdout } = e;
    const dependencies = stdout.replace(/(.|\n|\r)*URL/gm, '');

    const toUpgradeObject = dependencies.trim().split('\n').reduce((outDatedObj, currentDepLine) => {
      const [name, installedVersion, wantedVer, latestAvailable] = currentDepLine.trim().split(/\s/).filter(a => a.length);
      // eslint-disable-next-line no-param-reassign
      outDatedObj[`${name.trim()}`] = {
        installedVersion: installedVersion.trim(),
        wantedVer: wantedVer.trim(),
        latestAvailable: latestAvailable.trim()
      };

      return outDatedObj;
    }, {});

    event.reply('RETURN_OUTDATED', { upgrades: toUpgradeObject });
  }
});

ipcMain.on('GET_DEPENDENCY_README', async (event, arg) => {
  const htmlResponse = await rp.get(arg.dependencyPath);
  const $ = cheerio.load(htmlResponse);
  event.reply('RETURN_DEPENDENCY_README', { html: $('#readme').html() });
});
