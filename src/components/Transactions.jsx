import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../context/AuthContext';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token , user } = useContext(AuthContext);

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };
 const userRole = user.role.toLowerCase();

 console.log('userRole',userRole)
 const ownerLink = `/${userRole}-dashboard`

  const fetchTransactions = async () => {
    try {
      toast.info('Fetching transactions...');
      const res = await axios.get('https://tranzit.onrender.com/transaction/Auth/get-all-transactions', authHeader);
      
      if (Array.isArray(res.data)) {
        setTransactions(res.data);
      } else if (Array.isArray(res.data.transactions)) {
        setTransactions(res.data.transactions);
      } else {
        setTransactions([]);
      }

      toast.dismiss();
      toast.success('Transactions loaded');
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || 'Error loading transactions');
      setError('Failed to load transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="container-fluid mt-2">
      <ToastContainer position="top-right" autoClose={3000} />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold"><Link to={ownerLink}>Dashboard</Link></li>
          <li className="breadcrumb-item active fw-bold" aria-current="page">Transactions</li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-info">
            <i className="bi bi-cash-stack me-2"></i>All Transactions
          </h5>
        </div>

        <div className="table-responsive">
          {loading ? (
            <div className="alert alert-info text-center">
              <i className="bi bi-arrow-repeat me-2"></i>Loading transactions...
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">
              <i className="bi bi-exclamation-triangle me-2"></i>{error}
            </div>
          ) : transactions.length === 0 ? (
            <div className="alert alert-warning text-center">
              <i className="bi bi-exclamation-circle me-2"></i>No transactions found!
            </div>
          ) : (
            <table className="table table-bordered table-hover table-striped">
              <thead className="table-info">
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>From Wallet</th>
                  <th>To Wallet</th>
                  <th>Platform Share</th>
                  <th>Driver Share</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={tx._id}>
                    <td>{index + 1}</td>
                    <td>{tx.type}</td>
                    <td>${tx.amount?.toFixed(2) || '0.00'}</td>
                    <td>{tx.status}</td>
                    <td>
                      {tx.fromWallet 
                        ? `${tx.fromWallet.name || 'Unknown'} (${tx.fromWallet.phone || 'No phone'})`
                        : 'N/A'}
                    </td>
                    <td>
                      {tx.toWallet 
                        ? `${tx.toWallet.name || 'Unknown'} (${tx.toWallet.phone || 'No phone'})`
                        : 'N/A'}
                    </td>
                    <td>${(tx.platformShare || 0).toFixed(2)}</td>
                    <td>${(tx.driverShare || 0).toFixed(2)}</td>
                    <td>{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
