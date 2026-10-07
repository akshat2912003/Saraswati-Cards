const mongoose = require('mongoose');

let isConnecting = false;

const connectDB = async () => {
  if (isConnecting || mongoose.connection.readyState === 1) return;
  isConnecting = true;

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/saraswati-cards';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    isConnecting = false;
  } catch (err) {
    console.error(`⚠️ MongoDB connection error: ${err.message}`);
    console.log('🔄 Will retry connecting in 5 seconds...');
    isConnecting = false;
    setTimeout(connectDB, 5000);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Retrying...');
  setTimeout(connectDB, 5000);
});

module.exports = connectDB;
