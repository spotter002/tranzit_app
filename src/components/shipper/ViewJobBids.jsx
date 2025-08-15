import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewJobBids = () => {
  const { jobId: jobIdParam } = useParams();
  const { state } = useLocation();
  const jobId = jobIdParam || state?.job?._id; // param first, fallback to state
  const { token, user } = useContext(AuthContext);
  const [bids, setBids] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 5;

  const navigate = useNavigate();

const [jobDetails, setJobDetails] = useState(null);

// Updated fetchBids to also fetch job details
const fetchBids = async () => {
  if (!jobId) return;
  try {
    const res = await axios.get(
      `https://tranzit.onrender.com/bid/Auth/job/${jobId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setBids(res.data);

    // fetch the job details
    const jobRes = await axios.get(
      `https://tranzit.onrender.com/delivery/Auth/${jobId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setJobDetails(jobRes.data);
  } catch (err) {
    toast.error("Error fetching bids or job details");
  }
};


  const fetchMyJobs = async () => {
    try {
      const res = await axios.get("https://tranzit.onrender.com/delivery/Auth/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const myJobs = res.data.filter(
        (j) => j.shipperUserId?.email === user?.email
      );
      setJobs(myJobs);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching jobs");
    }
  };

  const handleAcceptBid = async (bidId) => {
    try {
      await axios.post(
        `https://tranzit.onrender.com/bid/Auth/accept/${bidId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Bid accepted, others rejected");
      fetchBids();
    } catch (err) {
      console.error(err);
      toast.error("Error accepting bid");
    }
  };

  useEffect(() => {
    fetchBids();
    fetchMyJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const paginatedBids = bids.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(bids.length / limit);

  return (
    <div className="container mt-4">
      <ToastContainer />
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">
            Job Bids
          </li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm mb-4">
      <h5>
        {jobDetails
          ? `Bids for Job: ${jobDetails.cargoTitle} (${new Date(jobDetails.createdAt).toLocaleDateString()})`
          : `Bids for Job #${jobId}`}
      </h5>

        {bids.length === 0 ? (
          <p className="text-muted">No bids yet</p>
        ) : (
          <>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Amount</th>
                  <th>ETA (min)</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBids.map((bid) => (
                  <tr key={bid._id}>
                    <td>{bid.driverId?.name} ({bid.driverId?.email})</td>
                    <td>{bid.amount}</td>
                    <td>{bid.estimatedArrivalMinutes}</td>
                    <td>
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
                    </td>
                    <td>
                      {bid.status !== "accepted" && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleAcceptBid(bid._id)}
                        >
                          Accept
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="d-flex justify-content-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm me-2 ${
                    page === i + 1 ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="card p-4 shadow-sm">
        <h5>My Other Jobs</h5>
        {jobs.length === 0 ? (
          <p>No jobs found</p>
        ) : (
          <ul className="list-group">
            {jobs.map((job) => (
              <li key={job._id} className="list-group-item d-flex justify-content-between">
                <span>{job.cargoTitle} ({job.status})</span>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => navigate(`/shipper-dashboard/post-delivery/view-job-bids/${job._id}`)}
                >
                  View Bids
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ViewJobBids;
