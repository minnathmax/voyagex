const fs = require('fs');
const path = require('path');

const realCities = [
  { city: 'Paris', country: 'France', type: 'city' },
  { city: 'Tokyo', country: 'Japan', type: 'city' },
  { city: 'Bali', country: 'Indonesia', type: 'beach' },
  { city: 'Kyoto', country: 'Japan', type: 'cultural' },
  { city: 'Rome', country: 'Italy', type: 'cultural' },
  { city: 'New York', country: 'USA', type: 'city' },
  { city: 'Maui', country: 'USA', type: 'beach' },
  { city: 'Swiss Alps', country: 'Switzerland', type: 'mountain' },
  { city: 'London', country: 'UK', type: 'city' },
  { city: 'Barcelona', country: 'Spain', type: 'beach' },
  { city: 'Dubai', country: 'UAE', type: 'city' },
  { city: 'Sydney', country: 'Australia', type: 'beach' },
  { city: 'Cape Town', country: 'South Africa', type: 'adventure' },
  { city: 'Banff', country: 'Canada', type: 'mountain' },
  { city: 'Santorini', country: 'Greece', type: 'romantic' },
  { city: 'Machu Picchu', country: 'Peru', type: 'adventure' },
  { city: 'Reykjavik', country: 'Iceland', type: 'adventure' },
  { city: 'Phuket', country: 'Thailand', type: 'beach' },
  { city: 'Rio de Janeiro', country: 'Brazil', type: 'beach' },
  { city: 'Amsterdam', country: 'Netherlands', type: 'city' }
];

const adjectives = ['Golden', 'Emerald', 'Sapphire', 'Sunset', 'Crystal', 'Hidden', 'Mystic', 'Royal', 'Grand', 'Secret', 'Azure', 'Tranquil', 'Silent', 'Whispering', 'Lost'];
const nouns = ['Bay', 'Coast', 'Valley', 'Peaks', 'Island', 'Springs', 'Harbor', 'Shores', 'Ridge', 'Cove', 'Retreat', 'Oasis', 'Sanctuary', 'Haven', 'Lagoon'];
const countries = ['Maldives', 'Costa Rica', 'New Zealand', 'Fiji', 'Seychelles', 'Mauritius', 'Morocco', 'Vietnam', 'Portugal', 'Croatia'];

const descriptions = [
  "A breathtaking escape featuring world-class amenities and unforgettable views.",
  "Discover the hidden gems of this spectacular location, perfect for adventurers and relaxers alike.",
  "Immerse yourself in vibrant local culture and stunning natural beauty.",
  "An iconic destination offering the perfect blend of historical charm and modern luxury.",
  "Experience pristine landscapes, crystal clear waters, and unmatched tranquility.",
  "A vibrant metropolitan hub surrounded by towering peaks and lush greenery."
];

const categoriesList = ['city', 'beach', 'mountain', 'adventure', 'romantic', 'cultural'];

let idCounter = 1;

function generateDestinations() {
  const destinations = [];

  // Add the 20 real baseline cities
  for (const base of realCities) {
    destinations.push(buildDestination(base.city, base.country, [base.type, 'romantic']));
  }

  // Generate 230 more random exotic locations
  for (let i = 0; i < 230; i++) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];

    let type = 'adventure';
    if (noun.includes('Bay') || noun.includes('Coast') || noun.includes('Island') || noun.includes('Shores')) type = 'beach';
    if (noun.includes('Peaks') || noun.includes('Ridge') || noun.includes('Valley')) type = 'mountain';

    destinations.push(buildDestination(`${adj} ${noun}`, country, [type, 'romantic']));
  }

  return destinations;
}

