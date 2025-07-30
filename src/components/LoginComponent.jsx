import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    const response = await axios.post(url, {email,password });

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

  return (
    <div className='container mt-5' style={{ maxWidth: '600px' }}>
      <form className='card shadow bg-light p-4 rounded' onSubmit={handleLogin}>
        <h1 className='text-center text-success'>Tranzit</h1>
        <h2 className='text-center mb-4 text-success'>Login</h2>

        {error ? <div className="alert alert-danger">{error}</div> : null}
        {loading ? <div className="alert alert-info">{loading}</div> : null}
        {success ? <div className="alert alert-success">{success}</div> : null}

        <input type="email" className="form-control mb-3" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="form-control mb-3" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <div className="d-grid mb-3">
          <button type="submit" className="btn btn-success">Login</button>
        </div>

        <div className="text-center">
          <p>Don't have an account? <Link to="/register" className="text-decoration-none">Register</Link></p>
        </div>
      </form>
    </div>
  );
};

export default LoginComponent;
