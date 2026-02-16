import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import type { Guest, RSVPStatus } from '../types';
import { Download, Upload, Trash2, Search, MessageCircle, Plus, Link as LinkIcon, CheckCircle, ArrowRight, Users } from 'lucide-react';

interface GuestManagerProps {
    guests: Guest[];
    onUpdateGuests: (newGuests: Guest[]) => void;
    invitationUrl: string;
    mode: 'design' | 'rsvp'; // 'design' = full edit, 'rsvp' = status only
    customTags?: string[];
    onUpdateTags?: (tags: string[]) => void;
    maxCapacity?: number;
    onUpdateCapacity?: (capacity: number) => void;
}

const GuestManager: React.FC<GuestManagerProps> = ({ guests, onUpdateGuests, invitationUrl, mode, customTags = [], onUpdateTags, maxCapacity = 50, onUpdateCapacity }) => {
    // const { user } = useAuth(); // Removed unused hook
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTag, setFilterTag] = useState<string>('all');
    // const [stats, setStats] = useState({ pending: 0, confirmed: 0, declined: 0, total: 0 }); // Removed state
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [isAdding, setIsAdding] = useState(false);
    const [newGuest, setNewGuest] = useState<Partial<Guest>>({
        name: '',
        email: '',
        phone: '',
        tickets: 1,
        status: 'pending',
        tags: []
    });

    // Default Tags
    const DEFAULT_TAGS = ['Familia', 'Amigos', 'Trabajo', 'VIP', 'Novio', 'Novia'];
    const availableTags = Array.from(new Set([...DEFAULT_TAGS, ...customTags]));

    // Bulk Send State
    const [bulkQueue, setBulkQueue] = useState<Guest[] | null>(null);
    const [currentBulkIndex, setCurrentBulkIndex] = useState(0);

    // Update Stats when guests prop changes (Keep for safety or remove if unused? Removing since we calculate on fly)
    // useEffect(() => { ... }) -> Removed

    // Filter Logic First
    const filteredGuests = guests.filter(g => {
        const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = filterTag === 'all' || (g.tags && g.tags.includes(filterTag));
        return matchesSearch && matchesTag;
    });

    // Stats based on Filtered Guests
    const stats = filteredGuests.reduce((acc, guest) => {
        acc.total += guest.tickets || 1;
        if (guest.status === 'confirmed') acc.confirmed += guest.tickets || 1;
        if (guest.status === 'pending') acc.pending += guest.tickets || 1;
        if (guest.status === 'declined') acc.declined += guest.tickets || 1;
        return acc;
    }, { pending: 0, confirmed: 0, declined: 0, total: 0 });

    // Total Capacity Logic (based on ALL guests)
    const totalGuestsCount = guests.reduce((sum, g) => sum + (g.tickets || 1), 0);
    const capacityPercentage = Math.min(100, (totalGuestsCount / maxCapacity) * 100);
    const CAPACITY_OPTIONS = [50, 80, 100, 120, 140, 150, 180, 200, 250, 300];

    // ... handlers ...

    const [isAddingFamily, setIsAddingFamily] = useState(false);
    const [newFamily, setNewFamily] = useState<{ name: string, members: Partial<Guest>[], tags: string[] }>({
        name: '',
        members: [{ name: '', status: 'pending', tickets: 1 }],
        tags: []
    });

    const handleAddGuest = () => {
        if (!newGuest.name) return alert("El nombre es obligatorio");

        const guest: Guest = {
            id: Date.now().toString(),
            name: newGuest.name,
            email: newGuest.email,
            phone: newGuest.phone,
            tickets: newGuest.tickets || 1,
            status: 'pending',
            notes: '',
            tags: newGuest.tags
        };

        onUpdateGuests([...guests, guest]);
        setNewGuest({ name: '', email: '', phone: '', tickets: 1, status: 'pending', tags: [] });
        setIsAdding(false);
    };

    const handleSaveFamily = () => {
        if (!newFamily.name) return alert("El nombre de la familia es obligatorio");
        if (newFamily.members.some(m => !m.name)) return alert("Todos los miembros deben tener nombre");

        const familyId = `family_${Date.now()}`;
        const newGuests: Guest[] = newFamily.members.map((member, idx) => ({
            id: `${familyId}_${idx}`, // Unique ID
            name: member.name || '',
            email: '',
            phone: '',
            tickets: 1,
            status: 'pending',
            notes: '',
            groupId: familyId,
            tags: newFamily.tags
        }));

        onUpdateGuests([...guests, ...newGuests]);
        setNewFamily({ name: '', members: [{ name: '', status: 'pending', tickets: 1 }], tags: [] });
        setIsAddingFamily(false);
    };

    const handleDeleteGuest = (id: string) => {
        if (window.confirm('¿Eliminar invitado?')) {
            onUpdateGuests(guests.filter(g => g.id !== id));
        }
    };

    const handleStatusChange = (id: string, status: RSVPStatus) => {
        onUpdateGuests(guests.map(g => g.id === id ? { ...g, status } : g));
    };

    // Excel Export
    const handleExport = () => {
        const wb = XLSX.utils.book_new();
        const wsData = [
            ["Nombre", "Email", "Teléfono", "Cupos", "Estado", "Etiquetas", "Notas"], // Header
            ...guests.map(g => [g.name, g.email || '', g.phone || '', g.tickets, g.status, g.tags?.join(', ') || '', g.notes || ''])
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData); // eslint-disable-line
        XLSX.utils.book_append_sheet(wb, ws, "Invitados");
        XLSX.writeFile(wb, "Lista_Invitados_Boda.xlsx");
    };

    // Excel Import
    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsName = wb.SheetNames[0];
            const ws = wb.Sheets[wsName];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

            // Removing header row and mapping
            const importedGuests: Guest[] = (data.slice(1) as any[]).map((row: any) => ({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                name: row[0],
                email: row[1] || '',
                phone: String(row[2] || ''), // Force string to avoid crashes
                tickets: parseInt(row[3]) || 1,
                status: (['pending', 'confirmed', 'declined'].includes(row[4]) ? row[4] : 'pending') as RSVPStatus,
                tags: row[5] ? String(row[5]).split(',').map(s => s.trim()) : [],
                notes: row[6] || ''
            })).filter(g => g.name); // Filter empty rows

            onUpdateGuests([...guests, ...importedGuests]);
        };
        reader.readAsBinaryString(file);
        e.target.value = ''; // Reset input
    };

    const generatePersonalLink = (guest: Guest) => {
        if (!invitationUrl) return '';
        const separator = invitationUrl.includes('?') ? '&' : '?';
        return `${invitationUrl}${separator}gid=${encodeURIComponent(guest.id)}`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Enlace copiado al portapapeles");
    };

    const constructWhatsAppUrl = (guest: Guest) => {
        if (!guest.phone) return '';
        const link = generatePersonalLink(guest);
        const message = `Hola ${guest.name}, te invito a mi boda! Aquí tienes tu invitación personalizada y pases: ${link}`; // eslint-disable-line

        // Safe cleaning of phone number (handles Excel numbers automatically converted to string)
        const cleanPhone = String(guest.phone).replace(/[^0-9]/g, '');
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    }

    const sendWhatsApp = (guest: Guest) => {
        if (!guest.phone) return alert("Este invitado no tiene teléfono registrado");
        window.open(constructWhatsAppUrl(guest), '_blank');
    };

    // Bulk Sending Logic
    const startBulkSend = () => {
        const validGuests = guests.filter(g => g.phone && g.phone.length > 5);
        if (validGuests.length === 0) return alert("No hay invitados con teléfono para enviar.");
        setBulkQueue(validGuests);
        setCurrentBulkIndex(0);
    };

    const handleNextBulk = () => {
        if (!bulkQueue) return;
        if (currentBulkIndex < bulkQueue.length - 1) {
            setCurrentBulkIndex(prev => prev + 1);
        } else {
            // Finished
            setCurrentBulkIndex(prev => prev + 1); // Move to 'complete' state index
        }
    };

    const handleAddTag = (newTag: string) => {
        if (newTag && onUpdateTags && !customTags.includes(newTag)) {
            onUpdateTags([...customTags, newTag]);
        }
    };

    const toggleTag = (tag: string, currentTags: string[], setTags: (t: string[]) => void) => {
        if (currentTags.includes(tag)) {
            setTags(currentTags.filter(t => t !== tag));
        } else {
            setTags([...currentTags, tag]);
        }
    };



    return (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '2rem' }}>

            {/* CAPACITY PLANNER */}
            {mode === 'design' && (
                <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1E293B' }}>Capacidad del Evento</h3>
                            <p style={{ margin: '0.2rem 0 0', color: '#64748B', fontSize: '0.9rem' }}>Gestiona el límite de tu lista de invitados.</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.9rem', color: '#444' }}>Plan:</span>
                            <select
                                value={maxCapacity}
                                onChange={(e) => onUpdateCapacity && onUpdateCapacity(parseInt(e.target.value))}
                                style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontWeight: 600 }}
                            >
                                {CAPACITY_OPTIONS.map(cap => (
                                    <option key={cap} value={cap}>{cap} Personas</option>
                                ))}
                                <option value={500}>500+ (Personalizado)</option>
                            </select>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ position: 'relative', height: '24px', backgroundColor: '#E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${capacityPercentage}%`,
                            height: '100%',
                            backgroundColor: capacityPercentage > 100 ? '#EF4444' : (capacityPercentage > 90 ? '#F59E0B' : '#10B981'),
                            transition: 'width 0.5s ease'
                        }}></div>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 600, color: '#334155', textShadow: '0 0 2px white' }}>
                            {totalGuestsCount} / {maxCapacity} Cupos Usados ({Math.round(capacityPercentage)}%)
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#F3F4F6', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#374151' }}>{stats.total}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Total Invitados</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#EFF6FF', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2563EB' }}>{stats.confirmed}</div>
                    <div style={{ fontSize: '0.85rem', color: '#1E40AF' }}>Confirmados</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#FFF7ED', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#D97706' }}>{stats.pending}</div>
                    <div style={{ fontSize: '0.85rem', color: '#92400E' }}>Pendientes</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#FEF2F2', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#DC2626' }}>{stats.declined}</div>
                    <div style={{ fontSize: '0.85rem', color: '#991B1B' }}>Rechazados</div>
                </div>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F9FAFB', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #E5E7EB', flex: 1 }}>
                        <Search size={18} color="#9CA3AF" />
                        <input
                            type="text"
                            placeholder="Buscar invitado..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
                        />
                    </div>

                    {/* Tag Filter */}
                    <select
                        value={filterTag}
                        onChange={(e) => setFilterTag(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: 'white', color: '#555' }}
                    >
                        <option value="all">Todas las etiquetas</option>
                        {availableTags.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {mode === 'design' && (
                        <>
                            {/* Bulk Send Button */}
                            <button
                                onClick={startBulkSend}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    padding: '0.5rem 1rem', backgroundColor: '#25D366', color: 'white',
                                    borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600
                                }}
                            >
                                <MessageCircle size={16} /> Enviar Todo WhatsApp
                            </button>

                            <button onClick={() => setIsAdding(!isAdding)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', backgroundColor: '#111827', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                                <Plus size={16} /> Persona
                            </button>
                            <button onClick={() => setIsAddingFamily(!isAddingFamily)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                                <Users size={16} /> Familia
                            </button>
                            <button onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', backgroundColor: '#fff', color: '#374151', borderRadius: '6px', border: '1px solid #E5E7EB', cursor: 'pointer' }}>
                                <Upload size={16} /> Importar
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImport}
                                accept=".xlsx, .xls, .csv"
                                style={{ display: 'none' }}
                            />
                        </>
                    )}

                    <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', backgroundColor: '#fff', color: '#374151', borderRadius: '6px', border: '1px solid #E5E7EB', cursor: 'pointer' }}>
                        <Download size={16} /> Exportar
                    </button>
                </div>
            </div>

            {/* Add Guest Form */}
            {isAdding && (
                <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px dashed #D1D5DB' }}>
                    <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 }}>Nuevo Invitado</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        <input type="text" placeholder="Nombre Completo *" value={newGuest.name} onChange={e => setNewGuest({ ...newGuest, name: e.target.value })} style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                        <input type="email" placeholder="Email (Opcional)" value={newGuest.email} onChange={e => setNewGuest({ ...newGuest, email: e.target.value })} style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                        <input type="tel" placeholder="Teléfono (Opcional)" value={newGuest.phone} onChange={e => setNewGuest({ ...newGuest, phone: e.target.value })} style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                        <input type="number" placeholder="Cupos" min="1" value={newGuest.tickets} onChange={e => setNewGuest({ ...newGuest, tickets: parseInt(e.target.value) || 1 })} style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                    </div>

                    {/* Tag Selector */}
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: '#666' }}>Etiquetas:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {availableTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag, newGuest.tags || [], (tags) => setNewGuest({ ...newGuest, tags }))}
                                    style={{
                                        padding: '0.3rem 0.8rem', borderRadius: '20px', border: '1px solid',
                                        borderColor: newGuest.tags?.includes(tag) ? '#3B82F6' : '#D1D5DB',
                                        backgroundColor: newGuest.tags?.includes(tag) ? '#EFF6FF' : 'white',
                                        color: newGuest.tags?.includes(tag) ? '#1D4ED8' : '#6B7280',
                                        cursor: 'pointer', fontSize: '0.85rem'
                                    }}
                                >
                                    {tag}
                                </button>
                            ))}
                            {/* Create Tag Input */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <input
                                    type="text"
                                    placeholder="+ Crear"
                                    id="newTagInput"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddTag(e.currentTarget.value);
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                    style={{ padding: '0.3rem 0.6rem', borderRadius: '20px', border: '1px dashed #D1D5DB', fontSize: '0.85rem', width: '80px' }}
                                />
                                <button
                                    onClick={() => {
                                        const input = document.getElementById('newTagInput') as HTMLInputElement;
                                        if (input) {
                                            handleAddTag(input.value);
                                            input.value = '';
                                        }
                                    }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '0.2rem' }}
                                    title="Agregar etiqueta"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => setIsAdding(false)} style={{ padding: '0.5rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer', color: '#6B7280' }}>Cancelar</button>
                        <button onClick={handleAddGuest} style={{ padding: '0.5rem 1.5rem', border: 'none', background: '#4F46E5', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Guardar</button>
                    </div>
                </div>
            )}

            {/* Add Family Form */}
            {isAddingFamily && (
                <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#EFF6FF', borderRadius: '8px', border: '1px dashed #93C5FD' }}>
                    <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600, color: '#1E40AF' }}>Nueva Familia / Grupo</h4>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#1E40AF' }}>Nombre de la Familia (ej: Familia Pérez)</label>
                        <input
                            type="text"
                            placeholder="Familia Pérez"
                            value={newFamily.name}
                            onChange={e => setNewFamily({ ...newFamily, name: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #BFDBFE' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.9rem', color: '#1E40AF' }}>Miembros:</label>
                        {newFamily.members.map((member, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder={`Miembro ${idx + 1}`}
                                    value={member.name}
                                    onChange={e => {
                                        const updated = [...newFamily.members];
                                        updated[idx].name = e.target.value;
                                        setNewFamily({ ...newFamily, members: updated });
                                    }}
                                    style={{ flex: 1, padding: '0.6rem', borderRadius: '4px', border: '1px solid #BFDBFE' }}
                                />
                                <button
                                    onClick={() => {
                                        const updated = newFamily.members.filter((_, i) => i !== idx);
                                        setNewFamily({ ...newFamily, members: updated });
                                    }}
                                    title="Quitar"
                                    style={{ padding: '0 0.8rem', background: '#FEE2E2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => setNewFamily({ ...newFamily, members: [...newFamily.members, { name: '', status: 'pending', tickets: 1 }] })}
                            style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: '#2563EB', cursor: 'pointer', fontSize: '0.9rem', padding: '0.5rem 0' }}
                        >
                            + Agregar otro miembro
                        </button>
                    </div>

                    {/* Tag Selector for Family */}
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: '#666' }}>Etiquetas para todos:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {availableTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag, newFamily.tags || [], (tags) => setNewFamily({ ...newFamily, tags }))}
                                    style={{
                                        padding: '0.3rem 0.8rem', borderRadius: '20px', border: '1px solid',
                                        borderColor: newFamily.tags?.includes(tag) ? '#3B82F6' : '#D1D5DB',
                                        backgroundColor: newFamily.tags?.includes(tag) ? '#EFF6FF' : 'white',
                                        color: newFamily.tags?.includes(tag) ? '#1D4ED8' : '#6B7280',
                                        cursor: 'pointer', fontSize: '0.85rem'
                                    }}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => setIsAddingFamily(false)} style={{ padding: '0.5rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer', color: '#6B7280' }}>Cancelar</button>
                        <button onClick={handleSaveFamily} style={{ padding: '0.5rem 1.5rem', border: 'none', background: '#2563EB', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Guardar Familia</button>
                    </div>
                </div>
            )}

            {/* Guest Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #E5E7EB', color: '#6B7280' }}>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Nombre</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Info</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>Cupos</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>Estado</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGuests.length > 0 ? (
                            filteredGuests.map(guest => (
                                <tr key={guest.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500, color: '#1F2937' }}>
                                        {guest.name}
                                        {guest.tags && guest.tags.length > 0 && (
                                            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                                                {guest.tags.map(tag => (
                                                    <span key={tag} style={{ fontSize: '0.7rem', backgroundColor: '#F3F4F6', color: '#666', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', color: '#4B5563' }}>
                                        {guest.email && <div style={{ fontSize: '0.8rem' }}>📧 {guest.email}</div>}
                                        {guest.phone && <div style={{ fontSize: '0.8rem' }}>📱 {guest.phone}</div>}
                                        {guest.groupId && <div style={{ fontSize: '0.7rem', color: '#999', fontStyle: 'italic' }}>Parte de un grupo</div>}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>{guest.tickets}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <select
                                            value={guest.status}
                                            onChange={(e) => handleStatusChange(guest.id, e.target.value as RSVPStatus)}
                                            style={{
                                                padding: '0.3rem', borderRadius: '20px', border: 'none',
                                                backgroundColor: guest.status === 'confirmed' ? '#DCFCE7' : guest.status === 'declined' ? '#FEE2E2' : '#FEF3C7',
                                                color: guest.status === 'confirmed' ? '#166534' : guest.status === 'declined' ? '#991B1B' : '#92400E',
                                                fontWeight: 500, cursor: 'pointer', textAlign: 'center'
                                            }}
                                        >
                                            <option value="pending">Pendiente</option>
                                            <option value="confirmed">Confirmado</option>
                                            <option value="declined">Rechazado</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                            <button
                                                title="Enviar por WhatsApp"
                                                onClick={() => sendWhatsApp(guest)}
                                                style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #dcfce7', background: '#f0fdf4', color: '#16a34a', cursor: 'pointer' }}
                                            >
                                                <MessageCircle size={16} />
                                            </button>
                                            <button
                                                title="Copiar Enlace Personal"
                                                onClick={() => copyToClipboard(generatePersonalLink(guest))}
                                                style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #E5E7EB', background: 'white', color: '#4B5563', cursor: 'pointer' }}
                                            >
                                                <LinkIcon size={16} />
                                            </button>
                                            {mode === 'design' && (
                                                <button
                                                    title="Eliminar"
                                                    onClick={() => handleDeleteGuest(guest.id)}
                                                    style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #FEE2E2', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
                                    No hay invitados aún. ¡Agrega uno o importa desde Excel!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Bulk Send Wizard Modal */}
            {bulkQueue && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px', width: '90%', maxWidth: '500px',
                        padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        {currentBulkIndex < bulkQueue.length ? (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Enviar Invitaciones</h3>
                                    <span style={{ fontSize: '0.9rem', color: '#6B7280', background: '#F3F4F6', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                                        {currentBulkIndex + 1} de {bulkQueue.length}
                                    </span>
                                </div>

                                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{bulkQueue[currentBulkIndex].name}</h4>
                                    <p style={{ color: '#6B7280', margin: 0 }}>{bulkQueue[currentBulkIndex].phone}</p>
                                </div>

                                <div style={{ display: 'grid', gap: '0.8rem' }}>
                                    <button
                                        onClick={() => {
                                            sendWhatsApp(bulkQueue[currentBulkIndex]);
                                            handleNextBulk();
                                        }}
                                        style={{
                                            padding: '1rem', backgroundColor: '#25D366', color: 'white', border: 'none',
                                            borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                        }}
                                    >
                                        <MessageCircle size={20} /> Enviar WhatsApp y Siguiente
                                    </button>

                                    <button
                                        onClick={handleNextBulk}
                                        style={{
                                            padding: '0.8rem', backgroundColor: '#fff', color: '#4B5563', border: '1px solid #E5E7EB',
                                            borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                        }}
                                    >
                                        <ArrowRight size={18} /> Saltar este invitado
                                    </button>
                                </div>
                            </>
                        ) : (
                            // Completed State
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <div style={{ color: '#16a34a', marginBottom: '1rem' }}><CheckCircle size={60} /></div>
                                <h3 style={{ marginBottom: '0.5rem' }}>¡Proceso Finalizado!</h3>
                                <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Has revisado todos los invitados de la lista.</p>
                                <button
                                    onClick={() => setBulkQueue(null)}
                                    style={{
                                        padding: '0.8rem 2rem', backgroundColor: '#4F46E5', color: 'white', border: 'none',
                                        borderRadius: '8px', fontSize: '1rem', cursor: 'pointer'
                                    }}
                                >
                                    Cerrar
                                </button>
                            </div>
                        )}

                        {currentBulkIndex < bulkQueue.length && (
                            <button
                                onClick={() => setBulkQueue(null)}
                                style={{
                                    marginTop: '1.5rem', width: '100%', padding: '0.8rem', border: 'none',
                                    background: 'transparent', color: '#EF4444', cursor: 'pointer', fontSize: '0.9rem'
                                }}
                            >
                                Cancelar y Salir
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuestManager;
