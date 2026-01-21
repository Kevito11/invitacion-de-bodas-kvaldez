import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Cargando...</div>; // O un spinner elegante
    }

    if (!user) {
        // Redirigir a la landing con indicador para abrir el modal
        return <Navigate to="/" state={{ showLogin: true }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
