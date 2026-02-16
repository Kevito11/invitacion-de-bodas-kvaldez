import React from 'react';
import type { InvitationData } from '../../types';
import InvitationPreview from '../InvitationPreview';
import MobileMockup from '../UI/MobileMockup';
import { Clock, Monitor, Smartphone } from 'lucide-react';
// import { DRESS_CODES } from '../../data/dressCodes'; // Unused now
import { useLanguage } from '../../context/LanguageContext';

interface StepProps {
    data: InvitationData;
    onChange: (field: keyof InvitationData, value: any) => void;
}

const AnalogClockPicker: React.FC<{ value: string; onChange: (val: string) => void }> = ({ value, onChange }) => {
    const [mode, setMode] = React.useState<'hours' | 'minutes'>('hours');
    const [isOpen, setIsOpen] = React.useState(false);

    // Parse time
    const [hours24, minutes] = (value || '12:00').split(':').map(Number);
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12;

    const handleHourClick = (h: number) => {
        let newH24 = h;
        if (period === 'PM' && h !== 12) newH24 += 12;
        if (period === 'AM' && h === 12) newH24 = 0;
        onChange(`${newH24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
        setMode('minutes');
    };

    const handleMinuteClick = (m: number) => {
        onChange(`${hours24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        setIsOpen(false); // Close after picking minutes
        setMode('hours'); // Reset for next time
    };

    const togglePeriod = () => {
        let newH24 = hours24;
        if (period === 'AM') newH24 += 12;
        else newH24 -= 12;
        onChange(`${newH24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    };

    const numbers = mode === 'hours' ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    return (
        <div style={{ position: 'relative' }}>
            {/* Display Input */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px',
                    fontSize: '0.95rem', backgroundColor: '#FAFAF9', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}
            >
                <span>{hours12}:{minutes.toString().padStart(2, '0')} {period}</span>
                <Clock size={16} color="#666" />
            </div>

            {/* Picker Popup */}
            {isOpen && (
                <div style={{
                    position: 'absolute', top: '110%', left: 0, zIndex: 50,
                    backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '1rem', width: '250px'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        <button
                            onClick={() => setMode('hours')}
                            style={{
                                background: mode === 'hours' ? '#E6BEAE' : 'transparent', color: mode === 'hours' ? 'white' : '#333',
                                border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', fontWeight: 'bold', cursor: 'pointer'
                            }}
                        >
                            {hours12}
                        </button>
                        <span style={{ fontWeight: 'bold' }}>:</span>
                        <button
                            onClick={() => setMode('minutes')}
                            style={{
                                background: mode === 'minutes' ? '#E6BEAE' : 'transparent', color: mode === 'minutes' ? 'white' : '#333',
                                border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', fontWeight: 'bold', cursor: 'pointer'
                            }}
                        >
                            {minutes.toString().padStart(2, '0')}
                        </button>
                        <button
                            onClick={togglePeriod}
                            style={{
                                marginLeft: '0.5rem', background: '#F3F4F6', color: '#333',
                                border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600
                            }}
                        >
                            {period}
                        </button>
                    </div>

                    {/* Clock Face */}
                    <div style={{
                        width: '200px', height: '200px', backgroundColor: '#F9FAFB', borderRadius: '50%',
                        margin: '0 auto', position: 'relative', border: '1px solid #E5E7EB'
                    }}>
                        {/* Center Dot */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '4px', height: '4px', background: '#333', borderRadius: '50%', transform: 'translate(-50%, -50%)' }}></div>

                        {numbers.map((num, i) => {
                            const angle = (i * 30) - 90;
                            const radius = 80;
                            const x = radius * Math.cos(angle * Math.PI / 180);
                            const y = radius * Math.sin(angle * Math.PI / 180);

                            const isSelected = mode === 'hours' ? num === hours12 : num === minutes;

                            return (
                                <button
                                    key={num}
                                    onClick={() => mode === 'hours' ? handleHourClick(num) : handleMinuteClick(num)}
                                    style={{
                                        position: 'absolute',
                                        top: '50%', left: '50%',
                                        width: '32px', height: '32px',
                                        borderRadius: '50%',
                                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                                        border: 'none',
                                        backgroundColor: isSelected ? '#E6BEAE' : 'transparent',
                                        color: isSelected ? 'white' : '#4B5563',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {num === 0 && mode === 'hours' ? 12 : num.toString().padStart(2, '0') === '00' && mode === 'minutes' ? '00' : num}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const StepDetails: React.FC<StepProps> = ({ data, onChange }) => {
    const { t } = useLanguage();
    const [viewMode, setViewMode] = React.useState<'mobile' | 'desktop'>('mobile');

    const dressCodesTranslated = React.useMemo(() => [
        { id: 'Formal', label: t('dresscode.formal.label'), description: t('dresscode.formal.desc') },
        { id: 'SemiFormal', label: t('dresscode.semiformal.label'), description: t('dresscode.semiformal.desc') },
        { id: 'CocktailCasual', label: t('dresscode.cocktail.label'), description: t('dresscode.cocktail.desc') },
        { id: 'Rigurosa', label: t('dresscode.rigurosa.label'), description: t('dresscode.rigurosa.desc') },
        { id: 'Playa', label: t('dresscode.playa.label'), description: t('dresscode.playa.desc') }
    ], [t]);

    const inputStyle = {
        width: '100%',
        padding: '0.8rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        backgroundColor: '#FAFAF9'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.9rem',
        fontWeight: 600,
        marginBottom: '0.5rem',
        color: '#333'
    };

    const groupStyle = {
        marginBottom: '1.5rem'
    };

    return (
        <div style={{ display: 'flex', height: '100%', animation: 'fadeIn 0.5s ease-in' }}>

            {/* Left Column: Form (Scrollable) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem', backgroundColor: 'white', borderRight: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: '#111827' }}>{t('details.title')}</h2>

                    {/* View Mode Toggle */}
                    <div style={{ display: 'flex', backgroundColor: '#F3F4F6', borderRadius: '8px', padding: '3px' }}>
                        <button
                            onClick={() => setViewMode('desktop')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '5px',
                                border: 'none',
                                backgroundColor: viewMode === 'desktop' ? 'white' : 'transparent',
                                color: viewMode === 'desktop' ? '#10B981' : '#6B7280',
                                borderRadius: '6px',
                                padding: '0.4rem 0.8rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: viewMode === 'desktop' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            <Monitor size={14} /> {t('design.view.desktop')}
                        </button>
                        <button
                            onClick={() => setViewMode('mobile')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '5px',
                                border: 'none',
                                backgroundColor: viewMode === 'mobile' ? 'white' : 'transparent',
                                color: viewMode === 'mobile' ? '#10B981' : '#6B7280',
                                borderRadius: '6px',
                                padding: '0.4rem 0.8rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: viewMode === 'mobile' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            <Smartphone size={14} /> {t('design.view.mobile')}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                        <label style={labelStyle}>{t('details.label.p1')}</label>
                        <input
                            type="text"
                            value={data.partner1}
                            onChange={(e) => onChange('partner1', e.target.value)}
                            style={inputStyle}
                            placeholder={t('details.placeholder.name')}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>{t('details.label.p2')}</label>
                        <input
                            type="text"
                            value={data.partner2}
                            onChange={(e) => onChange('partner2', e.target.value)}
                            style={inputStyle}
                            placeholder={t('details.placeholder.name')}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                        <label style={labelStyle}>{t('details.label.date')}</label>
                        <input
                            type="date"
                            value={data.date}
                            onChange={(e) => onChange('date', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>{t('details.label.time')}</label>
                        <AnalogClockPicker
                            value={data.time}
                            onChange={(val) => onChange('time', val)}
                        />
                    </div>
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>{t('details.label.venue')}</label>
                    <input
                        type="text"
                        value={data.venueName}
                        onChange={(e) => onChange('venueName', e.target.value)}
                        style={{ ...inputStyle, marginBottom: '0.8rem' }}
                        placeholder={t('details.placeholder.venue_name')}
                    />
                    <input
                        type="text"
                        value={data.venueAddress}
                        onChange={(e) => onChange('venueAddress', e.target.value)}
                        style={inputStyle}
                        placeholder={t('details.placeholder.venue_address')}
                    />
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>{t('details.label.message')}</label>
                    <textarea
                        value={data.message}
                        onChange={(e) => onChange('message', e.target.value)}
                        rows={4}
                        style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                        placeholder={t('details.placeholder.message')}
                    />
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>{t('details.label.dresscode')}</label>
                    <select
                        value={data.dressCode}
                        onChange={(e) => {
                            const selectedCode = dressCodesTranslated.find(dc => dc.id === e.target.value);
                            onChange('dressCode', e.target.value);
                            // Optional: Auto-fill details if empty
                            if (selectedCode && !data.dressCodeDetails) {
                                onChange('dressCodeDetails', selectedCode.description);
                            }
                        }}
                        style={{ ...inputStyle, marginBottom: '0.8rem' }}
                    >
                        <option value="">{t('details.option.select')}</option>
                        {dressCodesTranslated.map(dc => (
                            <option key={dc.id} value={dc.id}>{dc.label}</option>
                        ))}
                    </select>
                    <textarea
                        value={data.dressCodeDetails}
                        onChange={(e) => onChange('dressCodeDetails', e.target.value)}
                        rows={2}
                        style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                        placeholder={t('details.placeholder.dresscode_details')}
                    />
                </div>
            </div>

            {/* Right Column: Preview (Fixed) */}
            <div style={{ flex: 1, backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: viewMode === 'mobile' ? '1rem' : '1rem' }}>
                {viewMode === 'mobile' ? (
                    <MobileMockup scale={0.85}>
                        <InvitationPreview data={data} isMobilePreview={true} />
                    </MobileMockup>
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'white',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        display: 'flex'
                    }}>
                        <InvitationPreview data={data} />
                    </div>
                )}
            </div>

        </div>
    );
};

export default StepDetails;
