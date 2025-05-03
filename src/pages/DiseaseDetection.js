import { useState, useEffect } from "react";
import "./styles.css";
import Navbar from "./Navbar";

function DiseaseDetection() {
    const [file, setFile] = useState(null);
    const [language, setLanguage] = useState("English");
    const [result, setResult] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select an image file.");
            return;
        }

        setError(null);
        setResult("");
        setLoading(true);

        try {
            const base64Image = await toBase64(file);
            const base64Data = base64Image.split(",")[1];

            const prompt = {
                role: "user",
                parts: [
                    { text: `Analyze the plant image and predict the possible disease. Provide details in structured format in ${language}:` },
                    { inlineData: { mimeType: "image/jpeg", data: base64Data } }
                ]
            };

            const apiKey = "AIzaSyCrQYaMJFhGp6o-v9cRX7XOD149nLIdT74";

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: [prompt] })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.error.message}`);
            }

            const data = await response.json();
            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate insights.";

            setResult(formatResponse(generatedText));
        } catch (err) {
            console.error("API Request Failed:", err);
            setError(`Error analyzing image: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const formatResponse = (text) => {
        return text.split("\n").map((line, index) => {
            const cleanedLine = line.replace(/\*/g, "");
            const isImportant = /important|key insight|warning|critical|symptoms|treatment/i.test(cleanedLine);
            return (
                <p key={index} className={isImportant ? "text-danger fw-bold" : "mb-2"}>{cleanedLine}</p>
            );
        });
    };

    const speakText = () => {
        if (!result) return;
        stopSpeech();

        const extractText = (elements) => {
            if (typeof elements === "string") return elements;
            if (Array.isArray(elements)) return elements.map(extractText).join(" ");
            if (elements && typeof elements === "object" && elements.props) {
                return extractText(elements.props.children);
            }
            return "";
        };

        const text = extractText(result);
        const speech = new SpeechSynthesisUtterance(text);

        const langMap = {
            "English": "en-US",
            "Telugu (తెలుగు)": "te-IN",
            "Hindi (हिंदी)": "hi-IN",
            "Tamil (தமிழ்)": "ta-IN",
            "Kannada (ಕನ್ನಡ)": "kn-IN",
            "Marathi (मराठी)": "mr-IN",
            "Bengali (বাংলা)": "bn-IN",
            "Gujarati (ગુજરાતી)": "gu-IN"
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

    // Cleanup on unmount to stop speech
    useEffect(() => {
        return () => {
            stopSpeech();
        };
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <h2 className="text-center mb-4">Plant Disease Detection</h2>
                <div className="card p-4 shadow-lg">
                    <div className="form-group mb-3">
                        <label className="fw-bold">Select Language</label>
                        <select className="form-control" onChange={handleLanguageChange} value={language}>
                            <option value="English">English</option>
                            <option value="Telugu (తెలుగు)">Telugu (తెలుగు)</option>
                            <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                            <option value="Tamil (தமிழ்)">Tamil (தமிழ்)</option>
                            <option value="Kannada (ಕನ್ನಡ)">Kannada (ಕನ್ನಡ)</option>
                            <option value="Marathi (मराठी)">Marathi (मराठी)</option>
                            <option value="Bengali (বাংলা)">Bengali (বাংলা)</option>
                            <option value="Gujarati (ગુજરાતી)">Gujarati (ગુજરાતી)</option>
                        </select>
                    </div>
                    <input type="file" className="form-control mb-3" accept="image/*" onChange={handleFileChange} />
                    <button className="btn btn-danger w-100" onClick={handleUpload} disabled={loading}>
                        {loading ? "Analyzing..." : "Predict"}
                    </button>
                    {error && <p className="text-danger mt-3">{error}</p>}
                    {result && (
                        <div className="mt-4 p-3 border rounded bg-light">
                            <h3 className="text-primary">Analysis Result:</h3>
                            {result}
                            <button className="btn btn-primary mt-3 me-2" onClick={speakText} disabled={isSpeaking}>🔊 Speak</button>
                            <button className="btn btn-secondary mt-3" onClick={stopSpeech}>⏹ Stop</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DiseaseDetection;
