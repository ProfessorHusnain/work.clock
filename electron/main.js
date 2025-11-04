const { app, BrowserWindow } = require("electron");
const path = require("path");

// ✅ Correct import for electron-serve (must access .default)
const serve = require("electron-serve").default;

// ✅ When packaged, serve files from Next.js export folder
const appServe = app.isPackaged
  ? serve({ directory: path.join(__dirname, "../out") })
  : null;

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (app.isPackaged) {
    // ✅ Wait for electron-serve to be ready before loading
    await appServe(win);
    win.loadURL("app://./index.html");
  } else {
    // ✅ Development mode: use Next.js dev server
    await win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
    win.webContents.on("did-fail-load", () => {
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
