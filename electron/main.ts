import { app, BrowserWindow, ipcMain, nativeImage } from "electron";
import * as path from "path";
import * as fs from "fs/promises";

/**
 * Get the application icon as NativeImage
 * Returns the correct icon based on environment and platform
 * Uses nativeImage for proper Windows icon handling
 */
const getAppIcon = (): Electron.NativeImage => {
  // Determine icon file based on platform
  let iconFile: string;
  
  if (process.platform === "win32") {
    iconFile = "icon.ico";
  } else if (process.platform === "darwin") {
    iconFile = "icon.icns";
  } else {
    // Linux and others
    iconFile = "world.clock.png";
  }

  let iconPath: string;
  
  if (app.isPackaged) {
    // Production: icon is in resources folder
    iconPath = path.join(process.resourcesPath, iconFile);
  } else {
    // Development: icon is in build folder
    // __dirname is dist/electron, so go up two levels to reach project root
    iconPath = path.join(__dirname, "..", "..", "build", iconFile);
  }
  
  // Log icon path for debugging
  console.log("Icon path:", iconPath);
  console.log("Icon exists:", require("fs").existsSync(iconPath));
  
  // Create NativeImage from path
  const icon = nativeImage.createFromPath(iconPath);
  
  if (icon.isEmpty()) {
    console.error("Failed to load icon from path:", iconPath);
  } else {
    console.log("Icon loaded successfully, size:", icon.getSize());
  }
  
  return icon;
};

const createWindow = async (): Promise<void> => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: getAppIcon(), // Set the application icon using nativeImage
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

app.whenReady().then(() => {
  // Set default app icon (Windows taskbar, etc.)
  if (process.platform === "win32") {
    app.setAppUserModelId("com.worldclock.app");
  }
  createWindow();
});

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

