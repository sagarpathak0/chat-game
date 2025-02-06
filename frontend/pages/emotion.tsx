import React, { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../components/loading";
import Navbar from "../components/navbar";
import { useTheme } from "../context/themeContext";
import { runPredictions, submitFeedback, emotionOptions } from "../utils/predictionUtils";

interface PredictionResponse {
  emotion: string;
  confidence: number;
}

const Emotion: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { isDarkMode } = useTheme();
  const [rows, setRows] = useState<number>(2);
  const [input, setInput] = useState<string>(""); // User input text
  const [load, setLoad] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [userFeedback, setUserFeedback] = useState<string>(""); // Automatically determined feedback
  const [correctEmotion, setCorrectEmotion] = useState<string>(""); // Correct emotion selected by user
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const inputTimeout = setTimeout(() => {
      runPredictions(input, setLoad, setPrediction);
    }, 1000);
    return () => clearTimeout(inputTimeout);
  }, [input]);

  if (loading) {
    return <Loading />;
  }

  function handleInputChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    setInput(event.target.value);
  }

  function handleEmotionChange(event: ChangeEvent<HTMLSelectElement>): void {
    const selectedEmotion = event.target.value;
    setCorrectEmotion(selectedEmotion);

    // Determine user feedback based on the correct emotion and model prediction
    if (selectedEmotion === prediction?.emotion) {
      setUserFeedback("correct");
    } else {
      setUserFeedback("incorrect");
    }
  }

  return (
    <>
      <Navbar />
      <div
        className={`p-6 md:px-24 lg:px-48  ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        <div className="flex justify-center">
          <h1 className={`text-5xl lg:text-[70px] text-center my-28 md:my-36 lg:my-48 font-bold relative w-[max-content] font-mono before:absolute before:inset-0 before:animate-typewriter  after:absolute after:inset-0 after:w-[0.125em] after:animate-caret ${isDarkMode?"before:bg-gray-900 after:bg-white":"before:bg-gray-100 after:bg-gray-900"} `}>Emotion Analysis</h1>
        </div>
        <p className="mt-4 text-xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
          What Is My Mood?
        </p>
        <div className="mt-0">
          <textarea
            className={`w-full  p-4 mt-4 rounded-lg ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            } shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
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
            <>
            <h2 className="text-xl font-bold mb-2 pt-16">Emotion Analysis</h2>
            <div
              className={`mt-4 p-4 rounded-lg flex flex-row justify-around items-end${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-md`}
            >
              <p className="mb-2">
                Detected Emotion:{" "}
                <span className="font-semibold">{prediction.emotion}</span>
              </p>
              <p>
                Confidence:{" "}
                <span className="font-semibold">
                  {(prediction.confidence * 100).toFixed(2)}%
                </span>
              </p>
            </div>
            </>
          )}

          {/* Feedback Section */}
          {prediction && !load && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Provide Feedback:</h3>

              {/* Dropdown for selecting correct emotion */}
              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Select Correct Emotion:
                </label>
                <select
                  className={`w-full p-4 mt-2 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-800"
                  } shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  value={correctEmotion}
                  onChange={handleEmotionChange}
                >
                  <option value="">Select emotion</option>
                  {emotionOptions.map((emotion) => (
                    <option key={emotion} value={emotion}>
                      {emotion}
                    </option>
                  ))}
                </select>
              </div>

              <p className="mt-4 text-xl font-semibold">
                Your feedback:{" "}
                <span className="text-blue-500">{userFeedback}</span>
              </p>

              <button
                onClick={() =>
                  submitFeedback(
                    input,
                    prediction,
                    userFeedback,
                    correctEmotion
                  )
                }
                className="mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md transition duration-300"
              >
                Submit Feedback
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Emotion;
