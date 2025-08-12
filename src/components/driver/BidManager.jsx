import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; // assuming you store driver info here

const BidManager = ({ jobId }) => {
  const { user } = useContext(AuthContext); // driverId comes from logged-in user
  const [amount, setAmount] = useState("");
  const [eta, setEta] = useState("");
  const [myBids, setMyBids] = useState([]);
  const [editBidId, setEditBidId] = useState(null);

  // ✅ Fetch all bids by this driver
  const fetchMyBids = async () => {
    try {
      const res = await axios.get(`/api/bids/driver/${user._id}`);
      setMyBids(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyBids();
  }, []);

  // 📤 Create Bid
  const handleCreateBid = async () => {
    if (!amount || !eta) return alert("Please enter all details");

    try {
      const res = await axios.post("/api/bids", {
        jobId,
        driverId: user._id,
        amount,
        estimatedArrivalMinutes: eta,
      });

      alert(res.data.message);
      setAmount("");
      setEta("");
      fetchMyBids();
    } catch (err) {
      console.error(err);
    }
  };

  // ✏️ Update Bid
  const handleUpdateBid = async (id) => {
    try {
      const res = await axios.put(`/api/bids/${id}`, {
        amount,
        estimatedArrivalMinutes: eta,
      });

      alert(res.data.message);
      setAmount("");
      setEta("");
      setEditBidId(null);
      fetchMyBids();
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ Delete Bid
  const handleDeleteBid = async (id) => {
    if (!window.confirm("Cancel this bid?")) return;
    try {
      const res = await axios.delete(`/api/bids/${id}`);
      alert(res.data.message);
      fetchMyBids();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bid for Job</h2>

      {/* Form */}
      <div>
        <input
          type="number"
          placeholder="Bid Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="number"
          placeholder="ETA (minutes)"
          value={eta}
          onChange={(e) => setEta(e.target.value)}
        />
        {editBidId ? (
          <button onClick={() => handleUpdateBid(editBidId)}>Update Bid</button>
        ) : (
          <button onClick={handleCreateBid}>Submit Bid</button>
        )}
      </div>

      <hr />

      {/* List of My Bids */}
      <h3>My Bids</h3>
      {myBids.length === 0 ? (
        <p>No bids yet.</p>
      ) : (
        <table border="1" cellPadding="5" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Job</th>
              <th>Amount</th>
              <th>ETA</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myBids.map((bid) => (
              <tr key={bid._id}>
                <td>{bid.jobId?.cargoTitle || "Unknown"}</td>
                <td>{bid.amount}</td>
                <td>{bid.estimatedArrivalMinutes} min</td>
                <td>{bid.status || "Pending"}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditBidId(bid._id);
                      setAmount(bid.amount);
                      setEta(bid.estimatedArrivalMinutes);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBid(bid._id)}
                    style={{ color: "red" }}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BidManager;
