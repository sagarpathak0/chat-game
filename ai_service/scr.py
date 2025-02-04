import tensorflow as tf
import os
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")


# Load the .h5 model
MODEL_PATH = os.path.join(MODEL_DIR, "emotion_model.h5")
model = tf.keras.models.load_model(MODEL_PATH)


# Save in TensorFlow's SavedModel format
model.save("emotion_model")  # This creates a folder named 'emotion_model'
