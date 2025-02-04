import tensorflow as tf
import os

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
MODEL_PATH_H5 = os.path.join(MODEL_DIR, "emotion_model.h5")
MODEL_PATH_SAVED_MODEL = os.path.join(MODEL_DIR, "emotion_model")
MODEL_PATH_KERAS = os.path.join(MODEL_DIR, "emotion_model.keras")

# Check if the .h5 model exists
if os.path.exists(MODEL_PATH_H5):
    # Load the .h5 model
    model = tf.keras.models.load_model(MODEL_PATH_H5)
    print("Model loaded from .h5 format.")
elif os.path.exists(MODEL_PATH_SAVED_MODEL):
    # Load the model from SavedModel format
    model = tf.keras.models.load_model(MODEL_PATH_SAVED_MODEL)
    print("Model loaded from SavedModel format.")
else:
    print("Model file does not exist. Make sure the model is in either .h5 or SavedModel format.")
    exit()

# Now save the model in .keras format
model.save(MODEL_PATH_KERAS)
print(f"Model successfully saved as .keras format at {MODEL_PATH_KERAS}.")
