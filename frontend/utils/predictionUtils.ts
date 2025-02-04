import axios from "axios";

export async function runPredictions(input: string, setLoad: (load: boolean) => void, setPrediction: (prediction: any) => void) {
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

// List of possible emotions for "correct_emotion"
export const emotionOptions = [
    "admiration",
    "amusement",
    "anger",
    "annoyance",
    "approval",
    "caring",
    "confusion",
    "curiosity",
    "desire",
    "disappointment",
    "disapproval",
    "disgust",
    "embarrassment",
    "excitement",
    "fear",
    "gratitude",
    "grief",
    "joy",
    "love",
    "nervousness",
    "optimism",
    "pride",
    "realization",
    "relief",
    "remorse",
    "sadness",
    "surprise",
    "neutral",
  ];


export async function submitFeedback(input: string, prediction: any, userFeedback: string, correctEmotion: string) {
    // Check if both feedback and correct emotion are selected
    if (userFeedback && correctEmotion) {
        try {
            // Send feedback along with the predicted data and correct emotion
            await axios.post('http://localhost:5000/api/feedback/feedback', {
                sentence: input,
                model_prediction: prediction?.emotion,
                confidence_score: prediction?.confidence,
                user_feedback: userFeedback,
                correct_emotion: correctEmotion
            });
            alert("Feedback submitted successfully!");
        } catch (error) {
            console.error("Error submitting feedback:", error);
        }
    } else {
        alert("Please provide feedback and select the correct emotion.");
    }
}

