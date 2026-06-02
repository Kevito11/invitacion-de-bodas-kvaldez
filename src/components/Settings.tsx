import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const Settings: React.FC = () => {
    const { t } = useLanguage();
    const { colors } = useTheme();

    return (
        <div style={{ padding: '2rem', color: colors.text }}>
            <h1 style={{ color: colors.text }}>{t('nav.settings')}</h1>
            <p style={{ color: colors.muted }}>Settings content placeholder.</p>
        </div>
    );
};

export default Settings;
