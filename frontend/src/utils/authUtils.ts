// frontend/src/utils/authUtils.ts
import { toast } from 'react-hot-toast';

export const forceLogout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('jwt_token');
  // Add other local storage items to clear if necessary
  window.location.href = '/login?sessionExpired=true'; // Direct redirect
  toast.error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
};
