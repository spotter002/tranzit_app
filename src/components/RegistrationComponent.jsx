import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterComponent = () => {
  const [role, setRole] = useState('admin');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    secretKey: '',
    vehicleType: '',
    plateNumber: '',
    licenseNumber: '',
    idNumber: '',
    companyName: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading("Registering account...");

    try {
      let url = '';
      if (role === 'driver') {
        url = 'https://tranzit.onrender.com/driver/Auth/driver/register';
      } else if (role === 'shipper') {
        url = 'https://tranzit.onrender.com/shipper/Auth/';
      } else {
        url = 'https://tranzit.onrender.com/user/Auth/register';
      }

      const response = await axios.post(url, formData);
      setLoading("");
      setSuccess("Registration successful");
      alert('Registration successful, redirecting to login page...');
      navigate('/login');
    } catch (error) {
      setLoading("");
      console.error(error.response?.data || error.message);
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className='container mt-5' style={{ maxWidth: '600px' }}>
      <form className='card shadow bg-light p-4 rounded' onSubmit={handleSubmit}>
        <h1 className='text-center text-success'>Tranzit</h1>
        <h2 className='text-center mb-4 text-success'>Register</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        {loading && <div className="alert alert-info">{loading}</div>}

        <select className="form-select mb-3" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="driver">Driver</option>
          <option value="shipper">Shipper</option>
        </select>

        <input type="text" className="form-control mb-3" name="name" placeholder="Enter name" value={formData.name} onChange={handleChange} required />
        <input type="email" className="form-control mb-3" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
        <input type="tel" className="form-control mb-3" name="phone" placeholder="Enter phone number" value={formData.phone} onChange={handleChange} required />
        <input type="password" className="form-control mb-3" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required />

        {role === 'admin' && (
          <input type="password" className="form-control mb-3" name="secretKey" placeholder="Enter secret key" value={formData.secretKey} onChange={handleChange} required />
        )}

        {role === 'driver' && (
          <>
            <input type="text" className="form-control mb-3" name="vehicleType" placeholder="Vehicle Type" value={formData.vehicleType} onChange={handleChange} required />
            <input type="text" className="form-control mb-3" name="plateNumber" placeholder="Plate Number" value={formData.plateNumber} onChange={handleChange} required />
            <input type="text" className="form-control mb-3" name="licenseNumber" placeholder="License Number" value={formData.licenseNumber} onChange={handleChange} required />
            <input type="text" className="form-control mb-3" name="idNumber" placeholder="ID Number" value={formData.idNumber} onChange={handleChange} required />
          </>
        )}

        {role === 'shipper' && (
          <input type="text" className="form-control mb-3" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required />
        )}

        <div className="d-grid mb-3">
          <button type="submit" className="btn btn-success">Register</button>
        </div>

        <div className="text-center">
          <p>Already have an account? <Link to="/login" className="text-decoration-none">Login</Link></p>
        </div>
      </form>
    </div>
  );
};

export default RegisterComponent;
