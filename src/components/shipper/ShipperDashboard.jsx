import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
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

const ShipperDashboard = ({ collapsed }) => {
  const [data, setData] = useState(null);
  const [shipper, setShipper] = useState(null);
  const [loading, setLoading] = useState('Loading shipper dashboard...');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const shipperId = user._id;
    console.log('Shipper ID:', shipperId);

    if (!shipperId) {
      setError('Shipper ID not found. Please login again.');
      setLoading('');
      return;
    }

    // Dashboard data
    axios.get('https://tranzit.onrender.com/dashboard/Auth/shipper', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setData(res.data);
        setLoading('');
      })
      .catch(() => {
        setError('Failed to load shipper dashboard');
        setLoading('');
      });

    // Shipper details
    axios.get(`https://tranzit.onrender.com/shipper/Auth/${shipperId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setShipper(res.data);
        setLoading('');
      })
      .catch(() => {
        setError('Failed to load shipper details');
        setLoading('');
      });
  }, []);

  const handleUpdateClick = () => {
    if (shipper) {
      navigate('/shipper-dashboard/update-Account', { state: { shipperData: shipper } });
    }
  };

  console.log('Data:', data);
  console.log('Shipper:', shipper);

  if (loading) return <div className="alert alert-info mt-4">{loading}</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!data || !shipper) return null;

  const deliveryLabels = data.deliveryStatsByDate.map(d => d._id);
  const deliveriesData = {
    labels: deliveryLabels,
    datasets: [
      {
        label: 'Completed',
        data: data.deliveryStatsByDate.map(d => d.completed),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: 'Pending',
        data: data.deliveryStatsByDate.map(d => d.pending),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
    ],
  };

  const walletLabels = data.walletGrowthStats.map(w => w._id);
  const walletData = {
    labels: walletLabels,
    datasets: [
      {
        label: 'Wallet Balance (KSh)',
        data: data.walletGrowthStats.map(w => w.balance),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.3)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-info">📦 Shipper Dashboard</h2>

      {/* Shipper Details */}
      <div className="card mb-4 shadow-sm p-3 text-muted">
        <h5 className="mb-3">Shipper Details</h5>
        <p><strong>Name:</strong> {shipper.name}</p>
        <p><strong>Email:</strong> {shipper.email}</p>
        <p><strong>Phone:</strong> {shipper.phone}</p>
        <p><strong>Company:</strong> {shipper.companyName || 'N/A'}</p>
        <p><strong>Location:</strong> {shipper.location || 'N/A'}</p>
        <p><strong>Verified:</strong> {shipper.isVerified ? 'Yes' : 'No'}</p>

        <button
          type="button"
          className="btn btn-primary d-flex align-items-center w-80 mt-3"
          onClick={handleUpdateClick}
        >
          <FaUserEdit size={18} className="me-2" />
          {!collapsed && 'Update Shipper'}
        </button>
      </div>

      {/* Stat cards */}
      <div className="row">
        <StatCard title="Wallet Balance" value={`KSh ${data.walletBalance.toLocaleString()}`} color="success" icon="bi-wallet2" />
        <StatCard title="Last Month Earnings" value={`KSh ${data.lastMonthEarnings.toLocaleString()}`} color="warning" icon="bi-calendar-event" />
        <StatCard title="Completion Rate" value={data.completionRate} color="info" icon="bi-bar-chart" />
        <StatCard title="Total Completed" value={data.totalCompleted} color="secondary" icon="bi-check-circle" />
        <StatCard title="Active Jobs" value={data.totalPending} color="danger" icon="bi-truck" />
      </div>

      {/* Charts */}
      <div className="row mt-5">
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm p-3 h-100">
            <h5>🚚 Deliveries Over Time</h5>
            <Bar
              data={deliveriesData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'top' } },
                scales: {
                  x: { stacked: true },
                  y: { stacked: true, beginAtZero: true },
                },
              }}
            />
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm p-3 h-100">
            <h5>💰 Wallet Growth</h5>
            <Line data={walletData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </div>
        </div>
      </div>

      {/* Recent tables */}
      <div className="row g-4">
        <div className="col-md-6">
          <RecentList
            title="Recent Deliveries"
            items={data.recentDeliveries}
            renderItem={d => `${d.pickupLocation} → ${d.dropoffLocation} (${d.status})`}
          />
        </div>
        <div className="col-md-6">
          <RecentList
            title="Recent Transactions"
            items={data.recentTransactions}
            renderItem={t => `${t.type.toUpperCase()} - KSh ${t.amount.toLocaleString()} on ${new Date(t.createdAt).toLocaleDateString()}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ShipperDashboard;
