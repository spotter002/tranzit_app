import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const EditShipper = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { shipperData } = state || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: ''
  });

  useEffect(() => {
    if (!shipperData) {
      toast.error('No shipper data provided');
      return navigate('/admin-dashboard/shippers');
    }

    setFormData({
      name: shipperData.name || '',
      email: shipperData.email || '',
      phone: shipperData.phone || '',
      companyName: shipperData.companyName || ''
    });
  }, [shipperData, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.info('Updating shipper...');
      await axios.put(`https://tranzit.onrender.com/shipper/Auth/${shipperData._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.dismiss();
      toast.success('Shipper updated');
      navigate('/admin-dashboard/shippers');
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold"><Link to="/admin-dashboard">Dashboard</Link></li>
          <li className="breadcrumb-item fw-bold"><Link to="/admin-dashboard/shippers">Shippers</Link></li>
          <li className="breadcrumb-item active fw-bold" aria-current="page">Edit Shipper</li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <h5 className="text-warning mb-3"><i className="bi bi-pencil-square me-2"></i>Edit Shipper</h5>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input name="name" className="form-control" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
            </div>
            <div className="col-md-6 mb-3">
              <input name="email" className="form-control" value={formData.email} onChange={handleChange} placeholder="Email" required />
            </div>
            <div className="col-md-6 mb-3">
              <input name="phone" className="form-control" value={formData.phone} onChange={handleChange} placeholder="Phone" />
            </div>
            <div className="col-md-6 mb-3">
              <input name="companyName" className="form-control" value={formData.companyName} onChange={handleChange} placeholder="Company Name" />
            </div>
          </div>
          <button type="submit" className="btn btn-warning">
            <i className="bi bi-check-circle-fill me-2"></i>Update Shipper
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditShipper;
