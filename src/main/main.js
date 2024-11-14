const { app, BrowserWindow, session } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined;

let mainWindow;

function createWindow() {
  // Configure session before creating window
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    callback({ requestHeaders: { ...details.requestHeaders } });
  });

  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: isDev
    }
  });

  // Load the app
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:5173'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );

  // Open DevTools only if in dev mode and when explicitly requested
  if (isDev && process.env.OPEN_DEV_TOOLS === 'true') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

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