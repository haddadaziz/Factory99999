import { useState, useEffect } from 'react';
import productService from '../services/productService';
import materialService from '../services/materialService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

export function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [availableMaterials, setAvailableMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [reference, setReference] = useState('');
    const [name, setName] = useState('');

    const [composition, setComposition] = useState([]);
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [prodsData, matsData] = await Promise.all([
                productService.getAll(),
                materialService.getAll(),
            ]);
            setProducts(prodsData);
            setAvailableMaterials(matsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [])

    const handleAddIngredient = () => {
        if (availableMaterials.length === 0) {
            alert('Veuillez d abord enregistrer des matieres premieres dans le catalogue');
            return;
        }

        setComposition([
            ...composition, { materialId: availableMaterials[0]._id, quantity: 1 }
        ]);
    };

    const handleRemoveIngredient = (indexToRemove) => {
        setComposition(composition.filter((_, idx) => idx !== indexToRemove));
    };

    const handleIngredientChange = (index, field, value) => {
        setComposition(
            composition.map((item, idx) => {
                if (idx !== index) return item;

                return {
                    ...item,
                    [field]: field === 'quantity' ? Math.max(0.001, Number(value)) : value,
                };
            })
        );
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!reference.trim() || !name.trim()) {
            setFormError('La référence et le nom du produit sont obligatoire');
            return;
        }

        if (composition.length === 0) {
            setFormError('La recette doit comporter au moins une matiere premiere');
            return;
        }

        const materialIds = composition.map((item) => item.materialId);
        const hasDuplicates = new Set(materialIds).size !== materialIds.length;

        if (hasDuplicates) {
            setFormError('Une matière premiere ne peut pas apparaitre plusieurs fois dans la meme recette');
            return;
        }

        try {
            setIsSubmitting(true);
            await productService.create({
                reference: reference.toUpperCase().trim(),
                name: name.trim(),
                composition,
            });

            setReference('');
            setName('');
            setComposition([]);
            setShowForm(false);
            await fetchData();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, prodName) => {
        const confirmation = window.confirm(`Voulez vous vraiment supprimer le produit ${prodName} ?`);
        if (!confirmation) return;

        try {
            await productService.delete(id);
            await fetchData();
        } catch (err) {
            alert(`Erreur : ${err.message}`)
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">
                    Catalogue des Produits Finis
                </h1>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    {showForm ? 'Annuler' : 'Nouveau Produit'}
                </button>
            </div>

            {showForm && (
                <div className="card form-card">
                    <h2 className="card-title">
                        Définir un nouveau produit
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
                                    Reference :
                                </label>
                                <input id="ref" type="text" className="form-input" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="ex: PROD-CHAISE" required>
                                </input>
                            </div>

                            <div className="form-group">
                                <label htmlFor="name" className="form-label">
                                    Désignation Du produit
                                </label>
                                <input id="name" type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="ex: Chaise Standard Safi" required>
                                </input>
                            </div>
                        </div>

                        <div className="recipe-section">
                            <div className="recipe-header">
                                <h3>Recette de Facbrication</h3>
                                <button type="button" onClick={handleAddIngredient} className="btn btn-secondary btn-sm">
                                    Ajouter un ingrédient
                                </button>
                            </div>

                            {composition.length === 0 ? (
                                <p className="hint-text">
                                    {"Aucun ingrédient défini. Cliquez sur ajouter un ingrédient pour ajouter"}
                                </p>
                            ) : (
                                <div className="composition-list">
                                    {composition.map((item, index) => (
                                        <div key={index} className="composition-row">
                                            <div className="form-group flex-1">
                                                <label className="form-label">
                                                    Matière première :
                                                </label>
                                                <select className="form-select" value={item.materialId} onChange={(e) => handleIngredientChange(index, 'materialId', e.target.value)}>
                                                    {availableMaterials.map((mat) => (
                                                        <option key={mat._id} value={mat._id}>
                                                            {mat.name} ({mat.reference}) - Unité : {mat.unit}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group flex-1">
                                                <label className="form-label">
                                                    Quantité requise :
                                                </label>
                                                <input type="number" min="0.001" step="any" className="form-input" value={item.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} required>
                                                </input>
                                            </div>

                                            <button type="button" onClick={() => handleRemoveIngredient(index)} className="btn btn-danger btn-sm align-end">
                                                Retirer
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                                {isSubmitting ? 'Enregistrement...' : 'Enregistrer le produit'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading && <LoadingSpinner message="Chargement des produits et recettes..." />}

            {error && !loading && (
                <ErrorMessage message={error} onRetry={fetchData} />
            )}

            {!loading && !error && products.length === 0 && (
                <EmptyState title="Aucun produit enregistré" description="Créer votre premier produit pour pouvoir lancer des ordres de fabrication" />
            )}

            {!loading && !error && products.length > 0 && (
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Reference</th>
                                <th>Designation</th>
                                <th>Recette / Composition</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((prod) => (
                                <tr key={prod._id}>
                                    <td><strong>{prod.reference}</strong></td>
                                    <td>
                                        <ul className="recipe-tag-list">
                                            {prod.composition.map((comp, idx) => (
                                                <li key={idx}>
                                                    {comp.materialId?.name || 'Matière'} : {comp.quantity} {comp.materialId?.unit || ''}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>
                                        <button onClick={() => handleDelete(prod._id,prod.name)} className="btn btn-danger btn-sm">
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default ProductsPage;