const imagePool = {
  beach: [
    '1507525428034-b723cf961d3e', '1519046904884-53103b34b206', '1473410338720-006f157778b0',
    '1506929641512-58e932454530', '1520942702018-0862200e9cfc', '1495954484750-af469fb2f9dd',
    '1545562083-a600704fa487', '1515238152791-8216bfdf89a7', '1510414842594-a61c69b5ae57'
  ],
  mountain: [
    '1464822759023-fed622ff2c3b', '1454496522488-7a8e488e860c', '1434394354979-a235cd36269d',
    '1465146344425-f00d5f5c8f07', '1470770841072-f978cf4d019e', '1506744038136-46273834b3fb',
    '1491555103946-3c631c5157ec', '1418489098021-ce81b0798219', '1439405326854-01518d04a4c3'
  ],
  city: [
    '1513635269975-59663e0ac1ad', '1502602898657-3e91760cbb34', '1540959733332-eab4deabeeaf',
    '1533929736458-ca588d08c8be', '1496442226666-8d4d0e62e6e9', '1526304640581-d334cdbbf45e',
    '1514565131-fce0801e5785', '1480714378408-67cf0d13bc1b', '1444723121867-7a241cacace9'
  ],
  adventure: [
    '1533240332313-0db49b459ad6', '1469474968028-56623f02e42e', '1501785888041-af3ef285b470',
    '1502791451862-7bd8c1df43a7', '1501555088652-021faa106b9b', '1500835597721-757582723360',
    '1472396961693-142e6e269027', '1441974231531-c6227db76b6e', '1470093851219-69951fcbb533'
  ],
  cultural: [
    '1524396309943-403f5fa02675', '1518709268805-4e9042af9f23', '1548013146-72479768bbaa',
    '1552832230-c0197dd311b5', '1528127269322-539801943592', '1534067783941-51c9c23ecfd3',
    '1518709268805-4e9042af9f23', '1508919857820-f0ec31a7ad03', '1506461883276-594a12b11ba3'
  ],
  romantic: [
    '1511739001486-6bfe10ce65f4', '1502602898657-3e91760cbb34', '1493976040374-85c8e9997518',
    '1537633552985-df8429e8048b', '1523906834658-6e24ef2386f9', '1516939884454-002122c9549a',
    '1518156677180-95a2893f3e9f', '1501908731313-2d2c1450259b', '1516589174184-c6c73873ba25'
  ]
};

const cityImageMap = {
  'Paris': ['1502602898657-3e91760cbb34', '1499852848443-3004de517aeb', '1511739001486-6bfe10ce65f4'],
  'Tokyo': ['1540959733332-eab4deabeeaf', '1503899036014-c24ccad6fd0a', '1493976040374-85c8e9997518'],
  'Bali': ['1537996194471-e657df975ab4', '1558271736-20027f311c97', '1519046904884-53103b34b206'],
  'Kyoto': ['1493976040374-85c8e9997518', '1476124369491-e7adef5ebff7', '1528360983277-135401969a62'],
  'Rome': ['1552832230-c0197dd311b5', '1529265470112-421f1d773539', '1525874684015-58379d421a52'],
  'New York': ['1496442226666-8d4d0e62e6e9', '1485871901521-490243047424', '1500916434205-1c21467a996e'],
  'Maui': ['1505852679233-d9fd70aff56d', '1507525428034-b723cf961d3e', '1468413253725-0d51810599a1'],
  'Swiss Alps': ['1464822759023-fed622ff2c3b', '1454496522488-7a8e488e860c', '1434394354979-a235cd36269d'],
  'London': ['1533929736458-ca588d08c8be', '1513635269975-59663e0ac1ad', '1526129314476-1bb97135016f'],
  'Barcelona': ['1473410338720-006f157778b0', '1523531294919-3b0194cf57e3', '1511527844068-d5622bb9a533'],
  'Dubai': ['1512453979798-5ea566f8310f', '1518684040210-b4a1f9e42d7e', '1489944440677-2ff90e5fc502'],
  'Sydney': ['1506973035872-a4ec16b8e889', '1524338198838-8430fd36140f', '1506929641512-58e932454530'],
  'Cape Town': ['1580619305416-f28cae9be8ae', '1551532434-274d089ba777', '1506744038136-46273834b3fb'],
  'Banff': ['1506744038136-46273834b3fb', '1465146344425-f00d5f5c8f07', '1434394354979-a235cd36269d'],
  'Santorini': ['1516483638261-f4dbaf036963', '1520942702018-0862200e9cfc', '1518709268805-4e9042af9f23'],
  'Machu Picchu': ['1526392060635-9d6019624c75', '1580216643220-304bc323085e', '1501555088652-021faa106b9b'],
  'Reykjavik': ['1476610182048-b716b8518aae', '1533240332313-0db49b459ad6', '1469474968028-56623f02e42e'],
  'Phuket': ['1528127269322-539801943592', '1519046904884-53103b34b206', '1495954484750-af469fb2f9dd'],
  'Rio de Janeiro': ['1483729558449-99ef09a8c325', '1484136540115-18f3a3f7216f', '1524338198838-8430fd36140f'],
  'Amsterdam': ['1513635269975-59663e0ac1ad', '1468413253725-0d51810599a1', '1524396309943-403f5fa02675']
};

