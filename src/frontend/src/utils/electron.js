export const getElectron = () => {
    if (window.require) {
        try {
            return window.require('electron');
        } catch (e) {
            console.warn('Could not require electron', e);
        }
    }
    return null;
};

export const ipcRenderer = getElectron()?.ipcRenderer || {
    on: () => { },
    removeListener: () => { },
    removeAllListeners: () => { },
    send: () => { },
    invoke: async () => ({ success: false, error: 'Electron not available' }),
};

export const shell = getElectron()?.shell || {
    openExternal: async () => { },
};
