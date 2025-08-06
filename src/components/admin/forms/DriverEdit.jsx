import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const EditDriver = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedDriver = state?.driverData;

  console.log("Selected driver data:", selectedDriver);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [plateNumber, setPlateNumber] = useState('');

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (!selectedDriver) {
      toast.error('Driver not found. Redirecting...');
      setTimeout(() => navigate('/admin-dashboard/drivers'), 2000);
      return;
    }

    // Populate state with selected driver's data
    setName(selectedDriver?.name || '');
    setEmail(selectedDriver?.email || '');
    setPhone(selectedDriver?.phone || '');
    setVehicleType(selectedDriver?.vehicleType || '');
    setPlateNumber(selectedDriver?.vehicleDetails?.plateNumber || '');
  }, [selectedDriver, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.info('Updating driver...');
      const data = {
        name,
        email,
        phone,
        vehicleType,
        vehicleDetails: {
          plateNumber,
        },
      };

      await axios.put(
        `https://tranzit.onrender.com/driver/Auth/driver/${selectedDriver._id}`,
        data,
        authHeader
      );

      toast.dismiss();
      toast.success('Driver updated successfully!');
      navigate('/admin-dashboard/drivers');
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Failed to update driver');
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/admin-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item fw-bold">
            <Link to="/admin-dashboard/drivers">Drivers</Link>
          </li>
          <li className="breadcrumb-item active fw-bold" aria-current="page">
            Edit Driver
          </li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <h5 className="text-primary mb-3">
          <i className="bi bi-pencil-square me-2"></i>Edit Driver
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                placeholder="Vehicle Type"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                placeholder="Plate Number"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-success">
            <i className="bi bi-check-circle-fill me-2"></i>Update Driver
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDriver;
