import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <div className="container text-center text-md-left">
        <div className="row">

          <div className="col-md-4 col-lg-4 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-success">
              Harvestify
            </h5>
            <p>
              Revolutionizing agriculture with smart solutions. Join us in our
              journey to a greener, sustainable future.
            </p>
          </div>

          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">
              Quick Links
            </h5>
            <p><a href="#" className="text-white text-decoration-none">Home</a></p>
            <p><a href="#" className="text-white text-decoration-none">About</a></p>
            <p><a href="#" className="text-white text-decoration-none">Services</a></p>
            <p><a href="#" className="text-white text-decoration-none">Contact</a></p>
          </div>


          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-info">
              Contact
            </h5>
            <p><i className="fas fa-home mr-3"></i> Hyderabad, India</p>
            <p><i className="fas fa-envelope mr-3"></i> support@harvestify.com</p>
            <p><i className="fas fa-phone mr-3"></i> +91 98765 43210</p>
          </div>


          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-danger">
              Follow Us
            </h5>
            <a href="#" className="btn btn-outline-light btn-floating m-1">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="btn btn-outline-light btn-floating m-1">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="btn btn-outline-light btn-floating m-1">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="btn btn-outline-light btn-floating m-1">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 text-center mt-3">
            <p className="text-muted">
              &copy; {new Date().getFullYear()} Harvestify | All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
