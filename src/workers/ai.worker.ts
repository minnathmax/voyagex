// Destination knowledge base for the mock AI
const DEST_INFO: Record<string, { highlights: string[]; foods: string[]; tips: string }> = {
  paris: { highlights: ['Eiffel Tower at sunset','Louvre Museum','Champs-Élysées','Montmartre & Sacré-Cœur','Seine River cruise'], foods: ['Croissants','Escargot','Crêpes','French onion soup','Macarons'], tips: 'Buy a Paris Museum Pass to skip lines at major attractions.' },
  bali: { highlights: ['Ubud Rice Terraces','Tanah Lot Temple','Uluwatu Cliffside','Seminyak Beach','Mount Batur sunrise trek'], foods: ['Nasi Goreng','Satay','Babi Guling','Lawar','Jaje Bali'], tips: 'Visit temples early morning to avoid crowds and heat.' },
  tokyo: { highlights: ['Shibuya Crossing','Senso-ji Temple','Meiji Shrine','Akihabara district','Tsukiji Outer Market'], foods: ['Sushi','Ramen','Tempura','Takoyaki','Matcha desserts'], tips: 'Get a 72-hour Tokyo Metro pass for unlimited travel.' },
  santorini: { highlights: ['Oia sunset views','Red Beach','Akrotiri archaeological site','Wine tasting tour','Caldera boat cruise'], foods: ['Fava','Tomatokeftedes','Fresh seafood','Baklava','Greek salad'], tips: 'Book sunset-facing accommodation in Oia well in advance.' },
  'new york city': { highlights: ['Statue of Liberty','Central Park','Times Square','Brooklyn Bridge','Metropolitan Museum of Art'], foods: ['New York pizza','Bagels','Cheesecake','Pastrami sandwiches','Street hot dogs'], tips: 'Walk across the Brooklyn Bridge at sunrise for stunning views.' },
  dubai: { highlights: ['Burj Khalifa observation deck','Dubai Mall & Aquarium','Desert safari','Palm Jumeirah','Dubai Marina'], foods: ['Shawarma','Al Machboos','Luqaimat','Camel milk chocolate','Arabic coffee'], tips: 'Visit during winter months (Nov-Mar) for pleasant weather.' },
  maldives: { highlights: ['Overwater villa stay','Snorkeling coral reefs','Dolphin watching cruise','Underwater restaurant','Bioluminescent beach'], foods: ['Garudhiya fish soup','Mas huni','Grilled reef fish','Coconut curry','Tropical fruit platters'], tips: 'Book a seaplane transfer for breathtaking aerial views.' },
  'swiss alps': { highlights: ['Jungfraujoch (Top of Europe)','Lake Interlaken','Grindelwald First','Lauterbrunnen Valley','Swiss chocolate factory'], foods: ['Fondue','Raclette','Rösti','Swiss chocolate','Zürcher Geschnetzeltes'], tips: 'Buy a Swiss Travel Pass for unlimited train, bus, and boat rides.' },
  'machu picchu': { highlights: ['Sun Gate (Inti Punku)','Huayna Picchu hike','Temple of the Sun','Sacred Valley tour','Cusco city walk'], foods: ['Ceviche','Lomo Saltado','Cuy (guinea pig)','Quinoa soup','Pisco Sour'], tips: 'Acclimatize in Cusco for a day before heading to altitude.' },
  london: { highlights: ['Big Ben & Parliament','Tower of London','Buckingham Palace','British Museum','Camden Market'], foods: ['Fish and chips','Full English breakfast','Afternoon tea','Pie and mash','Sticky toffee pudding'], tips: 'Use an Oyster card for the cheapest public transport fares.' },
  rome: { highlights: ['Colosseum','Vatican & Sistine Chapel','Trevi Fountain','Roman Forum','Pantheon'], foods: ['Carbonara','Cacio e Pepe','Supplì','Gelato','Tiramisu'], tips: 'Book Vatican tickets online to skip the 2+ hour queue.' },
  kyoto: { highlights: ['Fushimi Inari Shrine','Arashiyama Bamboo Grove','Kinkaku-ji (Golden Pavilion)','Geisha district Gion','Tea ceremony'], foods: ['Kaiseki (multi-course meal)','Matcha sweets','Yudofu (tofu hot pot)','Tsukemono pickles','Kyoto-style ramen'], tips: 'Visit during cherry blossom (late March) or fall foliage (November).' },
  'cape town': { highlights: ['Table Mountain cable car','Cape of Good Hope','Boulders Beach penguins','V&A Waterfront','Winelands tour'], foods: ['Bobotie','Braai (BBQ)','Biltong','Cape Malay curry','Koeksisters'], tips: 'Rent a car to drive the stunning Chapman\'s Peak coastal road.' },
  barcelona: { highlights: ['Sagrada Família','Park Güell','La Rambla','Gothic Quarter','Barceloneta Beach'], foods: ['Paella','Tapas','Churros con chocolate','Patatas Bravas','Sangria'], tips: 'Book Sagrada Família tickets months ahead — they sell out fast.' },
  iceland: { highlights: ['Northern Lights viewing','Blue Lagoon','Golden Circle route','Jökulsárlón Glacier Lagoon','Skógafoss waterfall'], foods: ['Lamb stew','Skyr','Plokkfiskur','Hot dogs','Rye bread ice cream'], tips: 'Rent a 4x4 and drive the Ring Road for the ultimate experience.' },
  phuket: { highlights: ['Phi Phi Islands day trip','Big Buddha','Old Phuket Town','Patong Beach','Phang Nga Bay'], foods: ['Pad Thai','Green curry','Mango sticky rice','Tom Yum soup','Fresh coconut'], tips: 'Visit between November and February for the best weather.' },
  marrakech: { highlights: ['Jemaa el-Fnaa square','Bahia Palace','Majorelle Garden','Medina souks','Atlas Mountains day trip'], foods: ['Tagine','Couscous','Pastilla','Mint tea','Msemen flatbread'], tips: 'Haggle confidently in the souks — start at 50% of the asking price.' },
  sydney: { highlights: ['Sydney Opera House','Harbour Bridge climb','Bondi Beach','Royal Botanic Garden','Taronga Zoo ferry'], foods: ['Meat pies','Barramundi','Lamingtons','Tim Tams','Flat white coffee'], tips: 'Take the coastal walk from Bondi to Coogee for spectacular views.' },
  petra: { highlights: ['The Treasury (Al-Khazneh)','Monastery (Ad Deir)','Siq canyon walk','Royal Tombs','Petra by Night'], foods: ['Mansaf','Falafel','Knafeh','Zarb (underground BBQ)','Sage tea'], tips: 'Arrive at 6 AM when the gates open to beat the tour groups.' },
  'amalfi coast': { highlights: ['Positano village','Ravello gardens','Path of the Gods hike','Amalfi Cathedral','Capri day trip'], foods: ['Limoncello','Fresh seafood pasta','Sfogliatella','Delizia al limone','Buffalo mozzarella'], tips: 'Take the SITA bus for a thrilling (and cheap) coastal ride.' },
  serengeti: { highlights: ['Great Migration river crossing','Big Five safari','Ngorongoro Crater','Hot air balloon ride','Maasai village visit'], foods: ['Nyama Choma','Ugali','Chipsi Mayai','Pilau rice','Mandazi donuts'], tips: 'Visit June-October for the best wildlife migration viewing.' },
  banff: { highlights: ['Lake Louise','Moraine Lake','Banff Gondola','Johnston Canyon','Icefields Parkway drive'], foods: ['Alberta beef','Poutine','Smoked salmon','Maple syrup treats','Wild berry pie'], tips: 'Wake up early for Moraine Lake — the parking lot fills by 6 AM.' },
  havana: { highlights: ['Old Havana walking tour','Malecón seaside drive','Vintage car ride','Fusterlandia art project','El Capitolio'], foods: ['Ropa Vieja','Cuban sandwich','Mojito','Tostones','Arroz con pollo'], tips: 'Bring cash (Euros or USD) — ATMs and cards are unreliable.' },
  queenstown: { highlights: ['Milford Sound cruise','Bungee jumping at Kawarau Bridge','Skyline Gondola','Lake Wakatipu','Remarkables ski field'], foods: ['Fergburger','NZ lamb','Green-lipped mussels','Pavlova','Hokey Pokey ice cream'], tips: 'Book the Milford Sound cruise in advance — it\'s a 4-hour drive each way.' },
  jaipur: { highlights: ['Amber Fort','Hawa Mahal','City Palace','Jantar Mantar','Nahargarh Fort sunset'], foods: ['Dal Baati Churma','Laal Maas','Ghevar','Pyaaz Kachori','Lassi'], tips: 'Hire a local guide at Amber Fort for the best stories and hidden gems.' },
};

