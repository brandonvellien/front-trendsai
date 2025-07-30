// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Center, Loader } from '@mantine/core';

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Affiche un loader pendant la vérification de l'état de connexion
    return <Center style={{ height: '100vh' }}><Loader /></Center>;
  }

  if (!user) {
    // Si pas d'utilisateur, redirige vers la page de connexion
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est connecté, affiche la page demandée
  return <Outlet />;
}