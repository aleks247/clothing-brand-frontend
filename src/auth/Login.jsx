import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { Link } from 'react-router';
import styles from './Auth.module.css'; 

export default function Login() {
    const { loginSubmitHandler } = useAuth();
    const [values, setValues] = useState({email: '', password: ''});

    const onChange = (e) => {
        setValues(state => ({...state, [e.target.name]: e.target.value}));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        loginSubmitHandler(values);
    };

    return (
        <div className={styles['container']}>
            <div className={styles['imageSection']}>
                <img 
                    src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=80" 
                    alt="Fashion Editorial" 
                    className={styles['authImage']} 
                />
                <div className={styles['imageOverlay']}></div>
            </div>

            <div className={styles['formSection']}>
                <h1 className={styles['title']}>Welcome Back</h1>
                <p className={styles['subtitle']}>Please enter your details to sign in.</p>

                <form className={styles['form']} onSubmit={onSubmit}>
                    
                    <div className={styles['inputGroup']}>
                        <label htmlFor="email" className={styles['label']}>Email</label>
                        <input 
                            id="email"
                            name="email" 
                            type="email"
                            value={values.email} 
                            onChange={onChange} 
                            placeholder="john@example.com" 
                            className={styles['input']}
                            required
                        />
                    </div>

                    <div className={styles['inputGroup']}>
                        <label htmlFor="password" className={styles['label']}>Password</label>
                        <input 
                            id="password"
                            name="password" 
                            type="password" 
                            value={values.password} 
                            onChange={onChange} 
                            placeholder="••••••••"
                            className={styles['input']}
                            required
                        />
                    </div>

                    <div className={styles['actions']}>
                        <label style={{display:'flex', gap:'8px', alignItems:'center', cursor:'pointer'}}>
                           <input type="checkbox" /> Remember me
                        </label>
                        <a href="#" className={styles['link']}>Forgot Password?</a>
                    </div>

                    <button type="submit" className={styles['submitBtn']}>
                        Sign In
                    </button>
                </form>

                <p className={styles['switchText']}>
                    Don't have an account? 
                    <Link to="/register" className={styles['switchLink']}>Create Account</Link>
                </p>
            </div>
        </div>
    );
}