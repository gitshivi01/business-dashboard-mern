import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isLoggedIn, loginUser } from '../services/api';
import '../styles/login.css';
 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
    <div className="auth-container">
  <h2 className="auth-title">Login</h2>

  {error && <div className="auth-error">{error}</div>}

  <form onSubmit={handleSubmit}>
    <div className="auth-group">
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>

    <div className="auth-group">
      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>

    <button type="submit" disabled={loading} className="auth-btn">
      {loading ? 'Logging in...' : 'Login'}
    </button>
  </form>

  <p className="auth-footer">
    Don't have an account? <Link to="/register">Register</Link>
  </p>
</div>
</div>
  );
}

export default Login;
