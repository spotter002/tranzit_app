import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [featuredDrivers, setFeaturedDrivers] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchDrivers = async () => {
    try {
      toast.info('Fetching drivers...');
      const res = await axios.get('https://tranzit.onrender.com/driver/Auth/driver', authHeader);
      setDrivers(res.data);
      toast.dismiss();
      toast.success('Drivers loaded');
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || 'Error loading drivers');
    }
  };

  const fetchFeatured = async () => {
    try {
      const res = await axios.get('https://tranzit.onrender.com/featured/Auth/', authHeader);
      setFeaturedDrivers(res.data);
    } catch (err) {
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchFeatured();
  }, []);

const toggleFeatured = async (driverId, currentlyFeatured) => {
  try {
    if (currentlyFeatured) {
      const featuredDoc = featuredDrivers.find(f => f.driverId?._id === driverId);
      console.log(featuredDoc._id);
      await axios.delete(`https://tranzit.onrender.com/featured/Auth/${featuredDoc._id}`, authHeader);
      toast.info('Driver removed from featured');
    } else {
      await axios.post(`https://tranzit.onrender.com/featured/Auth`, {
        driverId,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30*24*60*60*1000) // +30 days
      }, authHeader);
      toast.success('Driver added to featured');
    }
    fetchFeatured();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Error updating featured status');
  }
};


  // const getAvgRating = (ratings) => {
  //   if (!ratings || ratings.length === 0) return 0;
  //   const sum = ratings.reduce((a, r) => a + r.stars, 0);
  //   return (sum / ratings.length).toFixed(1);
  // };

  return (
    <div className="container mt-2">
      <ToastContainer position="top-right" autoClose={3000} />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold"><Link to="/admin-dashboard">Dashboard</Link></li>
          <li className="breadcrumb-item active fw-bold" aria-current="page">Drivers</li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm w-100">
        <h5 className="text-info mb-3">
          <i className="bi bi-truck me-2"></i>Drivers List
        </h5>

        <div className="table-responsive">
          {drivers.length === 0 ? (
            <div className="alert alert-warning text-center">
              <i className="bi bi-exclamation-triangle me-2"></i>No drivers found!
            </div>
          ) : (
            <table className="table table-bordered table-hover table-striped">
              <thead className="table-info">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Avg Rating</th>
                  <th>Premium</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver, index) => {
                  const isFeatured = featuredDrivers.some(f => f.driverId?._id === driver._id);
                  return (
                    <tr key={driver._id}>
                      <td>{index + 1}</td>
                      <td>{driver.name}</td>
                      <td>{driver.email}</td>
                      <td>{driver.phone || 'N/A'}</td>
                      <td>{driver.avgRating || '0.0'}</td>
                      <td>{driver.isPremium ? 'Yes' : 'No'}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${isFeatured ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => toggleFeatured(driver._id, isFeatured)}
                        >
                          {isFeatured ? 'Remove Featured' : 'Set Featured'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Featured Drivers List */}
      <div className="card p-4 shadow-sm w-100 mt-4">
        <h5 className="text-success mb-3">Featured Drivers</h5>
        {featuredDrivers.length === 0 ? (
          <p>No featured drivers yet.</p>
        ) : (
          <ul>
            {featuredDrivers.map(fd => (
              <li key={fd._id}>{fd.driverId?.name || 'Unknown Driver'}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Drivers;
