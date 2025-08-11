import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars } from 'react-icons/fa6';

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className='text-light d-flex flex-column p-3'
      style={{
        width: collapsed ? '50px' : '120px',
        overflow: 'auto',
        background: 'linear-gradient(135deg, rgb(12,79,46), rgb(54,66,159))',
        transition: 'width 0.3s',
        height: '100vh'
      }}
    >
      <div className='d-flex align-items-center justify-content-between mb-4'>
        <h3 className='m-0' style={{ fontSize: collapsed ? '1rem' : '1.25rem' }}>Admin Panel</h3>
        <button
          className='btn btn-sm btn-outline-light ms-2'
          onClick={toggleSidebar}
          style={{ fontSize: '0.6rem' }}
        >
          <FaBars />
        </button>
      </div>
      <NavLink to='/admin-dashboard' className='text-light mb-3' style={{ textDecoration: 'none' }}>
        <i className='bi bi-speedometer2 me-2'></i>
        {!collapsed && 'Dashboard'}
      </NavLink>
      <NavLink to='/admin-dashboard/shippers' className='text-light mb-3' style={{ textDecoration: 'none' }}>
        <i className='bi bi-truck me-2'></i>
        {!collapsed && 'Shippers'}
      </NavLink>
      <NavLink to='/admin-dashboard/drivers' className='text-light mb-3' style={{ textDecoration: 'none' }}>
        <i className='bi bi-truck-front-fill me-2'></i>
        {!collapsed && 'Drivers'}
      </NavLink>
      <NavLink to='/admin-dashboard/featured' className='text-light mb-3' style={{ textDecoration: 'none' }}>
        <i className='bi bi-person-lines-fill me-2'></i>
        {!collapsed && 'Featured Drivers'}
      </NavLink>
      <NavLink to='/admin-dashboard/bids' className='text-light mb-3' style={{ textDecoration: 'none' }}>
        <i className='bi bi-easel2-fill me-2'></i>
        {!collapsed && 'Bids'}
      </NavLink>
      <NavLink to='/admin-dashboard/transactions' className='text-light mb-3' style={{ textDecoration: 'none' }}>
        <i className='bi bi-people-fill me-2'></i>
        {!collapsed && 'Transactions'}
      </NavLink>
      <NavLink to='/admin-dashboard/wallet' className='text-light mb-3' style={{ textDecoration: 'none' }}>
        <i className='bi bi-truck-front-fill me-2'></i>
        {!collapsed && 'Wallets'}
      </NavLink>
      <NavLink to='/walletPayment' className='text-light mb-3' style={{ textDecoration: 'none' }}>
        <i className='bi bi-truck-front-fill me-2'></i>
        {!collapsed && 'payment'}
      </NavLink>
      <NavLink to='/transactions' className='text-light mb-3' style={{ textDecoration: 'none' }}>
        <i className='bi bi-truck-front-fill me-2'></i>
        {!collapsed && 'transactions'}
      </NavLink>
      
    </div>
  );
};

export default SideBar;
