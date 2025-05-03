import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-white bg-opacity-75 backdrop-blur shadow-sm px-5 py-3">
            <Link className="navbar-brand d-flex align-items-center text-dark fw-bold fs-3" to="/">
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/2903/2903657.png" 
                    alt="Harvestify Logo" 
                    className="me-3 rounded-circle border border-secondary shadow-sm"
                    style={{ height: "50px", width: "50px" }}
                />
                Harvestify
            </Link>

            <button 
                className="navbar-toggler border-0" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link text-dark fw-semibold px-4 py-2 rounded-pill" to="/about">
                            ℹ️ About Us
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
