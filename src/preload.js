const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  goWebsite: (url) => ipcRenderer.send("go-to-website", url),
  resizeWindow: ({ height, width }) =>
    ipcRenderer.send("resize-window", {
      height,
      width,
    }),
  isFirstLaunch: () => ipcRenderer.invoke("is-first-launch"),
  completeOnboarding: () => ipcRenderer.invoke("complete-onboarding"),
  captureWebviewRaw: (webContentsId) =>
    ipcRenderer.invoke("capture-webview-raw", webContentsId),
  saveScreenshot: (dataUrl) => ipcRenderer.invoke("save-screenshot", dataUrl),
});
