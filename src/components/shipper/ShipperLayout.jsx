import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ShipperSidebar from '../shipper/SideBar';

const ShipperLayout = () => {
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

    if (!token || user?.role?.toLowerCase() !== 'shipper') {
      setAuthStatus({ loading: false, error: 'Unauthorized. Please log in as a shipper.', authorized: false });
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setAuthStatus({ loading: false, error: '', authorized: true });
    }
  }, [navigate]);

  if (authStatus.loading) return <div className="alert alert-info m-4">Checking shipper permissions...</div>;
  if (authStatus.error) return <div className="alert alert-danger m-4">{authStatus.error}</div>;

  return (
    <div className="d-flex">
      <ShipperSidebar />
      <div className="flex-grow-1">
        <main className="p-4 vh-100 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ShipperLayout;
