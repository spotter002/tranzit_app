import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../css/register.css";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaXTwitter } from 'react-icons/fa6';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading('Logging in...');

    try {
      const url = 'https://tranzit.onrender.com/user/Auth/login';
      const response = await axios.post(url, { email, password });

      setLoading('');
      setSuccess('Login successful!');

      const token = response.data.token;
      const user = response.data.user;
      localStorage.setItem('token', token);

      const role = user.role.toLowerCase();
      alert(`Login successful! Redirecting to ${role}-dashboard...`);
      navigate(`/${role}-dashboard`);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed');
      setLoading('');
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`Social login with ${provider} coming soon! 🚀`);
    // Here you would integrate actual OAuth flow
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <form
        className="card shadow text-light bg-primary bg-gradient p-4 rounded-4 border-0"
        style={{ maxWidth: '400px' }}
        onSubmit={handleLogin}
      >
        <h1 className="text-center text-white fw-bold">Tranzit</h1>
        <h4 className="text-center mb-4">🔐 Login to your account</h4>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="alert alert-info">{loading}</div>}
        {success && <div className="alert alert-success">{success}</div>}

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

        {/* Social login buttons inline */}
        <div className="d-flex justify-content-center gap-3 mb-3 flex-wrap">
          <button
            type="button"
            className="btn btn-outline-light d-flex align-items-center gap-2"
            onClick={() => handleSocialLogin('Google')}
          >
            <FaGoogle /> Loggin with Google
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
  );
};

export default LoginComponent;
