export function EmptyState({title='Aucune donnée trouvée', description}) {
    return (
        <div className="empty-state">
            <p className="empty-title">{title}</p>
            {description && <p className="empty-description">{description}</p>}
        </div>
    );
}

export default EmptyState;