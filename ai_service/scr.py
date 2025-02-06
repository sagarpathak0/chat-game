import tensorflow as tf

model = tf.keras.models.load_model('C:\\Users\\sagar\\OneDrive\\desktop\\dev\\ecom\\ai_service\\model\\emotion_model.keras')
model.save('C:\\Users\\sagar\\OneDrive\\desktop\\dev\\ecom\\ai_service\\model\\emotion_model.h5')
