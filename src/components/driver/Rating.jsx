import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Rating = () => {
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(null);

  useEffect(() => {
    axios.get('/api/ratings/driver', { withCredentials: true })
      .then(res => {
        setRatings(res.data.ratings || []);
        setAverage(res.data.averageRating);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="rating-container">
      <h2>Your Overall Rating: {average ?? 'N/A'} ⭐</h2>
      {ratings.length ? (
        ratings.map((r, i) => (
          <div key={i} className="rating-card">
            <h3>{r.jobId?.cargoTitle}</h3>
            <p>{r.stars} stars</p>
            <p>{r.comment}</p>
          </div>
        ))
      ) : (
        <p>No ratings yet.</p>
      )}
    </div>
  );
};

export default Rating;
