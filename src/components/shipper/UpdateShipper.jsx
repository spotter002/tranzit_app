import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const UpdateShipper = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedShipper = location.state?.shipperData;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    if (!selectedShipper) {
      toast.error('Shipper data not found. Redirecting...');
      setTimeout(() => navigate('/shipper-dashboard'), 2000);
      return;
    }

    setName(selectedShipper.name || '');
    setEmail(selectedShipper.email || '');
    setPhone(selectedShipper.phone || '');
    setCompanyName(selectedShipper.companyName || '');
    setLocationName(selectedShipper.location || '');
    setIsVerified(selectedShipper.isVerified || false);
    setPhoto(selectedShipper.photo || '');
  }, [selectedShipper, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.info('Updating shipper...');
      const data = {
        name,
        email,
        phone,
        companyName,
        location: locationName,
        isVerified,
        photo
      };

      await axios.put(
        `https://tranzit.onrender.com/shipper/Auth/${selectedShipper._id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.dismiss();
      toast.success('Shipper updated successfully!');
      navigate('/shipper-dashboard');
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Failed to update shipper');
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/shipper-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active fw-bold" aria-current="page">
            Edit Shipper Profile
          </li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <h5 className="text-primary mb-3">
          <i className="bi bi-pencil-square me-2"></i>Edit Shipper Profile
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
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                placeholder="Location"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                />
                <label className="form-check-label">Verified Shipper</label>
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

export default UpdateShipper;
