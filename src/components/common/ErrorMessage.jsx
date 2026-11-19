export function ErrorMessage({message,onRetry}) {
    return (
        <div className="alert alert-danger" role="alert">
            <p className="error-text">{message}</p>
            {onRetry && (
                <button onClick={onRetry} className="btn btn-secondary">
                    Réessayer
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;