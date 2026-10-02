
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function LoginPage() {
    const navigate = useNavigate();

    const [rollnum, setRollnum] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage('');
        setLoading(true);

        try {
            const response = await fetch(
                API_URL + '/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        rollnum: Number(rollnum),
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || 'Login failed');
                return;
            }

            localStorage.setItem(
                'token',
                data.data.token
            );

            localStorage.setItem(
                'user',
                JSON.stringify({
                    id: data.data.id,
                    name: data.data.name,
                    rollnum: data.data.rollnum,
                    role: data.data.role
                })
            );

            navigate('/');
        } catch (error) {
            console.error(error);
            setMessage('Unable to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.loginCard}>

                <div style={styles.header}>
                    <h1 style={styles.title}>
                        Welcome Back
                    </h1>

                    <p style={styles.subtitle}>
                        Login to your Blog Website
                    </p>
                </div>

                <form onSubmit={handleLogin}>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Roll Number
                        </label>

                        <input
                            type="number"
                            value={rollnum}
                            onChange={(e) => setRollnum(e.target.value)}
                            placeholder="Enter your roll number"
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            style={styles.input}
                        />
                    </div>

                    {message && (
                        <div style={styles.error}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.button,
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                </form>

                <div style={styles.footer}>
                    <span>
                        Don't have an account?
                    </span>

                    <Link
                        to="/users"
                        style={styles.link}
                    >
                        Register
                    </Link>
                </div>

            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
        background: '#f4f7fb',
        boxSizing: 'border-box'
    },

    loginCard: {
        width: '100%',
        maxWidth: '420px',
        background: '#ffffff',
        padding: '40px',
        borderRadius: '14px',
        boxShadow: '0 10px 35px rgba(0, 0, 0, 0.10)',
        boxSizing: 'border-box'
    },

    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },

    title: {
        margin: '0 0 8px',
        fontSize: '32px',
        fontWeight: '700',
        color: '#1f2937'
    },

    subtitle: {
        margin: 0,
        fontSize: '15px',
        color: '#6b7280'
    },

    field: {
        marginBottom: '20px'
    },

    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151'
    },

    input: {
        width: '100%',
        height: '46px',
        padding: '0 13px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
        background: '#ffffff'
    },

    button: {
        width: '100%',
        height: '46px',
        marginTop: '5px',
        border: 'none',
        borderRadius: '8px',
        background: '#2563eb',
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer'
    },

    error: {
        padding: '11px 13px',
        marginBottom: '15px',
        borderRadius: '7px',
        background: '#fee2e2',
        color: '#b91c1c',
        fontSize: '14px'
    },

    footer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '6px',
        marginTop: '25px',
        fontSize: '14px',
        color: '#6b7280'
    },

    link: {
        color: '#2563eb',
        textDecoration: 'none',
        fontWeight: '600'
    }
};

export default LoginPage;
