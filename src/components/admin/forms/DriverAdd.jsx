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
    password: '',
    vehicleType: '',
    vehicleDetails: {
      plateNumber: '',
      capacityKg: '',
      model: '',
    },
    licenseNumber: '',
    idNumber: '',
    isPremium: false,
    isVerifiedDriver: true,
    availableForJobs: true,
  });

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
      setFormData(prev => ({
        ...prev,
        [name]: value === 'true' ? true : value === 'false' ? false : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.info('Adding driver...');

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
        isPremium: formData.isPremium,
        isVerifiedDriver: formData.isVerifiedDriver,
        availableForJobs: formData.availableForJobs
      };

      await axios.post(
  'https://tranzit.onrender.com/driver/Auth/driver/register',
  payload,
  { headers: { 'Content-Type': 'application/json' } }
);


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
        <h5 className="text-success mb-3">
          <i className="bi bi-truck me-2"></i>Add New Driver
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input name="name" className="form-control" placeholder="Name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <input name="email" type="email" className="form-control" placeholder="Email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <input name="phone" className="form-control" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <input name="password" type="password" className="form-control" placeholder="Password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <select className="form-select mb-3" name="vehicleType" value={formData.vehicleType} onChange={handleChange} required>
                <option value="" disabled>Select Vehicle Type</option>
                {['boda', 'car', 'van', 'tuktuk', 'pickup', 'truck'].map((type) => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <input name="vehicleDetails.plateNumber" className="form-control" placeholder="Plate Number" value={formData.vehicleDetails.plateNumber} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <input name="licenseNumber" className="form-control" placeholder="License Number" value={formData.licenseNumber} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <input name="idNumber" className="form-control" placeholder="ID Number" value={formData.idNumber} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <input name="vehicleDetails.model" className="form-control" placeholder="Vehicle Model" value={formData.vehicleDetails.model} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <input name="vehicleDetails.capacityKg" type="number" className="form-control" placeholder="Capacity (Kg)" value={formData.vehicleDetails.capacityKg} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <select name="isVerifiedDriver" className="form-control" value={formData.isVerifiedDriver} onChange={handleChange}>
                <option value={true}>Verified</option>
                <option value={false}>Not Verified</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <select name="availableForJobs" className="form-control" value={formData.availableForJobs} onChange={handleChange}>
                <option value={true}>Available</option>
                <option value={false}>Unavailable</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <select name="isPremium" className="form-control" value={formData.isPremium} onChange={handleChange}>
                <option value={true}>Premium</option>
                <option value={false}>Standard</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-success"><i className="bi bi-check-circle me-2"></i>Add Driver</button>
        </form>
      </div>
    </div>
  );
};

export default AddDriver;
