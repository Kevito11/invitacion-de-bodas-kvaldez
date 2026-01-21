import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, X, User, Lock, Loader2 } from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const success = await login(username, password);

        if (success) {
            onClose();
            navigate('/dashboard');
        } else {
            setError('Credenciales incorrectas. Intenta de nuevo.');
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: '#fff', padding: '2.5rem', borderRadius: '20px',
                width: '90%', maxWidth: '400px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                position: 'relative',
                fontFamily: "'Lato', sans-serif"
            }} onClick={e => e.stopPropagation()}>

                <button onClick={onClose} style={{
                    position: 'absolute', top: '15px', right: '15px',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#999'
                }}>
                    <X size={24} />
                </button>

                <h2 style={{ textAlign: 'center', color: '#2D2A26', marginBottom: '2rem', fontFamily: "'Playfair Display', serif" }}>
                    Acceso Administrativo
                </h2>

                {error && (
                    <div style={{
                        padding: '0.8rem', backgroundColor: '#FEF2F2', color: '#DC2626',
                        borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4B5563', fontSize: '0.9rem' }}>Usuario</label>
                        <div style={{ position: 'relative' }}>
                            <User size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{
                                    width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.8rem',
                                    border: '1px solid #E5E7EB', borderRadius: '10px',
                                    fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="Usuario"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4B5563', fontSize: '0.9rem' }}>Contraseña</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.8rem',
                                    border: '1px solid #E5E7EB', borderRadius: '10px',
                                    fontSize: '1rem', outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} style={{
                        width: '100%', padding: '1rem',
                        backgroundColor: '#D4AF37', color: '#fff',
                        border: 'none', borderRadius: '10px',
                        fontSize: '1rem', fontWeight: 600,
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.7 : 1,
                        transition: 'background-color 0.2s',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
                    }}>
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <>Entrar <ArrowRight size={20} /></>
                        )}
                    </button>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
                        Acceso exclusivo para administradores.
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
