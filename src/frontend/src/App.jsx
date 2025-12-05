import React, { useState, useEffect } from 'react';
import { AppHeader } from './components/app/AppHeader';
import { MainView } from './components/views/MainView';
import { CustomizeView } from './components/views/CustomizeView';
import { HelpView } from './components/views/HelpView';
import { HistoryView } from './components/views/HistoryView';
import { AssistantView } from './components/views/AssistantView';
import { OnboardingView } from './components/views/OnboardingView';
import { AdvancedView } from './components/views/AdvancedView';
import { ProvidersView } from './components/views/ProvidersView';
import { ipcRenderer } from './utils/electron';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState(localStorage.getItem('onboardingCompleted') ? 'main' : 'onboarding');
  const [statusText, setStatusText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [isClickThrough, setIsClickThrough] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(localStorage.getItem('advancedMode') === 'true');
  const [layoutMode, setLayoutMode] = useState(localStorage.getItem('layoutMode') || 'normal');

  useEffect(() => {
    window.cheddar.currentView = currentView;
  }, [currentView]);

  useEffect(() => {
    window.cheddar.layoutMode = layoutMode;
  }, [layoutMode]);

  useEffect(() => {
    const handleShortcut = (e) => {
      const { shortcutKey } = e.detail;
      if (shortcutKey === 'ctrl+enter' || shortcutKey === 'cmd+enter') {
        if (currentView === 'main') {
          handleStart();
        } else {
          window.cheddar.captureManualScreenshot();
        }
      }
    };
    window.addEventListener('cheddar-shortcut', handleShortcut);
    return () => window.removeEventListener('cheddar-shortcut', handleShortcut);
  }, [currentView]);

  useEffect(() => {
    // Apply layout mode
    if (layoutMode === 'compact') {
      document.documentElement.classList.add('compact-layout');
    } else {
      document.documentElement.classList.remove('compact-layout');
    }

    // IPC Listeners
    const handleStatus = (event, status) => setStatusText(status);
    const handleClickThrough = (event, isEnabled) => setIsClickThrough(isEnabled);

    ipcRenderer.on('update-status', handleStatus);
    ipcRenderer.on('click-through-toggled', handleClickThrough);

    return () => {
      ipcRenderer.removeListener('update-status', handleStatus);
      ipcRenderer.removeListener('click-through-toggled', handleClickThrough);
    };
  }, [layoutMode]);

  useEffect(() => {
    // Notify main process of view change
    ipcRenderer.send('view-changed', currentView);
  }, [currentView]);

  const handleStart = async () => {
    const apiKey = localStorage.getItem('apiKey')?.trim();
    if (!apiKey) return;

    // Initialize Gemini
    await window.cheddar.initializeGemini(
      localStorage.getItem('selectedProfile') || 'interview',
      localStorage.getItem('selectedLanguage') || 'en-US'
    );

    // Start Capture
    const interval = localStorage.getItem('selectedScreenshotInterval') || '5';
    const quality = localStorage.getItem('selectedImageQuality') || 'medium';
    window.cheddar.startCapture(interval, quality);

    setStartTime(Date.now());
    setCurrentView('assistant');
  };

  const handleLayoutModeChange = (mode) => {
    setLayoutMode(mode);
    localStorage.setItem('layoutMode', mode);
    ipcRenderer.invoke('update-sizes');
  };

  const renderView = () => {
    switch (currentView) {
      case 'onboarding':
        return <OnboardingView onComplete={() => {
          localStorage.setItem('onboardingCompleted', 'true');
          setCurrentView('main');
        }} />;
      case 'main':
        return <MainView
          onStart={handleStart}
          onAPIKeyHelp={() => ipcRenderer.invoke('open-external', 'https://cheatingdaddy.com/help/api-key')}
          onLayoutModeChange={handleLayoutModeChange}
          onProvidersClick={() => setCurrentView('providers')}
        />;
      case 'customize':
        return <CustomizeView />;
      case 'providers':
        return <ProvidersView />;
      case 'help':
        return <HelpView />;
      case 'history':
        return <HistoryView />;
      case 'advanced':
        return <AdvancedView />;
      case 'assistant':
        return <AssistantView />;
      default:
        return <div>Unknown view: {currentView}</div>;
    }
  };

  const mainContentClass = `main-content ${currentView === 'assistant' ? 'assistant-view' : currentView === 'onboarding' ? 'onboarding-view' : 'with-border'
    }`;

  return (
    <div className="window-container">
      <div className="container">
        <AppHeader
          currentView={currentView}
          statusText={statusText}
          startTime={startTime}
          advancedMode={advancedMode}
          onCustomizeClick={() => setCurrentView('customize')}
          onHelpClick={() => setCurrentView('help')}
          onHistoryClick={() => setCurrentView('history')}
          onAdvancedClick={() => setCurrentView('advanced')}
          onCloseClick={() => {
            if (currentView === 'assistant') {
              window.cheddar.stopCapture();
              setCurrentView('main');
            } else {
              ipcRenderer.invoke('quit-application');
            }
          }}
          onBackClick={() => setCurrentView('main')}
          onHideToggleClick={() => ipcRenderer.invoke('toggle-window-visibility')}
          isClickThrough={isClickThrough}
        />
        <div className={mainContentClass}>
          <div className="view-container">
            {renderView()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
