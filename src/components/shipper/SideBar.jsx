import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ShipperSidebar = () => {
  const { pathname } = useLocation();

  const links = [
    { label: 'Dashboard', to: '/shipper/dashboard', icon: '📦' },
    { label: 'My Deliveries', to: '/shipper/deliveries', icon: '🚚' },
    { label: 'Wallet', to: '/shipper/wallet', icon: '💰' },
    { label: 'Settings', to: '/shipper/settings', icon: '⚙️' },
  ];

  return (
    <div className="bg-dark text-light p-3 vh-100" style={{width:'200px',background:'linear-gradient(135deg, rgb(12,79,46), rgb(54,66,159))'}
    }>
      <h4 className="mb-4">📦 Shipper Panel</h4>
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

export default ShipperSidebar;
