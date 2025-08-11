import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CreateWallet = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


    const authHeader = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    console.log(authHeader);
  

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('https://tranzit.onrender.com/transaction/Auth/create', {}, authHeader);
        console.log("response is",res.data);
      setMessage(res.data.message);
      setTimeout(() => navigate('/walletPayment'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create wallet');
    }
    setLoading(false);
  };

  return (
    <div className="wallet-payment-container">
      <h2>Create Wallet</h2>
      <button onClick={handleCreate} disabled={loading}>
        {loading ? 'Creating Wallet...' : 'Create Wallet'}
      </button>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CreateWallet;
