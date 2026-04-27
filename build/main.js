"use strict";
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const logger = require("logmoji")();
if (require("electron-squirrel-startup")) {
  app.quit();
}
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: "customButtonsOnHover",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  ipcMain.on("go-to-website", (event, targetUrl) => {
    mainWindow.loadURL(targetUrl);
  });
  logger.info(`Dev server url: ${"http://localhost:5173"}`);
  {
    mainWindow.loadURL("http://localhost:5173");
  }
  mainWindow.webContents.openDevTools();
};
app.whenReady().then(() => {
  createWindow();
  logger.success("App ready!");
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
