// SideBar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom'



const SideBar = () => {
  return (
    <div className='text-light d-flex flex-column p-3' style={{width:'200px',background:'linear-gradient(135deg, rgb(12,79,46), rgb(54,66,159))'}
    }>
        <h3 className='text-center mb-4'>
            <i className='bi bi-speedometer2 me-3'> Panel</i>Admin</h3>

        <ul className='nav nav-pills flex-column mb-auto'>
            <li className='nav-item mb-3'>
                <h3></h3>
                <NavLink to={'/admin-dashboard'} end className={({isActive})=>isActive?'nav-link bg-success text-white fe-fold ':'nav-link text-light'}>
                    <i className='bi bi-grid me-3'></i>Dashboard
                </NavLink>
            </li>
            <li className='nav-item mb-3'>
                <h3></h3>
                <NavLink to={'/admin-dashboard/bids'} end className={({isActive})=>isActive?'nav-link bg-success text-white fe-fold ':'nav-link text-light'}>
                    <i className='bi bi-journal-bookmark me-3'></i>Bid
                </NavLink>
            </li>
            <li className='nav-item mb-3'>
                <NavLink to={'/admin-dashboard/deliveries'} end className={({isActive})=>isActive?'nav-link bg-success text-white fe-fold ':'nav-link text-light'}>
                    <i className='bi bi-person-lines-fill me-3'></i>Deliveries
                </NavLink>
            </li>
            <li className='nav-item mb-3'>
                <NavLink to={'/admin-dashboard/featured'} end className={({isActive})=>isActive?'nav-link bg-success text-white fe-fold ':'nav-link text-light'}>
                    <i className='bi bi-person-badge me-3'></i>Featured
                </NavLink>
            </li>
            <li className='nav-item mb-3'>
                <NavLink to={'/admin-dashboard/shippers'} end className={({isActive})=>isActive?'nav-link bg-success text-white fe-fold ':'nav-link text-light'}>
                    <i className='bi bi-people-fill me-3'></i>Shippers
                </NavLink>
            </li>
            <li className='nav-item mb-3'>
                <NavLink to={'/admin-dashboard/transactions'} end className={({isActive})=>isActive?'nav-link bg-success text-white fe-fold ':'nav-link text-light'}>
                    <i className='bi bi-people-fill me-3'></i>Transactions
                </NavLink>
            </li>
            <li className='nav-item mb-3'>
                <NavLink to={'/admin-dashboard/wallet'} end className={({isActive})=>isActive?'nav-link bg-success text-white fe-fold ':'nav-link text-light'}>
                    <i className='bi bi-people-fill me-3'></i>Wallets
                </NavLink>
            </li>
            <li className='nav-item mb-3'>
                <NavLink to={'/admin-dashboard/drivers'} end className={({isActive})=>isActive?'nav-link bg-success text-white fe-fold ':'nav-link text-light'}>
                    <i className='bi bi-people-fill me-3'></i>Drivers
                </NavLink>
            </li>
        </ul>
    </div>
  )
}


export default SideBar;
