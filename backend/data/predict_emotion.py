import sys
import pickle
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
import json
import os

# Suppress TensorFlow logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Load model & tokenizer using paths relative to the script's directory
model_path = os.path.join(os.path.dirname(__file__), "emotion_model.h5")
model = tf.keras.models.load_model(model_path)

tokenizer_path = os.path.join(os.path.dirname(__file__), "tokenizer.pkl")
with open(tokenizer_path, "rb") as f:
    tokenizer = pickle.load(f)

label_encoder_path = os.path.join(os.path.dirname(__file__), "label_encoder.pkl")
with open(label_encoder_path, "rb") as f:
    label_encoder = pickle.load(f)

def predict_emotion(text):
    sequence = tokenizer.texts_to_sequences([text])
    padded = pad_sequences(sequence, maxlen=50, padding="post", truncating="post")
    
    # Disable progress bar output
    prediction = model.predict(padded, verbose=0)
    predicted_label = np.argmax(prediction)
    emotion = label_encoder.inverse_transform([predicted_label])[0]
    
    response = {
        'emotion': emotion,
        'confidence': float(np.max(prediction))  # Convert to float for proper JSON serialization
    }
    return json.dumps(response)

if __name__ == "__main__":
    input_text = sys.argv[1]
    print(predict_emotion(input_text), end='')  # Add end='' to prevent extra newline
    sys.stdout.flush()
