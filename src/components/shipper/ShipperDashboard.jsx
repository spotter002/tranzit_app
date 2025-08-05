import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShipperDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState('Loading shipper dashboard...');
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
          `https://tranzit.onrender.com/dashboard/Auth/shipper`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setData(res.data);
        setLoading('');
      } catch (err) {
        console.error(err);
        setError('Failed to load shipper dashboard');
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
      <h2 className="text-info">📦 Shipper Dashboard</h2>
      <div className="row g-4 my-3">
        <StatCard title="Wallet Balance" value={`KSh ${data.walletBalance.toLocaleString()}`} color="success" icon="bi-wallet2" />
        <StatCard title="Active Jobs" value={data.activeJobs.length} color="primary" icon="bi-truck" />
        <StatCard title="Completed Jobs" value={data.jobHistory.length} color="secondary" icon="bi-check-circle" />
      </div>

      <h4>📋 Active Deliveries</h4>
      {data.activeJobs.length === 0 ? (
        <p className="text-muted">No active deliveries found.</p>
      ) : (
        <table className="table table-striped table-hover mt-3">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.activeJobs.map((job, index) => (
              <tr key={job._id}>
                <td>{index + 1}</td>
                <td>{job.pickupLocation || 'N/A'}</td>
                <td>{job.dropoffLocation || 'N/A'}</td>
                <td>{job.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h4 className="mt-5">📦 Job History (Recent)</h4>
      {data.jobHistory.length === 0 ? (
        <p className="text-muted">No completed deliveries yet.</p>
      ) : (
        <table className="table table-bordered table-hover mt-3">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>From</th>
              <th>To</th>
              <th>Completed At</th>
            </tr>
          </thead>
          <tbody>
            {data.jobHistory.map((job, index) => (
              <tr key={job._id}>
                <td>{index + 1}</td>
                <td>{job.pickupLocation || 'N/A'}</td>
                <td>{job.dropoffLocation || 'N/A'}</td>
                <td>{new Date(job.completedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShipperDashboard;
