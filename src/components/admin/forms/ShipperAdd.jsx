import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const ShipperAdd = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: ''
  });

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      toast.info('Adding shipper...');
      await axios.post('https://tranzit.onrender.com/shipper/Auth', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.dismiss();
      toast.success('Shipper added');
      navigate('/admin-dashboard/shippers');
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || 'Add failed');
    }
  };

  return (
    <div className="container">
      <ToastContainer />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold"><Link to="/admin-dashboard">Dashboard</Link></li>
          <li className="breadcrumb-item fw-bold"><Link to="/admin-dashboard/shippers">Shippers</Link></li>
          <li className="breadcrumb-item active fw-bold" aria-current="page">Add Shipper</li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <h5 className="text-success mb-3">
          <i className="bi bi-person-plus-fill me-2"></i>Add New Shipper
        </h5>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required placeholder="Full Name" />
            </div>
            <div className="col-md-6 mb-3">
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required placeholder="Email" />
            </div>
            <div className="col-md-6 mb-3">
              <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} placeholder="Phone" />
            </div>
            <div className="col-md-6 mb-3">
              <input type="text" name="companyName" className="form-control" value={formData.companyName} onChange={handleChange} placeholder="Company Name" />
            </div>
          </div>
          <button type="submit" className="btn btn-success">
            <i className="bi bi-check-circle-fill me-2"></i>Add Shipper
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShipperAdd;