self.addEventListener('message', async (event: MessageEvent) => {
    const { text } = event.data;

    try {
        self.postMessage({ status: 'init' });

        for (let i = 0; i <= 100; i += 25) {
            self.postMessage({ status: 'progress', progress: { progress: i } });
            await new Promise(resolve => setTimeout(resolve, 80));
        }

        self.postMessage({ status: 'ready' });
        await new Promise(resolve => setTimeout(resolve, 400));

        const promptLower = text.toLowerCase();

        // Find matching destination
        let destKey = '';
        let destName = 'your destination';
        for (const key of Object.keys(DEST_INFO)) {
            if (promptLower.includes(key)) {
                destKey = key;
                destName = key.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
                break;
            }
        }
        // Fallback: try to extract from "to X with" pattern
        if (!destKey) {
            const match = promptLower.match(/to\s+([a-z\s]+?)\s+with/);
            if (match && match[1]) {
                const extracted = match[1].trim();
                for (const key of Object.keys(DEST_INFO)) {
                    if (key.includes(extracted) || extracted.includes(key)) {
                        destKey = key;
                        destName = key.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
                        break;
                    }
                }
                if (!destKey) destName = extracted.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
            }
        }

        const info = destKey ? DEST_INFO[destKey] : null;
        let mockResponse = '';

        if (promptLower.includes('summary')) {
            if (info) {
                mockResponse = `Get ready for an unforgettable journey to ${destName}! You'll experience world-class highlights like ${info.highlights[0]} and ${info.highlights[1]}, savor incredible local dishes such as ${info.foods[0]} and ${info.foods[1]}, and create memories that last a lifetime. Pro tip: ${info.tips}`;
            } else {
                mockResponse = `Get ready for an unforgettable journey to ${destName}, where every moment is tailored to your unique preferences. You will experience a perfect blend of premium accommodations, immersive local culture, and breathtaking sights. This thoughtfully curated itinerary ensures an exceptional balance of thrilling exploration and deep relaxation.`;
            }
        } else {
            if (info) {
                mockResponse = `Here is your personalized travel plan for **${destName}**! 🌍

**Day 1: Arrival & Iconic Sights**
- **Morning:** Arrive and check into your accommodation. Enjoy a welcome meal featuring ${info.foods[0]}.
- **Afternoon:** Head straight to ${info.highlights[0]} — the absolute must-see experience.
- **Evening:** Explore the local dining scene and try authentic ${info.foods[1]} and ${info.foods[2]}.

**Day 2: Deep Dive & Adventure**
- **Morning:** Visit ${info.highlights[1]} for a truly immersive experience.
- **Afternoon:** Discover ${info.highlights[2]} — a highlight you won't forget.
- **Evening:** Enjoy ${info.highlights[3] || 'a scenic sunset walk'} and try ${info.foods[3] || 'local street food'}.

**Day 3: Hidden Gems & Farewell**
- **Morning:** Experience ${info.highlights[4] || 'a local market or cultural activity'}.
- **Afternoon:** Last chance for souvenir shopping and a final meal of ${info.foods[4] || 'regional specialties'}.
- **Evening:** Depart with unforgettable memories!

> 💡 **Pro Tip:** ${info.tips}

*This itinerary is crafted with love by VoyageX AI to give you the perfect balance of adventure, culture, and relaxation.*`;
            } else {
                mockResponse = `Here is your personalized travel plan for **${destName}**! 🌍

**Day 1: Arrival & Exploration**
- **Morning:** Arrive and settle into your premium accommodation. Enjoy a local breakfast.
- **Afternoon:** Take a guided walking tour of the main historical district.
- **Evening:** Dine at a top-rated local restaurant offering traditional cuisine.

**Day 2: Adventure & Sightseeing**
- **Morning:** Visit the most famous landmark before the crowds arrive.
- **Afternoon:** Enjoy a special activity tailored to your interests.
- **Evening:** Relax at a scenic viewpoint with panoramic views.

**Day 3: Relaxation & Departure**
- **Morning:** Explore local markets for unique souvenirs.
- **Afternoon:** Enjoy a final relaxed lunch and prepare for departure.

*This itinerary is crafted by VoyageX AI for the perfect balance of adventure and relaxation.*`;
            }
        }

        self.postMessage({ status: 'complete', output: mockResponse });

    } catch (error: any) {
        self.postMessage({ status: 'error', error: error.message });
    }
});
