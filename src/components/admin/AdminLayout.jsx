// AdminLayout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import DashBoardNavbar from '../DashBoardNavbar';

const AdminLayout = () => {
  const [authStatus, setAuthStatus] = useState({ loading: true, error: '', authorized: false });
  const navigate = useNavigate();

  

  useEffect(() => {
    const token = localStorage.getItem('token');
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem('user') || '{}');
    } catch (err) {
      console.error('Invalid user data');
    }

    if (!token || user?.role?.toLowerCase() !== 'admin') {
      setAuthStatus({ loading: false, error: 'Unauthorized. Please log in as an admin.', authorized: false });
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setAuthStatus({ loading: false, error: '', authorized: true });
    }
  }, [navigate]);

  if (authStatus.loading) return <div className="alert alert-info m-4">Checking admin permissions...</div>;
  if (authStatus.error) return <div className="alert alert-danger m-4">{authStatus.error}</div>;

  return (
  <div className="d-flex">
    {/* Fixed sidebar */}
    <div style={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 1000 }}>
      <SideBar />
    </div>

    {/* Main content shifted right */}
    <div className="flex-grow-1 p-2" style={{ marginLeft: '150px' }}> 
      <DashBoardNavbar />
      <main className="p-2 vh-100 overflow-auto container-fluid">
        <Outlet />
      </main>
    </div>
  </div>
);

};

export default AdminLayout;
