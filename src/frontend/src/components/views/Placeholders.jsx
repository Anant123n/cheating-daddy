import React from 'react';

export const CustomizeView = () => <div>Customize View</div>;
export const HelpView = () => <div>Help View</div>;
export const HistoryView = () => <div>History View</div>;
export const AssistantView = () => <div>Assistant View</div>;
export const OnboardingView = ({ onComplete }) => (
    <div>
        <h1>Onboarding</h1>
        <button onClick={onComplete}>Complete</button>
    </div>
);
export const AdvancedView = () => <div>Advanced View</div>;
