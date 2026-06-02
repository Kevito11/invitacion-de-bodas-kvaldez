import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const HelpCenter: React.FC = () => {
    const { t } = useLanguage();
    const { colors } = useTheme();

    return (
        <div style={{ padding: '2rem', color: colors.text }}>
            <h1 style={{ color: colors.text }}>{t('nav.help')}</h1>
            <p style={{ color: colors.muted }}>Help Center content placeholder.</p>
        </div>
    );
};

export default HelpCenter;
