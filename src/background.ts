'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
// import { } from "./ServerAPI/searchIp";
// import { ip } from "./ServerAPI/searchIp";

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])


app.commandLine.appendSwitch('disable-setuid-sandbox');

ipcMain.on('asynchronous-message', (event, type, params) => {
  console.log(event, type, params) // prints "ping"
  for (const window of windows) {
    window.webContents.send('asynchronous-message', type, params)
  }
})

// IPC handlers for config management
ipcMain.handle('get-documents-path', () => {
  return path.join(os.homedir(), 'Documents')
})

ipcMain.handle('read-config', async (event, configPath) => {
  try {
    return fs.readFileSync(configPath, 'utf8')
  } catch (error) {
    throw new Error(`Не удалось прочитать конфиг: ${error}`)
  }
})

ipcMain.handle('write-config', async (event, configPath, data) => {
  try {
    // Создаем директорию если не существует
    const dir = path.dirname(configPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(configPath, data, 'utf8')
  } catch (error) {
    throw new Error(`Не удалось сохранить конфиг: ${error}`)
  }
})

const windows: BrowserWindow[] = [];
async function createWindow(sideDisplay: boolean) {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      additionalArguments: [sideDisplay ? '1' : '0'],

      nodeIntegration: true
    }
  })
  windows.push(win)
  win.on('close', ()=>process.exit(0))
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL((process.env.WEBPACK_DEV_SERVER_URL as string) + ('?' + sideDisplay))
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html', {

    })
  }

}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow(false);
    createWindow(true)
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow(false)
  createWindow(true)
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
