const { Destination, User } = require('../models');
const bcrypt = require('bcryptjs');

const sampleDestinations = [
  {
    name: 'Paris',
    description: 'The City of Light, known for its iconic Eiffel Tower, world-class art museums, and romantic atmosphere. Experience the charm of French culture, cuisine, and history.',
    location: {
      city: 'Paris',
      country: 'France',
      coordinates: { latitude: 48.8566, longitude: 2.3522 }
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', caption: 'Eiffel Tower' },
      { url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800', caption: 'Louvre Museum' }
    ],
    category: ['city', 'cultural', 'romantic'],
    bestSeason: ['spring', 'autumn'],
    budgetRange: { min: 800, max: 2500, currency: 'USD' },
    rating: { average: 4.7, count: 1250 },
    activities: [
      { name: 'Eiffel Tower Visit', description: 'Visit the iconic iron lady', price: 35, duration: '2-3 hours' },
      { name: 'Seine River Cruise', description: 'Romantic boat tour along the Seine', price: 45, duration: '1 hour' },
      { name: 'Louvre Museum Tour', description: 'See the Mona Lisa and more', price: 50, duration: '3 hours' }
    ],
    attractions: [
      { name: 'Eiffel Tower', description: 'Iconic iron lattice tower', type: 'landmark', entryFee: 35 },
      { name: 'Louvre Museum', description: 'World\'s largest art museum', type: 'museum', entryFee: 50 },
      { name: 'Notre-Dame Cathedral', description: 'Medieval Catholic cathedral', type: 'religious', entryFee: 0 }
    ],
    accommodations: [
      { name: 'Hotel Le Marais', type: 'hotel', pricePerNight: 150, rating: 4.5, amenities: ['WiFi', 'Breakfast', 'Gym'] },
      { name: 'Paris Luxury Suites', type: 'hotel', pricePerNight: 300, rating: 4.8, amenities: ['Spa', 'Pool', 'Restaurant'] }
    ],
    weather: {
      climate: 'Temperate',
      bestTimeToVisit: 'April to June, September to November',
      averageTemperature: { summer: 25, winter: 7, spring: 15, autumn: 16 }
    },
    transport: {
      nearestAirport: 'Charles de Gaulle Airport',
      airportDistance: 25,
      localTransport: ['Metro', 'Bus', 'Taxi', 'RER']
    },
    tags: ['romantic', 'culture', 'food', 'art', 'history'],
    isActive: true,
    visitCount: 15000
  },
  {
    name: 'Bali',
    description: 'A tropical paradise known for its stunning beaches, lush rice terraces, vibrant culture, and spiritual atmosphere. Perfect for relaxation and adventure.',
    location: {
      city: 'Denpasar',
      country: 'Indonesia',
      coordinates: { latitude: -8.4095, longitude: 115.1889 }
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', caption: 'Rice Terraces' },
      { url: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800', caption: 'Beach Sunset' }
    ],
    category: ['beach', 'cultural', 'adventure'],
    bestSeason: ['summer', 'spring'],
    budgetRange: { min: 500, max: 1500, currency: 'USD' },
    rating: { average: 4.8, count: 2100 },
    activities: [
      { name: 'Ubud Monkey Forest', description: 'Sacred sanctuary with monkeys', price: 15, duration: '2 hours' },
      { name: 'Surfing Lesson', description: 'Learn to surf in Kuta', price: 40, duration: '2 hours' },
      { name: 'Temple Tour', description: 'Visit ancient Hindu temples', price: 50, duration: '4 hours' }
    ],
    attractions: [
      { name: 'Tanah Lot Temple', description: 'Sea temple on a rock formation', type: 'temple', entryFee: 10 },
      { name: 'Ubud Rice Terraces', description: 'Stunning green rice paddies', type: 'nature', entryFee: 5 },
      { name: 'Uluwatu Temple', description: 'Cliffside temple with sunset views', type: 'temple', entryFee: 15 }
    ],
    accommodations: [
      { name: 'Ubud Jungle Resort', type: 'resort', pricePerNight: 120, rating: 4.6, amenities: ['Pool', 'Spa', 'Yoga'] },
      { name: 'Seminyak Beach Villa', type: 'villa', pricePerNight: 200, rating: 4.9, amenities: ['Private Pool', 'Beach Access', 'Butler'] }
    ],
    weather: {
      climate: 'Tropical',
      bestTimeToVisit: 'April to October (Dry Season)',
      averageTemperature: { summer: 30, winter: 27, spring: 28, autumn: 29 }
    },
    transport: {
      nearestAirport: 'Ngurah Rai International Airport',
      airportDistance: 13,
      localTransport: ['Taxi', 'Scooter Rental', 'Private Driver', 'Shuttle']
    },
    tags: ['beach', 'temples', 'nature', 'surfing', 'yoga'],
    isActive: true,
    visitCount: 22000
  },
  {
    name: 'Tokyo',
    description: 'A dazzling metropolis where ancient traditions blend seamlessly with cutting-edge technology. Experience world-class dining, shopping, and unique cultural experiences.',
    location: {
      city: 'Tokyo',
      country: 'Japan',
      coordinates: { latitude: 35.6762, longitude: 139.6503 }
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', caption: 'Shibuya Crossing' },
      { url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800', caption: 'Tokyo Tower' }
    ],
    category: ['city', 'cultural', 'adventure'],
    bestSeason: ['spring', 'autumn'],
    budgetRange: { min: 1000, max: 3000, currency: 'USD' },
    rating: { average: 4.9, count: 1800 },
    activities: [
      { name: 'Tsukiji Food Tour', description: 'Explore the famous fish market', price: 80, duration: '3 hours' },
      { name: 'Sumo Wrestling Match', description: 'Watch traditional sumo wrestling', price: 60, duration: '3 hours' },
      { name: 'Cherry Blossom Viewing', description: 'See sakura in full bloom', price: 0, duration: '2 hours' }
    ],
    attractions: [
      { name: 'Senso-ji Temple', description: 'Tokyo\'s oldest Buddhist temple', type: 'temple', entryFee: 0 },
      { name: 'Tokyo Skytree', description: 'Tallest structure in Japan', type: 'landmark', entryFee: 30 },
      { name: 'Meiji Shrine', description: 'Shinto shrine in a forest', type: 'temple', entryFee: 0 }
    ],
    accommodations: [
      { name: 'Shinjuku Granbell Hotel', type: 'hotel', pricePerNight: 180, rating: 4.4, amenities: ['WiFi', 'Restaurant', 'Bar'] },
      { name: 'Traditional Ryokan', type: 'homestay', pricePerNight: 250, rating: 4.8, amenities: ['Onsen', 'Kaiseski Meals', 'Tatami Rooms'] }
    ],
    weather: {
      climate: 'Humid Subtropical',
      bestTimeToVisit: 'March to May, October to November',
      averageTemperature: { summer: 28, winter: 6, spring: 15, autumn: 18 }
    },
    transport: {
      nearestAirport: 'Narita International Airport',
      airportDistance: 60,
      localTransport: ['JR Trains', 'Metro', 'Bus', 'Taxi']
    },
    tags: ['technology', 'food', 'temples', 'shopping', 'anime'],
    isActive: true,
    visitCount: 18000
  },
  {
    name: 'Santorini',
    description: 'A stunning Greek island famous for its white-washed buildings, blue-domed churches, and breathtaking sunsets over the caldera. The ultimate romantic getaway.',
    location: {
      city: 'Fira',
      country: 'Greece',
      coordinates: { latitude: 36.3932, longitude: 25.4615 }
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', caption: 'Oia Sunset' },
      { url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', caption: 'Blue Domes' }
    ],
    category: ['beach', 'romantic', 'cultural'],
    bestSeason: ['summer', 'spring'],
    budgetRange: { min: 1200, max: 3500, currency: 'USD' },
    rating: { average: 4.9, count: 1500 },
    activities: [
      { name: 'Sunset Cruise', description: 'Catamaran cruise with dinner', price: 120, duration: '5 hours' },
      { name: 'Wine Tasting', description: 'Sample local Assyrtiko wines', price: 65, duration: '2 hours' },
      { name: 'Volcano Hike', description: 'Walk on an active volcano', price: 40, duration: '3 hours' }
    ],
    attractions: [
      { name: 'Oia Village', description: 'Famous for sunset views', type: 'village', entryFee: 0 },
      { name: 'Red Beach', description: 'Unique red volcanic sand beach', type: 'beach', entryFee: 0 },
      { name: 'Ancient Akrotiri', description: 'Minoan Bronze Age settlement', type: 'historical', entryFee: 15 }
    ],
    accommodations: [
      { name: 'Canaves Oia Suites', type: 'hotel', pricePerNight: 500, rating: 4.9, amenities: ['Infinity Pool', 'Spa', 'Caldera View'] },
      { name: 'Santorini Cave House', type: 'homestay', pricePerNight: 200, rating: 4.7, amenities: ['Kitchen', 'Terrace', 'Sea View'] }
    ],
    weather: {
      climate: 'Mediterranean',
      bestTimeToVisit: 'May to October',
      averageTemperature: { summer: 29, winter: 12, spring: 18, autumn: 22 }
    },
    transport: {
      nearestAirport: 'Santorini International Airport',
      airportDistance: 6,
      localTransport: ['Bus', 'Taxi', 'ATV Rental', 'Car Rental']
    },
    tags: ['romantic', 'sunset', 'beach', 'luxury', 'views'],
    isActive: true,
    visitCount: 12000
  },
  {
    name: 'New York City',
    description: 'The city that never sleeps! Experience world-class entertainment, iconic landmarks, diverse cuisine, and the energy of one of the world\'s greatest cities.',
    location: {
      city: 'New York',
      country: 'USA',
      coordinates: { latitude: 40.7128, longitude: -74.0060 }
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', caption: 'Times Square' },
      { url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800', caption: 'Central Park' }
    ],
    category: ['city', 'cultural', 'family'],
    bestSeason: ['spring', 'autumn'],
    budgetRange: { min: 1000, max: 4000, currency: 'USD' },
    rating: { average: 4.6, count: 3000 },
    activities: [
      { name: 'Broadway Show', description: 'Watch a world-class musical', price: 150, duration: '3 hours' },
      { name: 'Statue of Liberty Tour', description: 'Visit the iconic statue', price: 25, duration: '3 hours' },
      { name: 'Food Walking Tour', description: 'Taste NYC\'s diverse cuisine', price: 75, duration: '4 hours' }
    ],
    attractions: [
      { name: 'Central Park', description: 'Urban park in Manhattan', type: 'park', entryFee: 0 },
      { name: 'Empire State Building', description: 'Art Deco skyscraper', type: 'landmark', entryFee: 44 },
      { name: 'Metropolitan Museum', description: 'One of world\'s largest museums', type: 'museum', entryFee: 30 }
    ],
    accommodations: [
      { name: 'The Plaza Hotel', type: 'hotel', pricePerNight: 600, rating: 4.8, amenities: ['Spa', 'Butler Service', 'Fine Dining'] },
      { name: 'Pod 51 Hotel', type: 'hotel', pricePerNight: 150, rating: 4.2, amenities: ['WiFi', 'Rooftop', 'Central Location'] }
    ],
    weather: {
      climate: 'Humid Subtropical',
      bestTimeToVisit: 'April to June, September to November',
      averageTemperature: { summer: 29, winter: 2, spring: 16, autumn: 18 }
    },
    transport: {
      nearestAirport: 'JFK International Airport',
      airportDistance: 26,
      localTransport: ['Subway', 'Bus', 'Taxi', 'Uber']
    },
    tags: ['city', 'entertainment', 'shopping', 'food', 'museums'],
    isActive: true,
    visitCount: 35000
  },
  {
    name: 'Dubai',
    description: 'A futuristic city in the desert known for luxury shopping, ultramodern architecture, and a lively nightlife scene. Experience the extraordinary!',
    location: {
      city: 'Dubai',
      country: 'UAE',
      coordinates: { latitude: 25.2048, longitude: 55.2708 }
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', caption: 'Burj Khalifa' },
      { url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800', caption: 'Desert Safari' }
    ],
    category: ['city', 'adventure', 'luxury'],
    bestSeason: ['winter', 'spring'],
    budgetRange: { min: 1500, max: 5000, currency: 'USD' },
    rating: { average: 4.7, count: 1700 },
    activities: [
      { name: 'Desert Safari', description: 'Dune bashing and BBQ dinner', price: 80, duration: '6 hours' },
      { name: 'Burj Khalifa Visit', description: 'World\'s tallest building', price: 45, duration: '2 hours' },
      { name: 'Luxury Shopping', description: 'Shop at Dubai Mall', price: 0, duration: '4 hours' }
    ],
    attractions: [
      { name: 'Burj Khalifa', description: 'World\'s tallest building', type: 'landmark', entryFee: 45 },
      { name: 'Dubai Mall', description: 'One of world\'s largest malls', type: 'shopping', entryFee: 0 },
      { name: 'Palm Jumeirah', description: 'Artificial palm-shaped island', type: 'landmark', entryFee: 0 }
    ],
    accommodations: [
      { name: 'Burj Al Arab', type: 'hotel', pricePerNight: 1200, rating: 4.9, amenities: ['Private Beach', 'Helipad', 'Butler Service'] },
      { name: 'Atlantis The Palm', type: 'resort', pricePerNight: 400, rating: 4.7, amenities: ['Water Park', 'Aquarium', 'Spa'] }
    ],
    weather: {
      climate: 'Desert',
      bestTimeToVisit: 'November to March',
      averageTemperature: { summer: 41, winter: 24, spring: 30, autumn: 35 }
    },
    transport: {
      nearestAirport: 'Dubai International Airport',
      airportDistance: 15,
      localTransport: ['Metro', 'Taxi', 'Bus', 'Tram']
    },
    tags: ['luxury', 'shopping', 'desert', 'architecture', 'beach'],
    isActive: true,
    visitCount: 20000
  }
];

const seedDatabase = async () => {
  try {
    console.log('Seeding destinations...');
    
    // Clear existing destinations
    await Destination.deleteMany({});
    console.log('Cleared existing destinations');
    
    // Insert sample destinations
    await Destination.insertMany(sampleDestinations);
    console.log(`Inserted ${sampleDestinations.length} destinations`);
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@voyagex.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@voyagex.com',
      phone: '+1-555-ADMIN',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      isBlocked: false
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@voyagex.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

module.exports = { seedDatabase, createAdminUser };
