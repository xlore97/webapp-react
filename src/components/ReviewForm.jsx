import React, { useState } from 'react';
import api from '../services/api';
import { useLoader } from '../contexts/LoaderContext';

export default function ReviewForm({ movieId, onReviewAdded }) {
    const [formData, setFormData] = useState({ name: '', vote: 5, text: '' });
    const [error, setError] = useState(null);
    const { showLoader, hideLoader } = useLoader();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        showLoader();
        setError(null);

        const payload = {
            movie_id: movieId,
            name: formData.name.trim(),
            vote: parseInt(formData.vote, 10),
            text: formData.text.trim()
        };

        console.log('Invio recensione:', payload);

        api.post('/api/movies/reviews', payload)
            .then(res => {
                console.log('Recensione salvata:', res.data);
                if (onReviewAdded) onReviewAdded(res.data);
                setFormData({ name: '', vote: 5, text: '' });
            })
            .catch(err => {
                console.error('Errore completo:', err);
                console.error('Response data:', err.response?.data);
                console.error('Status code:', err.response?.status);

                const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Errore durante il salvataggio della recensione.';
                setError(errorMsg);
            })
            .finally(() => hideLoader());
    };

    return (
        <div className="card mt-4">
            <div className="card-body">
                <h5 className="card-title">Aggiungi una recensione</h5>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nome</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="vote" className="form-label">Voto (1-5)</label>
                        <select
                            className="form-select"
                            id="vote"
                            name="vote"
                            value={formData.vote}
                            onChange={handleChange}
                            required
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="text" className="form-label">Recensione</label>
                        <textarea
                            className="form-control"
                            id="text"
                            name="text"
                            rows="4"
                            value={formData.text}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Invia recensione
                    </button>
                </form>
            </div>
        </div>
    );
}
