import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        api.get(`/api/movies/${id}`)
            .then(res => setMovie(res.data))
            .catch(err => {
                console.error(err);
                setError('Errore durante il caricamento del film.');
            })
            .finally(() => setLoading(false));
    }, [id]);

    const getImageSrc = (item) => {
        const filename = item && (item.image || item.cover);
        if (!filename) return null;
        if (/^https?:\/\//i.test(filename)) return filename;
        const base = (api && api.defaults && api.defaults.baseURL) ? api.defaults.baseURL.replace(/\/$/, '') : 'http://localhost:3000';
        const imagesPath = '/images/';
        return `${base}${imagesPath}${String(filename).replace(/^\/+/, '')}`;
    };

    const imgStyle = {
        width: '100%',
        height: '600px',
        objectFit: 'cover',
        display: 'block'
    };

    if (loading) return <div>Caricamento...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!movie) return (
        <div>
            <p>Film non trovato.</p>
            <Link to="/" className="btn btn-secondary">Torna alla home</Link>
        </div>
    );

    return (
        <div className="row">
            <div className="col-md-4">
                {getImageSrc(movie) && (
                    <img src={getImageSrc(movie)} alt={movie.title} className="img-fluid" style={imgStyle} />
                )}
            </div>
            <div className="col-md-8">
                <h2>{movie.title}</h2>
                <p><strong>Regista:</strong> {movie.director || 'N/A'}</p>
                <p><strong>Genere:</strong> {movie.genre || 'N/A'}</p>
                <p><strong>Anno:</strong> {movie.release_year || 'N/A'}</p>
                <p>{movie.abstract || 'Nessuna descrizione disponibile.'}</p>

                <h4 className="mt-4">Recensioni</h4>
                {Array.isArray(movie.reviews) && movie.reviews.length > 0 ? (
                    movie.reviews.map(r => (
                        <div key={r.id} className="card mb-2">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <strong>{r.name}</strong>
                                    <span className="badge bg-primary">{r.vote}/5</span>
                                </div>
                                <p className="mb-0">{r.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nessuna recensione disponibile.</p>
                )}

                <Link to="/" className="btn btn-secondary mt-3">Torna alla home</Link>
            </div>
        </div>
    );
}
