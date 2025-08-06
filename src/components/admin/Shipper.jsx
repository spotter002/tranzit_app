import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Shippers = () => {
  const [shippers, setShippers] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchShippers = async () => {
    try {
      toast.info('Fetching shippers...');
      const res = await axios.get('https://tranzit.onrender.com/shipper/Auth', authHeader);
      setShippers(res.data);
      toast.dismiss();
      toast.success('Shippers loaded');
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || 'Error loading shippers');
    }
  };
   useEffect(() => {
    fetchShippers();
  }, []);


  const handleDelete = async (id) => {
    if (window.confirm('Delete this shipper?')) {
      try {
        toast.warning('Deleting shipper...');
        await axios.delete(`https://tranzit.onrender.com/shipper/Auth/${id}`, authHeader);
        toast.dismiss();
        toast.success('Shipper deleted');
        fetchShippers(); // Refresh
      } catch (err) {
        toast.dismiss();
        toast.error(err.response?.data?.message || 'Delete failed');
      }
    }
  };

 
  return (
    <div className="container mt-2">
      <ToastContainer position="top-right" autoClose={3000} />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold"><Link to="/admin-dashboard">Dashboard</Link></li>
          <li className="breadcrumb-item active fw-bold" aria-current="page">Shippers</li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-info">
            <i className="bi bi-person-workspace me-2"></i>Shippers List
          </h5>
          <button className="btn btn-info" onClick={() => navigate('/admin-dashboard/shippers/add')}>
            <i className="bi bi-plus-circle me-2"></i>Add Shipper
          </button>
        </div>

        <div className="table-responsive">
          {shippers.length === 0 ? (
            <div className="alert alert-warning text-center">
              <i className="bi bi-exclamation-triangle me-2"></i>No shippers found!
            </div>
          ) : (
            <table className="table table-bordered table-hover table-striped">
              <thead className="table-info">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shippers.map((shipper, index) => (
                  <tr key={shipper._id}>
                    <td>{index + 1}</td>
                    <td>{shipper.name}</td>
                    <td>{shipper.email}</td>
                    <td>{shipper.phone || 'N/A'}</td>
                    <td>{shipper.companyName || 'N/A'}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2">
                        <i className="bi bi-pencil-square"></i> Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(shipper._id)}>
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shippers;
