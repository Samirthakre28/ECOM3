import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            navigate('/shop');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="container">
            <div className="auth-container animate-fade-in" style={{ maxWidth: '450px', margin: '150px auto' }}>
                <h2 style={{textAlign: 'center', marginBottom: '30px', fontSize: '2rem'}}>Welcome Back</h2>
                {error && <div style={{color: '#ef4444', marginBottom: '20px', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px'}}>{error}</div>}
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
                    </div>
                    <div className="form-group" style={{marginBottom: '30px'}}>
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{width: '100%', fontSize: '1.1rem'}}>Sign In</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
