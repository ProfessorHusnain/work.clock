import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods for storage and IPC
contextBridge.exposeInMainWorld("electron", {
  storage: {
    get: (key: string): Promise<string | null> => 
      ipcRenderer.invoke("storage:get", key),
    set: (key: string, value: string): Promise<void> => 
      ipcRenderer.invoke("storage:set", key, value),
    clear: (): Promise<void> => 
      ipcRenderer.invoke("storage:clear"),
  },
});

export {};

