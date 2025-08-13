import React, { useState, useEffect,useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../css/register.css";
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa6';
import { AuthContext } from '../context/AuthContext'; // adjust path



const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const [success, setSuccess] = useState('');
  const { setToken, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading('Logging in...');

    
    try {
      

      const url = 'https://tranzit.onrender.com/user/Auth/login';
      const response = await axios.post(url, { email, password });

      const token = response?.data?.token || '';
      const user = response?.data?.user || null;

      if (!token || !user) {
        console.error("Unexpected login response:", response.data);
        throw new Error('Malformed response from server');
      }

      console.log('Token:', token);
      console.log('User:', user);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);

      await checkWalletAndRedirect(user);



      setSuccess('Login successful!');
      setLoading('');

      // Perform wallet check & redirect after successful login
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading('');
    }
  };

  const checkWalletAndRedirect = async (user) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("No auth token found");

    const res = await axios.get(
      'https://tranzit.onrender.com/transaction/Auth/get-wallet',
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const wallet = res.data.wallet || res.data;

    // Admin shortcut
    if (user.isAdmin || user.role?.toLowerCase() === 'admin') {
      navigate('/admin-dashboard');
      return;
    }

    // If wallet exists
    if (wallet && wallet.name) {
      const role = user.role?.toLowerCase() || 'user';
      navigate(`/${role}-dashboard`);
    } else {
      // No wallet, go to create wallet page
      navigate('/create-wallet');
    }

  } catch (err) {
    console.error('Wallet check failed:', err);
    navigate('/create-wallet'); // fallback
  }
};


  const handleSocialLogin = (provider) => {
    alert(`Social login with ${provider} coming soon! 🚀`);
  };

  useEffect(() => {
    let timer;
    if (error || success) {
      timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [error, success]);

  return (
    <div className="auth-background">
      <div className="container mt-5 d-flex justify-content-center">
        <form
          className="card shadow text-light bg-primary bg-gradient p-4 rounded-4 border-0"
          style={{ maxWidth: '400px' }}
          onSubmit={handleLogin}
        >
          <h1 className="text-center text-white fw-bold">Tranzit</h1>
          <h4 className="text-center mb-4">🔐 Login to your account</h4>

          {loading && !error && !success && (
            <div className="alert alert-info">{loading}</div>
          )}

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {success && (
            <div className="alert alert-success">{success}</div>
          )}

          <div className="mb-3 input-group">
            <span className="input-group-text">📧</span>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 input-group">
            <span className="input-group-text">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-light"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="d-grid gap-2 mb-3">
            <button type="submit" className="btn btn-light text-primary fw-bold">
              Login
            </button>
          </div>

          {/* Social login buttons */}
          <div className="d-flex justify-content-center gap-3 mb-3 flex-wrap">
            <button
              type="button"
              className="btn btn-outline-light d-flex align-items-center gap-2"
              onClick={() => handleSocialLogin('Google')}
            >
              <FaGoogle /> Login with Google
            </button>
          </div>

          <div className="text-center">
            <p className="text-white">
              Don't have an account?{' '}
              <Link to="/register" className="text-warning text-decoration-none fw-bold">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
