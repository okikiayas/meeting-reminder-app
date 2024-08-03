export const isElectron = () => {
    return window && window.process && window.process.type;
  };
  
  export const getIpcRenderer = () => {
    if (isElectron()) {
      return window.require('electron').ipcRenderer;
    }
    return null;
  };