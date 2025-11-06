import { app, BrowserWindow } from "electron";
import * as path from "path";

const createWindow = async (): Promise<void> => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false, // Don't show until ready
  });

  // Show window when ready to avoid flickering
  win.once("ready-to-show", () => {
    win.show();
  });

  if (app.isPackaged) {
    // Production: Load from file system
    // __dirname is dist/electron, so we need to go up 2 levels to reach out/
    const indexPath = path.join(__dirname, "../../out/index.html");
    await win.loadFile(indexPath);
  } else {
    // Development mode: use Next.js dev server
    await win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
    win.webContents.on("did-fail-load", () => {
      win.webContents.reloadIgnoringCache();
    });
  }

  // Log any errors for debugging
  win.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.error("Failed to load:", errorCode, errorDescription);
  });
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

