import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, CreditCard, Mail, Tag, List, Globe, Edit2, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useEvents } from '../context/EventsContext';
import EventsTable from './EventsTable';

const AccountSettings: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { colors, theme } = useTheme();
    const { clearAllEvents } = useEvents();
    const [activeTab, setActiveTab] = useState('general');

    // Mock Notification State
    const [notifications, setNotifications] = useState({
        dailySummary: true,
        promotions: true,
        recommendations: true,
        cardOpened: false,
        newResponse: true,
        undeliverable: true,
        messageReceived: true,
        paymentReceived: true,
        resendOnBehalf: true,
        eventReminder: true
    });

    const toggleNotify = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div style={{ padding: '2rem 3rem', fontFamily: "'Montserrat', sans-serif", maxWidth: '1400px', margin: '0 auto', color: colors.text }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: colors.text, margin: 0 }}>
                    Mi cuenta
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: colors.muted, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Check size={14} /> Se guardaron todos los cambios
                    </span>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            backgroundColor: theme === 'dark' ? '#059669' : '#57B07B', color: 'white',
                            border: 'none', padding: '0.8rem 1.5rem',
                            fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px',
                            cursor: 'pointer', borderRadius: '4px', textTransform: 'uppercase'
                        }}
                    >
                        Volver a 'Boda de {user?.username}'
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex', borderBottom: `1px solid ${colors.border}`, marginBottom: '2rem',
                justifyContent: 'space-between', padding: '0 1rem'
            }}>
                <TabButton active={activeTab === 'general'} icon={<Settings size={16} />} label="General" onClick={() => setActiveTab('general')} colors={colors} theme={theme} />
                <TabButton active={activeTab === 'billing'} icon={<CreditCard size={16} />} label="Facturación" onClick={() => setActiveTab('billing')} colors={colors} theme={theme} />
                <TabButton active={activeTab === 'events'} icon={<Mail size={16} />} label="Eventos" onClick={() => setActiveTab('events')} colors={colors} theme={theme} />
                <TabButton active={activeTab === 'tags'} icon={<Tag size={16} />} label="Etiquetas" onClick={() => setActiveTab('tags')} colors={colors} theme={theme} />
                <TabButton active={activeTab === 'fields'} icon={<List size={16} />} label="Campos personalizados" onClick={() => setActiveTab('fields')} colors={colors} theme={theme} />
                <TabButton active={activeTab === 'langs'} icon={<Globe size={16} />} label="Idiomas" onClick={() => setActiveTab('langs')} colors={colors} theme={theme} />
            </div>

            {/* Content Area */}
            {activeTab === 'general' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* ... (Existing General Tab Content) ... */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '4px', padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', position: 'relative' }}>
                                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: colors.text, margin: 0 }}>
                                    Información de la cuenta
                                </h3>
                                <button style={{ position: 'absolute', right: 0, top: 0, background: 'none', border: `1px solid ${colors.border}`, borderRadius: '4px', padding: '4px', cursor: 'pointer' }}>
                                    <Edit2 size={16} color={theme === 'dark' ? '#34D399' : '#57B07B'} />
                                </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', fontSize: '0.9rem', marginBottom: '2rem' }}>
                                <span style={{ fontWeight: 600, color: colors.text }}>Nombre</span>
                                <span style={{ color: colors.muted }}>{user?.username} Rodríguez</span>
                                <span style={{ fontWeight: 600, color: colors.text }}>Correo electrónico</span>
                                <span style={{ color: colors.muted }}>{user?.username ? `${user.username.toLowerCase()}@hotmail.com` : 'email@example.com'}</span>
                                <span style={{ fontWeight: 600, color: colors.text }}>Zona horaria</span>
                                <span style={{ color: colors.muted }}>(UTC-04:00) Santiago</span>
                                <span style={{ fontWeight: 600, color: colors.text }}>Empresa</span>
                                <span style={{ color: colors.muted }}>-</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center' }}>
                                <button style={{ backgroundColor: theme === 'dark' ? '#059669' : '#57B07B', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.5px' }}>CAMBIAR CONTRASEÑA</button>
                                <button style={{ backgroundColor: colors.muted, color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.5px' }}>GESTIONAR CLAVES DE ACCESO</button>
                            </div>
                        </div>
                        <div style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '4px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: `1px solid ${theme === 'dark' ? colors.border : '#F3F4F6'}`, paddingBottom: '1rem' }}>
                                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: theme === 'dark' ? '#E6BEAE' : '#E6BEAE', margin: 0 }}>Emails de notificación principal</h3>
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
                                <div style={{ fontSize: '0.9rem', color: colors.text }}>{user?.username ? `${user.username.toLowerCase()}@hotmail.com` : 'email@example.com'}</div>
                                <button style={{ background: 'none', border: 'none', color: theme === 'dark' ? '#34D399' : '#57B07B', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontStyle: 'italic', cursor: 'pointer' }}><Plus size={16} /> Añadir correo electrónico</button>
                            </div>
                        </div>
                    </div>
                    <div style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '4px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: colors.text, margin: 0, textAlign: 'center', width: '100%' }}>Notificaciones</h3>
                            <button style={{ position: 'absolute', right: '4rem', background: 'none', border: 'none', color: theme === 'dark' ? '#34D399' : '#57B07B', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Restablecer notificaciones predeterminadas</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3rem' }}>
                            <div>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', color: colors.text }}>Correos electrónicos sobre su cuenta</h4>
                                <Checkbox label="Resumen diario" checked={notifications.dailySummary} onChange={() => toggleNotify('dailySummary')} colors={colors} theme={theme} />
                                <Checkbox label="Promociones" checked={notifications.promotions} onChange={() => toggleNotify('promotions')} colors={colors} theme={theme} />
                                <Checkbox label="Actividad de recomendaciones" checked={notifications.recommendations} onChange={() => toggleNotify('recommendations')} colors={colors} theme={theme} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', color: colors.text }}>Cada vez que un invitado...</h4>
                                <Checkbox label="Apertura de tarjeta" checked={notifications.cardOpened} onChange={() => toggleNotify('cardOpened')} colors={colors} theme={theme} />
                                <Checkbox label="Submits a new response" checked={notifications.newResponse} onChange={() => toggleNotify('newResponse')} colors={colors} theme={theme} />
                                <Checkbox label="Card/Message is undeliverable" checked={notifications.undeliverable} onChange={() => toggleNotify('undeliverable')} colors={colors} theme={theme} />
                                <Checkbox label="Sends you a message" checked={notifications.messageReceived} onChange={() => toggleNotify('messageReceived')} colors={colors} theme={theme} />
                                <Checkbox label="Envía pago de entrada/donación" checked={notifications.paymentReceived} onChange={() => toggleNotify('paymentReceived')} colors={colors} theme={theme} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', color: colors.text }}>Cuando Greenvelope hace algo por usted</h4>
                                <Checkbox label="Resends card on your behalf" checked={notifications.resendOnBehalf} onChange={() => toggleNotify('resendOnBehalf')} colors={colors} theme={theme} />
                                <Checkbox label="Sends a reminder for the event" checked={notifications.eventReminder} onChange={() => toggleNotify('eventReminder')} colors={colors} theme={theme} />
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div style={{ backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2', border: `1px solid ${theme === 'dark' ? '#EF4444' : '#FECACA'}`, borderRadius: '4px', padding: '2rem' }}>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#EF4444', margin: '0 0 1rem 0' }}>Zona de Peligro</h3>
                        <p style={{ color: colors.muted, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            Estas acciones son destructivas y no se pueden deshacer.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => {
                                    if (window.confirm('¿Estás SEGURO de que quieres eliminar TODOS tus eventos? Esta acción borrará permanentemente todas las invitaciones y datos asociados. No se puede deshacer.')) {
                                        clearAllEvents();
                                        alert('Todos los eventos han sido eliminados.');
                                    }
                                }}
                                style={{
                                    backgroundColor: '#EF4444', color: 'white',
                                    border: 'none', padding: '0.8rem 1.5rem',
                                    borderRadius: '4px', cursor: 'pointer',
                                    fontWeight: 700, fontSize: '0.8rem',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                ELIMINAR TODOS LOS EVENTOS
                            </button>
                        </div>
                    </div>
                </div>
            )
            }

            {
                activeTab === 'events' && (
                    <EventsTable />
                )
            }
        </div >
    );
};

interface TabButtonProps {
    active: boolean;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    colors: any;
    theme: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, label, icon, onClick, colors, theme }) => (
    <button
        onClick={onClick}
        style={{
            background: 'none', border: 'none',
            borderBottom: active ? `3px solid ${theme === 'dark' ? '#34D399' : '#57B07B'}` : '3px solid transparent',
            padding: '1rem 0.5rem',
            color: active ? (theme === 'dark' ? '#34D399' : '#57B07B') : colors.muted,
            fontWeight: active ? 700 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            transition: 'all 0.2s'
        }}
    >
        {icon} {label}
    </button>
);

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: () => void;
    colors: any;
    theme: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, colors, theme }) => (
    <div
        onClick={onChange}
        style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem', cursor: 'pointer' }}
    >
        <div style={{
            width: '18px', height: '18px', borderRadius: '3px',
            border: checked ? 'none' : `1px solid ${colors.border}`,
            backgroundColor: checked ? (theme === 'dark' ? '#059669' : '#57B07B') : colors.cardBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            {checked && <Check size={12} color="white" />}
        </div>
        <span style={{ fontSize: '0.9rem', color: colors.muted }}>{label}</span>
    </div>
);

export default AccountSettings;
