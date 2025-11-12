import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { LoaderProvider } from './contexts/LoaderContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';

export default function App() {
  return (
    <BrowserRouter>
      <LoaderProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="movie/:id" element={<MovieDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </LoaderProvider>
    </BrowserRouter>
  );
}
