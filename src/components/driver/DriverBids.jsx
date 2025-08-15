import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const DriverBids = () => {
  const { user, token } = useContext(AuthContext); // user is a driver
  const [jobs, setJobs] = useState([]);
  const [amount, setAmount] = useState("");
  const [eta, setEta] = useState("");
  const [myBids, setMyBids] = useState([]);
  const [editBidId, setEditBidId] = useState(null);
  const [bidInputs, setBidInputs] = useState({}); // { jobId: { amount: '', eta: '' } }
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const res = await axios.get("https://tranzit.onrender.com/delivery/Auth/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const openJobs = res.data.filter(
        (j) => !j.driverId && (j.status === "posted" || j.status === "cancelled")
      );
      setJobs(openJobs);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching jobs");
    }
  };

  const fetchMyBids = async () => {
    try {
      const res = await axios.get(
        `https://tranzit.onrender.com/bid/Auth/driver`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyBids(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching your bids");
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchMyBids();
  }, []);

const handleCreateBid = async (jobId, amount, eta) => {
  if (!amount || !eta) return toast.error("Please enter bid amount and ETA");

  // Check if already bid for this job
  const alreadyBid = myBids.some(b => b.jobId?._id === jobId);
  if (alreadyBid) {
    return toast.error("You have already placed a bid for this job");
  }

  try {
    const res = await axios.post(
      "https://tranzit.onrender.com/bid/Auth/",
      { jobId, driverId: user._id, amount, estimatedArrivalMinutes: eta },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('jobId', jobId, 'amount', amount, 'eta', eta , 'driverId', user._id);
    toast.success(res.data.message);
    setBidInputs({ ...bidInputs, [jobId]: { amount: "", eta: "" } });
    fetchMyBids();
  } catch (err) {
    console.error(err);
    toast.error("Error placing bid");
  }
};


  const handleUpdateBid = async (id) => {
    try {
      const res = await axios.put(
        `https://tranzit.onrender.com/bid/Auth/${id}`,
        { amount, estimatedArrivalMinutes: eta },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);
      toast.success(res.data.message);
      setAmount("");
      setEta("");
      setEditBidId(null);
      fetchMyBids();
    } catch (err) {
      console.error(err);
      toast.error("Error updating bid");
    }
  };

  const handleDeleteBid = async (id) => {
    if (!window.confirm("Cancel this bid?")) return;
    try {
      const res = await axios.delete(
        `https://tranzit.onrender.com/bid/Auth/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      fetchMyBids();
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
          <li className="breadcrumb-item fw-bold">
            <Link to="/driver-dashboard">Driver Dashboard</Link>
          </li>
          <li className="breadcrumb-item active fw-bold" aria-current="page">
            Browse Jobs & Bid
          </li>
        </ol>
      </nav>

      {/* Open Jobs */}
      <div className="card p-4 shadow-sm">
        <h5 className="text-success mb-3">
          <i className="bi bi-briefcase me-2"></i>Available Jobs
        </h5>
        {jobs.length === 0 ? (
          <p className="text-muted fst-italic">No jobs available at the moment</p>
        ) : (
          <ul className="list-group">
            {jobs.map((job) => (
              <li key={job._id} className="list-group-item">
                <div>
                  <strong>{job.cargoTitle}</strong> - {job.cargoType} ({job.weightEstimate})
                </div>
                <div>
                  Pickup: {job.pickup?.address} → Dropoff: {job.dropoff?.address}
                </div>
                <div className="mt-2 d-flex">
                  <input
                    type="number"
                    className="form-control me-2"
                    placeholder="Bid Amount"
                    value={bidInputs[job._id]?.amount || ""}
                    onChange={(e) =>
                      setBidInputs({
                        ...bidInputs,
                        [job._id]: { ...bidInputs[job._id], amount: e.target.value },
                      })
                    }
                  />
                  <input
                    type="number"
                    className="form-control me-2"
                    placeholder="ETA (minutes)"
                    value={bidInputs[job._id]?.eta || ""}
                    onChange={(e) =>
                      setBidInputs({
                        ...bidInputs,
                        [job._id]: { ...bidInputs[job._id], eta: e.target.value },
                      })
                    }
                  />
                 <button
                    className="btn btn-primary me-2"
                    onClick={() =>
                      handleCreateBid(
                        job._id,
                        bidInputs[job._id]?.amount,
                        bidInputs[job._id]?.eta
                      )
                    }
                  >
                    Submit Bid
                  </button>
                  <button
                    className="btn btn-outline-info"
                    onClick={() => navigate(`/job-bids/${job._id}`, { state: { job } })}
                  >
                    View All Bids
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* My Bids */}
      <div className="card mt-4 p-3 shadow-sm">
        <h5 className="text-primary mb-3">
          <i className="bi bi-cash-coin me-2"></i>My Bids
        </h5>
        {myBids.length === 0 ? (
          <p className="text-muted fst-italic">You haven't placed any bids</p>
        ) : (
          <ul className="list-group">
            {myBids.map((bid) => (
              <li key={bid._id} className="list-group-item">
                <div>
                  <strong>{bid.jobId?.cargoTitle}</strong> - {bid.amount} KES
                </div>
                <div>
                  ETA: {bid.estimatedArrivalMinutes} min |{" "}
                  Status:{" "}
                  <span
                    className={`fw-bold ${
                      bid.status === "accepted"
                        ? "text-success"
                        : bid.status === "rejected"
                        ? "text-danger"
                        : "text-warning"
                    }`}
                  >
                    {bid.status}
                  </span>
                </div>
                <div className="mt-2 d-flex">
                  <button
                    className="btn btn-secondary btn-sm me-2"
                    onClick={() => navigate(`/bid-manager/${bid._id}`, { state: { bid } })}
                  >
                    Manage
                  </button>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditBidId(bid._id);
                      setAmount(bid.amount);
                      setEta(bid.estimatedArrivalMinutes);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteBid(bid._id)}
                  >
                    Cancel
                  </button>
                </div>
                {editBidId === bid._id && (
                  <div className="mt-2 d-flex">
                    <input
                      type="number"
                      className="form-control me-2"
                      placeholder="New Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <input
                      type="number"
                      className="form-control me-2"
                      placeholder="New ETA"
                      value={eta}
                      onChange={(e) => setEta(e.target.value)}
                    />
                    <button
                      className="btn btn-success"
                      onClick={() => handleUpdateBid(bid._id)}
                    >
                      Save
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DriverBids;
