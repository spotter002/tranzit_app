import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit } from 'react-icons/fa';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  LineElement,
  PointElement
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  Filler,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  BarElement,
  Tooltip,
  Legend
);

const StatCard = ({ title, value, color, icon }) => (
  <div className="col-md-4 mb-3">
    <div className={`card text-bg-${color} shadow-sm`}>
      <div className="card-body d-flex align-items-center gap-3">
        <i className={`bi ${icon} fs-2`}></i>
        <div>
          <h6 className="card-title mb-0">{title}</h6>
          <p className="card-text fs-4 fw-bold">{value}</p>
        </div>
      </div>
    </div>
  </div>
);

// Ensure items is always an array to avoid errors
const RecentList = ({ title, items = [], renderItem }) => (
  <div className="card mb-4 shadow-sm h-100">
    <div className="card-header bg-primary text-white">{title}</div>
    <ul className="list-group list-group-flush">
      {items.length === 0 ? (
        <li className="list-group-item text-muted">No {title.toLowerCase()} found.</li>
      ) : (
        items.map((item, idx) => (
          <li key={idx} className="list-group-item">
            {renderItem(item)}
          </li>
        ))
      )}
    </ul>
  </div>
);

const DriverDashboard = ({ collapsed }) => {
  const [data, setData] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState('Loading dashboard...');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const driverId = user._id;

    if (!driverId) {
      setError('Driver ID not found. Please login again.');
      setLoading('');
      return;
    }

    axios.get('https://tranzit.onrender.com/dashboard/Auth/driver', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setData(res.data);
        setLoading('');
      })
      .catch(() => {
        setError('Failed to load driver dashboard');
        setLoading('');
      });

    axios.get(`https://tranzit.onrender.com/driver/Auth/driver/${driverId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setDriver(res.data);
        setLoading('');
      })
      .catch(() => {
        setError('Failed to load driver details');
        setLoading('');
      });
  }, []);

  const handleUpdateClick = () => {
    if (driver) {
      navigate('/driver-dashboard/update-Account', { state: { driverData: driver } });
    }
  };

  if (loading) return <div className="alert alert-info mt-4">{loading}</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!data || !driver) return null;

  const monthlyLabels = (data.monthlyEarnings || [])
    .map(m => `${m._id.month}/${m._id.year}`)
    .reverse();

  const monthlyEarningsData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Earnings (KSh)',
        data: data.monthlyEarnings.map(m => m.total),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.3)',
        fill: true,
        tension: 0.3,
        pointRadius: 3
      }
    ]
  };

  const iconColors = {
    update: '#4dabf7'
  };

  const linkStyle = {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '18px',
    padding: '8px',
    borderRadius: '8px',
    transition: 'background 0.2s'
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-primary">🚚 Driver Dashboard</h2>

      <div className="card mb-4 shadow-sm p-3 text-muted">
        <h5 className="mb-3">Driver Details</h5>
        <p><strong>Name:</strong> {driver.name}</p>
        <p><strong>Email:</strong> {driver.email}</p>
        <p><strong>Phone:</strong> {driver.phone}</p>
        <p><strong>Vehicle Type:</strong> {driver.vehicleType}</p>
        <p><strong>Plate Number:</strong> {driver.vehicleDetails?.plateNumber || 'N/A'}</p>
        <p><strong>Model:</strong> {driver.vehicleDetails?.model || 'N/A'}</p>
        <p><strong>Capacity (kg):</strong> {driver.vehicleDetails?.capacityKg || 'N/A'}</p>
        <p><strong>ID Number:</strong> {driver.idNumber}</p>
        <p><strong>License Number:</strong> {driver.licenseNumber || 'N/A'}</p>
        <p><strong>Verified Driver:</strong> {driver.isVerifiedDriver ? 'Yes' : 'No'}</p>
        <p><strong>Premium Driver:</strong> {driver.isPremium ? 'Yes' : 'No'}</p>
        <p><strong>Available for Jobs:</strong> {driver.availableForJobs ? 'Yes' : 'No'}</p>

        <button
          type="button"
          style={linkStyle}
          className="btn btn-primary d-flex align-items-center"
          onClick={handleUpdateClick}
        >
          <FaUserEdit color={iconColors.update} size={18} className="me-2" />
          {!collapsed && 'Update Driver'}
        </button>
      </div>

      <div className="row">
        <h2>Earnings</h2>
        <StatCard title="Wallet Balance" value={`KSh ${data.walletBalance.toLocaleString()}`} color="success" icon="bi-wallet2" />
        <StatCard title="Today’s Earnings" value={`KSh ${data.earnings.today.toLocaleString()}`} color="primary" icon="bi-cash" />
        <StatCard title="This Week" value={`KSh ${data.earnings.thisWeek.toLocaleString()}`} color="info" icon="bi-calendar-week" />
        <StatCard title="This Month" value={`KSh ${data.earnings.thisMonth.toLocaleString()}`} color="warning" icon="bi-calendar-month" />
        <StatCard title="Total Earnings" value={`KSh ${data.earnings.total.toLocaleString()}`} color="secondary" icon="bi-graph-up" />
      </div>

      <h2>Jobs</h2>
      <div className="row mt-4">
        <StatCard title="Pending Jobs" value={data.jobs.pending} color="danger" icon="bi-hourglass-split" />
        <StatCard title="In Progress" value={data.jobs.inProgress} color="primary" icon="bi-truck" />
        <StatCard title="Completed" value={data.jobs.completed} color="success" icon="bi-check-circle" />
        <StatCard title="Cancelled" value={data.jobs.cancelled} color="secondary" icon="bi-x-circle" />
      </div>

      <h2>Ratings</h2>
      <div className="row mt-4">
        <StatCard title="Average Rating" value={data.ratings.average} color="info" icon="bi-star-fill" />
        <StatCard title="Total Reviews" value={data.ratings.totalReviews} color="primary" icon="bi-chat-square-text" />
      </div>

      <h2>Monthly Earnings</h2>
      <div className="row mt-5">
        <div className="col-lg-12 mb-4">
          <div className="card shadow-sm p-3">
            <h5>📈 Monthly Earnings</h5>
            <Line
              data={monthlyEarningsData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' }
                }
              }}
            />
          </div>
        </div>
      </div>

      <h2>Recent Transactions</h2>
      <div className="row mt-4">
        <div className="col-md-6">
          <RecentList
            title="Recent Jobs"
            items={data.recentJobs}
            renderItem={(job) => (
              <>
                <strong>{job.clientName}</strong> - {job.status} - <span className="text-success">KSh {job.amount.toLocaleString()}</span>
              </>
            )}
          />
        </div>
        <div className="col-md-6">
          <RecentList
            title="Recent Payments"
            items={data.recentPayments}
            renderItem={(payment) => (
              <>
                <strong>{payment.method}</strong> - <span className="text-success">KSh {payment.amount.toLocaleString()}</span>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
