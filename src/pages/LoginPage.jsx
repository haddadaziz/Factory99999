import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../constants'

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        setIsSubmitting(true);

        try {
            const user = await login(email, password);

            if (user.role === ROLES.ADMIN) {
                navigate('/admin');
            } else {
                navigate('/operator')
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2 className="login-title">
                    FactoryFlow - Connexion                </h2>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email :
                        </label>
                        <input id="email" type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ex: admin@factoryflow.com" disabled={isSubmitting}>
                        </input>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="formlabel">
                            Mot de passe :
                        </label>
                        <input id="password" type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" disabled={isSubmitting}></input>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                        {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    );

}

export default LoginPage;