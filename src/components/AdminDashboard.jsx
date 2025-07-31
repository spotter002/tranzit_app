import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState('Loading dashboard...');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://tranzit.onrender.com/dashboard/Auth/admin',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDashboardData(response.data);
        setLoading('');
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load dashboard');
        setLoading('');
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="alert alert-info">{loading}</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/admin-dashboard">Admin</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/users">All Users</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register-driver">Register Driver</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/update-user">Update User Account</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/update-shipper">Update Shipper Account</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/update-driver">Update Driver Account</Link>
                </li>

          </ul>
        </div>
      </div>
    </nav>


      <h2 className="text-success mb-4">Admin Dashboard</h2>

      <div className="row g-4">
        <DashboardCard title="Admin Earnings" value={`Ksh ${dashboardData.adminEarnings}`} />
        <DashboardCard title="Total Users" value={dashboardData.totalUsers} />
        <DashboardCard title="Total Drivers" value={dashboardData.totalDrivers} />
        <DashboardCard title="Total Shippers" value={dashboardData.totalShippers} />
        <DashboardCard title="Pending Deliveries" value={dashboardData.pendingDeliveries} />
        <DashboardCard title="Completed Deliveries" value={dashboardData.completedDeliveries} />
        <DashboardCard title="Total Account Balance" value={`Ksh ${dashboardData.totalWalletBalance}`} />
      </div>

      <h4 className="mt-5">Recent Payments</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Owner</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {dashboardData.recentPayments.map((tx) => (
            <tr key={tx._id}>
              <td>{tx._id}</td>
              <td>{tx.ownerId}</td>
              <td>Ksh {tx.amount}</td>
              <td>{tx.status}</td>
              <td>{new Date(tx.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DashboardCard = ({ title, value }) => (
  <div className="col-md-4">
    <div className="card shadow-sm p-3">
      <h5 className="text-muted">{title}</h5>
      <h3 className="text-dark">{value}</h3>
    </div>
  </div>
);

export default AdminDashboard;
