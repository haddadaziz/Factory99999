export function LoadingSpinner({message ='Chargement des données...'}) {
    return (
        <div className="loading-state">
            <div className="spinner">
                <p className="loading-text">{message}</p>
            </div>
        </div>
    )
}

export default LoadingSpinner;