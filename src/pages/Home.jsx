import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useLoader } from '../contexts/LoaderContext';

export default function Home() {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const { showLoader, hideLoader } = useLoader();

    const imgStyle = {
        width: '100%',
        height: '300px',
        objectFit: 'cover',
        display: 'block'
    };

    useEffect(() => {
        showLoader();
        api.get('/api/movies')
            .then(res => {
                setMovies(Array.isArray(res.data) ? res.data : []);
            })
            .catch(err => {
                console.error(err);
                setError('Errore durante il caricamento dei film.');
            })
            .finally(() => hideLoader());
    }, []);

    const getImageSrc = (movie) => {
        const filename = movie.image || movie.cover;
        if (!filename) return null;
        if (/^https?:\/\//i.test(filename)) return filename;
        const base = (api && api.defaults && api.defaults.baseURL) ? api.defaults.baseURL.replace(/\/$/, '') : 'http://localhost:3000';
        const imagesPath = '/images/';
        return `${base}${imagesPath}${filename.replace(/^\/+/, '')}`;
    };

    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="row">
            {movies.map(movie => (
                <div className="col-md-4 mb-4" key={movie.id}>
                    <div className="card h-100">
                        {getImageSrc(movie) && (
                            <img
                                src={getImageSrc(movie)}
                                className="card-img-top"
                                alt={movie.title}
                                style={imgStyle}
                            />
                        )}
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{movie.title}</h5>
                            {movie.director && <p className="card-text">{movie.director}</p>}
                            <div className="mt-auto">
                                <Link to={`/movie/${movie.id}`} className="btn btn-primary">Dettagli</Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
