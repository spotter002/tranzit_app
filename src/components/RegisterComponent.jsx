import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../css/register.css";
import { FaEye, FaEyeSlash, FaBolt, FaGoogle } from 'react-icons/fa6';

const RegisterComponent = () => {
  const [role, setRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    secretKey: '',
    vehicleType: '',
    vehicleDetails: {
      plateNumber: '',
      capacityKg: '',
      model: '',
    },
    licenseNumber: '',
    idNumber: '',
    companyName: ''
  });

  // Handle nested and flat input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('vehicleDetails.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        vehicleDetails: {
          ...prev.vehicleDetails,
          [key]: value,
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    const newPassword = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setFormData(prev => ({ ...prev, password: newPassword }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (role === 'admin') {
        response = await axios.post(
          'https://tranzit.onrender.com/user/Auth/register',
          formData
        );
      } else if (role === 'driver') {
        // Shape payload exactly as backend expects it
        const payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          vehicleType: formData.vehicleType,
          vehicleDetails: {
            plateNumber: formData.vehicleDetails.plateNumber,
            capacityKg: formData.vehicleDetails.capacityKg,
            model: formData.vehicleDetails.model,
          },
          licenseNumber: formData.licenseNumber,
          idNumber: formData.idNumber,
          isPremium: false, // default, or extend form to include
        };
        response = await axios.post(
          'https://tranzit.onrender.com/driver/Auth/driver/register',
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );
      } else if (role === 'shipper') {
        const payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          companyName: formData.companyName,
        };
        response = await axios.post(
          'https://tranzit.onrender.com/shipper/Auth',
          payload
        );
      }

      alert('Registration successful. Redirecting to login...');
      navigate('/login');
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-background">
      <div className='container mt-5' style={{ maxWidth: '400px' }}>
        <form className='card shadow text-light bg-primary bg-gradient p-4 rounded-4 border-0' onSubmit={handleSubmit}>
          <h1 className='text-center text-white fw-bold'>TRANZIT LOGISTICS</h1>
          <h4 className='text-center mb-4'>🚀 Register your account</h4>

          <select className="form-select mb-3" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="driver">Driver</option>
            <option value="shipper">Shipper</option>
          </select>

          <div className="mb-3 input-group">
            <span className="input-group-text">👤</span>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 input-group">
            <span className="input-group-text">📧</span>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 input-group">
            <span className="input-group-text">📞</span>
            <input
              type="tel"
              className="form-control"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {(role === 'driver' || role === 'admin') && (
            <div className="mb-3 input-group">
              <span className="input-group-text">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <button
                type="button"
                className="btn btn-outline-warning"
                onClick={generatePassword}
              >
                <FaBolt /> Generate
              </button>
            </div>
          )}

          {role === 'admin' && (
            <div className="mb-3 input-group">
              <span className="input-group-text">🗝️</span>
              <input
                type="password"
                className="form-control"
                name="secretKey"
                placeholder="Enter secret key"
                value={formData.secretKey}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {role === 'driver' && (
            <>
              <select
                className="form-select mb-3"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Vehicle Type</option>
                {['boda', 'car', 'van', 'tuktuk', 'pickup', 'truck'].map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>

              <input
                type="text"
                className="form-control mb-3"
                name="vehicleDetails.plateNumber"
                placeholder="Plate Number"
                value={formData.vehicleDetails.plateNumber}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                className="form-control mb-3"
                name="vehicleDetails.capacityKg"
                placeholder="Capacity (Kg)"
                value={formData.vehicleDetails.capacityKg}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                className="form-control mb-3"
                name="vehicleDetails.model"
                placeholder="Vehicle Model"
                value={formData.vehicleDetails.model}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                className="form-control mb-3"
                name="licenseNumber"
                placeholder="License Number"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                className="form-control mb-3"
                name="idNumber"
                placeholder="ID Number"
                value={formData.idNumber}
                onChange={handleChange}
                required
              />
            </>
          )}

          {role === 'shipper' && (
            <input
              type="text"
              className="form-control mb-3"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          )}

          <div className="d-grid gap-2 mb-3">
            <button type="submit" className="btn btn-light text-primary fw-bold">Register</button>
          </div>

          <div className="d-flex justify-content-center gap-3 mb-3 flex-wrap">
            <button type="button" className="btn btn-outline-light d-flex align-items-center gap-2">
              <FaGoogle /> Register with Google
            </button>
          </div>

          <div className="text-center">
            <p className="text-white">
              Already have an account? <Link to="/login" className="text-warning text-decoration-none fw-bold">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterComponent;
