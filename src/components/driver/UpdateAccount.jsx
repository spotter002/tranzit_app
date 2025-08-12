import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'  // fixed path
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const UpdateAccount = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // All your fields:
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [capacityKg, setCapacityKg] = useState('');
  const [model, setModel] = useState('');
  const [isVerifiedDriver, setIsVerifiedDriver] = useState(false);
  const [availableForJobs, setAvailableForJobs] = useState(false);
  const [idNumber, setidNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch logged-in driver profile on mount
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await axios.get('https://tranzit.onrender.com/driver/Auth/profile', authHeader);
        const driver = res.data;
        
        setName(driver.name || '');
        setEmail(driver.email || '');
        setPhone(driver.phone || '');
        setIsPremium(driver.isPremium || false);
        setVehicleType(driver.vehicleType || '');
        setPlateNumber(driver.vehicleDetails?.plateNumber || '');
        setLicenseNumber(driver.vehicleDetails?.licenseNumber || '');
        setidNumber(driver.idNumber || '');
        setCapacityKg(driver.vehicleDetails?.capacityKg || '');
        setModel(driver.vehicleDetails?.model || '');
        setIsVerifiedDriver(driver.isverifiedDriver ?? true);
        setAvailableForJobs(driver.availableForJobs || true);
        setPhoto(driver.photo || '');

        setLoading(false);
      } catch (error) {
        toast.error('Failed to load driver data. Please login again.');
        navigate('/login'); // Redirect to login or wherever makes sense
      }
    };

    fetchDriver();
  }, [authHeader, navigate]);

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
          capacityKg,
          model
        },
        licenseNumber,
        idNumber,
        isVerifiedDriver,
        isPremium,
        availableForJobs,
        photo
      };

      await axios.put(
        'https://tranzit.onrender.com/driver/Auth/driver',  // Assume this endpoint uses token to identify driver
        data,
        authHeader
      );

      toast.dismiss();
      toast.success('Driver updated successfully!');
      navigate('/driver-dashboard'); // Or wherever driver should land after update
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Failed to update driver');
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <ToastContainer />
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/driver-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active fw-bold" aria-current="page">
            Edit Profile
          </li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <h5 className="text-primary mb-3">
          <i className="bi bi-pencil-square me-2"></i>Edit Profile
        </h5>
        <form onSubmit={handleSubmit}>
          {/* ... all your inputs here, same as before ... */}
          {/* I won't rewrite all inputs here, just keep your previous JSX */}
          {/* ... */}
          <button type="submit" className="btn btn-success">
            <i className="bi bi-check-circle-fill me-2"></i>Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAccount;
