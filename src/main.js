const {
  app,
  BrowserWindow,
  dialog,
  globalShortcut,
  ipcMain,
  webContents,
} = require("electron");
const { updateElectronApp } = require("update-electron-app");
const path = require("node:path");
const fs = require("node:fs/promises");
const logger = require("logmoji")();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}
updateElectronApp();

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1220,
    height: 800,
    minWidth: 600,
    minHeight: 400,
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 12, y: 12 },
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webviewTag: true,
    },
  });

  ipcMain.on("go-to-website", (event, targetUrl) => {
    mainWindow.loadURL(targetUrl);
  });

  ipcMain.on("resize-window", (event, dimensions) => {
    mainWindow.setSize(dimensions.width, dimensions.height, true);
  });

  ipcMain.handle("capture-screenshot", async () => {
    const image = await mainWindow.webContents.capturePage();
    const fileName = `shotscreen-${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.png`;

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: "Save screenshot",
      defaultPath: path.join(app.getPath("pictures"), fileName),
      filters: [{ name: "PNG Image", extensions: ["png"] }],
    });

    if (canceled || !filePath) {
      return { canceled: true };
    }

    await fs.writeFile(filePath, image.toPNG());
    return { canceled: false, filePath };
  });

  ipcMain.handle("capture-screenshot-raw", async () => {
    const image = await mainWindow.webContents.capturePage();
    return image.toPNG().toString("base64");
  });

  ipcMain.handle("capture-webview-raw", async (_event, webContentsId) => {
    const wc = webContents.fromId(webContentsId);
    if (!wc) throw new Error("WebContents not found");
    const image = await wc.capturePage();
    return image.toPNG().toString("base64");
  });

  ipcMain.handle("save-screenshot", async (_event, dataUrl) => {
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64, "base64");

    const fileName = `shotscreen-${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.png`;

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: "Save screenshot",
      defaultPath: path.join(app.getPath("pictures"), fileName),
      filters: [{ name: "PNG Image", extensions: ["png"] }],
    });

    if (canceled || !filePath) {
      return { canceled: true };
    }

    await fs.writeFile(filePath, buffer);
    return { canceled: false, filePath };
  });

  // and load the index.html of the app.
  logger.info(`Dev server url: ${MAIN_WINDOW_VITE_DEV_SERVER_URL}`);
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();


  logger.success("App ready!");
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
