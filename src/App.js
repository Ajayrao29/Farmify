import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import CropRecommendation from "./pages/CropRecommendation";
import Fertilizer from "./pages/Fertilizer";
import DiseaseDetection from "./pages/DiseaseDetection";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/crop-recommend" element={<CropRecommendation />} />
                <Route path="/fertilizer" element={<Fertilizer />} />
                <Route path="/disease" element={<DiseaseDetection />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
}

export default App;
