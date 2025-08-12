import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OwnWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState('Loading wallet...');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://tranzit.onrender.com/transaction/Auth/get-wallet', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.message) {
          setError(res.data.message);
        } else {
          setWallet(res.data);
        }
        setLoading('');
      } catch (err) {
        setError('Failed to fetch wallet');
        setLoading('');
      }
    };
    fetchWallet();
  }, []);

  if (loading) return <div className="alert alert-info mt-4">{loading}</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!wallet) return null;

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-primary">💳 My Wallet</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{wallet.name}</h5>
          <p className="card-text">
            <strong>Balance:</strong> KSh {wallet.balance?.toLocaleString()}<br />
            <strong>Phone:</strong> {wallet.phone}<br />
            <strong>Owner Type:</strong> {wallet.ownerType}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnWallet;
