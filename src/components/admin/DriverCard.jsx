import React from 'react';
import '../../css/DriverCard.css';

const DriverCard = ({ driver, onEdit, onDelete }) => {
  return (
    <div className="driver-card">
      <div className="card-inner">
        {/* Front */}
        <div className="card-front text-center">
          {driver.photo ? (
            <img src={driver.photo} alt={driver.name} className="driver-photo" />
          ) : (
            <img
              src="https://via.placeholder.com/90x90.png?text=No+Photo"
              alt="No Photo"
              className="driver-photo"
            />
          )}
          <h5>{driver.name}</h5>
          <p><strong>Email:</strong> {driver.email}</p>
          <p><strong>Phone:</strong> {driver.phone}</p>
          <p><strong>ID Number:</strong> {driver.idNumber || 'N/A'}</p>
          <p><strong>Rating:</strong> {driver.rating}</p>
          <p>
            <strong>Premium Driver:</strong>{' '}
            <span className={`badge ${driver.isPremium ? 'bg-success' : 'bg-secondary'}`}>
              {driver.isPremium ? 'Yes' : 'No'}
            </span>
          </p>
        </div>

        {/* Back */}
        <div className="card-back">
          <p><strong>Vehicle Type:</strong> {driver.vehicleType}</p>
          <p><strong>Plate:</strong> {driver.vehicleDetails?.plateNumber}</p>
          <p><strong>Capacity:</strong> {driver.vehicleDetails?.capacityKg} kg</p>
          <p><strong>Model:</strong> {driver.vehicleDetails?.model}</p>
          <p><strong>License No:</strong> {driver.licenseNumber}</p>
          <p><strong>Verified:</strong> {driver.isVerifiedDriver ? 'Yes' : 'No'}</p>
          <p><strong>Completed Jobs:</strong> {driver.totalCompletedJobs}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`badge ${driver.availableForJobs ? 'bg-success' : 'bg-secondary'}`}>
              {driver.availableForJobs ? 'Available' : 'Unavailable'}
            </span>
          </p>
          <div className="mt-2 d-flex justify-content-between">
            <button className="btn btn-warning btn-sm" onClick={() => onEdit(driver)}>
              <i className="bi bi-pencil"></i>
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(driver._id)}>
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverCard;
