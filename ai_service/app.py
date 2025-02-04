from flask import Flask, request, jsonify
import os
import pickle
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = Flask(__name__)

# Define model directory
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")

# Load model & tokenizer
MODEL_PATH = os.path.join(MODEL_DIR, "emotion_model")
TOKENIZER_PATH = os.path.join(MODEL_DIR, "tokenizer.pkl")
LABEL_ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")

model = tf.keras.models.load_model(MODEL_PATH)

with open(TOKENIZER_PATH, "rb") as f:
    tokenizer = pickle.load(f)

with open(LABEL_ENCODER_PATH, "rb") as f:
    label_encoder = pickle.load(f)

def predict_emotion(text):
    sequence = tokenizer.texts_to_sequences([text])
    padded = pad_sequences(sequence, maxlen=50, padding="post", truncating="post")
    
    prediction = model.predict(padded, verbose=0)
    predicted_label = np.argmax(prediction)
    emotion = label_encoder.inverse_transform([predicted_label])[0]
    
    return {"emotion": emotion, "confidence": float(np.max(prediction))}

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    if "text" not in data:
        return jsonify({"error": "Missing 'text' field"}), 400

    text = data["text"]
    response = predict_emotion(text)
    
    return jsonify(response)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
