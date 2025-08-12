// DashBoardNavbar.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const DashBoardNavbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className='navbar navbar-expand-lg bg-light shadow-sm px-4 py-3 mb-3 rounded'>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <span className='navbar-brand fw-bold text-success fs-4'>
          Tranzit Transport and Logistics
          <marquee behavior="" direction="right"><i className='bi bi-truck me-3'></i></marquee>
        </span>

        <div className="d-flex align-items-center">
          <span className='me-3 text-muted'>
            <i className='bi bi-person-circle me-2'></i>
            <strong>{user?.name}</strong>
            <small className='text-muted'> ({user?.role})</small>
          </span>

          {/* Animated spinning gear */}
          <i className="bi bi-gear-fill text-secondary fs-4 spin-animation"></i>
        </div>
      </div>

      <style>{`
        .spin-animation {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </nav>
  );
};

export default DashBoardNavbar;
