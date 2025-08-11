import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/walletPayment.css';

const WalletPayment = () => {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState('');
  const [driverId, setDriverId] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const walletRes = await axios.get('https://tranzit.onrender.com/transaction/Auth/get-wallet', authHeader);
        if (walletRes.data.success) {
          setWallet(walletRes.data.wallet);
        } else {
          setMessage(walletRes.data.message);
          setTimeout(() => (window.location.href = '/create-wallet'), 2000);
        }

        const driversRes = await axios.get('https://tranzit.onrender.com/driver/Auth/driver');
        setDrivers(driversRes.data);
      } catch (err) {
        setMessage('Error loading data');
      }
    };
    fetchData();
  }, []);

  const handleDeposit = async () => {
    if (!amount || isNaN(amount) || amount <= 0) return setMessage('Enter a valid amount');
    setLoading(true);
    try {
      const res = await axios.post('https://tranzit.onrender.com/transaction/Auth/deposit', { amount: Number(amount) }, authHeader);
      if (res.data.success) {
        setWallet(res.data.wallet);
      }
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Deposit failed');
    }
    setLoading(false);
  };

  const handleWithdraw = async () => {
    if (!amount || isNaN(amount) || amount <= 0) return setMessage('Enter a valid amount');
    setLoading(true);
    try {
      const res = await axios.post('https://tranzit.onrender.com/transaction/Auth/withdraw', { amount: Number(amount) }, authHeader);
      if (res.data.success) {
        setWallet(res.data.wallet);
      }
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Withdrawal failed');
    }
    setLoading(false);
  };


  const handlePayment = async () => {
    if (!amount || isNaN(amount) || amount <= 0) return setMessage('Enter a valid amount');
    if (!driverId) return setMessage('Select a driver');
    setLoading(true);
    try {
      const res = await axios.post('https://tranzit.onrender.com/transaction/Auth/pay-driver', { amount: Number(amount), driverId }, authHeader);
      if (res.data.success) {
        setWallet(res.data.shipperWallet);
      }
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Payment failed');
    }
    setLoading(false);
  };

  return (
    <div className="wallet-payment-container">
      {wallet ? (
        <>
          <div className="card">
            <h2>Your Wallet</h2>
            <p><strong>Name:</strong> {wallet.name}</p>
            <p><strong>Phone:</strong> {wallet.phone}</p>
            <p><strong>Balance:</strong> ${wallet.balance}</p>
            <div className="input-group">
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>
            <div className="btn-group">
              <button onClick={handleDeposit} disabled={loading}>Deposit</button>
              <button onClick={handleWithdraw} disabled={loading}>Withdraw</button>
            </div>
          </div>

          <div className="card">
            <h3>Make Payment to Driver</h3>
            <select value={driverId} onChange={(e) => setDriverId(e.target.value)} disabled={loading}>
              <option value="">Select driver</option>
              {drivers.map(driver => (
                <option key={driver._id} value={driver._id}>
                  {driver.name} ({driver.phone})
                </option>
              ))}
            </select>
            <button onClick={handlePayment} disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
              Pay Driver
            </button>
            {message && <p className="message">{message}</p>}
          </div>
        </>
      ) : (
        <p>Loading wallet...</p>
      )}
    </div>
  );
};

export default WalletPayment;