function buildDestination(name, country, cats) {
  const imageCount = Math.floor(Math.random() * 3) + 6; // Increased to 6 to 8 images per destination
  const images = [];

  // Pick specific pool or category pool
  const pool = cityImageMap[name] || imagePool[cats[0]] || imagePool['city'];

  for (let i = 0; i < imageCount; i++) {
    const photoId = pool[i % pool.length];
    images.push({
      url: `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=800&q=80&v=2`,
      caption: `${name} View ${i + 1}`
    });
  }

  return {
    _id: `dest_${idCounter++}_${Math.random().toString(36).substr(2, 5)}`,
    name: name,
    isActive: true,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    location: {
      city: name,
      country: country,
      coordinates: {
        latitude: parseFloat((Math.random() * 180 - 90).toFixed(4)),
        longitude: parseFloat((Math.random() * 360 - 180).toFixed(4))
      }
    },
    images: images,
    category: cats,
    bestSeason: ['spring', 'summer', 'autumn', 'winter'].sort(() => 0.5 - Math.random()).slice(0, 2),
    budgetRange: {
      min: Math.floor(Math.random() * 100) * 10 + 500, // 500 to 1500
      max: Math.floor(Math.random() * 200) * 10 + 2000, // 2000 to 4000
      currency: "USD"
    },
    rating: {
      average: parseFloat((Math.random() * 1.0 + 4.0).toFixed(1)), // 4.0 to 5.0
      count: Math.floor(Math.random() * 3000) + 100
    },
    visitCount: Math.floor(Math.random() * 5000) + 500, // Important for "Popular" sorting
    activities: [
      { name: "Guided Tour", description: "Explore the main attractions with a local expert.", price: 45, duration: "3 hours", image: `https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=400&q=80` },
      { name: "Local Tasting", description: "Sample the best regional cuisine.", price: 65, duration: "2 hours", image: `https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80` }
    ],
    attractions: [
      { name: "Historic Center", description: "The beautiful heart of the region.", type: "Landmark", entryFee: 0 },
      { name: "Panoramic Viewpoint", description: "Breathtaking vistas of the surrounding area.", type: "Nature", entryFee: 15 }
    ],
    weather: {
      climate: ["Tropical", "Moderate", "Alpine", "Mediterranean"][Math.floor(Math.random() * 4)],
      temperature: { min: 15, max: 30, unit: "C" }
    },
    accommodations: [
      { name: "Grand Resort & Spa", type: "Resort", pricePerNight: 250, rating: 4.8 },
      { name: "Boutique Hotel", type: "Hotel", pricePerNight: 150, rating: 4.5 },
      { name: "Cozy Retreat", type: "Guesthouse", pricePerNight: 85, rating: 4.3 }
    ],
    transport: {
      nearestAirport: `${name} International (IAX)`,
      localTransport: ["Metro", "Bus", "Taxi", "Ride-share"]
    },
    tags: ["popular", "recommended", cats[0]]
  };
}

const finalData = generateDestinations();

fs.writeFileSync(
  path.join(__dirname, 'localdb', 'destinations.json'),
  JSON.stringify(finalData, null, 2)
);

console.log(`✅ Successfully generated ${finalData.length} massive destinations with highly detailed photo galleries!`);
