import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, ArrowRight } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const success = await login(username, password);
            if (success) {
                navigate('/dashboard');
            } else {
                setError('Credenciales incorrectas');
            }
        } catch (err) {
            setError('Ocurrió un error. Inténtalo de nuevo.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FAFAF9',
            fontFamily: "'Lato', sans-serif"
        }}>
            <div style={{
                backgroundColor: '#fff',
                padding: '3rem',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <Heart fill="#D4AF37" color="#D4AF37" size={32} />
                </div>

                <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '2rem',
                    color: '#2D2A26',
                    marginBottom: '0.5rem'
                }}>
                    Admin Access
                </h2>

                <p style={{ color: '#666', marginBottom: '2rem' }}>
                    Ingresa con tus credenciales de administrador
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '1rem',
                            backgroundColor: '#FAFAF9',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '1rem',
                            backgroundColor: '#FAFAF9',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    />

                    {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#2D2A26',
                            color: '#fff',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            marginTop: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        Iniciar Sesión <ArrowRight size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
