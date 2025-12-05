import React, { useEffect, useState } from 'react';
import { History, Settings, HelpCircle, X, ChevronLeft, Sliders } from 'lucide-react';
import './AppHeader.css';

export const AppHeader = ({
    currentView,
    statusText,
    startTime,
    onCustomizeClick,
    onHelpClick,
    onHistoryClick,
    onCloseClick,
    onBackClick,
    onHideToggleClick,
    isClickThrough,
    advancedMode,
    onAdvancedClick
}) => {
    const [elapsedTime, setElapsedTime] = useState('');
    const isMacOS = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    useEffect(() => {
        let interval;
        if (currentView === 'assistant' && startTime) {
            interval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                setElapsedTime(`${elapsed}s`);
            }, 1000);
        } else {
            setElapsedTime('');
        }
        return () => clearInterval(interval);
    }, [currentView, startTime]);

    const getViewTitle = () => {
        const titles = {
            onboarding: 'Welcome to Cheating Daddy',
            main: 'Cheating Daddy',
            customize: 'Customize',
            help: 'Help & Shortcuts',
            history: 'Conversation History',
            advanced: 'Advanced Tools',
            assistant: 'Cheating Daddy',
        };
        return titles[currentView] || 'Cheating Daddy';
    };

    const isNavigationView = () => {
        return ['customize', 'help', 'history', 'advanced'].includes(currentView);
    };

    return (
        <div className={`header ${isClickThrough ? 'click-through' : ''}`}>
            <div className="header-title">{getViewTitle()}</div>
            <div className="header-actions">
                {currentView === 'assistant' && (
                    <>
                        <span>{elapsedTime}</span>
                        <span>{statusText}</span>
                    </>
                )}
                {currentView === 'main' && (
                    <>
                        <button className="icon-button" onClick={onHistoryClick} title="History">
                            <History size={20} />
                        </button>
                        {advancedMode && (
                            <button className="icon-button" onClick={onAdvancedClick} title="Advanced Tools">
                                <Sliders size={20} />
                            </button>
                        )}
                        <button className="icon-button" onClick={onCustomizeClick} title="Customize">
                            <Settings size={20} />
                        </button>
                        <button className="icon-button" onClick={onHelpClick} title="Help">
                            <HelpCircle size={20} />
                        </button>
                    </>
                )}
                {currentView === 'assistant' ? (
                    <>
                        <button onClick={onHideToggleClick} className="button hide-button">
                            Hide&nbsp;&nbsp;
                            <span className="key" style={{ pointerEvents: 'none' }}>{isMacOS ? 'Cmd' : 'Ctrl'}</span>
                            &nbsp;&nbsp;<span className="key">\</span>
                        </button>
                        <button onClick={onCloseClick} className="icon-button window-close">
                            <X size={20} />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={isNavigationView() ? onBackClick : onCloseClick}
                        className="icon-button window-close"
                    >
                        {isNavigationView() ? <ChevronLeft size={20} /> : <X size={20} />}
                    </button>
                )}
            </div>
        </div>
    );
};
