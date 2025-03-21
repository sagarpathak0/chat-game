import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Connection with improved error handling and retry logic
const connectDB = async () => {
  try {
    // Add better timeout and connection options
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      // Increase timeout to 30 seconds
      serverSelectionTimeoutMS: 30000,
      // Socket timeout
      socketTimeoutMS: 45000,
      // Connection retry logic
      retryWrites: true,
      // Heartbeat to keep connection alive
      heartbeatFrequencyMS: 10000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Add connection event listeners for better monitoring
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });

    return mongoose;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

export default connectDB;
