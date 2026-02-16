import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const ExploreDesigns: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div style={{ padding: '2rem' }}>
            <h1>{t('nav.explore')}</h1>
            <p>Explore designs content placeholder.</p>
        </div>
    );
};

export default ExploreDesigns;
