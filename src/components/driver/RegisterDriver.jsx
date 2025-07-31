import React, { useState } from 'react';
import axios from 'axios';

const RegisterDriver = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    vehicleType: '',
    plateNumber: '',
    licenseNumber: '',
    idNumber: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading('Registering driver...');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://tranzit.onrender.com/driver/Auth/driver/register',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      setLoading('');
      setSuccess('Driver registered successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        vehicleType: '',
        plateNumber: '',
        licenseNumber: '',
        idNumber: ''
      });
    } catch (err) {
      setLoading('');
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to register driver');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <div className="card shadow p-4 bg-light">
        <h3 className="text-center text-success mb-3">Register Driver</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        {loading && <div className="alert alert-info">{loading}</div>}

        <form onSubmit={handleSubmit}>
          <input type="text" name="name" className="form-control mb-3" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" className="form-control mb-3" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="tel" name="phone" className="form-control mb-3" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
          <input type="password" name="password" className="form-control mb-3" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input type="text" name="vehicleType" className="form-control mb-3" placeholder="Vehicle Type" value={formData.vehicleType} onChange={handleChange} required />
          <input type="text" name="plateNumber" className="form-control mb-3" placeholder="Plate Number" value={formData.plateNumber} onChange={handleChange} required />
          <input type="text" name="licenseNumber" className="form-control mb-3" placeholder="License Number" value={formData.licenseNumber} onChange={handleChange} required />
          <input type="text" name="idNumber" className="form-control mb-3" placeholder="ID Number" value={formData.idNumber} onChange={handleChange} required />

          <div className="d-grid">
            <button className="btn btn-success" type="submit">Register Driver</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterDriver;
