import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const RateDriver = () => {
  const { token } = useContext(AuthContext);
  const [jobId, setJobId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingRatingId, setEditingRatingId] = useState(null); // for update

  // Fetch all ratings given by this shipper
  const fetchRatings = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const shipperId = user._id;

      if (!shipperId) {
        toast.error("Shipper ID not found. Please login again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `https://tranzit.onrender.com/rating/shipper/${shipperId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRatings(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch ratings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobId || !driverId || !stars) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      if (editingRatingId) {
        // Update rating
        await axios.put(
          `https://tranzit.onrender.com/rating/${editingRatingId}`,
          { jobId, driverId, stars, comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Rating updated!");
      } else {
        // Create new rating
        await axios.post(
          "https://tranzit.onrender.com/rating",
          { jobId, driverId, stars, comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Driver rated successfully!");
      }

      // Reset form
      setJobId("");
      setDriverId("");
      setStars(0);
      setComment("");
      setEditingRatingId(null);

      // Refresh ratings list
      fetchRatings();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save rating");
    }
  };

  const handleEdit = (rating) => {
    setJobId(rating.jobId?._id || "");
    setDriverId(rating.driverId?._id || "");
    setStars(rating.stars);
    setComment(rating.comment || "");
    setEditingRatingId(rating._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this rating?")) return;

    try {
      await axios.delete(`https://tranzit.onrender.com/rating/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Rating deleted!");
      fetchRatings();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete rating");
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
            Rate Driver
          </li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm mb-4">
        <h5 className="text-primary mb-3">
          {editingRatingId ? "Update Rating" : "Rate a Driver"}
        </h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Job ID"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Driver ID"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <select
              className="form-control"
              value={stars}
              onChange={(e) => setStars(Number(e.target.value))}
              required
            >
              <option value="">Select Stars</option>
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star} ⭐
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-success">
              {editingRatingId ? "Update Rating" : "Submit Rating"}
            </button>
            {editingRatingId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditingRatingId(null);
                  setJobId("");
                  setDriverId("");
                  setStars(0);
                  setComment("");
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card p-4 shadow-sm">
        <h5 className="text-primary mb-3">My Ratings</h5>
        {loading ? (
          <p>Loading ratings...</p>
        ) : ratings.length === 0 ? (
          <p className="text-muted">No ratings found.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Job</th>
                <th>Stars</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((r) => (
                <tr key={r._id}>
                  <td>{r.driverId?.name || "N/A"}</td>
                  <td>{r.jobId?.cargoTitle || "N/A"}</td>
                  <td>{r.stars} ⭐</td>
                  <td>{r.comment || "-"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(r._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RateDriver;
