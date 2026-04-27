"use strict";
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  goWebsite: (url) => ipcRenderer.send("go-to-website", url),
});
