import React from 'react';
export const OnboardingView = ({ onComplete }) => (
    <div style={{ padding: '20px' }}>
        <h1>Onboarding</h1>
        <p>Welcome to Cheating Daddy. Let's get you set up.</p>
        <button onClick={onComplete}>Get Started</button>
    </div>
);
