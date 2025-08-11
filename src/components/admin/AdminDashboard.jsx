import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Chart,
  Filler,
  LineController,
  LineElement,
  PointElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  Filler,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
  
);


// Stat card component with icon, color, title, and value
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

// Generic recent items list with title and render function
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

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState('Loading dashboard...');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('https://tranzit.onrender.com/dashboard/Auth/admin', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
        setLoading('');
      } catch (err) {
        setError('Failed to load admin dashboard');
        setLoading('');
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="alert alert-info mt-4">{loading}</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!data) return null;

  // Safe defaults for arrays to avoid undefined errors
  const registrationsChartData = data.registrationsChartData || [];
  const deliveriesStatsByDate = data.deliveriesStatsByDate || [];
  const walletGrowthStats = data.walletGrowthStats || [];
  const recentAdmins = data.recentAdmins || [];
  const recentUsers = data.recentUsers || [];
  const recentDrivers = data.recentDrivers || [];
  const recentShippers = data.recentShippers || [];
  const recentPayments = data.recentPayments || [];

  // === Chart Data Preparation ===

  const registrationLabels = registrationsChartData.map(d => d.date);
  const registrationsData = {
    labels: registrationLabels,
    datasets: [
      {
        label: 'Drivers',
        data: registrationsChartData.map(d => d.drivers),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
      {
        label: 'Shippers',
        data: registrationsChartData.map(d => d.shippers),
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
      },
    ],
  };

  const deliveryLabels = deliveriesStatsByDate.map(d => d._id);
  const deliveriesData = {
    labels: deliveryLabels,
    datasets: [
      {
        label: 'Completed',
        data: deliveriesStatsByDate.map(d => d.completed),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: 'Pending',
        data: deliveriesStatsByDate.map(d => d.total - d.completed),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
    ],
  };

  const walletLabels = walletGrowthStats.map(w => w._id);
  const walletData = {
    labels: walletLabels,
    datasets: [
      {
        label: 'Wallet Balance (KSh)',
        data: walletGrowthStats.map(w => w.balance),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.3)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-primary">🛡️ Admin Dashboard</h2>

      <div className="row">
        <StatCard title="Admin Earnings" value={`KSh ${data.adminEarnings.toLocaleString()}`} color="success" icon="bi-cash-coin" />
        <StatCard title="Total Users" value={data.totalUsers} color="primary" icon="bi-people" />
        <StatCard title="Total Drivers" value={data.totalDrivers} color="warning" icon="bi-truck" />
        <StatCard title="Total Shippers" value={data.totalShippers} color="info" icon="bi-box-seam" />
        <StatCard title="Pending Deliveries" value={data.pendingDeliveries} color="danger" icon="bi-hourglass-split" />
        <StatCard title="Completed Deliveries" value={data.completedDeliveries} color="secondary" icon="bi-check-circle" />
      </div>

      <div className="row mt-5">
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm p-3 h-100">
            <h5>📈 Registrations Over Time</h5>
            <Bar data={registrationsData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm p-3 h-100">
            <h5>🚚 Delivery Completion Over Time</h5>
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

        <div className="col-lg-12 mb-4">
          <div className="card shadow-sm p-3">
            <h5>💰 Admin Wallet Growth</h5>
            <Line data={walletData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <RecentList
            title="Recent Admins"
            items={recentAdmins}
            renderItem={a => `${a.name || a.username} (${new Date(a.createdAt).toLocaleDateString()})`}
          />
        </div>

        <div className="col-md-6 col-lg-3">
          <RecentList
            title="Recent Users"
            items={recentUsers}
            renderItem={u => `${u.name || u.username} (${new Date(u.createdAt).toLocaleDateString()})`}
          />
        </div>

        <div className="col-md-6 col-lg-3">
          <RecentList
            title="Recent Drivers"
            items={recentDrivers}
            renderItem={d => `${d.name || d.driverId} (${new Date(d.createdAt).toLocaleDateString()})`}
          />
        </div>

        <div className="col-md-6 col-lg-3">
          <RecentList
            title="Recent Shippers"
            items={recentShippers}
            renderItem={s => `${s.name || s.shipperId} (${new Date(s.createdAt).toLocaleDateString()})`}
          />
        </div>
      </div>

      <h4 className="mt-5">💸 Recent Payments</h4>
      {recentPayments.length === 0 ? (
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
            {recentPayments.map((tx, index) => (
              <tr key={tx._id}>
                <td>{index + 1}</td>
                <td>{tx.senderName || 'Unknown'}</td>
                <td>{tx.amount.toLocaleString()}</td>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
