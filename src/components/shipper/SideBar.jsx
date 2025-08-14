// SideBar.jsx
import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaBars,
  FaTachometerAlt,
  FaPlusSquare,
  FaStarHalfAlt,
  FaUserEdit,
  FaExchangeAlt,
  FaCog,
  FaWallet,
  FaUsers,
  FaSignOutAlt
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import '../../css/home.css';

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useContext(AuthContext);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

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
    dashboard: '#ffcc00',
    postDelivery: '#4dabf7',
    rateDriver: '#a29bfe',
    updateAccount: '#00cec9',
    transactions: '#2ecc71',
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
        height: '100vh',
      }}
    >
      {/* Top menu items */}
      <div>
        <div className='d-flex align-items-center justify-content-between mb-4'>
          {!collapsed && <h3 className='m-0 fs-5 fw-bold'>Shipper</h3>}
          <button
            className='btn btn-sm btn-outline-light ms-2'
            onClick={toggleSidebar}
            style={{ fontSize: '0.8rem' }}
          >
            <FaBars />
          </button>
        </div>

        <NavLink to='/shipper-dashboard' style={linkStyle} className='text-light'>
          <FaTachometerAlt color={iconColors.dashboard} size={iconSize} className="me-2" />
          {!collapsed && 'Dashboard'}
        </NavLink>
        <NavLink to='/shipper-dashboard/post-delivery' style={linkStyle} className='text-light'>
          <FaPlusSquare color={iconColors.postDelivery} size={iconSize} className="me-2" />
          {!collapsed && 'Post Delivery'}
        </NavLink>
        <NavLink to='/shipper-dashboard/rate-driver' style={linkStyle} className='text-light'>
          <FaStarHalfAlt color={iconColors.rateDriver} size={iconSize} className="me-2" />
          {!collapsed && 'Rate Driver'}
        </NavLink>
        {/* <NavLink to='/shipper-dashboard/update-Account' style={linkStyle} className='text-light'>
          <FaUserEdit color={iconColors.updateAccount} size={iconSize} className="me-2" />
          {!collapsed && 'Update Account'}
        </NavLink> */}
        <NavLink to='/own-wallet' style={linkStyle} className='text-light'>
                  <FaWallet color={iconColors.wallet} size={iconSize} className="me-2" />
                  {!collapsed && 'View Wallet'}
                </NavLink>
        <NavLink to='/shipper-dashboard/transactions' style={linkStyle} className='text-light'>
          <FaExchangeAlt color={iconColors.transactions} size={iconSize} className="me-2" />
          {!collapsed && 'Transactions'}
        </NavLink>
      </div>

      {/* Bottom actions */}
      <div className="mt-auto">
        <NavLink to='/settings' style={linkStyle} className='text-light'>
          <FaCog color={iconColors.settings} size={iconSize} className="me-2" />
          {!collapsed && 'Settings'}
        </NavLink>
        <NavLink to='/login' style={linkStyle} className='text-light'>
          <FaUsers color={iconColors.switch} size={iconSize} className="me-2" />
          {!collapsed && 'Switch'}
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
