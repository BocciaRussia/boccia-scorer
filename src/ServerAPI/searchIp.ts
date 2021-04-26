import { ipcMain } from "electron";

setTimeout(() => {
    

ipcMain.emit('ip', {
    ip: '192.168.100.3'
})
}, 10000);

export const ip = ''