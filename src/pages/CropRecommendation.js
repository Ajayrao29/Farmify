import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

function CropRecommendation() {
    const [formData, setFormData] = useState({
        nitrogen: "",
        phosphorous: "",
        pottasium: "",
        ph: "",
        rainfall: "",
        city: "",
    });

    const [language, setLanguage] = useState("English");
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setPrediction(null);
        setLoading(true); // Set loading to true when the prediction starts

        const prompt = `Given these soil conditions:
        - Nitrogen: ${formData.nitrogen}
        - Phosphorous: ${formData.phosphorous}
        - Potassium: ${formData.pottasium}
        - pH: ${formData.ph}
        - Rainfall: ${formData.rainfall}
        - City: ${formData.city}

        Suggest the best crop to grow in a structured format. The response should be in ${language}.
        
        Format:
        - **Recommended Crop:** (Crop Name)
        - **Ideal Growth Conditions:** (Bullet points)
        - **Expected Yield:** (Bullet points)
        - **Additional Notes:** (Bullet points)`;

        const apiKey = "AIzaSyCrQYaMJFhGp6o-v9cRX7XOD149nLIdT74";

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate insights.";

            setPrediction(formatResponse(generatedText));
        } catch (err) {
            console.error("API Request Failed:", err);
            setError("Error fetching prediction. Check API key or request format.");
        } finally {
            setLoading(false); // Set loading to false once the prediction is done
        }
    };

    const formatResponse = (text) => {
        const lines = text.split("\n").filter(line => line.trim() !== "");
        return (
            <div className="card border-success shadow-lg mt-4">
                <div className="card-body">
                    {lines.map((line, index) => (
                        <p key={index} className={`mb-2 ${line.includes("**") ? "fw-bold text-success" : ""}`}>
                            {line.replace(/\*\*/g, "")}
                        </p>
                    ))}
                </div>
            </div>
        );
    };

    const speakText = () => {
        if (!prediction) return;
        stopSpeech(); // Stop any previous speech before starting a new one

        const extractText = (element) => {
            if (typeof element === "string") return element;
            if (Array.isArray(element)) return element.map(extractText).join(" ");
            if (element && typeof element === "object" && element.props) {
                return extractText(element.props.children);
            }
            return "";
        };

        const text = extractText(prediction);
        const speech = new SpeechSynthesisUtterance(text);

        const langMap = {
            "English": "en-US",
            "Telugu": "te-IN",
            "Hindi": "hi-IN",
            "Tamil": "ta-IN",
            "Kannada": "kn-IN",
            "Marathi": "mr-IN",
            "Bengali": "bn-IN",
            "Gujarati": "gu-IN"
        };

        speech.lang = langMap[language] || "en-US";
        speech.rate = 0.9;
        speech.pitch = 1;

        speech.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(speech);
        setIsSpeaking(true);
    };

    const stopSpeech = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    // Stop speech when component unmounts
    useEffect(() => {
        return () => stopSpeech();
    }, []);

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="card shadow-lg p-4 bg-light">
                    <h2 className="text-center text-success fw-bold">🌾 Crop Recommendation System</h2>
                    <p className="text-center text-muted">Enter the soil conditions below to get the best crop recommendation.</p>

                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="row">
                            {["nitrogen (kg/ha)", "phosphorous (kg/ha)", "pottasium (kg/ha)", "ph", "rainfall (mm/yr)", "city"].map((field) => (
                                <div className="col-md-6 mb-3" key={field}>
                                    <label className="form-label fw-bold text-success">{field.toUpperCase()}</label>
                                    <input type="text" name={field} className="form-control" onChange={handleChange} required />
                                </div>
                            ))}
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold text-success">Select Language</label>
                            <select className="form-control" onChange={handleLanguageChange} value={language}>
                                <option value="English">English</option>
                                <option value="Telugu">Telugu (తెలుగు)</option>
                                <option value="Hindi">Hindi (हिन्दी)</option>
                                <option value="Tamil">Tamil (தமிழ்)</option>
                                <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                                <option value="Marathi">Marathi (मराठी)</option>
                                <option value="Bengali">Bengali (বাংলা)</option>
                                <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-success w-100 fw-bold">Predict</button>
                    </form>

                    {error && <p className="alert alert-danger text-center mt-3">{error}</p>}

                    {loading ? (
                        <p className="text-center mt-4">Predicting...</p> // Show "Predicting..." while loading
                    ) : (
                        prediction && (
                            <div className="mt-4">
                                <h3 className="text-center text-success fw-bold">Prediction Result</h3>
                                {prediction}
                                <div className="d-flex gap-2 mt-3">
                                    <button className="btn btn-primary w-50 fw-bold" onClick={speakText}>
                                        🔊 Speak
                                    </button>
                                    <button className="btn btn-danger w-50 fw-bold" onClick={stopSpeech} disabled={!isSpeaking}>
                                        ⏹ Stop
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
}

export default CropRecommendation;
