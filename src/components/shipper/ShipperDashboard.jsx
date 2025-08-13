import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

const RecentList = ({ title, items, renderItem }) => (
  <div className="card mb-4 shadow-sm h-100">
    <div className="card-header bg-primary text-white">{title}</div>
    <ul className="list-group list-group-flush">
      {items.length === 0 ? (
        <li className="list-group-item text-muted">No recent {title.toLowerCase()} found.</li>
      ) : (
        items.map(item => (
          <li key={item._id} className="list-group-item">
            {renderItem(item)}
          </li>
        ))
      )}
    </ul>
  </div>
);

const ShipperDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState('Loading shipper dashboard...');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `https://tranzit.onrender.com/dashboard/Auth/shipper`,
          { headers: { Authorization: `Bearer ${token}` } }
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

  // Chart data
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

      {/* Stat cards */}
      <div className="row">
        <StatCard title="Wallet Balance" value={`KSh ${data.walletBalance.toLocaleString()}`} color="success" icon="bi-wallet2" />
        <StatCard title="Total Earnings" value={`KSh ${data.totalEarnings.toLocaleString()}`} color="primary" icon="bi-cash-coin" />
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
