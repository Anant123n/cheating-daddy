import React, { useState, useEffect } from 'react';
import { Command, CornerDownLeft, Globe } from 'lucide-react';
import './MainView.css';

export const MainView = ({ onStart, onAPIKeyHelp, onLayoutModeChange, onProvidersClick }) => {
    const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
    const [isInitializing, setIsInitializing] = useState(false);
    const [showApiKeyError, setShowApiKeyError] = useState(false);
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    useEffect(() => {
        const handleSessionInitializing = (event, initializing) => {
            setIsInitializing(initializing);
        };

        if (window.electron && window.electron.ipcRenderer) {
            window.electron.ipcRenderer.on('session-initializing', handleSessionInitializing);
        }

        const handleKeydown = (e) => {
            const isStartShortcut = isMac ? e.metaKey && e.key === 'Enter' : e.ctrlKey && e.key === 'Enter';
            if (isStartShortcut) {
                e.preventDefault();
                handleStartClick();
            }
        };

        document.addEventListener('keydown', handleKeydown);

        // Load layout mode
        const savedLayoutMode = localStorage.getItem('layoutMode');
        if (savedLayoutMode && savedLayoutMode !== 'normal') {
            onLayoutModeChange(savedLayoutMode);
        }

        // Resize layout (mocking the utility for now, or import it if we port it)
        // resizeLayout(); 

        return () => {
            if (window.electron && window.electron.ipcRenderer) {
                window.electron.ipcRenderer.removeListener('session-initializing', handleSessionInitializing);
            }
            document.removeEventListener('keydown', handleKeydown);
        };
    }, [isMac, onLayoutModeChange]);

    const handleInput = (e) => {
        const value = e.target.value;
        setApiKey(value);
        localStorage.setItem('apiKey', value);
        if (showApiKeyError) {
            setShowApiKeyError(false);
        }
    };

    const handleStartClick = () => {
        if (isInitializing) return;
        if (!apiKey.trim()) {
            triggerApiKeyError();
            return;
        }
        onStart();
    };

    const triggerApiKeyError = () => {
        setShowApiKeyError(true);
        setTimeout(() => setShowApiKeyError(false), 1000);
    };

    return (
        <div className="main-view">
            <div className="welcome">Welcome</div>

            <div className="input-group">
                <input
                    type="password"
                    placeholder="Enter your Gemini API Key"
                    value={apiKey}
                    onChange={handleInput}
                    className={showApiKeyError ? 'api-key-error' : ''}
                />
                <button
                    onClick={handleStartClick}
                    className={`start-button ${isInitializing ? 'initializing' : ''}`}
                >
                    Start Session
                    <span className="shortcut-icons">
                        {isMac ? (
                            <>
                                <Command size={14} />
                                <CornerDownLeft size={14} />
                            </>
                        ) : (
                            <>
                                Ctrl
                                <CornerDownLeft size={14} />
                            </>
                        )}
                    </span>
                </button>
            </div>
            <p className="description">
                dont have an api key?
                <span onClick={onAPIKeyHelp} className="link">get one here</span>
            </p>

            <button onClick={onProvidersClick} className="providers-link">
                <Globe size={14} /> Supported Providers
            </button>
        </div>
    );
};
