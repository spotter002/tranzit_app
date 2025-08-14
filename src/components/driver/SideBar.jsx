import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaBars,
  FaUserEdit,
  FaWallet,
  FaGavel,
  FaExchangeAlt,
  FaStar,
  FaCog,
  FaTachometerAlt,
  FaUsers,
  FaSignOutAlt
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import '../../css/home.css';

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useContext(AuthContext);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const iconSize = 18;
  const linkStyle = {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '18px',
    padding: '8px',
    borderRadius: '8px',
    transition: 'background 0.2s',
  };

  const iconColors = {
    update: '#4dabf7',
    wallet: '#2ecc71',
    bid: '#a29bfe',
    rating: '#ffd43b',
    settings: '#fab1a0',
    switch: '#e17055',
    logout: '#d63031'
  };

  return (
    <div
      className='text-light d-flex flex-column p-3 justify-content-between'
      style={{
        width: collapsed ? '60px' : '150px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgb(12,79,46), rgb(54,66,159))',
        transition: 'width 0.3s',
        height: '100vh'
      }}
    >
      {/* Top menu items */}
      <div>
        <div className='d-flex align-items-center justify-content-between mb-4'>
          {!collapsed && <h3 className='m-0 fs-5 fw-bold'>Driver</h3>}
          <button
            className='btn btn-sm btn-outline-light ms-2'
            onClick={toggleSidebar}
            style={{ fontSize: '0.8rem' }}
          >
            <FaBars />
          </button>
        </div>
        <NavLink to='/driver-dashboard' style={linkStyle} className='text-light'>
                  <FaTachometerAlt color={iconColors.dashboard} size={iconSize} className="me-2" />
                  {!collapsed && 'Dashboard'}
                </NavLink>
        <NavLink to='/driver-dashboard/update-Account' style={linkStyle} className='text-light'>
          <FaUserEdit color={iconColors.update} size={iconSize} className="me-2" />
          {!collapsed && 'Update Driver'}
        </NavLink>
        <NavLink to='/own-wallet' style={linkStyle} className='text-light'>
          <FaWallet color={iconColors.wallet} size={iconSize} className="me-2" />
          {!collapsed && 'View Wallet'}
        </NavLink>
        <NavLink to='/driver-dashboard/bid' style={linkStyle} className='text-light'>
          <FaGavel color={iconColors.bid} size={iconSize} className="me-2" />
          {!collapsed && 'Make Bid'}
        </NavLink>
        <NavLink to='/driver-dashboard/rating' style={linkStyle} className='text-light'>
          <FaStar color={iconColors.rating} size={iconSize} className="me-2" />
          {!collapsed && 'See Rating'}
        </NavLink>
        <NavLink to='/driver-dashboard/transactions' style={linkStyle} className='text-light'>
                  <FaExchangeAlt color={iconColors.transactions} size={iconSize} className="me-2" />
                  {!collapsed && 'Transactions'}
                </NavLink>
      </div>

      {/* Bottom actions */}
      <div className="mt-auto">
        <NavLink to='/driver-dashboard/settings' style={linkStyle} className='text-light'>
          <FaCog color={iconColors.settings} size={iconSize} className="me-2" />
          {!collapsed && 'Settings'}
        </NavLink>
        <NavLink to='/login' style={linkStyle} className='text-light'>
          <FaUsers color={iconColors.switch} size={iconSize} className="me-2" />
          {!collapsed && 'Switch Account'}
        </NavLink>
        <button
          onClick={logout}
          style={{
            ...linkStyle,
            background: 'transparent',
            border: 'none',
            color: 'white',
            width: '100%',
            textAlign: collapsed ? 'center' : 'left'
          }}
        >
          <FaSignOutAlt color={iconColors.logout} size={iconSize} className="me-2" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default SideBar;
