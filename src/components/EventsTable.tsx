import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useEvents } from '../context/EventsContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Filter, X, Tag, Trash2 } from 'lucide-react';

interface EventsTableProps {
    events?: any[]; // Optional prop to override internal data fetching
}

const EventsTable: React.FC<EventsTableProps> = ({ events: externalEvents }) => {
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const { user } = useAuth();
    const { colors, theme } = useTheme();
    const { events: contextEvents, deleteEvents, updateEvent } = useEvents();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    // Filtering State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTag, setFilterTag] = useState('');
    const [filterDate, setFilterDate] = useState('');

    // Inline Tag Editing State
    const [editingTagId, setEditingTagId] = useState<string | null>(null);

    // Use external events if provided, otherwise use context events
    const rawEvents = externalEvents || contextEvents;

    // Get Unique Tags for the Filter Dropdown and Editing
    const uniqueTags = useMemo(() => {
        const tags = new Set<string>();
        // Add some default tags if desired, or just rely on existing ones
        tags.add('Boda');
        tags.add('Cumpleaños');
        tags.add('Baby Shower');
        tags.add('Corporativo');

        rawEvents.forEach((ev: any) => {
            if (ev.selectedTag) tags.add(ev.selectedTag);
            if (ev.customTags && Array.isArray(ev.customTags)) {
                ev.customTags.forEach((t: string) => tags.add(t));
            }
        });
        return Array.from(tags).sort();
    }, [rawEvents]);

    const mappedEvents = useMemo(() => {
        const locale = language === 'es' ? 'es-ES' : 'en-US';
        return rawEvents.map((ev: any) => ({
            id: ev.id,
            title: ev.partner1 && ev.partner2 ? `Boda de ${ev.partner1} & ${ev.partner2}` : (ev.title || 'Evento Sin Título'),
            originalData: ev,
            type: t('dashboard.table.event_type'),
            image: ev.imageUrl || null,
            initials: (ev.partner1 && ev.partner2)
                ? `${ev.partner1.charAt(0).toUpperCase()}&${ev.partner2.charAt(0).toUpperCase()}`
                : (ev.title ? ev.title.charAt(0).toUpperCase() : '?'),
            created: new Date().toLocaleDateString(locale),
            eventDate: ev.date ? new Date(ev.date) : null,
            eventDateString: ev.date ? new Date(ev.date).toLocaleDateString(locale) : 'Por definir',
            lastDelivery: t('dashboard.table.not_sent'),
            openRate: 0,
            responseRate: 0,
            status: t('dashboard.table.status.trial')
        }));
    }, [rawEvents, language, t]);

    // Apply Filters
    const events = useMemo(() => {
        return mappedEvents.filter((ev: any) => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                searchTerm === '' ||
                ev.title.toLowerCase().includes(searchLower) ||
                (ev.originalData.partner1 && ev.originalData.partner1.toLowerCase().includes(searchLower)) ||
                (ev.originalData.partner2 && ev.originalData.partner2.toLowerCase().includes(searchLower)) ||
                (ev.originalData.location && ev.originalData.location.toLowerCase().includes(searchLower)) ||
                (ev.originalData.selectedTag && ev.originalData.selectedTag.toLowerCase().includes(searchLower)) ||
                ev.eventDateString.toLowerCase().includes(searchLower);

            const matchesTag = filterTag ? ev.originalData.selectedTag === filterTag : true;
            const matchesDate = filterDate
                ? (ev.originalData.date === filterDate) // Compare exact YYYY-MM-DD strings
                : true;

            return matchesSearch && matchesTag && matchesDate;
        });
    }, [mappedEvents, searchTerm, filterTag, filterDate]);

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedEvents(events.map((ev: any) => ev.id));
        } else {
            setSelectedEvents([]);
        }
    };

    const toggleSelectEvent = (id: string) => {
        setSelectedEvents(prev =>
            prev.includes(id)
                ? prev.filter(eventId => eventId !== id)
                : [...prev, id]
        );
    };

    const handleDeleteSelected = () => {
        if (selectedEvents.length === 0 || !user?.username) return;

        if (window.confirm(`¿Estás seguro de que deseas eliminar ${selectedEvents.length} evento(s)? Esta acción no se puede deshacer.`)) {
            deleteEvents(selectedEvents);
            setSelectedEvents([]);
        }
    };

    const handleDeleteSingle = (id: string, title: string) => {
        if (!user?.username) return;

        if (window.confirm(`¿Estás seguro de que deseas eliminar el evento "${title}"? Esta acción no se puede deshacer.`)) {
            deleteEvents([id]);
            // If the deleted event was selected, remove it from selection
            if (selectedEvents.includes(id)) {
                setSelectedEvents(prev => prev.filter(eventId => eventId !== id));
            }
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterTag('');
        setFilterDate('');
    };

    const handleUpdateTag = async (eventId: string, newTag: string) => {
        const eventToUpdate = rawEvents.find((e: any) => e.id === eventId);
        if (eventToUpdate) {
            const updatedEvent = {
                ...eventToUpdate,
                selectedTag: newTag
            };
            await updateEvent(updatedEvent);
        }
        setEditingTagId(null);
    };

    const hasFilters = searchTerm || filterTag || filterDate;

    return (
        <div style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: '4px',
            overflow: 'hidden',
            fontFamily: "'Montserrat', sans-serif"
        }}>
            {/* Toolbar */}
            <div style={{
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `1px solid ${colors.border}`,
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button style={{ padding: '0.5rem 1rem', border: `1px solid ${colors.border}`, background: colors.cardBg, borderRadius: '4px', color: theme === 'dark' ? '#34D399' : '#059669', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>{t('dashboard.filter.active')}</button>
                    {/* <button style={{ padding: '0.5rem 1rem', border: `1px solid ${colors.border}`, background: 'transparent', borderRadius: '4px', color: colors.muted, fontSize: '0.85rem', cursor: 'pointer' }}>{t('dashboard.filter.archived')}</button> */}

                    {/* Tag Filter */}
                    <div style={{ position: 'relative' }}>
                        <select
                            value={filterTag}
                            onChange={(e) => setFilterTag(e.target.value)}
                            style={{
                                padding: '0.5rem 2rem 0.5rem 0.8rem',
                                border: `1px solid ${colors.border}`,
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                                background: colors.bg,
                                color: filterTag ? (theme === 'dark' ? '#34D399' : '#059669') : colors.muted,
                                outline: 'none',
                                cursor: 'pointer',
                                appearance: 'none',
                                fontWeight: filterTag ? 600 : 400
                            }}
                        >
                            <option value="">{t('dashboard.filter.all_tags')}</option>
                            {uniqueTags.map(tag => (
                                <option key={tag} value={tag}>{tag}</option>
                            ))}
                        </select>
                        <Filter size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: colors.muted }} />
                    </div>

                    {/* Date Filter */}
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        style={{
                            padding: '0.5rem',
                            border: `1px solid ${colors.border}`,
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            background: colors.bg,
                            color: filterDate ? (theme === 'dark' ? '#34D399' : '#059669') : colors.muted,
                            outline: 'none',
                            fontWeight: filterDate ? 600 : 400
                        }}
                    />

                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            title={t('dashboard.filter.clear')}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#EF4444', display: 'flex', alignItems: 'center'
                            }}
                        >
                            <X size={18} />
                        </button>
                    )}

                    {selectedEvents.length > 0 && (
                        <button
                            onClick={handleDeleteSelected}
                            style={{
                                marginLeft: '0.5rem',
                                padding: '0.5rem 1rem',
                                border: 'none',
                                background: '#EF4444',
                                borderRadius: '4px',
                                color: 'white',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            {t('dashboard.delete_selected')} ({selectedEvents.length})
                        </button>
                    )}
                </div>

                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder={t('dashboard.search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '0.5rem',
                            border: `1px solid ${colors.border}`,
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            background: colors.bg,
                            color: colors.text,
                            outline: 'none',
                            minWidth: '250px'
                        }}
                    />
                </div>
            </div>

            {/* Table */}
            <div style={{ width: '100%', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: colors.text }}>
                    <thead style={{ backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.2)' : '#F9FAFB', borderBottom: `1px solid ${colors.border}` }}>
                        <tr>
                            <th style={{ padding: '1rem', width: '40px' }}>
                                <input
                                    type="checkbox"
                                    checked={events.length > 0 && selectedEvents.length === events.length}
                                    onChange={(e) => toggleSelectAll(e.target.checked)}
                                />
                            </th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>{t('dashboard.table.header.title')}</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>{t('dashboard.table.header.created')}</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>{t('dashboard.table.header.event_date')}</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>{t('dashboard.table.header.last_delivery')}</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>{t('dashboard.table.header.open_rate')}</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>{t('dashboard.table.header.response_rate')}</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>{t('dashboard.table.header.status')}</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length > 0 ? (
                            events.map((ev: any) => (
                                <tr key={ev.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedEvents.includes(ev.id)}
                                            onChange={() => toggleSelectEvent(ev.id)}
                                        />
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{
                                                width: '60px', height: '60px',
                                                backgroundColor: ev.image ? '#E5E7EB' : (theme === 'dark' ? '#333' : '#F3F4F6'),
                                                borderRadius: '4px',
                                                backgroundImage: ev.image ? `url(${ev.image})` : 'none',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1.4rem',
                                                fontFamily: "'Playfair Display', serif",
                                                color: theme === 'dark' ? '#E6BEAE' : '#D4A373',
                                                fontWeight: 700,
                                                border: `1px solid ${colors.border}`
                                            }}>
                                                {!ev.image && (
                                                    ev.initials ? ev.initials : <Calendar size={20} color="#9CA3AF" />
                                                )}
                                            </div>
                                            <div>
                                                <div
                                                    onClick={() => navigate(`/dashboard/event/${ev.id}`)}
                                                    style={{
                                                        fontWeight: 600,
                                                        color: theme === 'dark' ? '#34D399' : '#059669',
                                                        marginBottom: '0.2rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {ev.title}
                                                </div>
                                                <div style={{ fontStyle: 'italic', color: colors.muted, fontSize: '0.8rem' }}>{ev.type}</div>
                                                <div style={{ marginTop: '0.3rem', fontSize: '0.75rem', color: colors.muted }}>
                                                    {editingTagId === ev.id ? (
                                                        <select
                                                            autoFocus
                                                            value={ev.originalData.selectedTag || ''}
                                                            onChange={(e) => handleUpdateTag(ev.id, e.target.value)}
                                                            onBlur={() => setEditingTagId(null)}
                                                            style={{
                                                                padding: '0.1rem',
                                                                fontSize: '0.75rem',
                                                                borderRadius: '4px',
                                                                border: `1px solid ${colors.border}`,
                                                                background: colors.bg,
                                                                color: colors.text
                                                            }}
                                                        >
                                                            <option value="">{t('dashboard.table.no_tag')}</option>
                                                            {uniqueTags.map(tag => (
                                                                <option key={tag} value={tag}>{tag}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingTagId(ev.id);
                                                            }}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                                                cursor: 'pointer',
                                                                transition: 'opacity 0.2s',
                                                                opacity: 0.8
                                                            }}
                                                            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                                                            onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
                                                        >
                                                            {ev.originalData.selectedTag ? (
                                                                <span style={{ backgroundColor: theme === 'dark' ? 'rgba(52, 211, 153, 0.2)' : '#ECFDF5', color: theme === 'dark' ? '#34D399' : '#059669', padding: '0.1rem 0.4rem', borderRadius: '4px', border: `1px solid ${theme === 'dark' ? 'rgba(52, 211, 153, 0.3)' : '#D1FAE5'}` }}>
                                                                    {ev.originalData.selectedTag}
                                                                </span>
                                                            ) : (
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                                    <Tag size={10} /> + {t('dashboard.table.add_tag')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{ev.created}</td>
                                    <td style={{ padding: '1rem' }}>{ev.eventDateString}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: ev.lastDelivery === 'Sin enviar' ? colors.border : '#60A5FA' }}></div>
                                            {ev.lastDelivery}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '60px', height: '6px', backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: `${ev.openRate}%`, height: '100%', backgroundColor: '#D4AF37' }}></div>
                                            </div>
                                            <span>{ev.openRate}%</span>
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: theme === 'dark' ? '#34D399' : '#059669', cursor: 'pointer', marginTop: '0.2rem' }}>{t('dashboard.table.view_details')}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '60px', height: '6px', backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: `${ev.responseRate}%`, height: '100%', backgroundColor: '#10B981' }}></div>
                                            </div>
                                            <span>{ev.responseRate}%</span>
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: theme === 'dark' ? '#34D399' : '#059669', cursor: 'pointer', marginTop: '0.2rem' }}>{t('dashboard.table.view_details')}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {ev.status === 'Comprado' ? (
                                            <span style={{ color: colors.text }}>{t('dashboard.table.status.purchased')}</span>
                                        ) : (
                                            <span style={{ backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2', color: '#EF4444', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>{t('dashboard.table.status.trial')}</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSingle(ev.id, ev.title);
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#EF4444',
                                                padding: '0.4rem',
                                                borderRadius: '4px',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#FEE2E2'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            title="Eliminar evento"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: colors.muted }}>
                                    {hasFilters ? t('dashboard.table.no_results') : t('dashboard.table.no_events')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventsTable;
