import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

function FertilizerRecommendation() {
    const [formData, setFormData] = useState({
        cropname: "",
        nitrogen: "",
        phosphorous: "",
        pottasium: "",
    });

    const [language, setLanguage] = useState("English");
    const [recommendation, setRecommendation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false); // State to manage speaking status

    const speechRef = useRef(null); // Ref to store the speech synthesis instance

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setRecommendation(null);
        setLoading(true);

        const prompt = `Given these crop and soil conditions:
        - Crop Name: ${formData.cropname}
        - Nitrogen Level: ${formData.nitrogen}
        - Phosphorous Level: ${formData.phosphorous}
        - Potassium Level: ${formData.pottasium}

        Suggest the best fertilizer in a structured format in ${language}.
        
        Format:
        - **Recommended Fertilizer:** (Fertilizer Name)
        - **Application Method:** (Bullet points)
        - **Benefits:** (Bullet points)
        - **Additional Tips:** (Bullet points);`;

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

            setRecommendation(formatResponse(generatedText));

            // Optionally, you can trigger speech synthesis here (if desired)
            const speech = new SpeechSynthesisUtterance(generatedText);
            speech.lang = "en-US"; // Adjust based on language
            speechRef.current = speech;
        } catch (err) {
            console.error("API Request Failed:", err);
            setError("Error fetching recommendation. Please check the API.");
        } finally {
            setLoading(false);
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

    const handleStartSpeech = () => {
        if (speechRef.current) {
            speechSynthesis.speak(speechRef.current);
            setIsSpeaking(true); // Mark as speaking
        }
    };

    const handleStopSpeech = () => {
        speechSynthesis.cancel(); // Stop the speech synthesis
        setIsSpeaking(false); // Mark as stopped
    };

    useEffect(() => {
        return () => {
            // Cleanup: Stop the speech synthesis when the component unmounts
            speechSynthesis.cancel();
        };
    }, []);

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="card shadow-lg p-4 bg-light">
                    <h2 className="text-center text-success fw-bold">🌿 Fertilizer Recommendation System</h2>
                    <p className="text-center text-muted">Enter the crop and soil details to get the best fertilizer suggestion.</p>

                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="row">
                            {["cropname", "nitrogen (kg/ha)", "phosphorous (kg/ha)", "pottasium (kg/ha)"].map((field) => (
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

                        <button type="submit" className="btn btn-success w-100 fw-bold">Get Recommendation</button>
                    </form>

                    {loading && <p className="text-center text-primary mt-3">Fetching recommendation...</p>}
                    {error && <p className="alert alert-danger text-center mt-3">{error}</p>}

                    {recommendation && (
                        <div className="mt-4">
                            <h3 className="text-center text-success fw-bold">Recommendation Result</h3>
                            {recommendation}
                        </div>
                    )}

                    {/* Speech Control Buttons */}
                    {recommendation && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={handleStartSpeech}
                                className="btn btn-primary me-2"
                                disabled={isSpeaking}
                            >
                                Start Speech
                            </button>
                            <button
                                onClick={handleStopSpeech}
                                className="btn btn-danger"
                                disabled={!isSpeaking}
                            >
                                Stop Speech
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default FertilizerRecommendation;
