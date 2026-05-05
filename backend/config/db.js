const mongoose = require('mongoose');
const { getCollection, seedLocalDestinations, seedLocalUsers } = require('../localDB');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagex';
    
    if (mongoURI.includes('username:password@cluster.mongodb.net')) {
      console.warn('⚠️ MongoDB placeholder detected. Using local JSON database. ⚠️');
      global.DB_CONNECTED = false;
      global.USE_LOCAL_DB = true;

      // Expose local collections globally so controllers can use them
      global.localDB = {
        users: getCollection('users'),
        destinations: getCollection('destinations'),
        bookings: getCollection('bookings'),
        payments: getCollection('payments'),
        reviews: getCollection('reviews'),
        itineraries: getCollection('itineraries'),
      };

      // Seed destinations and users into local DB
      seedLocalDestinations();
      await seedLocalUsers();

      return null;
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.DB_CONNECTED = true;
    global.USE_LOCAL_DB = false;

    // Auto-seed MongoDB if destinations collection is empty
    try {
      const { Destination, User } = require('../src/models');
      const destCount = await Destination.countDocuments();
      if (destCount === 0) {
        const { MOCK_DESTINATIONS } = require('../src/utils/mockDestinations');
        await Destination.insertMany(MOCK_DESTINATIONS.map(d => {
          const { _id, ...rest } = d; // Remove local _id, let MongoDB generate
          return rest;
        }));
        console.log(`📦 Seeded ${MOCK_DESTINATIONS.length} destinations into MongoDB Atlas.`);
      }
      
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount === 0) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        await User.create({
          firstName: 'Admin', lastName: 'VoyageX',
          email: 'admin@voyagex.com',
          password: await bcrypt.hash('admin123', salt),
          role: 'admin', isActive: true
        });
        console.log('👤 Seeded admin user into MongoDB Atlas.');
      }

      const userCount = await User.countDocuments({ role: 'user' });
      if (userCount === 0) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        await User.create({
          firstName: 'Demo', lastName: 'User',
          email: 'user@voyagex.com',
          password: await bcrypt.hash('user123', salt),
          role: 'user', isActive: true
        });
        console.log('👤 Seeded demo user into MongoDB Atlas.');
      }
    } catch (seedErr) {
      console.warn('Seeding skipped:', seedErr.message);
    }

    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.warn('⚠️ Falling back to local JSON database. ⚠️');
    global.DB_CONNECTED = false;
    global.USE_LOCAL_DB = true;

    global.localDB = {
      users: getCollection('users'),
      destinations: getCollection('destinations'),
      bookings: getCollection('bookings'),
      payments: getCollection('payments'),
      reviews: getCollection('reviews'),
      itineraries: getCollection('itineraries'),
    };

    seedLocalDestinations();
    await seedLocalUsers();
    return null;
  }
};

module.exports = connectDB;
