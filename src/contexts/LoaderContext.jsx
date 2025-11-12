import React, { createContext, useContext, useState } from 'react';

const LoaderContext = createContext();

export function useLoader() {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoader deve essere usato all\'interno di LoaderProvider');
    }
    return context;
}

export function LoaderProvider({ children }) {
    const [loading, setLoading] = useState(false);

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    return (
        <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
            {children}
        </LoaderContext.Provider>
    );
}
