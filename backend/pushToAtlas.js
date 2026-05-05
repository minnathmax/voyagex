#!/usr/bin/env node
/**
 * pushToAtlas.js — Migrates all local JSON database data to MongoDB Atlas.
 * 
 * Usage:
 *   1. Update your .env file with your real MongoDB Atlas connection string
 *   2. Run:  node pushToAtlas.js
 * 
 * This will upload all destinations, bookings, payments, users, reviews, 
 * and itineraries from the localdb/ JSON files into your Atlas cluster.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'localdb');

// Import models
const { User, Destination, Booking, Payment, Review, Itinerary } = require('./src/models');

const COLLECTIONS = [
  { name: 'users', model: User },
  { name: 'destinations', model: Destination },
  { name: 'bookings', model: Booking },
  { name: 'payments', model: Payment },
  { name: 'reviews', model: Review },
  { name: 'itineraries', model: Itinerary },
];

async function readLocalData(name) {
  const filePath = path.join(DB_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`⚠️ Could not read ${name}.json:`, e.message);
    return [];
  }
}

async function main() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri || uri.includes('username:password')) {
    console.error('❌ ERROR: Please set a valid MONGODB_URI in your .env file first!');
    console.error('   Example: MONGODB_URI=mongodb+srv://youruser:yourpass@cluster.mongodb.net/voyagex');
    process.exit(1);
  }

  console.log('🔗 Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB Atlas!\n');

  for (const { name, model } of COLLECTIONS) {
    const data = await readLocalData(name);
    
    if (data.length === 0) {
      console.log(`⏭️  ${name}: No local data, skipping.`);
      continue;
    }

    console.log(`📤 ${name}: Pushing ${data.length} documents...`);

    // Remove local-only _id fields that might conflict with MongoDB ObjectIDs
    const cleanedData = data.map(doc => {
      const { _id, __v, ...rest } = doc;
      // Keep _id if it looks like a valid MongoDB ObjectID (24 hex chars)
      if (_id && /^[0-9a-f]{24}$/.test(_id)) {
        return { _id, ...rest };
      }
      return rest;
    });

    try {
      // Use insertMany with ordered: false to skip duplicates
      const result = await model.insertMany(cleanedData, { ordered: false });
      console.log(`   ✅ Inserted ${result.length} documents into ${name}.`);
    } catch (err) {
      if (err.code === 11000) {
        const inserted = err.result?.insertedCount || 0;
        console.log(`   ⚠️ ${name}: ${inserted} new documents inserted, some duplicates skipped.`);
      } else {
        console.error(`   ❌ Error inserting ${name}:`, err.message);
      }
    }
  }

  console.log('\n🎉 Migration complete! Your local data is now in MongoDB Atlas.');
  console.log('💡 Tip: Update your .env with the real MONGODB_URI and restart the server.');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
