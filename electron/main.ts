import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as fs from "fs/promises";

const createWindow = async (): Promise<void> => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      // Enable features needed for drag and drop
      enableBlinkFeatures: 'CSSVariables',
      // Ensure proper event handling
      disableBlinkFeatures: '',
      // Enable hardware acceleration for smooth animations
      experimentalFeatures: true,
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

// Storage IPC handlers
const getStoragePath = () => {
  return path.join(app.getPath("userData"), "storage");
};

const ensureStorageDir = async () => {
  const storagePath = getStoragePath();
  try {
    await fs.mkdir(storagePath, { recursive: true });
  } catch (error) {
    console.error("Error creating storage directory:", error);
  }
};

ipcMain.handle("storage:get", async (event, key: string) => {
  try {
    await ensureStorageDir();
    const filePath = path.join(getStoragePath(), `${key}.json`);
    const data = await fs.readFile(filePath, "utf-8");
    return data;
  } catch (error) {
    // File doesn't exist or error reading
    return null;
  }
});

ipcMain.handle("storage:set", async (event, key: string, value: string) => {
  try {
    await ensureStorageDir();
    const filePath = path.join(getStoragePath(), `${key}.json`);
    await fs.writeFile(filePath, value, "utf-8");
  } catch (error) {
    console.error(`Error writing storage file (${key}):`, error);
    throw error;
  }
});

ipcMain.handle("storage:clear", async () => {
  try {
    const storagePath = getStoragePath();
    const files = await fs.readdir(storagePath);
    await Promise.all(
      files.map((file) => fs.unlink(path.join(storagePath, file)))
    );
  } catch (error) {
    console.error("Error clearing storage:", error);
    throw error;
  }
});

