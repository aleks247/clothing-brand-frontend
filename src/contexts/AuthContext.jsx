import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import * as request from '../utils/request';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // const [auth, setAuth] = useState(null);
    const navigate = useNavigate();

    const [auth, setAuth] = useState(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return null;
        return {
            accessToken,
            email: localStorage.getItem('email'),
            _id: localStorage.getItem('_id'),
            username: localStorage.getItem('username'),
            role: localStorage.getItem('role')
        };
    });


    const loginSubmitHandler = async (values) => {
        try {
            const result = await request.post('http://localhost:3030/users/login', values);

            setAuth(result);
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('email', result.email);
            localStorage.setItem('username', result.username);
            localStorage.setItem('role', result.role);
            localStorage.setItem('_id', result._id);

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
            const result = await request.post('http://localhost:3030/users/register', values);

            setAuth(result);
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('email', result.email);
            localStorage.setItem('username', result.username);
            localStorage.setItem('role', result.role);
            localStorage.setItem('_id', result._id);

            navigate('/');
        } catch (error) {
            alert(error.message);
        }
    };

    const logoutHandler = async () => {
        try {
            await request.get('http://localhost:3030/users/logout');
        } catch (error) {
            console.log(error);
        }
        
        setAuth(null);
        localStorage.clear();
        navigate('/');
    };

    const userUpdate = (data) => {
        setAuth(state => {
            const newState = { ...state, ...data };
            
            if (data.email) localStorage.setItem('email', data.email);
            if (data.username) localStorage.setItem('username', data.username);
            
            return newState;
        });
    };

    const values = {
        loginSubmitHandler,
        registerSubmitHandler,
        logoutHandler,
        userUpdate,
        user: auth,
        userId: auth?._id,
        email: auth?.email,
        isAuthenticated: !!auth?.accessToken,
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
};
    
export const useAuth = () => {
    return useContext(AuthContext);
};