const { app, BrowserWindow, dialog, globalShortcut, ipcMain, webContents } = require("electron");
const { updateElectronApp } = require("update-electron-app");
const path = require("node:path");
const fs = require("node:fs/promises");
const logger = require("logmoji")();

const configPath = path.join(app.getPath("userData"), "config.json");

const readConfig = async () => {
  try {
    const data = await fs.readFile(configPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
};

const writeConfig = async (config) => {
  await fs.writeFile(configPath, JSON.stringify(config));
};

if (require("electron-squirrel-startup")) {
  app.quit();
}
updateElectronApp();

let mainWindow = null;
let registeredWebviewId = null;

ipcMain.handle("is-first-launch", async () => {
  const config = await readConfig();
  return !config.onboardingComplete;
});

ipcMain.handle("complete-onboarding", async () => {
  const config = await readConfig();
  config.onboardingComplete = true;
  await writeConfig(config);
});

ipcMain.handle("save-screenshot", async (event, dataUrl, opts = {}) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const fmt = (opts.format || "PNG").toUpperCase();
  const ext = fmt === "JPG" ? "jpg" : fmt.toLowerCase();
  const mime = fmt === "JPG" ? "jpeg" : fmt.toLowerCase();
  const base64 = dataUrl.replace(new RegExp(`^data:image/${mime};base64,`), "");
  const buffer = Buffer.from(base64, "base64");

  const fileName = `shotscreen-${new Date().toISOString().replace(/[:.]/g, "-")}.${ext}`;

  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    title: "Save screenshot",
    defaultPath: path.join(app.getPath("pictures"), fileName),
    filters: [{ name: `${fmt} Image`, extensions: [ext] }],
  });

  if (canceled || !filePath) return { canceled: true };

  await fs.writeFile(filePath, buffer);
  return { canceled: false, filePath };
});

ipcMain.on("register-webview", (_, id) => {
  registeredWebviewId = id;
});

ipcMain.handle("capture-webview", async (_, opts = {}) => {
  if (!registeredWebviewId) throw new Error("No webview registered");
  const wc = webContents.fromId(registeredWebviewId);
  if (!wc) throw new Error("WebContents not found");
  const image = await wc.capturePage();
  const fmt = (opts.format || "PNG").toUpperCase();
  if (fmt === "JPG") return image.toJPEG(92).toString("base64");
  if (fmt === "WEBP") return image.toWebP(92).toString("base64");
  return image.toPNG().toString("base64");
});

const preload = path.join(__dirname, "preload.js");

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: "hiddenInset",
    backgroundColor: "#1a1a1d",
    webPreferences: {
      preload,
      webviewTag: true,
    },
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    registeredWebviewId = null;
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
};

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register("CmdOrCtrl+Shift+S", () => {
    mainWindow?.webContents.send("trigger-capture");
  });

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

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
