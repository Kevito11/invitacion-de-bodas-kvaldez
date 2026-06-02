import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const Directory: React.FC = () => {
    const { t } = useLanguage();
    const { colors } = useTheme();

    return (
        <div style={{ padding: '2rem', color: colors.text }}>
            <h1 style={{ color: colors.text }}>{t('nav.directory')}</h1>
            <p style={{ color: colors.muted }}>Directory content placeholder.</p>
        </div>
    );
};

export default Directory;
