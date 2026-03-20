const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  goWebsite: (url) => ipcRenderer.send("go-to-website", url),
  resizeWindow: ({ height, width }) =>
    ipcRenderer.send("resize-window", {
      height,
      width,
    }),
  captureScreenshot: () => ipcRenderer.invoke("capture-screenshot"),
  onToggleOverlay: (callback) => {
    const listener = () => callback();
    ipcRenderer.on("toggle-overlay", listener);

    return () => {
      ipcRenderer.removeListener("toggle-overlay", listener);
    };
  },
});
