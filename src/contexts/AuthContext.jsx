import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [auth, setAuth] = useState(() => {
        const savedAuth = localStorage.getItem('auth');
        return savedAuth ? JSON.parse(savedAuth) : null;
    });

    const loginSubmitHandler = async (values) => {
        try {
            const response = await fetch('http://localhost:8081/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message || 'Login failed');

            const authData = {
                accessToken: result.token,
                email: result.email,
                username: result.username,
                role: result.role,
                _id: result.userId
            };

            setAuth(authData);
            localStorage.setItem('auth', JSON.stringify(authData));
            navigate('/');
        } catch (error) {
            alert(error.message);
        }
    };

    const registerSubmitHandler = async (values) => {
        if (values.password !== values.confirmPassword) {
            return alert("Passwords don't match!");
        }

        try {
            const response = await fetch('http://localhost:8081/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: values.email,
                    username: values.username,
                    password: values.password
                }),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message || 'Registration failed');

            const authData = {
                accessToken: result.token,
                email: values.email,
                username: values.username,
                role: 'USER',
                _id: result.userId
            };

            setAuth(authData);
            localStorage.setItem('auth', JSON.stringify(authData));
            navigate('/');
        } catch (error) {
            alert(error.message);
        }
    };

    const logoutHandler = async () => {
        setAuth(null);
        localStorage.removeItem('auth');
        navigate('/');
    };

    const values = {
        loginSubmitHandler,
        registerSubmitHandler,
        logoutHandler,
        user: auth,
        isAuthenticated: !!auth?.accessToken,
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);