import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WalletPayment = () => {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState('');
  const [driverId, setDriverId] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch wallet and drivers on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const walletRes = await axios.get('/api/wallet'); // adjust API route
        setWallet(walletRes.data);

        const driversRes = await axios.get('/api/drivers'); // fetch available drivers
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
      const res = await axios.post('/api/wallet/deposit', { amount: Number(amount) });
      setWallet(res.data.wallet);
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
      const res = await axios.post('/api/wallet/withdraw', { amount: Number(amount) });
      setWallet(res.data.wallet);
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
      const res = await axios.post('/api/payment/payDriver', { amount: Number(amount), driverId });
      setWallet(res.data.shipperWallet); // update wallet balance after payment
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Payment failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto' }}>
      <h2>Your Wallet</h2>
      {wallet ? (
        <>
          <p><strong>Name:</strong> {wallet.name}</p>
          <p><strong>Phone:</strong> {wallet.phone}</p>
          <p><strong>Balance:</strong> ${wallet.balance.toFixed(2)}</p>

          <div>
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

          <button onClick={handleDeposit} disabled={loading}>Deposit</button>
          <button onClick={handleWithdraw} disabled={loading}>Withdraw</button>

          <hr />

          <h3>Make Payment to Driver</h3>
          <select
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            disabled={loading}
          >
            <option value="">Select driver</option>
            {drivers.map(driver => (
              <option key={driver._id} value={driver._id}>
                {driver.name} ({driver.phone})
              </option>
            ))}
          </select>
          <button onClick={handlePayment} disabled={loading}>Pay Driver</button>

          {message && <p style={{ marginTop: 20, color: 'red' }}>{message}</p>}
        </>
      ) : (
        <p>Loading wallet...</p>
      )}
    </div>
  );
};

export default WalletPayment;
