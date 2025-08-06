import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const AddDriver = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleType: '',
    plateNumber: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.info('Adding driver...');
      await axios.post('https://tranzit.onrender.com/driver/Auth/driver/register', {
        ...formData,
        vehicleDetails: {
          plateNumber: formData.plateNumber
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.dismiss();
      toast.success('Driver added successfully');
      navigate('/admin-dashboard/drivers');
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Error adding driver');
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold"><Link to="/admin-dashboard">Dashboard</Link></li>
          <li className="breadcrumb-item fw-bold"><Link to="/admin-dashboard/drivers">Drivers</Link></li>
          <li className="breadcrumb-item active fw-bold" aria-current="page">Add Driver</li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <h5 className="text-success mb-3"><i className="bi bi-truck me-2"></i>Add New Driver</h5>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input name="name" className="form-control" placeholder="Name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <input name="email" type="email" className="form-control" placeholder="Email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <input name="phone" className="form-control" placeholder="Phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <input name="vehicleType" className="form-control" placeholder="Vehicle Type" value={formData.vehicleType} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <input name="plateNumber" className="form-control" placeholder="Plate Number" value={formData.plateNumber} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn btn-success"><i className="bi bi-check-circle me-2"></i>Add Driver</button>
        </form>
      </div>
    </div>
  );
};

export default AddDriver;
