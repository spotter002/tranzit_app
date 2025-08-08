import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import DriverCard from './DriverCard';
const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchDrivers = async () => {
    try {
      toast.info('Fetching drivers...');
      const res = await axios.get('https://tranzit.onrender.com/driver/Auth/driver', authHeader);
      setDrivers(res.data);
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Error fetching drivers');
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        toast.warning('Deleting driver...');
        await axios.delete(`https://tranzit.onrender.com/driver/Auth/driver/${id}`, authHeader);
        toast.dismiss();
        toast.success('Driver deleted');
        fetchDrivers();
      } catch (error) {
        toast.dismiss();
        toast.error(error.response?.data?.message || 'Delete failed');
      }
    }
  };

const handleEdit = (driverData) => {
  navigate('/admin-dashboard/drivers/edit', { state: {driverData} });
};


  return (
    <div className="container mt-2">
      <ToastContainer position="top-right" autoClose={3000} />
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold"><Link to="/admin-dashboard">Dashboard</Link></li>
          <li className="breadcrumb-item active fw-bold" aria-current="page">Drivers</li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-primary"><i className="bi bi-truck me-2"></i>Driver List</h5>
          <button className="btn btn-primary" onClick={() => navigate('/admin-dashboard/drivers/add')}>
            <i className="bi bi-plus-circle me-2"></i>Add Driver
          </button>
        </div>
        <div className="d-flex flex-wrap justify-content-start">
          {drivers.length === 0 ? (
            <div className="alert alert-warning text-center w-100">
              <i className="bi bi-exclamation-triangle me-2"></i>No drivers found!
            </div>
          ) : (
            drivers.map(driver => (
              <DriverCard
                key={driver._id}
                driver={driver}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Drivers;
