import mongoose from 'mongoose';
import { seedAdmin } from '../utils/seedAdmin.js';
import { seedSampleData } from '../utils/seedSampleData.js';

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    // Auto-seed if database is fresh
    try {
      await seedAdmin(false);
      await seedSampleData(false);
    } catch (seedErr) {
      console.warn('⚠️ Auto-seed notice:', seedErr.message);
    }

    return conn;
  } catch (error) {
    console.warn(`⚠️ Could not reach local MongoDB at ${uri} (${error.message})`);
    console.log('🚀 Starting built-in In-Memory MongoDB for seamless zero-setup local development...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`✅ Connected to In-Memory MongoDB at: ${memUri}`);
      process.env.MONGO_URI = memUri;

      // Seed fresh database
      await seedAdmin(false);
      await seedSampleData(false);

      return conn;
    } catch (memErr) {
      console.error(`❌ In-Memory MongoDB startup error: ${memErr.message}`);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

export default connectDB;
