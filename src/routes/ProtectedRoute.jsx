import {Navigate,Outlet} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';

export function ProtectedRoute({allowedRoles}) {
    const {isAuthenticated,role,loading} = useAuth();

    if(loading) {
        return (
            <div className="loading-container">
                <p className="loading-container">Vérification de l authentification...</p>
            </div>
        );
    }

    if(!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    if (allowedRoles && !allowedRoles.includes(role)){
        return <Navigate to="/unauthorized replace"/>
    }

    return <Outlet/>;
}

export default ProtectedRoute;