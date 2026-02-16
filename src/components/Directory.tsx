import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Directory: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div style={{ padding: '2rem' }}>
            <h1>{t('nav.directory')}</h1>
            <p>Directory content placeholder.</p>
        </div>
    );
};

export default Directory;
