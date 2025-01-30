import React, { ChangeEvent, useEffect, useState } from "react";
import Loading from "./loading";
import Navbar from "../components/navbar"; // Corrected import path
import { useTheme } from "../context/themeContext"; // Corrected import path
import emotionThemes from "../themes/emo_themes"; // Importing emotionThemes from emo_themes.tsx
import axios from "axios";

interface PredictionResponse {
  emotion: string;
  confidence: number;
}

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { isDarkMode } = useTheme();
  const [rows, setRows] = useState<number>(2);
  const [input, setInput] = useState<string>("");
  const [load, setLoad] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);

  useEffect(() => {
    const inputTimeout = setTimeout(() => {
      runPredictions();
    }, 1000);
    return () => clearTimeout(inputTimeout);
  }, [input]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  async function runPredictions() {
    if (input) {
      try {
        setLoad(true);
        const response = await axios.post('http://localhost:5000/api/prediction/get-predictions', { input });
        const { emotion, confidence } = response.data;
        setPrediction({ emotion, confidence });
      } catch (error) {
        console.error('Error getting prediction:', error);
      } finally {
        setLoad(false);
      }
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    setInput(event.target.value);
  }

  return (
    <>
      <Navbar />
      <div
        className={`p-6 text-center ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
        <p className="mt-4 text-xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Paint My Mood
        </p>
        <div className="mt-4">
          <textarea
            className={`w-full p-4 mt-4 rounded-lg ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
            placeholder="Write something..."
            rows={rows}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              const textarea = e.target as HTMLTextAreaElement;
              const rows = textarea.value.split("\n").length;
              setRows(rows);
              handleInputChange(e);
            }}
          />
          
          {load && (
            <div className="mt-4">
              <p>Analyzing your text...</p>
            </div>
          )}

          {prediction && !load && (
            <div className={`mt-4 p-4 rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}>
              <h2 className="text-xl font-bold mb-2">Emotion Analysis</h2>
              <p className="mb-2">
                Detected Emotion: <span className="font-semibold">{prediction.emotion}</span>
              </p>
              <p>
                Confidence: <span className="font-semibold">{(prediction.confidence * 100).toFixed(2)}%</span>
              </p>
              <p>
                Sentence: <span className="font-semibold">{emotionThemes[prediction.emotion]}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
