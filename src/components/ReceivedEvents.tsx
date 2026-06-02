import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const ReceivedEvents: React.FC = () => {
    const { t } = useLanguage();
    const { colors } = useTheme();

    return (
        <div style={{ padding: '2rem', color: colors.text }}>
            <h1 style={{ color: colors.text }}>{t('nav.received')}</h1>
            <p style={{ color: colors.muted }}>Received events content placeholder.</p>
        </div>
    );
};

export default ReceivedEvents;
