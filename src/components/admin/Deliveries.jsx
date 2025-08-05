// src/pages/Deliveries.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaTruck, FaMapMarkerAlt, FaWeightHanging, FaUser, FaPencilAlt } from 'react-icons/fa';

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [formData, setFormData] = useState({
    shipperEmail: '',
    cargoTitle: '',
    cargoDescription: '',
    cargoType: '',
    weightEstimate: '',
    pickup: '',
    dropoff: '',
    specialInstructions: ''
  });

  const { token } = useContext(AuthContext);
  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get('https://tranzit.onrender.com/delivery/Auth');
      setDeliveries(res.data);
    } catch (err) {
      toast.error('Failed to fetch deliveries');
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://tranzit.onrender.com/delivery/Auth', formData);
      toast.success(res.data.message);
      fetchDeliveries();
    } catch (err) {
      toast.error('Error creating delivery');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this delivery?')) {
      try {
        toast.warning('Deleting...');
        await axios.delete(`https://tranzit.onrender.com/delivery/${id}`, authHeader);
        toast.dismiss();
        toast.success('Delivery deleted');
        fetchDeliveries();
      } catch (error) {
        toast.dismiss();
        toast.error(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  return (
    <motion.div
      className="p-6 max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-10 text-blue-700 text-center animate-pulse">
        🚚 Manage Deliveries
      </h1>

      {/* FORM */}
      <motion.form
        onSubmit={handleSubmit}
        className="card shadow text-light bg-primary bg-gradient p-5 rounded-4 border-0 mb-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-center fw-bold text-white mb-4">📦 Create New Delivery</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries({
            shipperEmail: [FaUser, 'Shipper Email'],
            cargoTitle: [FaTruck, 'Cargo Title'],
            cargoDescription: [FaPencilAlt, 'Cargo Description'],
            cargoType: [FaTruck, 'Cargo Type'],
            weightEstimate: [FaWeightHanging, 'Weight Estimate'],
            pickup: [FaMapMarkerAlt, 'Pickup Location'],
            dropoff: [FaMapMarkerAlt, 'Dropoff Location'],
            specialInstructions: [FaPencilAlt, 'Special Instructions']
          }).map(([key, [Icon, placeholder]]) => (
            <div key={key} className="mb-3 input-group">
              <span className="input-group-text"><Icon /></span>
              <input
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="form-control"
                placeholder={placeholder}
                required
              />
            </div>
          ))}
        </div>

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-light text-primary fw-bold">
            + Add Delivery
          </button>
        </div>
      </motion.form>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {deliveries.length === 0 && (
          <motion.p
            className="text-gray-600 col-span-full text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No deliveries found.
          </motion.p>
        )}

        {deliveries.map((delivery, i) => (
          <motion.div
            key={delivery._id || i}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">{delivery.cargoTitle}</h3>
              <p className="text-gray-700 mb-2">{delivery.cargoDescription}</p>
              <p className="text-sm text-gray-600"><strong>Type:</strong> {delivery.cargoType}</p>
              <p className="text-sm text-gray-600"><strong>Weight:</strong> {delivery.weightEstimate}</p>
              <p className="text-sm text-gray-600"><strong>Pickup:</strong> {delivery.pickup}</p>
              <p className="text-sm text-gray-600"><strong>Dropoff:</strong> {delivery.dropoff}</p>
              <p className="text-sm text-gray-600"><strong>Shipper:</strong> {delivery.shipperEmail}</p>
            </div>
            <button
              onClick={() => handleDelete(delivery._id)}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all"
            >
              🗑 Delete
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Deliveries;
