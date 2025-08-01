// SideBar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SideBar = () => {
  const { pathname } = useLocation();

  const links = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: '📊' },
    { label: 'Users', to: '/admin/users', icon: '👥' },
    { label: 'Deliveries', to: '/admin/deliveries', icon: '🚚' },
    { label: 'Settings', to: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="bg-dark text-light p-3 vh-100" style={{ width: '200px' }}>
      <h4 className="mb-4">🚀 Tranzit Admin</h4>
      <ul className="nav flex-column">
        {links.map((link) => (
          <li className="nav-item" key={link.to}>
            <Link
              to={link.to}
              className={`nav-link text-light ${pathname === link.to ? 'bg-secondary rounded' : ''}`}
            >
              {link.icon} {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
