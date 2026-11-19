import {useNavigate} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import {ROLES} from '../constants';

export function UnauthorizedPage() {
    const navigate = useNavigate();
    const {role} = useAuth();

    const handleReturn = () =>{
        if(role === ROLES.ADMIN) {
            navigate('/admin');
        }else{
            navigate('/operator')
        }
    };

    return (
        <div className="unauthorized-page">
            <div className="unauthorized-card">
                <h1 className="unauthorized-title">
                    403 - Acces Refusé
                </h1>
                <p className="unauthorized-message">
                    Vos droits d accès atuels ({role}) ne vous permettent pas d acceder a cette ressource
                </p>
                <button onClick={handleReturn} className="btn btn-primary">
                    Retourner à mon epace
                </button>
            </div>
        </div>
    );
}

export default UnauthorizedPage;