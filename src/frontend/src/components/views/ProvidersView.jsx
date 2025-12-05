import React from 'react';
import { ipcRenderer } from '../../utils/electron';
import { ExternalLink, Cpu, Zap, MessageSquare, BrainCircuit } from 'lucide-react';
import './ProvidersView.css';

export const ProvidersView = () => {
    const providers = [
        {
            id: 'gemini',
            name: 'Google Gemini',
            description: 'Multimodal AI models from Google. Known for strong reasoning and large context windows.',
            url: 'https://ai.google.dev/',
            icon: <BrainCircuit size={32} color="#4285F4" />,
            features: ['Multimodal', 'Large Context', 'Fast Inference']
        },
        {
            id: 'openai',
            name: 'OpenAI',
            description: 'Creators of GPT-4 and ChatGPT. Industry standard for reasoning and creative writing.',
            url: 'https://platform.openai.com/',
            icon: <Zap size={32} color="#10A37F" />,
            features: ['GPT-4', 'Function Calling', 'Reliable']
        },
        {
            id: 'anthropic',
            name: 'Anthropic Claude',
            description: 'AI assistant focused on safety and reliability. Excellent at coding and long-form content.',
            url: 'https://www.anthropic.com/api',
            icon: <MessageSquare size={32} color="#D97757" />,
            features: ['Claude 3.5 Sonnet', 'Safe', 'Human-like']
        },
        {
            id: 'xai',
            name: 'xAI Grok',
            description: 'AI with a rebellious streak, integrated with real-time knowledge from X.',
            url: 'https://x.ai/api',
            icon: <Cpu size={32} color="#FFFFFF" />,
            features: ['Real-time Info', 'Uncensored', 'Fast']
        }
    ];

    const handleOpenLink = (url) => {
        ipcRenderer.invoke('open-external', url);
    };

    return (
        <div className="providers-view">
            <div className="providers-header">
                <h2>AI Providers</h2>
                <p>Explore the powerful AI models supported by our platform.</p>
            </div>

            <div className="providers-grid">
                {providers.map(provider => (
                    <div key={provider.id} className="provider-card">
                        <div className="card-header">
                            <div className="provider-icon">
                                {provider.icon}
                            </div>
                            <h3>{provider.name}</h3>
                        </div>

                        <p className="provider-description">{provider.description}</p>

                        <div className="provider-features">
                            {provider.features.map((feature, index) => (
                                <span key={index} className="feature-tag">{feature}</span>
                            ))}
                        </div>

                        <button
                            className="visit-button"
                            onClick={() => handleOpenLink(provider.url)}
                        >
                            Visit Website <ExternalLink size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
