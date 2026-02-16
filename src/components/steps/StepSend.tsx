import React, { useState } from 'react';
import type { InvitationData } from '../../types';
import { CheckCircle, ExternalLink, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface StepProps {
    data: InvitationData;
    onChange: (field: keyof InvitationData, value: any) => void;
}

const StepSend: React.FC<StepProps> = ({ data }) => {
    const { t } = useLanguage();
    const [publicUrl, setPublicUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateLink = async () => {
        setIsGenerating(true);
        try {
            const { saveInvitationToDb } = await import('../../services/database');
            const id = await saveInvitationToDb(data);
            if (id) {
                const url = `${window.location.origin}/invitacion?id=${id}`;
                setPublicUrl(url);
            }
        } catch (e) {
            console.error(e);
            alert("Error al generar el enlace.");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (publicUrl) {
            navigator.clipboard.writeText(publicUrl);
            alert("Enlace copiado!");
        }
    };

    const statCardStyle = {
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid',
        textAlign: 'center' as const
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem', color: '#111827' }}>{t('send.title')}</h2>

            <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #eee', textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{ width: '70px', height: '70px', backgroundColor: '#ECFDF5', color: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <CheckCircle size={36} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: '#111827' }}>{t('send.ready.title')}</h3>
                <p style={{ color: '#6B7280', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                    {t('send.ready.desc')}
                </p>

                {!publicUrl ? (
                    <button
                        onClick={generateLink}
                        disabled={isGenerating}
                        style={{
                            backgroundColor: '#111827', color: 'white', padding: '0.8rem 2rem', borderRadius: '50px',
                            fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                            opacity: isGenerating ? 0.7 : 1, transition: 'transform 0.2s'
                        }}
                    >
                        {isGenerating ? t('send.btn.generating') : t('send.btn.generate')}
                    </button>
                ) : (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F9FAFB', padding: '0.8rem', borderRadius: '8px', border: '1px solid #eee', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                            <input
                                type="text"
                                readOnly
                                value={publicUrl}
                                style={{ flex: 1, background: 'transparent', border: 'none', color: '#4B5563', fontSize: '0.9rem', outline: 'none' }}
                            />
                            <button onClick={copyToClipboard} style={{ color: '#2563EB', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}>
                                {t('send.btn.copy')}
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
                            <a
                                href={publicUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '50px', color: '#374151', fontWeight: 500, textDecoration: 'none' }}
                            >
                                <ExternalLink size={18} /> {t('send.btn.open')}
                            </a>
                            <button
                                onClick={() => {
                                    const text = `¡Nos casamos! ${data.partner1} & ${data.partner2} te invitan a su boda. Ver invitación: ${publicUrl}`;
                                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                                }}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                            >
                                <MessageCircle size={18} /> {t('send.btn.share_whatsapp')}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div style={{ ...statCardStyle, backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2563EB', marginBottom: '0.2rem' }}>
                        {data.guests?.length || 0}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#1E40AF', fontWeight: 500 }}>{t('send.stat.total')}</div>
                </div>
                <div style={{ ...statCardStyle, backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#059669', marginBottom: '0.2rem' }}>
                        {data.guests?.filter(g => g.status === 'confirmed').length || 0}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#065F46', fontWeight: 500 }}>{t('send.stat.confirmed')}</div>
                </div>
                <div style={{ ...statCardStyle, backgroundColor: '#FEFCE8', borderColor: '#FEF08A' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#CA8A04', marginBottom: '0.2rem' }}>
                        {data.guests?.filter(g => g.status === 'pending').length || 0}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#854D0E', fontWeight: 500 }}>{t('send.stat.pending')}</div>
                </div>
            </div>
        </div>
    );
};

export default StepSend;
