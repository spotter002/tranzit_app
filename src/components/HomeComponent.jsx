import React from "react";
import "../css/home.css";
import { Link } from "react-router-dom";

const HomeComponent = () => {
  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to={"/"}>Tranzit</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a href="#how-it-works" className="nav-link">How It Works</a>
              </li>
              <li className="nav-item">
                <a href="#features" className="nav-link">Features</a>
              </li>
              <li className="nav-item">
                <a href="#contact" className="nav-link">Contact</a>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"login"}>Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero position-relative text-white">
        <img
          src="images/download.jpeg"
          alt="banner"
          className="w-100 img-fluid"
          style={{ maxHeight: "450px", objectFit: "cover" }}
        />
        <div className="hero-content position-absolute top-50 start-50 translate-middle text-center bg-dark p-4 rounded bg-opacity-50">
          <h1>Move Anything, Anytime, Anywhere.</h1>
          <a href="#how-it-works" className="btn btn-success mt-2">See How It Works</a>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-4 text-success">How Tranzit Works</h2>
          <div className="row text-center">
            <div className="col-md-4">
              <h4>1. Post Delivery</h4>
              <p>Enter package info and pick-up/drop-off points.</p>
            </div>
            <div className="col-md-4">
              <h4>2. Get Matched</h4>
              <p>We'll link you with an idle, nearby transporter.</p>
            </div>
            <div className="col-md-4">
              <h4>3. Track in Real-time</h4>
              <p>Watch your delivery move and arrive safely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4 text-success">Why Choose Tranzit?</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">Affordable Rates</h3>
                  <p className="card-text">Fair pricing for every distance. No middleman inflation.</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">Smart Matching</h3>
                  <p className="card-text">We pair your delivery with transporters headed your way.</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">M-Pesa Integrated</h3>
                  <p className="card-text">Pay instantly via STK Push. Seamless and secure.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="text-center py-5 bg-light">
        <div className="container">
          <h2 className="text-success">Ready to Send Your First Delivery?</h2>
          <p>Join thousands of small businesses and farmers using Tranzit today.</p>
          <Link to={"/register"} className="btn btn-success">Get Started</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} Tranzit Logistics Platform. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomeComponent;
