import { useState, useEffect } from 'react';
import materialService from '../services/materialService';
import { RAW_MATERIAL_UNITS } from '../constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

export function MaterialsPage() {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [reference, setReference] = useState('');
    const [name, setName] = useState('');
    const [unit, setUnit] = useState(RAW_MATERIAL_UNITS[0]);
    const [currentStock, setCurrentStock] = useState(0);
    const [alertTreshold, setAlertTreshold] = useState(10);
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchMaterials = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await materialService.getAll();
            setMaterials(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!reference.trim() || !name.trim()) {
            setFormError('La référence et le nom sont obligatoires');
            return;
        }

        try {
            setIsSubmitting(true);
            await materialService.create({
                reference: reference.toUpperCase().trim(),
                name: name.trim(),
                unit,
                currentStock: Number(currentStock),
                alertTreshold: Number(alertTreshold),
            });

            setReference('');
            setName('');
            setCurrentStock(0);
            setAlertTreshold(10);
            setShowForm(false);

            await fetchMaterials();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, matName) => {
        const confirmation = window.confirm(`Voulez-vous vraiment supprimer "${matName}" ?`);
        if (!confirmation) return;

        try {
            await materialService.delete(id);
            await fetchMaterials();
        } catch (err) {
            alert(`Erreur de suppression : ${err.message}`);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">
                    Gestion des matières premières
                </h1>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    {showForm ? 'Annuler' : 'Ajouter une Matière'}
                </button>
            </div>

            {showForm && (
                <div className="card form-card">
                    <h2 className="card-title">
                        Ajouter une Matière Première
                    </h2>

                    {formError && (
                        <div className="alert alert-danger" role="alert">
                            {formError}
                        </div>
                    )}

                    <form onSubmit={handleCreate}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="ref" className="form-label">
                                    Reference
                                </label>
                                <input id="ref" type="text" className="form-input" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="ex: MAT-ACIER" required>
                                </input>
                            </div>

                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Nom :</label>
                                <input
                                    id="name"
                                    type="text"
                                    className="form-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="ex: Acier Inoxydable 316L"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="unit" className="form-label">
                                    Unité :
                                </label>
                                <select id="unit" className="form-select" value={unit} onChange={(e) => setUnit(e.target.value)}>
                                    {RAW_MATERIAL_UNITS.map((u) => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="stock" className="form-label">Stock initial :</label>
                                <input id="stock" type="number" min="0" step="any" className="form-input" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} required>
                                </input>
                            </div>

                            <div className="form-group">
                                <label htmlFor="threshold" className="form-label">
                                    {"Seuil d'alerte :"}
                                </label>
                                <input id="threshold" type="number" min="0" step="any" className="form-input" value={alertTreshold} onChange={(e) => setAlertTreshold(e.target.value)} required>
                                </input>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                                {isSubmitting ? 'Enregistrement...' : 'Enregistrer la matière'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading && <LoadingSpinner message="Récupération des stocks..." />}

            {error && !loading && (
                <ErrorMessage message={error} onRetry={fetchMaterials} />
            )}
            {!loading && !error && materials.length === 0 && (
                <EmptyState title="Aucune matière première" description="Cliquez sur 'Nouvelle Matiere' pour initialiser le stock">
                </EmptyState>
            )}
            {!loading && !error && materials.length > 0 && (
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Référence</th>
                                <th>Désignation</th>
                                <th>Stock Actuel</th>
                                <th>{"Seuil d'Alerte"}</th>
                                <th>Etat du Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map((mat) => {
                                const isLow = mat.currentStock <= mat.alertTreshold;
                                return (
                                    <tr key={mat.id} className={isLow ? 'row-alert' : ''}>
                                        <td><strong>{mat.reference}</strong></td>
                                        <td>{mat.name}</td>
                                        <td>{mat.currentStock} {mat.unit}</td>
                                        <td>
                                            <span className={isLow ? 'badge badge-danger' : 'badge badge-success'}>
                                                {isLow ? 'Seuil Critique' : 'Normal'}
                                            </span>
                                        </td>
                                        <td>
                                            <button onClick={() => handleDelete(mat._id, mat.name)} className="btn btn-danger btn-sm">
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default MaterialsPage;