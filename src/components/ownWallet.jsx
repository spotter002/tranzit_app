import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/walletPayment.css';
import DashBoardNavbar from './DashBoardNavbar';

const OwnWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchWallet = async () => {
    try {
      setError('');
      const res = await axios.get(
        'https://tranzit.onrender.com/transaction/Auth/get-wallet',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.message && !res.data.success) {
        setError(res.data.message);
        setWallet(null);
      } else {
        setWallet({ ...(res.data.wallet || res.data) });
      }
    } catch (err) {
      setError('Failed to fetch wallet');
    } finally {
      setLoadingWallet(false);
    }
  };

  useEffect(() => {
    fetchWallet();
    const interval = setInterval(fetchWallet, 20000); // periodic refresh
    return () => clearInterval(interval);
  }, []);

  // Instant local balance update
  const updateBalanceLocally = (change) => {
    setWallet((prev) => ({
      ...prev,
      balance: (prev?.balance || 0) + change
    }));
  };

  const handleDeposit = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      return setMessage('Enter a valid amount');
    }
    setActionLoading(true);
    try {
      const res = await axios.post(
        'https://tranzit.onrender.com/transaction/Auth/deposit',
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);

      if (res.data.success) {
        // Update immediately without waiting for backend
        updateBalanceLocally(Number(amount));
        setAmount('');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Deposit failed');
    }
    setActionLoading(false);
  };

  const handleWithdraw = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      return setMessage('Enter a valid amount');
    }
    if (wallet.balance < Number(amount)) {
      return setMessage('Insufficient balance');
    }
    setActionLoading(true);
    try {
      const res = await axios.post(
        'https://tranzit.onrender.com/transaction/Auth/withdraw',
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);

      if (res.data.success) {
        // Update immediately without waiting for backend
        updateBalanceLocally(-Number(amount));
        setAmount('');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Withdrawal failed');
    }
    setActionLoading(false);
  };

  if (loadingWallet) return <div className="alert alert-info mt-4">Loading wallet...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!wallet) return null;

  return (
    <div>
      <DashBoardNavbar />
      <div className="wallet-payment-container">
        <div className="card">
          <h2 className="mb-3 text-primary">💳 My Wallet</h2>
          <p><strong>Name:</strong> {wallet.name}</p>
          <p><strong>Phone:</strong> {wallet.phone}</p>
          <p><strong>Balance:</strong> KSh {wallet.balance?.toLocaleString()}</p>
          <p><strong>Owner Type:</strong> {wallet.ownerType}</p>
        </div>

        <div className="input-group">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            disabled={actionLoading}
          />
        </div>

        <div className="btn-group">
          <button onClick={handleDeposit} disabled={actionLoading}>Deposit</button>
          <button onClick={handleWithdraw} disabled={actionLoading}>Withdraw</button>
        </div>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default OwnWallet;
