/**
 * Seed Script — creates admin user and demo user.
 * Reads ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD from .env with safe defaults.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

export const seedAdmin = async (isStandalone = false) => {
  try {
    const adminName = process.env.ADMIN_NAME || 'Cinema Admin';
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@imovies.dev').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';

    // Seed Admin
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log(`✅ Admin created: ${adminEmail}`);
    }

    // Seed Demo User
    const demoEmail = 'user@imovies.dev';
    const existingUser = await User.findOne({ email: demoEmail });
    if (!existingUser) {
      await User.create({
        name: 'Demo Moviegoer',
        email: demoEmail,
        password: 'User@1234',
        role: 'user',
      });
      console.log(`✅ Demo User created: ${demoEmail}`);
    }
  } catch (err) {
    console.error('Seed admin error:', err.message);
    if (isStandalone) process.exit(1);
  }

  if (isStandalone) {
    await mongoose.disconnect();
    process.exit(0);
  }
};

if (process.argv[1] && process.argv[1].endsWith('seedAdmin.js')) {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies');
  await seedAdmin(true);
}
