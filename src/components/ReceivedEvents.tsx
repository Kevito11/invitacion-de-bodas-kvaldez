import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const ReceivedEvents: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div style={{ padding: '2rem' }}>
            <h1>{t('nav.received')}</h1>
            <p>Received events content placeholder.</p>
        </div>
    );
};

export default ReceivedEvents;
