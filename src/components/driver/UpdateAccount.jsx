import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const UpdateAccount = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDriver = location.state?.driverData;

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

  useEffect(() => {
    if (!selectedDriver) {
      toast.error('Driver data not found. Redirecting...');
      setTimeout(() => navigate('/driver-dashboard'), 2000);
      return;
    }

    setName(selectedDriver.name || '');
    setEmail(selectedDriver.email || '');
    setPhone(selectedDriver.phone || '');
    setIsPremium(selectedDriver.isPremium || false);
    setVehicleType(selectedDriver.vehicleType || '');
    setPlateNumber(selectedDriver.vehicleDetails?.plateNumber || '');
    setLicenseNumber(selectedDriver.vehicleDetails?.licenseNumber || '');
    setidNumber(selectedDriver.idNumber || '');
    setCapacityKg(selectedDriver.vehicleDetails?.capacityKg || '');
    setModel(selectedDriver.vehicleDetails?.model || '');
    setIsVerifiedDriver(selectedDriver.isVerifiedDriver ?? true);
    setAvailableForJobs(selectedDriver.availableForJobs || true);
    setPhoto(selectedDriver.photo || '');
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

      console.log('Update driver ID',selectedDriver)
      await axios.put(
        `https://tranzit.onrender.com/driver/Auth/driver/${selectedDriver._id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.dismiss();
      toast.success('Driver updated successfully!');
      navigate('/driver-dashboard');
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

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                placeholder="License Number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                placeholder="ID Number"
                value={idNumber}
                onChange={(e) => setidNumber(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                placeholder="Capacity (kg)"
                value={capacityKg}
                onChange={(e) => setCapacityKg(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                placeholder="Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={isVerifiedDriver}
                  onChange={(e) => setIsVerifiedDriver(e.target.checked)}
                />
                <label className="form-check-label">Verified Driver</label>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                />
                <label className="form-check-label">Premium Driver</label>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={availableForJobs}
                  onChange={(e) => setAvailableForJobs(e.target.checked)}
                />
                <label className="form-check-label">Available for Jobs</label>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label>Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPhoto(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {photo && (
                <div className="mt-2">
                  <img src={photo} alt="Preview" className="driver-photo" style={{ height: '100px' }} />
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-success">
            <i className="bi bi-check-circle-fill me-2"></i>Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAccount;
