import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('/api/transactions'); // Admin route to get all transactions
        setTransactions(res.data);
      } catch (err) {
        setError('Failed to load transactions');
      }
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ maxWidth: 800, margin: 'auto' }}>
      <h2>All Transactions</h2>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>From Wallet</th>
            <th>To Wallet</th>
            <th>Platform Share</th>
            <th>Driver Share</th>
            <th>Admin Share</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx._id}>
              <td>{tx._id}</td>
              <td>{tx.type}</td>
              <td>${tx.amount.toFixed(2)}</td>
              <td>{tx.status}</td>
              <td>{tx.fromWallet || 'N/A'}</td>
              <td>{tx.toWallet || 'N/A'}</td>
              <td>${(tx.platformShare || 0).toFixed(2)}</td>
              <td>${(tx.driverShare || 0).toFixed(2)}</td>
              <td>${(tx.adminShare || 0).toFixed(2)}</td>
              <td>{new Date(tx.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
