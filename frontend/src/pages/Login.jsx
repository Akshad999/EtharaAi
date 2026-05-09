import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card auth-card fade-in">
        <div className="auth-header">
          <div className="auth-icon">
            <LogIn size={32} color="var(--primary)" />
          </div>
          <h1>Welcome Back</h1>
          <p>Login to manage your team tasks</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }
        .auth-card {
          width: 100%;
          max-width: 420px;
          padding: 40px;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .auth-icon {
          width: 64px;
          height: 64px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .auth-header h1 {
          font-size: 1.75rem;
          margin-bottom: 8px;
        }
        .auth-header p {
          color: var(--text-muted);
        }
        .btn-block {
          width: 100%;
          justify-content: center;
          margin-top: 10px;
        }
        .auth-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 0.9rem;
        }
        .auth-footer a {
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
        }
        .error-msg {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--error);
          color: var(--error);
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
};

export default Login;
