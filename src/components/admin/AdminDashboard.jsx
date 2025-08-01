// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState('Loading dashboard...');
  const [error, setError] = useState('');

  const StatCard = ({ title, value, color, icon }) => (
  <div className="col-md-4">
    <div className={`card text-bg-${color} shadow`}>
      <div className="card-body d-flex align-items-center gap-3">
        <i className={`bi ${icon} fs-1`}></i>
        <div>
          <h6 className="card-title mb-1">{title}</h6>
          <p className="card-text fs-5 fw-bold">{value}</p>
        </div>
      </div>
    </div>
  </div>
);


  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `https://tranzit.onrender.com/dashboard/Auth/admin`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setData(res.data);
        setLoading('');
      } catch (err) {
        console.error(err);
        setError('Failed to load admin dashboard');
        setLoading('');
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="alert alert-info mt-4">{loading}</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!data) return null;

  return (
    <div>
      <h2 className="text-primary">🛡️ Admin Dashboard</h2>
      <div className="row g-4 my-3">
        <StatCard title="Admin Earnings" value={`KSh ${data.adminEarnings.toLocaleString()}`} color="success" icon="bi-cash-coin" />
        <StatCard title="Total Users" value={data.totalUsers} color="primary" icon="bi-people" />
        <StatCard title="Total Drivers" value={data.totalDrivers} color="warning" icon="bi-truck" />
        <StatCard title="Total Shippers" value={data.totalShippers} color="info" icon="bi-box-seam" />
        <StatCard title="Pending Deliveries" value={data.pendingDeliveries} color="danger" icon="bi-hourglass-split" />
        <StatCard title="Completed Deliveries" value={data.completedDeliveries} color="secondary" icon="bi-check-circle" />

        {/* <StatCard title="Total Wallet Balance" value={`KSh ${data.totalWalletBalance.toLocaleString()}`} color="dark" /> */}
      </div>

      <h4>💸 Recent Payments</h4>
      {data.recentPayments.length === 0 ? (
        <p className="text-muted">No recent payments found.</p>
      ) : (
        <table className="table table-bordered table-hover mt-3">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Sender</th>
              <th>Amount (KSh)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.recentPayments.map((tx, index) => (
              <tr key={tx._id}>
                <td>{index + 1}</td>
                <td>{tx.senderName || 'Unknown'}</td>
                <td>{tx.amount}</td>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className="col-md-4">
    <div className={`card text-bg-${color} shadow`}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text fs-4">{value}</p>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
