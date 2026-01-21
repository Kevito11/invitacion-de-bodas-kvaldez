import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import type { Guest, RSVPStatus } from '../types';
import { Download, Upload, Trash2, Search, MessageCircle, Plus, Link as LinkIcon, CheckCircle, ArrowRight } from 'lucide-react';

interface GuestManagerProps {
    guests: Guest[];
    onUpdateGuests: (newGuests: Guest[]) => void;
    invitationUrl: string;
    mode: 'design' | 'rsvp'; // 'design' = full edit, 'rsvp' = status only
}

const GuestManager: React.FC<GuestManagerProps> = ({ guests, onUpdateGuests, invitationUrl, mode }) => {
    // const { user } = useAuth(); // Removed unused hook
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ pending: 0, confirmed: 0, declined: 0, total: 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [isAdding, setIsAdding] = useState(false);
    const [newGuest, setNewGuest] = useState<Partial<Guest>>({
        name: '',
        email: '',
        phone: '',
        tickets: 1,
        status: 'pending'
    });

    // Bulk Send State
    const [bulkQueue, setBulkQueue] = useState<Guest[] | null>(null);
    const [currentBulkIndex, setCurrentBulkIndex] = useState(0);

    // Update Stats when guests prop changes
    useEffect(() => {
        const newStats = guests.reduce((acc, guest) => {
            acc.total++;
            acc[guest.status]++;
            return acc;
        }, { pending: 0, confirmed: 0, declined: 0, total: 0 });
        setStats(newStats);
    }, [guests]);

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
        };

        onUpdateGuests([...guests, guest]);
        setNewGuest({ name: '', email: '', phone: '', tickets: 1, status: 'pending' });
        setIsAdding(false);
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
            ["Nombre", "Email", "Teléfono", "Cupos", "Estado", "Notas"], // Header
            ...guests.map(g => [g.name, g.email || '', g.phone || '', g.tickets, g.status, g.notes || ''])
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
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
                notes: row[5] || ''
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
        const message = `Hola ${guest.name}, te invito a mi boda! Aquí tienes tu invitación personalizada y pases: ${link}`;

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

    const filteredGuests = guests.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '2rem' }}>

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F9FAFB', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #E5E7EB', flex: 1, minWidth: '200px' }}>
                    <Search size={18} color="#9CA3AF" />
                    <input
                        type="text"
                        placeholder="Buscar invitado..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
                    />
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
                                <Plus size={16} /> Agregar
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
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => setIsAdding(false)} style={{ padding: '0.5rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer', color: '#6B7280' }}>Cancelar</button>
                        <button onClick={handleAddGuest} style={{ padding: '0.5rem 1.5rem', border: 'none', background: '#4F46E5', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Guardar</button>
                    </div>
                </div>
            )}

            {/* Guest Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #E5E7EB', color: '#6B7280' }}>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Nombre</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Contacto</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>Cupos</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>Estado</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGuests.length > 0 ? (
                            filteredGuests.map(guest => (
                                <tr key={guest.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500, color: '#1F2937' }}>{guest.name}</td>
                                    <td style={{ padding: '1rem', color: '#4B5563' }}>
                                        {guest.email && <div style={{ fontSize: '0.8rem' }}>📧 {guest.email}</div>}
                                        {guest.phone && <div style={{ fontSize: '0.8rem' }}>📱 {guest.phone}</div>}
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
