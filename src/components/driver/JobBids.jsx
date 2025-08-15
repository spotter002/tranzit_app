import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const JobBids = () => {
  const { token, user } = useContext(AuthContext);
  const { jobId } = useParams();
  const location = useLocation();
  const job = location.state?.job;
  const [bids, setBids] = useState([]);
  const [editBidId, setEditBidId] = useState(null);
  const [amount, setAmount] = useState("");
  const [eta, setEta] = useState("");

  const fetchBids = async () => {
    try {
      const res = await axios.get(
        `https://tranzit.onrender.com/bid/Auth/job/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBids(res.data);
    } catch (err) {
      toast.error("Error fetching bids");
    }
  };

  const handleUpdateBid = async (bidId) => {
    try {
      const res = await axios.put(
        `https://tranzit.onrender.com/bid/Auth/${bidId}`,
        { amount, estimatedArrivalMinutes: eta },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      setEditBidId(null);
      fetchBids();
    } catch (err) {
      toast.error("Error updating bid");
    }
  };

  useEffect(() => {
    fetchBids();
  }, [jobId]);

  return (
    <div className="container mt-4">
      <h4>
        All Bids for Job: {job?.cargoTitle} ({job?.pickup?.address} → {job?.dropoff?.address})
      </h4>
      <ul className="list-group mt-3">
        {bids.map((bid) => (
          <li key={bid._id} className="list-group-item">
            <div>
              Driver: {bid.driverId?.name || "Unknown"}  
              | Amount: {bid.amount} KES  
              | ETA: {bid.estimatedArrivalMinutes} min
            </div>
            {bid.driverId?._id === user._id && (
              <>
                {editBidId === bid._id ? (
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
                ) : (
                  <button
                    className="btn btn-warning btn-sm mt-2"
                    onClick={() => {
                      setEditBidId(bid._id);
                      setAmount(bid.amount);
                      setEta(bid.estimatedArrivalMinutes);
                    }}
                  >
                    Edit My Bid
                  </button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobBids;
