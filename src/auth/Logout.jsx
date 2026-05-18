import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Logout() {
    const { logoutHandler } = useAuth();

    useEffect(() => {
        logoutHandler();
    }, []); 

    return null; 
}