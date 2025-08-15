import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BidManager = () => {
  const { bidId: bidIdParam } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  // prefer URL param; fallback to state
  const bidId = bidIdParam || state?.bid?._id;

  const [bid, setBid] = useState(state?.bid || null);
  const [amount, setAmount] = useState(state?.bid?.amount || "");
  const [eta, setEta] = useState(state?.bid?.estimatedArrivalMinutes || "");

  const fetchBid = async () => {
    if (!bidId) return;
    try {
      const res = await axios.get(
        `https://tranzit.onrender.com/bid/Auth/${bidId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBid(res.data);
      setAmount(res.data?.amount || "");
      setEta(res.data?.estimatedArrivalMinutes || "");
    } catch (err) {
      console.error(err);
      toast.error("Error loading bid");
    }
  };

  useEffect(() => {
    if (!state?.bid) fetchBid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bidId]);

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `https://tranzit.onrender.com/bid/Auth/${bidId}`,
        { amount, estimatedArrivalMinutes: eta },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Bid updated");
      fetchBid();
    } catch (err) {
      console.error(err);
      toast.error("Error updating bid");
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this bid?")) return;
    try {
      await axios.delete(
        `https://tranzit.onrender.com/bid/Auth/${bidId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Bid cancelled");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("Error cancelling bid");
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/driver-dashboard">Driver Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Bid Manager</li>
        </ol>
      </nav>

      {!bid ? (
        <div className="card p-3 shadow-sm">
          <p className="text-muted m-0">Loading bid...</p>
        </div>
      ) : (
        <div className="card p-4 shadow-sm">
          <h5 className="mb-3">
            Manage Bid <span className="text-muted">#{bidId}</span>
          </h5>

          <div className="mb-3">
            <strong>Job:</strong> {bid.jobId?.cargoTitle} <br />
            <small className="text-muted">
              {bid.jobId?.pickup?.address} → {bid.jobId?.dropoff?.address}
            </small>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-md-4">
              <label className="form-label">Amount</label>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">ETA (minutes)</label>
              <input
                type="number"
                className="form-control"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label d-block">Status</label>
              <span
                className={`badge ${
                  bid.status === "accepted"
                    ? "bg-success"
                    : bid.status === "rejected"
                    ? "bg-danger"
                    : "bg-secondary"
                }`}
              >
                {bid.status || "pending"}
              </span>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={handleSave}>
              Save Changes
            </button>
            <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
            <button className="btn btn-danger ms-auto" onClick={handleCancel}>
              Cancel Bid
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidManager;
