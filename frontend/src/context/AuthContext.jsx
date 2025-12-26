import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const response = await fetch('/auth/me');
            if (response.ok) {
                const data = await response.json();
                if (data.authenticated) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            }
        } catch (error) {
            console.error('Failed to fetch user status', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, checkUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
