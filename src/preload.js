const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  isFirstLaunch: () => ipcRenderer.invoke("is-first-launch"),
  completeOnboarding: () => ipcRenderer.invoke("complete-onboarding"),

  saveScreenshot: (dataUrl, opts) => ipcRenderer.invoke("save-screenshot", dataUrl, opts),

  registerWebview: (id) => ipcRenderer.send("register-webview", id),
  captureWebview: (opts) => ipcRenderer.invoke("capture-webview", opts),

  onTriggerCapture: (cb) => {
    ipcRenderer.removeAllListeners("trigger-capture");
    ipcRenderer.on("trigger-capture", cb);
  },
});
