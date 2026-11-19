import {useContext} from 'react';
import {AuthContext} from '../contexts/AuthContext';

export function useAuth() {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error('useAuth doit être utilisé a l interieur d un AuthProvider');
    }
    return context;
}

export default useAuth