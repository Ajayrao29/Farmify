import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Home() {
    return (
        <div className="home-wrapper min-vh-100 d-flex flex-column" 
            style={{ 
                backgroundImage: "url('https://img.freepik.com/free-photo/beautiful-terraced-rice-field-water-season-top-view-rices-paddy-fieldthailand-generative-ai_1258-153055.jpg?ga=GA1.1.1267358041.1730314682&semt=ais_hybrid')", 
                backgroundSize: "cover", 
                backgroundPosition: "center", 
                backgroundRepeat: "no-repeat"
            }}>
            <Navbar />

            <div className="home-container container-fluid text-white text-center flex-grow-1 py-5 px-5">
                <div className="container mt-5 py-5">

                    <h1 className="display-3 fw-bold text-light">🌿 Harvestify 🌾</h1>
                    <p className="lead fw-semibold text-light">
                        Your Smart Farming Assistant - Get Real-Time Insights & Better Yield!
                    </p>

                    <div className="row mt-5">
                        {[
                            {
                                title: "🌱 Crop Recommendation",
                                description: "Find the best crop to grow based on soil & climate conditions.",
                                link: "/crop-recommend",
                                button: "Get Advice",
                                btnClass: "btn-success",
                            },
                            {
                                title: "🌾 Fertilizer Guidance",
                                description: "Discover the best fertilizers for your crop for higher yield.",
                                link: "/fertilizer",
                                button: "Learn More",
                                btnClass: "btn-primary",
                            },
                            {
                                title: "🩺 Disease Detection",
                                description: "Identify crop diseases and get remedies for healthier plants.",
                                link: "/disease",
                                button: "Detect Now",
                                btnClass: "btn-danger",
                            }
                        ].map((feature, index) => (
                            <div key={index} className="col-md-4 mb-4 d-flex">
                                <div className="card border-0 shadow-lg flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center p-4"
                                    style={{ backgroundColor: '#d4edda', minHeight: '250px' }}>
                                    <h3 className="fw-bold text-dark">{feature.title}</h3>
                                    <p className="text-muted">{feature.description}</p>
                                    <Link to={feature.link} className={`btn ${feature.btnClass} rounded-pill fw-semibold mt-3`}>
                                        {feature.button}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Home;