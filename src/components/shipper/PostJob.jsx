import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const PostJob = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const loc = useLocation();

  const [formData, setFormData] = useState({
    shipperEmail: "",
    cargoTitle: "",
    cargoDescription: "",
    cargoType: "",
    weightEstimate: "",
    pickup: { lat: "", lng: "", address: "" },
    dropoff: { lat: "", lng: "", address: "" },
    specialInstructions: "",
  });

  const [deliveries, setDeliveries] = useState([]);
  const [editId, setEditId] = useState(null);

  // Set user email & fetch deliveries
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, shipperEmail: user.email }));
      fetchDeliveries();
    }
  }, [user]);

  // Merge location/state from map picker back into formData
  useEffect(() => {
    if (loc.state) {
      setFormData((prev) => ({ ...prev, ...loc.state }));
      if (loc.state.editId) setEditId(loc.state.editId);
    }
  }, [loc.state]);

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get("https://tranzit.onrender.com/delivery/Auth/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const myDeliveries = res.data.filter(
        (d) => d.shipperUserId?.email === user?.email
      );
      setDeliveries(myDeliveries);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching deliveries");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.info(editId ? "Updating delivery..." : "Posting delivery...");

      if (editId) {
        await axios.put(
          `https://tranzit.onrender.com/delivery/Auth/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Delivery updated successfully");
        setEditId(null);
      } else {
        await axios.post("https://tranzit.onrender.com/delivery/Auth/", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Delivery posted successfully");
      }

      fetchDeliveries();
      setFormData({
        shipperEmail: user.email,
        cargoTitle: "",
        cargoDescription: "",
        cargoType: "",
        weightEstimate: "",
        pickup: { lat: "", lng: "", address: "" },
        dropoff: { lat: "", lng: "", address: "" },
        specialInstructions: "",
      });
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Error saving delivery");
    } finally {
      toast.dismiss();
    }
  };

  const handleEdit = (delivery) => {
    setFormData({
      shipperEmail: delivery.shipperUserId?.email || user.email,
      cargoTitle: delivery.cargoTitle,
      cargoDescription: delivery.cargoDescription,
      cargoType: delivery.cargoType,
      weightEstimate: delivery.weightEstimate,
      pickup: delivery.pickup,
      dropoff: delivery.dropoff,
      specialInstructions: delivery.specialInstructions,
    });
    setEditId(delivery._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://tranzit.onrender.com/delivery/Auth/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Delivery deleted");
      fetchDeliveries();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting delivery");
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active fw-bold" aria-current="page">
            {editId ? "Edit Delivery" : "Post Delivery"}
          </li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <h5 className="text-success mb-3">
          <i className="bi bi-truck me-2"></i>
          {editId ? "Edit Delivery" : "Post New Delivery"}
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                name="cargoTitle"
                className="form-control"
                placeholder="Cargo Title"
                value={formData.cargoTitle}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                name="cargoType"
                className="form-control"
                placeholder="Cargo Type"
                value={formData.cargoType}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                name="weightEstimate"
                className="form-control"
                placeholder="Weight Estimate"
                value={formData.weightEstimate}
                onChange={handleChange}
              />
            </div>

            {/* Pickup */}
            <div className="col-md-6 mb-3">
              <label>Pickup Location</label>
              <div className="input-group">
                <input
                  className="form-control"
                  value={formData.pickup.address}
                  readOnly
                />
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() =>
                    navigate("/map-picker", {
                      state: { formData, type: "pickup", editId }
                    })
                  }
                >
                  📍 open map
                </button>
              </div>
            </div>

            {/* Dropoff */}
            <div className="col-md-6 mb-3">
              <label>Dropoff Location</label>
              <div className="input-group">
                <input
                  className="form-control"
                  value={formData.dropoff.address}
                  readOnly
                />
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() =>
                    navigate("/map-picker", {
                      state: { formData, type: "dropoff", editId }
                    })
                  }
                >
                  📍 open map
                </button>
              </div>
            </div>

            <div className="col-12 mb-3">
              <textarea
                name="cargoDescription"
                className="form-control"
                placeholder="Cargo Description"
                value={formData.cargoDescription}
                onChange={handleChange}
              />
            </div>
            <div className="col-12 mb-3">
              <textarea
                name="specialInstructions"
                className="form-control"
                placeholder="Special Instructions"
                value={formData.specialInstructions}
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success">
            <i className="bi bi-check-circle me-2"></i>
            {editId ? "Update Delivery" : "Post Delivery"}
          </button>
        </form>
      </div>

      {/* Deliveries List */}
      <div className="card mt-4 p-3 shadow-sm">
        <h5 className="text-primary mb-3">
          <i className="bi bi-box-seam me-2"></i>My Deliveries
        </h5>
        {deliveries.length === 0 ? (
          <p className="text-muted fst-italic">No deliveries found</p>
        ) : (
          <ul className="list-group">
            {deliveries.map((delivery) => (
              <li key={delivery._id} className="list-group-item">
                <div className="mb-2">
                  <strong>Shipper:</strong>{" "}
                  {delivery.shipperUserId?.name || delivery.shipperUserId?.email}
                </div>
                <div className="mb-2">
                  <strong>Cargo Title:</strong> {delivery.cargoTitle}
                </div>
                <div className="mb-2">
                  <strong>Type:</strong> {delivery.cargoType} |{" "}
                  <strong>Weight:</strong> {delivery.weightEstimate}
                </div>
                <div className="mb-2">
                  <strong>Description:</strong> {delivery.cargoDescription || "N/A"}
                </div>
                <div className="mb-2">
                  <strong>Pickup:</strong> {delivery.pickup?.address} (Lat:{" "}
                  {delivery.pickup?.lat}, Lng: {delivery.pickup?.lng})
                </div>
                <div className="mb-2">
                  <strong>Dropoff:</strong> {delivery.dropoff?.address} (Lat:{" "}
                  {delivery.dropoff?.lat}, Lng: {delivery.dropoff?.lng})
                </div>
                <div className="mb-2">
                  <strong>Special Instructions:</strong>{" "}
                  {delivery.specialInstructions || "None"}
                </div>
                <div className="d-flex justify-content-end mt-2">
                  <button
                    onClick={() => handleEdit(delivery)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(delivery._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PostJob;
