import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Settings: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div style={{ padding: '2rem' }}>
            <h1>{t('nav.settings')}</h1>
            <p>Settings content placeholder.</p>
        </div>
    );
};

export default Settings;
