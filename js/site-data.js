// ====================================================
// SHRED HIMALAYAS — SITE DATA MANAGER
// Manages all dynamic content via Firebase Firestore.
// Public pages read from this; admin panel writes to it.
// ====================================================

const SHData = (function () {
  // In-memory cache (populated by init() from Firestore)
  var _cache = null;

  // ─── DEFAULT DATA ────────────────────────────────────
  const defaults = {
    settings: {
      whatsappNumber: '919149974118',
      heroTitle: 'From the Himalayas, Beyond the ordinary',
      heroSubtitle: 'Crafting Journeys & Experiences across Kashmir for those who believe memories are life’s greatest Luxury',
      heroVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-snowy-mountain-peak-under-blue-sky-41584-large.mp4',
      footerCopyright: '© 2024 Shred Himalayas. All rights reserved. Crafted with love in Kashmir.'
    },

    about: {
      label: 'Our Story',
      titlePrefix: 'Built By ',
      titleGradient: 'Local Experts',
      quote: '"We don\'t just show you Kashmir — we share the Kashmir we grew up in, the one that lives in our hearts."',
      bio: 'Shred Himalayas was born from a passion for the mountains and a desire to show the world the real Kashmir. As locals who grew up skiing the slopes of Gulmarg and trekking the Great Lakes, we know these mountains like the back of our hands. Every experience we craft carries the authenticity that only a local can provide.',
      portraitImage: 'assets/images/founder-portrait.png',
      timeline: [
        { id: 't1', year: '2018', text: 'Started as local ski guides in Gulmarg, sharing our passion with travelers.', enabled: true },
        { id: 't2', year: '2020', text: 'Officially launched Shred Himalayas as a licensed premium travel company.', enabled: true },
        { id: 't3', year: '2022', text: 'Expanded to trekking, sightseeing, and luxury tour packages across Kashmir.', enabled: true },
        { id: 't4', year: '2024', text: 'Trusted by 2000+ guests with a perfect 5-star rating on Google Reviews.', enabled: true }
      ]
    },

    seo: {
      metaTitle: 'Shred Himalayas — Premium Himalayan Adventures & Ski Experiences in Kashmir',
      metaDescription: 'Luxury adventures, ski experiences, treks, and bespoke Himalayan journeys crafted by local experts in Kashmir. Experience the Himalayas beyond the ordinary.',
      metaKeywords: 'Kashmir skiing, Gulmarg ski resort, heliskiing Kashmir, Kashmir snowboarding, Himalayan trekking, Kashmir luxury travel, Gulmarg gondola, Kashmir tour packages, Kashmir adventure sports, snowboarding Gulmarg, ski lessons Kashmir, backcountry skiing, Kashmir offbeat tours, Dal Lake houseboat, Pahalgam trekking, Sonamarg glacier, Kashmir winter sports, Kashmir mountain guide, premium Kashmir tours, Shred Himalayas',
      ogTitle: 'Shred Himalayas — Premium Himalayan Adventures',
      ogDescription: 'Crafting extraordinary ski, snowboard, trek, and luxury travel experiences in the heart of the Himalayas. Book your Kashmir adventure with local experts.',
      ogImage: 'assets/images/hero-mountains.png',
      ogUrl: 'https://shredhimalayas.com',
      twitterCard: 'summary_large_image',
      twitterSite: '@ShredHimalayas',
      twitterTitle: 'Shred Himalayas — Premium Himalayan Adventures',
      twitterDescription: 'Crafting extraordinary ski, snowboard, trek, and luxury travel experiences in the heart of the Himalayas.',
      canonicalUrl: 'https://shredhimalayas.com',
      robotsDirective: 'index, follow',
      schemaEnabled: true
    },

    contacts: [
      {
        id: 'c1',
        name: 'Tangmarg Head Office',
        badge: 'Shred Himalayas Expeditions',
        subtitle: 'We are here to craft your bespoke Kashmiri experience.',
        address: 'Chandilora, Tangmarg Gulmarg Road\nBaramulla Kashmir, India 193402',
        mapUrl: 'https://maps.google.com/?q=Chandilora,+Tangmarg+Gulmarg+Road,+Baramulla+Kashmir',
        email: 'loneakash7753@gmai.com',
        phone: '+91 91499 74118',
        whatsapp: '919149974118',
        isDefault: true,
        enabled: true
      }
    ],

    team: [
      {
        id: 't1',
        name: 'Akash Lone',
        role: 'Founder & Lead Himalayan Guide',
        badge: '12+ Yrs Exp',
        description: 'Native of Tangmarg with over 12 years of high-altitude mountaineering, ski coaching, and backcountry leadership across Gulmarg and Kashmir passes.',
        photo: 'assets/images/akash-avatar.jpg',
        whatsapp: '919149974118',
        enabled: true
      },
      {
        id: 't2',
        name: 'Tariq Ahmad',
        role: 'Senior Ski & Snowboard Instructor',
        badge: 'Certified Coach',
        description: 'FIS-certified alpine ski instructor specializing in technical slope coaching, powder carving, and backcountry avalanche safety protocols.',
        photo: 'assets/images/skiing-action.png',
        whatsapp: '919149974118',
        enabled: true
      },
      {
        id: 't3',
        name: 'Rayees Bhatt',
        role: 'Trek Leader & Expedition Specialist',
        badge: 'Expedition Lead',
        description: 'Veteran Himalayan trek leader who has successfully guided 150+ expeditions through Kashmir Great Lakes, Sonamarg glaciers, and Gurez Valley.',
        photo: 'assets/images/trekking-landscape.png',
        whatsapp: '919149974118',
        enabled: true
      }
    ],

    skiing: [
      {
        id: 'cat-learn-ski', title: 'Learn to Ski',
        items: [
          { id: 's1', title: 'Basic Skiing Package', price: '₹14,999', description: 'Perfect for first-timers. Learn the fundamentals of skiing with our certified instructors on gentle slopes. Includes all equipment and personalized coaching.', badge: 'Beginner', meta1: '3 Days', meta2: 'Private Instructor', meta3: 'All Equipment', includes: 'Equipment Rental,Instructor,Gondola Pass,Safety Gear', image: 'assets/images/skiing-action.png', waMsg: "I'm interested in the Basic Skiing Package" },
          { id: 's2', title: 'Intermediate Skiing Package', price: '₹19,999', description: 'Take your skiing to the next level. Master parallel turns, tackle blue runs, and build confidence on varied terrain with expert guidance.', badge: 'Intermediate', meta1: '4 Days', meta2: 'Private Instructor', meta3: 'Blue & Red Runs', includes: 'Equipment Rental,Instructor,Gondola Pass,Video Analysis', image: 'assets/images/gallery-gulmarg.png', waMsg: "I'm interested in the Intermediate Skiing Package" },
          { id: 's3', title: 'Advanced Skiing Package', price: '₹24,999', description: "For experienced skiers looking to conquer Gulmarg's legendary terrain. Off-piste runs, steep chutes, and deep powder coaching with expert local guides.", badge: 'Advanced', meta1: '5 Days', meta2: 'Expert Guide', meta3: 'Off-Piste Access', includes: 'Premium Equipment,Expert Guide,Avalanche Kit,Gondola Pass', image: 'assets/images/hero-mountains.png', waMsg: "I'm interested in the Advanced Skiing Package" }
        ]
      },
      {
        id: 'cat-ski-holidays', title: 'Ski Holidays',
        items: [
          { id: 's4', title: 'Essential Gulmarg Ski Holiday', price: '₹34,999', description: "A complete ski holiday experience with comfortable accommodation, daily skiing, equipment, and airport transfers. Everything you need for an unforgettable Gulmarg trip.", badge: '5 Nights', meta1: '5N / 6D', meta2: '3-Star Hotel', meta3: 'Transfers Included', includes: 'Accommodation,Meals,Equipment,Instructor,Transfers', image: 'assets/images/gallery-gulmarg.png', waMsg: "I'm interested in the Essential Gulmarg Ski Holiday" },
          { id: 's5', title: 'Premium Gulmarg Ski Holiday', price: '₹49,999', description: "Elevated ski holiday with premium accommodation, daily instructor-led sessions, après-ski experiences, and a day trip to Srinagar's iconic Dal Lake.", badge: '7 Nights', meta1: '7N / 8D', meta2: '4-Star Hotel', meta3: 'All Meals', includes: 'Premium Stay,All Meals,Equipment,Instructor,Srinagar Day Trip', image: 'assets/images/kashmir-package.png', waMsg: "I'm interested in the Premium Gulmarg Ski Holiday" },
          { id: 's6', title: 'Luxury Gulmarg Skiing Retreat', price: '₹89,999', description: "The ultimate Gulmarg experience. Stay at Kashmir's finest resort, enjoy private ski coaching, gourmet dining, spa treatments, and curated cultural experiences.", badge: 'Luxury', meta1: '7N / 8D', meta2: '5-Star Resort', meta3: 'VIP Experience', includes: '5-Star Resort,Gourmet Meals,Private Coach,Spa Access,Luxury SUV', image: 'assets/images/gallery-luxury-stay.png', waMsg: "I'm interested in the Luxury Gulmarg Skiing Retreat" }
        ]
      },
      {
        id: 'cat-elite-ski', title: 'Elite Experiences',
        items: [
          { id: 's7', title: 'Gulmarg Backcountry Ski Adventure', price: '₹59,999', description: "Venture beyond the groomed runs into Gulmarg's legendary backcountry. Guided by local experts through untouched powder bowls, pristine tree runs, and open faces with 360° Himalayan panoramas.", badge: 'Elite', meta1: '5 Days', meta2: 'Backcountry Access', meta3: 'Advanced Level', includes: 'Expert Guide,Avalanche Safety Kit,Premium Equipment,Accommodation', image: 'assets/images/hero-mountains.png', waMsg: "I'm interested in the Backcountry Ski Adventure" },
          { id: 's8', title: 'Gulmarg Heliskiing Experience', price: '₹1,49,999', description: "The pinnacle of skiing. Fly by helicopter to untouched Himalayan peaks and ski pristine powder runs that no gondola can reach. Limited availability — the most exclusive skiing experience in Asia.", badge: 'Exclusive', meta1: '3–5 Days', meta2: 'Helicopter Access', meta3: 'Expert Level', includes: 'Helicopter Drops,Certified Guide,Premium Equipment,Luxury Stay,Full Safety Team', image: 'assets/images/gallery-helicopter.png', waMsg: "I'm interested in the Heliskiing Experience" }
        ]
      }
    ],

    snowboarding: [
      {
        id: 'cat-learn-sb', title: 'Learn to Snowboard',
        items: [
          { id: 'sb1', title: 'Beginner Snowboard Package', price: '₹15,499', description: "Start your snowboarding journey on Gulmarg's gentle slopes. Learn balance, edge control, and basic turns with patient, certified instructors.", badge: 'Beginner', meta1: '3 Days', meta2: 'Private Coach', meta3: 'All Equipment', includes: 'Board & Boots,Instructor,Gondola Pass,Helmet', image: 'assets/images/snowboarding-action.png', waMsg: "I'm interested in the Beginner Snowboard Package" },
          { id: 'sb2', title: 'Intermediate Snowboard Package', price: '₹20,499', description: 'Progress to carving, switch riding, and tackling varied terrain. Gain confidence on blue and red runs with expert technique coaching.', badge: 'Intermediate', meta1: '4 Days', meta2: 'Expert Coach', meta3: 'Blue & Red Runs', includes: 'Board & Boots,Coach,Gondola Pass,Video Analysis', image: 'assets/images/gallery-gulmarg.png', waMsg: "I'm interested in the Intermediate Snowboard Package" },
          { id: 'sb3', title: 'Advanced Snowboard Package', price: '₹25,499', description: "Push your limits on Gulmarg's steepest terrain. Master powder riding, cliff drops, and tree runs with world-class local guides.", badge: 'Advanced', meta1: '5 Days', meta2: 'Expert Guide', meta3: 'Off-Piste', includes: 'Premium Board,Expert Guide,Avalanche Kit,Gondola Pass', image: 'assets/images/hero-mountains.png', waMsg: "I'm interested in the Advanced Snowboard Package" }
        ]
      },
      {
        id: 'cat-sb-holidays', title: 'Snowboard Holidays',
        items: [
          { id: 'sb4', title: 'Essential Gulmarg Snowboard Holiday', price: '₹35,499', description: "Complete snowboard holiday with accommodation, daily sessions, full equipment, and transfers. The perfect hassle-free Gulmarg snowboarding trip.", badge: '5 Nights', meta1: '5N / 6D', meta2: '3-Star Hotel', meta3: 'Transfers', includes: 'Accommodation,Meals,Equipment,Coach,Transfers', image: 'assets/images/snowboarding-action.png', waMsg: "I'm interested in the Essential Snowboard Holiday" },
          { id: 'sb5', title: 'Premium Gulmarg Snowboard Holiday', price: '₹50,499', description: "The ultimate snowboard holiday with premium stays, all meals, daily coaching, cultural excursions, and après-snowboarding experiences.", badge: '7 Nights', meta1: '7N / 8D', meta2: '4-Star Hotel', meta3: 'All Meals', includes: 'Premium Stay,All Meals,Equipment,Coach,Srinagar Trip', image: 'assets/images/gallery-luxury-stay.png', waMsg: "I'm interested in the Premium Snowboard Holiday" }
        ]
      },
      {
        id: 'cat-elite-sb', title: 'Elite Snowboard Experiences',
        items: [
          { id: 'sb6', title: 'Backcountry Snowboard Adventure', price: '₹60,499', description: "Leave the groomed runs behind and explore Gulmarg's endless backcountry powder. Guided splitboard tours through pristine terrain with avalanche-certified guides.", badge: 'Elite', meta1: '5 Days', meta2: 'Backcountry', meta3: 'Advanced', includes: 'Expert Guide,Splitboard,Avalanche Kit,Accommodation', image: 'assets/images/snowboarding-action.png', waMsg: "I'm interested in the Backcountry Snowboard Adventure" },
          { id: 'sb7', title: 'Heli-Snowboarding Experience', price: '₹1,50,499', description: "The ultimate ride. Helicopter access to virgin peaks, bottomless powder, and runs that defy imagination. The most exclusive snowboarding experience in the Himalayas.", badge: 'Exclusive', meta1: '3–5 Days', meta2: 'Helicopter', meta3: 'Expert', includes: 'Heli Drops,Certified Guide,Premium Gear,Luxury Stay,Safety Team', image: 'assets/images/gallery-helicopter.png', waMsg: "I'm interested in the Heli-Snowboarding Experience" }
        ]
      }
    ],

    trekking: [
      { id: 't1', title: 'Kashmir Great Lakes Trek', price: '₹16,500', description: "One of India's most beautiful treks. Walk through seven stunning alpine lakes set amidst flower-carpeted meadows and snow-capped peaks. A life-changing Himalayan journey.", difficulty: 'Moderate', difficultyClass: 'moderate', days: '7 Days / 6 Nights', altitude: '3,800m Max Altitude', distance: '72 km Distance', season: 'Jun – Sep', highlights: '7 pristine alpine lakes,Flower-carpeted meadows at Nichnai Pass,Stunning views of Kolahoi Glacier,Camping beside crystal-clear Vishansar Lake', image: 'assets/images/trekking-landscape.png', waMsg: "I'm interested in the Kashmir Great Lakes Trek" },
      { id: 't2', title: 'Tarsar Marsar Trek', price: '₹14,800', description: "A twin-lake odyssey through the Aru Valley. Two dramatically different alpine lakes — the green Tarsar and the blue Marsar — connected by a stunning high-altitude ridge walk.", difficulty: 'Moderate', difficultyClass: 'moderate', days: '6 Days / 5 Nights', altitude: '3,600m Max Altitude', distance: '48 km Distance', season: 'Jun – Sep', highlights: 'Twin alpine lakes with contrasting colors,Lush Aru Valley base camp,Dramatic Sundersar Pass crossing,Wildflower meadows and shepherd camps', image: 'assets/images/gallery-sonamarg.png', waMsg: "I'm interested in the Tarsar Marsar Trek" },
      { id: 't3', title: 'Gangbal Lake Trek', price: '₹12,500', description: "The sacred Harmukh-Gangbal circuit. Camp beside the twin Gangbal lakes at the foot of Mount Harmukh (4,724m) — one of Kashmir's most revered peaks. A trek of spiritual and natural beauty.", difficulty: 'Challenging', difficultyClass: 'challenging', days: '5 Days / 4 Nights', altitude: '3,570m Max Altitude', distance: '38 km Distance', season: 'Jun – Oct', highlights: 'Sacred Harmukh peak views,Twin glacial Gangbal lakes,Nundkol Lake camping,Rich Kashmiri cultural immersion', image: 'assets/images/gallery-pahalgam.png', waMsg: "I'm interested in the Gangbal Lake Trek" },
      { id: 't4', title: 'Gurez Valley Trek', price: '₹11,000', description: "One of India's most remote and untouched valleys. Trek through the Habba Khatoon range alongside the Kishanganga River to discover villages frozen in time and landscapes of raw beauty.", difficulty: 'Moderate', difficultyClass: 'moderate', days: '4 Days / 3 Nights', altitude: '3,200m Max Altitude', distance: '32 km Distance', season: 'Jun – Sep', highlights: 'Untouched Habba Khatoon peaks,Ancient Dard Shin villages,Kishanganga River valley,One of India\'s last frontiers', image: 'assets/images/gallery-gulmarg.png', waMsg: "I'm interested in the Gurez Valley Trek" },
      { id: 't5', title: 'Pir Panjal Trek', price: '₹22,000', description: "A high-altitude expedition crossing the mighty Pir Panjal range. Traverse glaciers, high passes above 4,000m, and experience the raw grandeur of the western Himalayas. For seasoned trekkers only.", difficulty: 'Challenging', difficultyClass: 'challenging', days: '8 Days / 7 Nights', altitude: '4,100m Max Altitude', distance: '65 km Distance', season: 'Jul – Sep', highlights: 'Cross the mighty Pir Panjal range,Glacier traversing experience,360° panoramic Himalayan views,Remote wilderness camping', image: 'assets/images/hero-mountains.png', waMsg: "I'm interested in the Pir Panjal Trek" }
    ],

    packages: [
      { id: 'p1', title: 'Luxury Kashmir Tour Package', price: '₹65,000', description: "Our signature 7-night luxury experience. Stay at Kashmir's finest hotels and houseboats, explore with private guides, enjoy gourmet Kashmiri cuisine, and experience exclusive cultural encounters. The ultimate way to discover Kashmir.", badge: 'Bestseller', duration: '7N / 8D', accommodation: '5-Star Hotels', transport: 'Luxury SUV', meals: 'All Meals', destinations: 'Srinagar,Gulmarg,Pahalgam,Sonamarg,Dal Lake', includes: '5-Star Accommodation,All Meals,Private Guide,Luxury SUV,Houseboat Night,Shikara Ride,Gondola Tickets,Airport Transfers', image: 'assets/images/kashmir-package.png', waMsg: "I'm interested in the Luxury Kashmir Tour Package" },
      { id: 'p2', title: 'Premium Kashmir Tour', price: '₹45,000', description: "A 5-night carefully curated journey through Kashmir's most iconic destinations. Premium accommodation, experienced guides, and a balanced mix of adventure and relaxation. Perfect for first-time visitors who want the best of Kashmir.", badge: 'Popular', duration: '5N / 6D', accommodation: '4-Star Hotels', transport: 'Private Cab', meals: 'Breakfast + Dinner', destinations: 'Srinagar,Gulmarg,Pahalgam,Dal Lake', includes: '4-Star Accommodation,Breakfast & Dinner,Private Guide,Private Cab,Shikara Ride,Gondola Tickets,Airport Transfers', image: 'assets/images/gallery-gulmarg.png', waMsg: "I'm interested in the Premium Kashmir Tour" },
      { id: 'p3', title: 'Kashmir Offbeat Tour', price: '₹38,000', description: "Explore Kashmir's hidden gems far from the tourist trail. Discover untouched villages, secret valleys, pristine meadows, and authentic Kashmiri culture that most visitors never see. For the true explorer who seeks the extraordinary.", badge: 'Unique', duration: '6N / 7D', accommodation: 'Boutique Stays', transport: '4x4 Vehicle', meals: 'All Meals', destinations: 'Doodhpathri,Yusmarg,Lolab Valley,Bangus Valley,Gurez Valley', includes: 'Boutique Accommodation,All Meals,Local Expert Guide,4x4 Vehicle,Cultural Experiences,Homestay Night', image: 'assets/images/gallery-sonamarg.png', waMsg: "I'm interested in the Kashmir Offbeat Tour" },
      { id: 'p4', title: 'Gurez Valley Tour Package', price: '₹28,000', description: "Journey to one of India's most remote and beautiful valleys. Cross the Razdan Pass at 3,500m, explore ancient Dard Shin villages, and discover landscapes that feel like another world. A true frontier adventure.", badge: 'Adventure', duration: '4N / 5D', accommodation: 'Guesthouses', transport: '4x4 Vehicle', meals: 'All Meals', destinations: 'Srinagar,Razdan Pass,Dawar,Habba Khatoon Peak,Tulail Valley', includes: 'Accommodation,All Meals,Local Guide,4x4 Vehicle,Permits,Airport Transfers', image: 'assets/images/gallery-pahalgam.png', waMsg: "I'm interested in the Gurez Valley Tour" },
      { id: 'p5', title: 'Kashmir Day Tours', price: '₹4,500', description: "Perfect single-day excursions for those short on time or wanting to add a day adventure to their itinerary. Choose from Gulmarg, Pahalgam, Sonamarg, or Srinagar city — each a curated full-day experience.", badge: 'Day Trip', duration: '1 Day', accommodation: '', transport: 'Private Cab', meals: 'Lunch Included', destinations: 'Gulmarg Day Trip,Pahalgam Day Trip,Sonamarg Day Trip,Srinagar City Tour', includes: 'Private Cab,Local Guide,Lunch,Entry Tickets,Hotel Pickup', image: 'assets/images/sightseeing-dal-lake.png', waMsg: "I'm interested in Kashmir Day Tours" }
    ],

    activities: {
      winter: [
        { id: 'aw1', name: 'Skiing & Snowboarding', desc: 'World-class powder runs in Gulmarg with certified instructors for all skill levels.', image: 'assets/images/skiing-action.png', badge: 'Winter', price: '₹14,999', waMsg: "I'm interested in Skiing & Snowboarding activities" },
        { id: 'aw2', name: 'Sledging & Tobogganing', desc: 'Family-friendly winter fun on snowy slopes — perfect for all ages.', image: 'assets/images/activities-winter.png', badge: 'Family Fun', price: '₹2,500', waMsg: "I'm interested in Sledging & Tobogganing" },
        { id: 'aw3', name: 'Snow Trekking', desc: 'Guided winter trail expeditions through pristine Himalayan snow landscapes.', image: 'assets/images/gallery-gulmarg.png', badge: 'Trekking', price: '₹4,999', waMsg: "I'm interested in Snow Trekking" },
        { id: 'aw4', name: 'Ice Climbing', desc: 'Scale frozen waterfalls with expert local guides and professional safety gear.', image: 'assets/images/hero-mountains.png', badge: 'Adventure', price: '₹6,999', waMsg: "I'm interested in Ice Climbing" },
        { id: 'aw5', name: 'Heliskiing', desc: 'Exclusive backcountry access by helicopter to untouched Himalayan powder runs.', image: 'assets/images/gallery-helicopter.png', badge: 'Exclusive', price: '₹1,49,999', waMsg: "I'm interested in Heliskiing" }
      ],
      summer: [
        { id: 'as1', name: 'Camping', desc: 'Starlit nights in pristine alpine meadows surrounded by Himalayan peaks.', image: 'assets/images/trekking-landscape.png', badge: 'Outdoor', price: '₹3,500', waMsg: "I'm interested in Camping" },
        { id: 'as2', name: 'River Rafting', desc: 'White-water rapids adventure on the Lidder River with professional safety equipment.', image: 'assets/images/gallery-sonamarg.png', badge: 'Adventure', price: '₹2,999', waMsg: "I'm interested in River Rafting" },
        { id: 'as3', name: 'Horse Riding', desc: 'Scenic mountain trail rides through lush meadows with experienced local guides.', image: 'assets/images/gallery-pahalgam.png', badge: 'Leisure', price: '₹1,999', waMsg: "I'm interested in Horse Riding" },
        { id: 'as4', name: 'Mountain Biking', desc: 'Thrilling Himalayan cycling routes through scenic valleys and mountain trails.', image: 'assets/images/sightseeing-dal-lake.png', badge: 'Cycling', price: '₹2,499', waMsg: "I'm interested in Mountain Biking" },
        { id: 'as5', name: 'Trout Fishing', desc: 'Pristine river fishing experiences in crystal-clear Himalayan streams.', image: 'assets/images/gallery-luxury-stay.png', badge: 'Leisure', price: '₹1,500', waMsg: "I'm interested in Trout Fishing" }
      ]
    },

    rentals: [
      {
        id: 'cat-ski-gear', title: 'Ski Rental', icon: '⛷️', comingSoon: false,
        items: [
          { id: 'rk1', enabled: true, title: 'Ski Package (Skis + Boots + Poles)', price: '₹800/day', desc: 'Full premium ski package from top brands. Includes skis, boots and poles sized to your height and ability level. Expert fitting included.', image: 'assets/images/skiing-action.png', waMsg: "I'm interested in renting the Ski Package" },
          { id: 'rk2', enabled: true, title: 'Helmet & Protective Gear', price: '₹200/day', desc: 'Safety-certified ski helmets, wrist guards and knee pads. All gear sanitised and maintained daily.', image: 'assets/images/gallery-gulmarg.png', waMsg: "I'm interested in renting Helmet & Protective Gear" },
          { id: 'rk3', enabled: true, title: 'Ski Jacket & Pants', price: '₹500/day', desc: 'Waterproof and breathable ski outerwear for men, women and kids. Multiple sizes available at base camp.', image: 'assets/images/hero-mountains.png', waMsg: "I'm interested in renting Ski Jacket & Pants" }
        ]
      },
      {
        id: 'cat-sb-gear', title: 'Snowboard Rental', icon: '🏂', comingSoon: false,
        items: [
          { id: 'rk4', enabled: true, title: 'Snowboard Package (Board + Boots)', price: '₹900/day', desc: 'All-mountain and powder snowboards with adjustable bindings and comfortable boots.', image: 'assets/images/snowboarding-action.png', waMsg: "I'm interested in renting the Snowboard Package" },
          { id: 'rk5', enabled: true, title: 'Snowboard Boots', price: '₹400/day', desc: 'High-performance quick-lace snowboard boots providing ankle support and warmth.', image: 'assets/images/gallery-gulmarg.png', waMsg: "I'm interested in renting Snowboard Boots" }
        ]
      },
      {
        id: 'cat-trek-gear', title: 'Trekking Gear', icon: '🥾', comingSoon: false,
        items: [
          { id: 'rk6', enabled: true, title: '4-Season Expedition Tent', price: '₹350/day', desc: 'Double-walled windproof expedition tents for 2–3 persons.', image: 'assets/images/trekking-landscape.png', waMsg: "I'm interested in renting an Expedition Tent" },
          { id: 'rk7', enabled: true, title: 'Sub-Zero Sleeping Bag (-10°C)', price: '₹250/day', desc: 'High-loft down sleeping bags rated for cold Himalayan nights.', image: 'assets/images/gallery-sonamarg.png', waMsg: "I'm interested in renting a Sleeping Bag" },
          { id: 'rk8', enabled: true, title: 'Trekking Backpack (60L–75L)', price: '₹200/day', desc: 'Ergonomic internal-frame rucksacks with rain covers.', image: 'assets/images/gallery-pahalgam.png', waMsg: "I'm interested in renting a Backpack" },
          { id: 'rk9', enabled: true, title: 'Trekking Poles (Pair)', price: '₹100/day', desc: 'Lightweight shock-absorbing aluminum trekking poles.', image: 'assets/images/gallery-gulmarg.png', waMsg: "I'm interested in renting Trekking Poles" }
        ]
      },
      {
        id: 'cat-mtb-gear', title: 'MTB Rental', icon: '🚵', comingSoon: true,
        items: []
      }
    ],

    testimonials: [
      { id: 'tm1', initials: 'AK', name: 'Arjun Kapoor', source: 'Google Review ★ 5.0', text: '"The skiing experience in Gulmarg was absolutely world-class. The Shred Himalayas team made everything seamless — from airport pickup to the final goodbye. Truly premium service."' },
      { id: 'tm2', initials: 'SM', name: 'Sarah Mitchell', source: 'Google Review ★ 5.0', text: '"Our Kashmir Great Lakes trek was the most beautiful experience of my life. The guides knew every trail, every viewpoint. We felt safe and amazed at every turn."' },
      { id: 'tm3', initials: 'RJ', name: 'Raj Johal', source: 'Google Review ★ 5.0', text: '"From the luxury houseboat to the backcountry snowboarding — every single detail was perfect. This team truly understands what premium travel means."' },
      { id: 'tm4', initials: 'PK', name: 'Priya Kapila', source: 'Google Review ★ 5.0', text: '"Booked the Kashmir Offbeat Tour and discovered places I never knew existed. The guides were locals who shared stories, recipes, and genuine hospitality. Unforgettable."' }
    ],

    sightseeing: [
      { id: 'sg1', place: 'gulmarg', label: 'Gulmarg', title: 'Gulmarg', desc: 'The "Meadow of Flowers" — home to Asia\'s highest gondola and world-class skiing terrain at 2,650m altitude.', image: 'assets/images/gallery-gulmarg.png' },
      { id: 'sg2', place: 'srinagar', label: 'Srinagar', title: 'Srinagar', desc: 'The summer capital of Jammu & Kashmir. Experience the iconic Dal Lake, Mughal Gardens, and ancient wooden architecture.', image: 'assets/images/sightseeing-dal-lake.png' },
      { id: 'sg3', place: 'pahalgam', label: 'Pahalgam', title: 'Pahalgam', desc: 'The "Valley of Shepherds" — a stunning green valley where the Lidder River flows through meadows and pine forests.', image: 'assets/images/gallery-pahalgam.png' },
      { id: 'sg4', place: 'sonamarg', label: 'Sonamarg', title: 'Sonamarg', desc: 'The "Meadow of Gold" — gateway to the Himalayan glaciers and the dramatic Thajiwas Glacier valley.', image: 'assets/images/gallery-sonamarg.png' }
    ],

    transport: [
      {
        id: 'tr-airport', title: 'Airport Transfers', icon: '✈️', comingSoon: false,
        items: [
          { id: 'ta1', enabled: true, title: 'Sedan Airport Pickup', price: '₹2,500/per day', desc: 'Comfortable sedan (Swift Dzire / Honda Amaze) for hassle-free Srinagar Airport pickup and drop. Meet & greet by uniformed driver at arrivals.', image: 'assets/images/transport-airport.png', waMsg: "I'm interested in Sedan Airport Pickup" },
          { id: 'ta2', enabled: true, title: 'SUV Airport Transfer', price: '₹3,500/per day', desc: 'Spacious SUV (Innova / Ertiga) for airport transfers with ample luggage space. Ideal for families or groups of 4–6 passengers.', image: 'assets/images/transport-cab.png', waMsg: "I'm interested in SUV Airport Transfer" },
          { id: 'ta3', enabled: true, title: 'Tempo Traveller Pickup', price: '₹5,000/per day', desc: '12-seater Tempo Traveller for large group airport transfers. AC, pushback seats, and dedicated luggage compartment included.', image: 'assets/images/transport-group.png', waMsg: "I'm interested in Tempo Traveller Airport Pickup" },
          { id: 'ta4', enabled: true, title: 'Late Night Transfer', price: '₹3,800/per day', desc: 'Available 24/7 for late-night and early-morning flights. Driver waits at arrivals with name board. No surge pricing.', image: 'assets/images/luxury-transport.png', waMsg: "I'm interested in Late Night Airport Transfer" }
        ]
      },
      {
        id: 'tr-private-cabs', title: 'Private Cabs', icon: '🚕', comingSoon: false,
        items: [
          { id: 'tc1', enabled: true, title: 'Gulmarg Day Trip', price: '₹3,500/per day', desc: 'Full-day private cab to Gulmarg with experienced mountain driver. Includes Tangmarg stop, Gondola base drop, and return to Srinagar.', image: 'assets/images/gallery-gulmarg.png', waMsg: "I'm interested in Gulmarg Day Trip cab" },
          { id: 'tc2', enabled: true, title: 'Pahalgam Day Trip', price: '₹4,000/per day', desc: 'Scenic drive through saffron fields to Pahalgam. Visit Betaab Valley, Aru Valley, and Chandanwari with flexible stops.', image: 'assets/images/gallery-pahalgam.png', waMsg: "I'm interested in Pahalgam Day Trip cab" },
          { id: 'tc3', enabled: true, title: 'Sonamarg Day Trip', price: '₹4,500/per day', desc: 'Drive along the dramatic Sindh Valley to Sonamarg. Includes Thajiwas Glacier visit and photo stops at Zero Point road.', image: 'assets/images/gallery-sonamarg.png', waMsg: "I'm interested in Sonamarg Day Trip cab" },
          { id: 'tc4', enabled: true, title: 'Full Day Srinagar Local', price: '₹2,500/per day', desc: 'Explore Srinagar at your own pace — Dal Lake, Mughal Gardens, Shankaracharya Temple, Old City, and local markets.', image: 'assets/images/sightseeing-dal-lake.png', waMsg: "I'm interested in Full Day Srinagar cab" }
        ]
      },
      {
        id: 'tr-group', title: 'Group Transport', icon: '🚌', comingSoon: false,
        items: [
          { id: 'tg1', enabled: true, title: '12-Seater Tempo Traveller', price: '₹5,500/per day', desc: 'Comfortable force tempo traveller with AC, pushback seats, and ample luggage space. Perfect for medium-sized groups.', image: 'assets/images/transport-group.png', waMsg: "I'm interested in 12-Seater Tempo Traveller" },
          { id: 'tg2', enabled: true, title: '17-Seater Traveller', price: '₹7,000/per day', desc: 'Larger capacity traveller with individual AC vents, curtains, and music system. Ideal for corporate outings and family reunions.', image: 'assets/images/transport-airport.png', waMsg: "I'm interested in 17-Seater Traveller" },
          { id: 'tg3', enabled: true, title: '26-Seater Mini Bus', price: '₹9,500/per day', desc: 'Full-size mini bus with high headroom, reclining seats, and onboard entertainment. Perfect for weddings and large tour groups.', image: 'assets/images/transport-cab.png', waMsg: "I'm interested in 26-Seater Mini Bus" }
        ]
      },
      {
        id: 'tr-luxury', title: 'Luxury Transport', icon: '🏎️', comingSoon: false,
        items: [
          { id: 'tl1', enabled: true, title: 'Toyota Fortuner', price: '₹7,000/per day', desc: 'Rugged luxury SUV with 4WD capability. Premium leather interiors, climate control, and professional chauffeur included.', image: 'assets/images/luxury-transport.png', waMsg: "I'm interested in Toyota Fortuner rental" },
          { id: 'tl2', enabled: true, title: 'Innova Crysta (Top End)', price: '₹5,500/per day', desc: 'India\'s most popular premium MPV. Captain seats, ambient lighting, and a smooth ride perfect for scenic mountain drives.', image: 'assets/images/transport-cab.png', waMsg: "I'm interested in Innova Crysta rental" },
          { id: 'tl3', enabled: true, title: 'Mercedes-Benz E-Class', price: '₹12,000/per day', desc: 'Ultimate luxury sedan experience. Immaculate interiors, panoramic sunroof, and English-speaking uniformed chauffeur.', image: 'assets/images/transport-airport.png', waMsg: "I'm interested in Mercedes E-Class rental" },
          { id: 'tl4', enabled: true, title: 'Range Rover Sport', price: '₹15,000/per day', desc: 'The pinnacle of mountain luxury. All-terrain capability meets world-class comfort — privacy glass, premium audio, and VIP service.', image: 'assets/images/transport-group.png', waMsg: "I'm interested in Range Rover Sport rental" }
        ]
      }
    ],

    policies: {
      privacy: `<h3>Privacy Policy</h3><p>At <strong>Shred Himalayas Expeditions</strong>, we value your trust and are dedicated to protecting your personal information. This Privacy Policy explains how we collect, use, and protect your data when you visit our website, book packages, or rent gear.</p><h4>1. Information We Collect</h4><p>We collect information you provide directly to us when making an enquiry, booking an expedition, or renting equipment. This includes your full name, phone number, email address, emergency contact details, physical address, and specific travel preferences.</p><h4>2. How We Use Your Information</h4><p>Your details are strictly used to:</p><ul><li>Process and confirm package bookings and equipment rentals.</li><li>Secure high-altitude permits, government entry passes, and cable car (Gondola) passes.</li><li>Coordinate local transportation, guides, and hotel accommodations.</li><li>Send critical travel updates, weather alerts, and safety guidelines for your trip.</li></ul><h4>3. Data Sharing & Security</h4><p>We do not sell, rent, or trade your personal information. Data is shared exclusively with certified local guides, hotel partners, and government permit offices solely for facilitating your expedition.</p><p>We implement robust physical, electronic, and procedural safeguards to ensure your data is kept secure against unauthorized access.</p><h4>4. Contact Us</h4><p>For questions or privacy requests, please contact us at <a href="mailto:loneakash7753@gmail.com">loneakash7753@gmail.com</a> or call <a href="tel:+919149974118">+91 91499 74118</a>.</p>`,
      terms: `<h3>Terms of Service</h3><p>Welcome to <strong>Shred Himalayas Expeditions</strong>. By accessing our services, booking tours, or renting equipment, you agree to abide by these Terms of Service.</p><h4>1. Bookings & Payments</h4><p>All expedition bookings and equipment rentals are confirmed upon receipt of the initial deposit. Full payment must be cleared prior to trip commencement or equipment hand-over.</p><h4>2. Mountain & High-Altitude Risks</h4><p>Skiing, snowboarding, trekking, and backcountry expeditions in the Himalayas involve inherent risks including extreme weather, avalanches, altitude sickness, and rugged terrain. Guests acknowledge these risks and participate voluntarily. Comprehensive medical and emergency evacuation insurance is strongly recommended.</p><h4>3. Equipment Rental Policy</h4><p>Rented gear must be returned in good working condition. The hirer is responsible for any loss or major damage to equipment beyond normal wear and tear.</p><h4>4. Schedule & Itinerary Changes</h4><p>Shred Himalayas reserves the right to modify itineraries, routes, or timings in response to adverse weather conditions, avalanche hazards, road blockages, or government security advisories to prioritize guest safety.</p><h4>5. Jurisdiction</h4><p>These terms shall be governed by and construed in accordance with the laws of Jammu & Kashmir, India.</p>`,
      cancellation: `<h3>Cancellation & Refund Policy</h3><p>We strive to keep our cancellation policies fair and transparent. Below are the terms governing trip cancellations, refunds, and weather disruptions for <strong>Shred Himalayas Expeditions</strong>.</p><h4>1. Cancellation Timeline & Refund Percentages</h4><ul><li><strong>30 days or more before trip start:</strong> 90% refund of the total booking amount.</li><li><strong>15 to 29 days before trip start:</strong> 50% refund of the total booking amount.</li><li><strong>7 to 14 days before trip start:</strong> 25% refund of the total booking amount.</li><li><strong>Less than 7 days before trip start:</strong> Non-refundable.</li></ul><h4>2. Weather & Gondola Closure Disruptions</h4><p>In the event of severe blizzards, road blockages, or Gulmarg Gondola suspensions, Shred Himalayas will arrange alternative local sightseeing or provide credit vouchers valid for 12 months. Direct cash refunds for weather disruptions are subject to third-party vendor terms.</p><h4>3. Medical Emergencies</h4><p>If a guest cannot travel due to a certified medical emergency prior to trip departure, a credit voucher valid for 12 months will be issued (minus non-recoverable hotel/permit costs).</p><h4>4. Refund Processing</h4><p>Approved refunds are credited to the original payment channel within 7 to 10 working days.</p>`
    }
  };

  // ─── FIRESTORE STORAGE HELPERS ──────────────────────
  var _listeners = [];
  var _unsubscribers = [];
  var _initPromise = null;
  var _cache = {};

  var SECTIONS = [
    'settings', 'about', 'seo', 'policies', 'skiing', 'snowboarding',
    'trekking', 'packages', 'activities', 'rentals', 'transport',
    'testimonials', 'team', 'contacts', 'sightseeing'
  ];

  function onChange(cb) {
    if (typeof cb !== 'function') return;
    _listeners.push(cb);
    try { cb(_cache); } catch (e) { console.error('Error triggering callback:', e); }
  }

  // Helper to sanitize objects (remove undefined properties for Firestore)
  function cleanData(data) {
    if (data === undefined || data === null) return null;
    return JSON.parse(JSON.stringify(data));
  }

  // Writes to _cache, localStorage (for instant reload & offline backup), and Firestore
  function save(section, data) {
    var sanitized = cleanData(data);
    _cache[section] = sanitized;

    // 1. Save to localStorage for instant reload persistence
    try {
      localStorage.setItem('sh_data_' + section, JSON.stringify(sanitized));
    } catch (e) {
      console.warn('LocalStorage save error for ' + section + ':', e);
    }

    // 2. Save to Firestore if available
    if (typeof db !== 'undefined' && db) {
      var docData = Array.isArray(sanitized) ? { items: sanitized } : sanitized;
      db.collection(section).doc('main').set(docData).catch(function (e) {
        console.warn('Firestore save warning for ' + section + ' (cached locally):', e);
      });
    }

    // Trigger listeners
    _listeners.forEach(function (cb) {
      try { cb(_cache); } catch (e) { console.error('Listener error on save:', e); }
    });
  }

  // Async init — pre-loads from localStorage, then syncs with Firestore
  function init() {
    if (_initPromise) return _initPromise;

    // Step 1: Immediately populate _cache from localStorage or defaults
    SECTIONS.forEach(function (sec) {
      try {
        var local = localStorage.getItem('sh_data_' + sec);
        if (local !== null) {
          _cache[sec] = JSON.parse(local);
        } else {
          _cache[sec] = JSON.parse(JSON.stringify(defaults[sec]));
        }
      } catch (e) {
        _cache[sec] = JSON.parse(JSON.stringify(defaults[sec]));
      }
    });

    if (typeof db === 'undefined' || !db) {
      console.warn('Firestore not available, using local cache');
      return Promise.resolve();
    }

    // Step 2: Listen for live updates and seed Firestore in the background
    SECTIONS.forEach(function (sec) {
      try {
        var unsub = db.collection(sec).doc('main').onSnapshot(function (doc) {
          if (doc.exists) {
            var val = doc.data();
            var fetched = (val && val.items !== undefined) ? val.items : val;
            _cache[sec] = fetched;
            try {
              localStorage.setItem('sh_data_' + sec, JSON.stringify(fetched));
            } catch (e) {}
          } else {
            // Seed Firestore document with current _cache or default value if document doesn't exist
            var defVal = _cache[sec] || defaults[sec];
            var docData = Array.isArray(defVal) ? { items: defVal } : defVal;
            db.collection(sec).doc('main').set(cleanData(docData)).catch(function (e) {
              console.warn('Error seeding Firestore for ' + sec + ':', e);
            });
          }

          // Trigger change listeners if subscribers are attached
          _listeners.forEach(function (cb) {
            try { cb(_cache); } catch (e) { console.error('Listener callback error:', e); }
          });
        }, function (err) {
          console.warn('Firestore listener warning for ' + sec + ':', err);
        });
        _unsubscribers.push(unsub);
      } catch (err) {
        console.warn('Firestore subscribe error for ' + sec + ':', err);
      }
    });

    // Ensure default admin user document exists in Firestore asynchronously
    try {
      db.collection('users').doc('admin').get().then(function (userDoc) {
        if (!userDoc.exists) {
          return db.collection('users').doc('admin').set({
            username: 'jammu&kashmir',
            password: 'admin@2000'
          });
        }
      }).catch(function(e) {
        console.warn('Admin user doc fetch warning:', e);
      });
    } catch (e) {
      console.warn('Admin user check error:', e);
    }

    _initPromise = Promise.resolve();
    return _initPromise;
  }

  function getPolicies() {
    var stored = get('policies');
    if (stored) return stored;
    return JSON.parse(JSON.stringify(defaults.policies));
  }

  function setPolicies(policiesObj) {
    save('policies', policiesObj);
  }

  function get(section) {
    if (_cache && _cache[section] !== undefined) {
      return _cache[section];
    }
    return JSON.parse(JSON.stringify(defaults[section]));
  }

  function set(section, data) {
    save(section, data);
  }

  function reset() {
    _cache = {};
    SECTIONS.forEach(function (sec) {
      try {
        localStorage.removeItem('sh_data_' + sec);
      } catch (e) {}
      _cache[sec] = JSON.parse(JSON.stringify(defaults[sec]));
    });
    if (typeof db !== 'undefined' && db) {
      SECTIONS.forEach(function (sec) {
        var defVal = defaults[sec];
        var docData = Array.isArray(defVal) ? { items: defVal } : defVal;
        db.collection(sec).doc('main').set(cleanData(docData)).catch(function (e) {
          console.warn('Firestore reset error for ' + sec + ':', e);
        });
      });
    }
  }

  // ─── HELPERS ─────────────────────────────────────────
  function wa(num, msg) {
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  }

  // ─── RENDERERS ───────────────────────────────────────

  /* -- Skiing & Snowboarding package card (clean first look) -- */
  function renderActivityCard(item, wa_num) {
    const safeData = encodeURIComponent(JSON.stringify(item)).replace(/'/g, "%27");
    return `
      <div class="detail-card reveal">
        <div class="detail-card__image-wrap">
          <img src="${item.image}" alt="${item.title}" class="detail-card__image">
          <span class="detail-card__badge">${item.badge}</span>
        </div>
        <div class="detail-card__body">
          <h3 class="detail-card__title">${item.title}</h3>
          <p class="detail-card__desc">${item.description}</p>
          <div class="detail-card__price">Starting from ${item.price || 'Contact for Price'}</div>
          <div class="detail-card__cta">
            <a href="${wa(wa_num, item.waMsg)}" class="btn btn--primary"><span>Enquire Now</span></a>
            <button class="btn btn--outline sh-more-info-btn" data-item-type="activity" data-item='${safeData}'><span>More Info</span></button>
          </div>
        </div>
      </div>`;
  }

  /* -- Skiing categories + items -- */
  function renderSkiing(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const cats = get('skiing');
    const wa_num = get('settings').whatsappNumber;
    el.innerHTML = cats.map(cat => {
      const visibleItems = cat.items.filter(item => item.enabled !== false);
      if (visibleItems.length === 0) return '';
      return `
      <div class="category-group">
        <div class="category-title">${cat.title}</div>
        <div class="detail-grid">
          ${visibleItems.map(item => renderActivityCard(item, wa_num)).join('')}
        </div>
      </div>`;
    }).join('');
  }

  /* -- Snowboarding categories + items -- */
  function renderSnowboarding(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const cats = get('snowboarding');
    const wa_num = get('settings').whatsappNumber;
    el.innerHTML = cats.map(cat => {
      const visibleItems = cat.items.filter(item => item.enabled !== false);
      if (visibleItems.length === 0) return '';
      return `
      <div class="category-group">
        <div class="category-title">${cat.title}</div>
        <div class="detail-grid">
          ${visibleItems.map(item => renderActivityCard(item, wa_num)).join('')}
        </div>
      </div>`;
    }).join('');
  }

  /* -- Trek cards (clean first look) -- */
  function renderTrekking(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const treks = get('trekking').filter(t => t.enabled !== false);
    const wa_num = get('settings').whatsappNumber;
    el.innerHTML = treks.map(t => {
      const safeData = encodeURIComponent(JSON.stringify(t)).replace(/'/g, "%27");
      return `
      <div class="trek-card reveal">
        <div class="trek-card__image-wrap">
          <img src="${t.image}" alt="${t.title}" class="trek-card__image">
          <span class="trek-card__difficulty trek-card__difficulty--${t.difficultyClass}">${t.difficulty}</span>
        </div>
        <div class="trek-card__body">
          <h3 class="trek-card__title">${t.title}</h3>
          <p class="trek-card__desc">${t.description}</p>
          <div class="trek-card__price">Starting from ${t.price || 'Contact for Price'}</div>
          <div class="detail-card__cta">
            <a href="${wa(wa_num, t.waMsg)}" class="btn btn--primary"><span>Enquire Now</span></a>
            <button class="btn btn--outline sh-more-info-btn" data-item-type="trek" data-item='${safeData}'><span>More Info</span></button>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  /* -- Tour packages (clean first look) -- */
  function renderPackages(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const pkgs = get('packages').filter(p => p.enabled !== false);
    const wa_num = get('settings').whatsappNumber;
    el.innerHTML = pkgs.map(p => {
      // Strip heavy PDF data from DOM attribute to keep HTML light
      const leanPkg = Object.assign({}, p);
      delete leanPkg.itineraryPdf;
      const safeData = encodeURIComponent(JSON.stringify(leanPkg)).replace(/'/g, "%27");
      return `
      <div class="detail-card reveal" style="min-height:300px;">
        <div class="detail-card__image-wrap">
          <img src="${p.image}" alt="${p.title}" class="detail-card__image">
          <span class="detail-card__badge">${p.badge}</span>
        </div>
        <div class="detail-card__body">
          <h3 class="detail-card__title">${p.title}</h3>
          <p class="detail-card__desc">${p.description}</p>
          <div class="detail-card__price">Starting from ${p.price || 'Contact for Price'}</div>
          <div class="detail-card__cta">
            <a href="${wa(wa_num, p.waMsg)}" class="btn btn--primary"><span>Enquire Now</span></a>
            <button class="btn btn--outline sh-more-info-btn" data-item-type="package" data-item='${safeData}'><span>More Info</span></button>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  /* -- Activities (rich cards with price & enquiry, synced with admin) -- */
  function renderActivities(winterId, summerId) {
    const acts = get('activities');
    const wa_num = get('settings').whatsappNumber;
    const defaultImages = {
      aw1: 'assets/images/skiing-action.png',
      aw2: 'assets/images/activities-winter.png',
      aw3: 'assets/images/gallery-gulmarg.png',
      aw4: 'assets/images/hero-mountains.png',
      aw5: 'assets/images/gallery-helicopter.png',
      as1: 'assets/images/trekking-landscape.png',
      as2: 'assets/images/gallery-sonamarg.png',
      as3: 'assets/images/gallery-pahalgam.png',
      as4: 'assets/images/sightseeing-dal-lake.png',
      as5: 'assets/images/gallery-luxury-stay.png'
    };
    // Activities data merge with defaults handled inline below
    const stored = load();

    // Merge stored activities with defaults to fill any missing fields (migration for old data)
    const defActs = JSON.parse(JSON.stringify(defaults.activities));

    function mergeWithDefaults(storedList, defaultList) {
      if (!storedList || storedList.length === 0) return defaultList;
      return storedList.map(function (a) {
        const def = defaultList.find(function (d) { return d.id === a.id; }) || {};
        // Merge: use defaults first, then override with stored values — but skip empty stored values
        const merged = Object.assign({}, def);
        Object.keys(a).forEach(function (k) {
          if (a[k] !== undefined && a[k] !== null && a[k] !== '') {
            merged[k] = a[k];
          }
        });
        return merged;
      });
    }
    const winter = mergeWithDefaults(acts.winter, defActs.winter).filter(a => a.enabled !== false);
    const summer = mergeWithDefaults(acts.summer, defActs.summer).filter(a => a.enabled !== false);
    const wEl = document.getElementById(winterId);
    const sEl = document.getElementById(summerId);



    function actCard(a, fallbackImg) {
      const imgSrc = a.image || defaultImages[a.id] || fallbackImg;
      const priceLine = a.price ? `<div class="activities__item-price">Starting from <strong>${a.price}</strong></div>` : '';
      const enquireHref = wa(wa_num, a.waMsg || `I'm interested in ${a.name}`);
      return `
      <div class="activities__item">
        <div class="activities__item-img-wrap">
          <img src="${imgSrc}" alt="${a.name}" class="activities__item-img" loading="lazy">
          ${a.badge ? `<span class="activities__item-badge">${a.badge}</span>` : ''}
        </div>
        <div class="activities__item-body">
          <div class="activities__item-name">${a.name}</div>
          <div class="activities__item-desc">${a.desc}</div>
          ${priceLine}
          <div class="activities__item-cta">
            <a href="${enquireHref}" class="btn btn--primary" target="_blank" rel="noopener"><span>Enquire Now</span></a>
          </div>
        </div>
      </div>`;
    }

    if (wEl) {
      if (winter.length === 0) {
        wEl.innerHTML = '<div class="activities__empty">No winter activities available at the moment.</div>';
      } else {
        wEl.innerHTML = winter.map(a => actCard(a, 'assets/images/skiing-action.png')).join('');
      }
    }

    if (sEl) {
      if (summer.length === 0) {
        sEl.innerHTML = '<div class="activities__empty">No summer activities available at the moment.</div>';
      } else {
        sEl.innerHTML = summer.map(a => actCard(a, 'assets/images/trekking-landscape.png')).join('');
      }
    }
  }

  /* -- Rentals -- */
  function renderRentals(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const rentals = get('rentals').filter(r => r.enabled !== false);
    el.innerHTML = rentals.map(r => `
      <div class="rentals__card ${r.comingSoon ? 'rentals__card--coming-soon' : ''} reveal">
        ${r.comingSoon ? '<span class="rentals__card-badge">Coming Soon</span>' : ''}
        <div class="rentals__card-icon">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="18" height="6" rx="2"/><path d="m7 12 2-2 2 2-2 2zm6 0 2-2 2 2-2 2z"/></svg>
        </div>
        <h4 class="rentals__card-title">${r.title}</h4>
        <p class="rentals__card-desc">${r.desc}</p>
      </div>`).join('');
  }

  /* -- Testimonials -- */
  function renderTestimonials(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const testimonials = get('testimonials').filter(t => t.enabled !== false);
    el.innerHTML = testimonials.map(t => `
      <div class="testimonials__card">
        <div class="testimonials__stars">
          <span class="testimonials__star">★</span><span class="testimonials__star">★</span>
          <span class="testimonials__star">★</span><span class="testimonials__star">★</span>
          <span class="testimonials__star">★</span>
        </div>
        <p class="testimonials__text">${t.text}</p>
        <div class="testimonials__author">
          <div class="testimonials__avatar">${t.initials}</div>
          <div>
            <div class="testimonials__author-name">${t.name}</div>
            <div class="testimonials__author-source">${t.source}</div>
          </div>
        </div>
      </div>`).join('');
  }

  /* -- Rentals: dedicated page renderer with tab toggle & URL param support -- */
  function renderRentalPage(tabsId, panelsId) {
    var tabsEl = document.getElementById(tabsId);
    var panelsEl = document.getElementById(panelsId);
    if (!tabsEl || !panelsEl) return;

    var cats = get('rentals');
    var wa_num = get('settings').whatsappNumber;

    // Read URL param ?cat=0 or hash #cat-0 to auto-select a tab
    var initialCat = 0;
    try {
      var params = new URLSearchParams(window.location.search);
      var catParam = parseInt(params.get('cat'), 10);
      if (!isNaN(catParam) && catParam >= 0 && catParam < cats.length) initialCat = catParam;
      if (isNaN(catParam) && window.location.hash && window.location.hash.indexOf('#cat-') === 0) {
        catParam = parseInt(window.location.hash.replace('#cat-', ''), 10);
        if (!isNaN(catParam) && catParam >= 0 && catParam < cats.length) initialCat = catParam;
      }
    } catch (e) { }

    // Build tabs
    tabsEl.innerHTML = cats.map(function (cat, ci) {
      var itemCount = cat.items ? cat.items.filter(function (i) { return i.enabled !== false; }).length : 0;
      var isCS = cat.comingSoon && itemCount === 0;
      return '<button class="rental-tab-btn' + (ci === initialCat ? ' active' : '') + '" data-ci="' + ci + '" id="rental-tab-' + ci + '">' +
        '<span class="rental-tab-icon">' + (cat.icon || '🎿') + '</span>' +
        '<span>' + cat.title + '</span>' +
        (isCS ? '<span class="rental-tab-cs-badge">Soon</span>' : '') +
        '</button>';
    }).join('');

    // Build panels
    panelsEl.innerHTML = cats.map(function (cat, ci) {
      var visibleItems = cat.items ? cat.items.filter(function (item) { return item.enabled !== false; }) : [];
      var panelContent = '';

      if (visibleItems.length === 0) {
        panelContent = '<div class="rental-coming-soon">' +
          '<div class="rental-coming-soon__icon">' + (cat.icon || '🎿') + '</div>' +
          '<h3 class="rental-coming-soon__title">Coming Soon</h3>' +
          '<p class="rental-coming-soon__text">We\'re bringing <strong>' + cat.title + '</strong> to base camp soon. Check back or enquire below to be the first to know.</p>' +
          '<a href="https://wa.me/' + wa_num + '?text=' + encodeURIComponent('I\'m interested in ' + cat.title + ' — when will it be available?') + '" class="btn btn--primary rental-coming-soon__btn" target="_blank" rel="noopener"><span>Enquire Early Access</span></a>' +
          '</div>';
      } else {
        panelContent = '<div class="rental-eq-grid">' +
          visibleItems.map(function (item) {
            var imgSrc = item.image || 'assets/images/hero-mountains.png';
            return '<div class="rental-eq-card">' +
              '<div class="rental-eq-card__img-wrap">' +
              '<img src="' + imgSrc + '" alt="' + item.title + '" class="rental-eq-card__img" loading="lazy">' +
              '<span class="rental-eq-card__price">' + (item.price || 'Contact') + '</span>' +
              '</div>' +
              '<div class="rental-eq-card__body">' +
              '<h3 class="rental-eq-card__title">' + item.title + '</h3>' +
              '<p class="rental-eq-card__desc">' + (item.desc || '') + '</p>' +
              '<a href="' + wa(wa_num, item.waMsg || 'I\'m interested in renting ' + item.title) + '" class="btn btn--primary rental-eq-card__cta" target="_blank" rel="noopener"><span>Enquire Now</span></a>' +
              '</div>' +
              '</div>';
          }).join('') +
          '</div>';
      }

      return '<div class="rental-panel' + (ci === initialCat ? ' active' : '') + '" id="rental-panel-' + ci + '" data-ci="' + ci + '">' +
        panelContent + '</div>';
    }).join('');

    // Tab switching
    tabsEl.querySelectorAll('.rental-tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-ci'), 10);
        tabsEl.querySelectorAll('.rental-tab-btn').forEach(function (b) { b.classList.remove('active'); });
        panelsEl.querySelectorAll('.rental-panel').forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        var panel = document.getElementById('rental-panel-' + idx);
        if (panel) {
          panel.classList.add('active');
          var cards = panel.querySelectorAll('.rental-eq-card');
          cards.forEach(function (card, i) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.45s ease ' + (i * 0.07) + 's, transform 0.45s ease ' + (i * 0.07) + 's';
          });
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              cards.forEach(function (card) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              });
            });
          });
        }
      });
    });
  }

  /* -- Rentals: homepage section renderer (category cards linking to rentals.html) -- */
  function renderRentals(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    var cats = get('rentals');
    el.innerHTML = cats.map(function (r, ci) {
      var isCategory = r.items !== undefined;
      var itemCount = isCategory ? r.items.filter(function (i) { return i.enabled !== false; }).length : 0;
      var csoon = r.comingSoon || (isCategory && itemCount === 0);
      var desc = r.desc || (isCategory && itemCount > 0 ? itemCount + ' item' + (itemCount === 1 ? '' : 's') + ' available' : (isCategory ? 'Equipment available at base camp' : ''));
      return '<a href="rentals.html?cat=' + ci + '" class="rentals__card ' + (csoon ? 'rentals__card--coming-soon' : '') + ' reveal" style="text-decoration:none;color:inherit;cursor:pointer;">' +
        (csoon ? '<span class="rentals__card-badge">Coming Soon</span>' : '') +
        '<div class="rentals__card-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="18" height="6" rx="2"/><path d="m7 12 2-2 2 2-2 2zm6 0 2-2 2 2-2 2z"/></svg></div>' +
        '<h4 class="rentals__card-title">' + r.title + '</h4>' +
        '<p class="rentals__card-desc">' + desc + '</p>' +
        '</a>';
    }).join('');
  }

  /* -- Hero text -- */
  function renderHero() {
    const s = get('settings');
    const el = document.getElementById('heroTitle');
    const sub = document.getElementById('heroSubtitle');
    const vid = document.querySelector('.hero__video');
    if (el) el.textContent = s.heroTitle;
    if (sub) sub.textContent = s.heroSubtitle;
    if (vid && s.heroVideoUrl) {
      const src = vid.querySelector('source');
      if (src) {
        src.setAttribute('src', s.heroVideoUrl);
        vid.load(); // Safari compatibility: trigger reload of the video element
      }
    }
  }

  /* -- Footer copyright -- */
  function renderFooter() {
    const s = get('settings');
    const el = document.querySelector('.footer__copyright');
    if (el) el.textContent = s.footerCopyright;
  }

  /* -- WhatsApp links -- */
  function updateWhatsApp() {
    const num = get('settings').whatsappNumber;
    document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
      const url = new URL(a.href);
      const txt = url.searchParams.get('text') || '';
      a.href = `https://wa.me/${num}${txt ? '?text=' + encodeURIComponent(txt) : ''}`;
    });
  }

  // ─── SH-MODAL SYSTEM AUTOMATION ──────────────────────────────────
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
      // 1. Inject modal overlay html if it is not already in page
      if (!document.getElementById('shModalOverlay')) {
        const modalHtml = `
          <div class="sh-modal-overlay" id="shModalOverlay">
            <div class="sh-modal" id="shModal">
              <button class="sh-modal__close" id="shModalClose" aria-label="Close modal">×</button>
              <div class="sh-modal__grid" id="shModalContent">
                <!-- Populated dynamically -->
              </div>
            </div>
          </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
      }

      const overlay = document.getElementById('shModalOverlay');
      const closeBtn = document.getElementById('shModalClose');
      const contentEl = document.getElementById('shModalContent');

      // ── iOS-safe scroll freeze helpers ──
      var _scrollY = 0;
      var _isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      function lockScroll() {
        if (_isIOS) {
          _scrollY = window.pageYOffset || document.documentElement.scrollTop;
          document.body.style.top = '-' + _scrollY + 'px';
          document.body.classList.add('ios-scroll-locked');
          document.documentElement.classList.add('ios-scroll-locked');
        } else {
          document.body.classList.add('no-scroll');
          document.documentElement.classList.add('no-scroll');
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';
        }
      }

      function unlockScroll() {
        if (_isIOS) {
          document.body.classList.remove('ios-scroll-locked');
          document.documentElement.classList.remove('ios-scroll-locked');
          document.body.style.top = '';
          window.scrollTo(0, _scrollY);
        } else {
          document.body.classList.remove('no-scroll');
          document.documentElement.classList.remove('no-scroll');
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
        }
      }

      function closeModal() {
        if (overlay) {
          overlay.classList.remove('is-active');
          unlockScroll();
        }
      }

      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (overlay) {
        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) closeModal();
        });
        // Prevent background wheel scroll when user scrolls on modal backdrop or modal edges
        overlay.addEventListener('wheel', function (e) {
          const modal = document.getElementById('shModal');
          if (!modal) return;
          const isInsideModal = e.target.closest('#shModal');
          if (!isInsideModal) {
            e.preventDefault();
            return;
          }
          // Prevent scroll boundary propagation inside modal
          const scrollTop = modal.scrollTop;
          const scrollHeight = modal.scrollHeight;
          const height = modal.clientHeight;
          const delta = e.deltaY;
          if ((delta < 0 && scrollTop <= 0) || (delta > 0 && scrollTop + height >= scrollHeight - 1)) {
            e.preventDefault();
          }
        }, { passive: false });
      }
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
      });

      // Delegate "More Info" click events on any page
      document.addEventListener('click', function (e) {
        const btn = e.target.closest('.sh-more-info-btn');
        if (!btn) return;
        e.preventDefault();
        try {
          const itemData = JSON.parse(decodeURIComponent(btn.getAttribute('data-item')));
          const itemType = btn.getAttribute('data-item-type') || 'activity';
          openModal(itemData, itemType);
        } catch (err) {
          console.error('Modal data parse error:', err);
        }
      });

      function openModal(itemData, itemType) {
        const wa_num = get('settings').whatsappNumber;

        // Helper: build the itinerary button or placeholder
        function itineraryBtnHtml(pdf, name) {
          if (pdf && pdf.length > 100) {
            return `<button class="btn sh-modal__itinerary-btn" data-pdf-url="${pdf}" data-pdf-name="${name || 'itinerary.pdf'}" style="padding:12px 20px;background:transparent;border:1px solid rgba(196,168,108,0.45);color:#c4a86c;display:flex;align-items:center;justify-content:center;gap:8px;border-radius:8px;font-size:13px;cursor:pointer;transition:all 0.25s ease;width:100%;margin-top:10px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>View Itinerary PDF</span>
            </button>`;
          }
          return `<div style="margin-top:10px;text-align:center;font-size:12px;color:rgba(255,255,255,0.4);border:1px dashed rgba(196,168,108,0.2);padding:10px;border-radius:8px;">No itinerary uploaded for this item.</div>`;
        }

        let html = '';

        if (itemType === 'trek') {
          // Fresh lookup to get itinerary PDF
          const latestTreks = get('trekking') || [];
          const matched = latestTreks.find(t => t.id === itemData.id) || itemData;
          const highlights = (matched.highlights || '').split(',').filter(Boolean);
          html = `
            <div class="sh-modal__image-side">
              <img src="${matched.image}" alt="${matched.title}" class="sh-modal__img">
              <span class="sh-modal__badge">${matched.difficulty}</span>
            </div>
            <div class="sh-modal__content-side">
              <h2 class="sh-modal__title">${matched.title}</h2>
              <div class="sh-modal__price-tag" style="font-size:1.35rem;font-weight:700;color:var(--gold,#c7965a);margin-bottom:16px;">
                Starting from ${matched.price || 'Contact for Price'}
              </div>
              <div class="sh-modal__meta-grid">
                <div class="sh-modal__meta-item"><span class="sh-modal__meta-label">Duration</span><span class="sh-modal__meta-value">${matched.days}</span></div>
                <div class="sh-modal__meta-item"><span class="sh-modal__meta-label">Max Altitude</span><span class="sh-modal__meta-value">${matched.altitude}</span></div>
                <div class="sh-modal__meta-item"><span class="sh-modal__meta-label">Distance</span><span class="sh-modal__meta-value">${matched.distance}</span></div>
                <div class="sh-modal__meta-item"><span class="sh-modal__meta-label">Best Season</span><span class="sh-modal__meta-value">${matched.season}</span></div>
              </div>
              <p class="sh-modal__desc">${matched.description}</p>
              <div class="sh-modal__extra">
                <h4 class="sh-modal__extra-title">Trek Highlights</h4>
                <div class="sh-modal__tags-container">
                  ${highlights.map(h => `<span class="sh-modal__tag">${h.trim()}</span>`).join('')}
                </div>
              </div>
              <div class="sh-modal__cta" style="margin-top:24px;">
                <a href="https://wa.me/${wa_num}?text=${encodeURIComponent(matched.waMsg || '')}" class="btn btn--primary sh-modal__enquire" target="_blank" style="padding:12px 28px;"><span>Enquire Now</span></a>
                ${itineraryBtnHtml(matched.itineraryPdf, matched.itineraryPdfName)}
              </div>
            </div>`;
        } else if (itemType === 'package') {
          // Look up latest package data from storage to access the PDF itinerary
          const latestPkgs = get('packages') || [];
          const matchedPkg = latestPkgs.find(p => p.id === itemData.id) || itemData;

          const includes = (matchedPkg.includes || '').split(',').filter(Boolean);
          const dests = (matchedPkg.destinations || '').split(',').filter(Boolean);

          html = `
            <div class="sh-modal__image-side">
              <img src="${matchedPkg.image}" alt="${matchedPkg.title}" class="sh-modal__img">
              <span class="sh-modal__badge">${matchedPkg.badge || 'Tour'}</span>
            </div>
            <div class="sh-modal__content-side">
              <h2 class="sh-modal__title">${matchedPkg.title}</h2>
              <div class="sh-modal__price-tag" style="font-size: 1.35rem; font-weight: 700; color: var(--gold, #c7965a); margin-bottom: 16px; font-family: 'Satoshi', sans-serif;">
                Starting from ${matchedPkg.price || 'Contact for Price'}
              </div>
              <div class="sh-modal__meta-grid">
                <div class="sh-modal__meta-item">
                  <span class="sh-modal__meta-label">Duration</span>
                  <span class="sh-modal__meta-value">${matchedPkg.duration}</span>
                </div>
                <div class="sh-modal__meta-item">
                  <span class="sh-modal__meta-label">Accommodation</span>
                  <span class="sh-modal__meta-value">${matchedPkg.accommodation}</span>
                </div>
                <div class="sh-modal__meta-item">
                  <span class="sh-modal__meta-label">Transport</span>
                  <span class="sh-modal__meta-value">${matchedPkg.transport}</span>
                </div>
                <div class="sh-modal__meta-item">
                  <span class="sh-modal__meta-label">Meals</span>
                  <span class="sh-modal__meta-value">${matchedPkg.meals}</span>
                </div>
              </div>
              <p class="sh-modal__desc">${matchedPkg.description}</p>
              
              <div class="sh-modal__extra" style="margin-bottom: 16px;">
                <h4 class="sh-modal__extra-title">Destinations</h4>
                <div class="sh-modal__tags-container" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
                  ${dests.map(d => `<span class="sh-modal__tag" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 6px; font-size: 11px;">${d.trim()}</span>`).join('')}
                </div>
              </div>

              <div class="sh-modal__extra">
                <h4 class="sh-modal__extra-title">What's Included</h4>
                <div class="sh-modal__tags-container">
                  ${includes.map(inc => `<span class="sh-modal__tag">${inc.trim()}</span>`).join('')}
                </div>
              </div>
              <div class="sh-modal__cta" style="margin-top: 24px;">
                <a href="https://wa.me/${wa_num}?text=${encodeURIComponent(matchedPkg.waMsg || '')}" class="btn btn--primary sh-modal__enquire" target="_blank" style="padding: 12px 28px;"><span>Enquire Now</span></a>
                ${itineraryBtnHtml(matchedPkg.itineraryPdf, matchedPkg.itineraryPdfName)}
              </div>
            </div>`;
        } else {
          // Skiing / Snowboarding / activity modal — fresh lookup by ID
          const allSkiing = get('skiing') || [];
          const allSnow = get('snowboarding') || [];
          const allActs = get('activities') || { winter: [], summer: [] };
          const allSights = get('sightseeing') || [];
          let matched = itemData;
          // Search skiing categories
          for (let c of allSkiing) { const f = (c.items || []).find(i => i.id === itemData.id); if (f) { matched = f; break; } }
          // Search snowboarding categories
          if (matched === itemData) {
            for (let c of allSnow) { const f = (c.items || []).find(i => i.id === itemData.id); if (f) { matched = f; break; } }
          }
          // Search winter & summer activities
          if (matched === itemData) {
            const list = [...(allActs.winter || []), ...(allActs.summer || [])];
            const f = list.find(i => i.id === itemData.id);
            if (f) matched = f;
          }
          // Search sightseeing places
          if (matched === itemData) {
            const f = allSights.find(i => i.id === itemData.id);
            if (f) matched = f;
          }
          const itemTitle = matched.title || matched.name || '';
          const itemDesc = matched.description || matched.desc || '';
          const itemBadge = matched.badge || matched.label || 'Sightseeing';
          const includes = (matched.includes || '').split(',').filter(Boolean);

          html = `
            <div class="sh-modal__image-side">
              <img src="${matched.image}" alt="${itemTitle}" class="sh-modal__img">
              <span class="sh-modal__badge">${itemBadge}</span>
            </div>
            <div class="sh-modal__content-side">
              <h2 class="sh-modal__title">${itemTitle}</h2>
              <div class="sh-modal__price-tag" style="font-size:1.35rem;font-weight:700;color:var(--gold,#c7965a);margin-bottom:16px;">
                Starting from ${matched.price || 'Contact for Price'}
              </div>
              <div class="sh-modal__meta-grid">
                ${matched.meta1 ? `<div class="sh-modal__meta-item"><span class="sh-modal__meta-label">Duration</span><span class="sh-modal__meta-value">${matched.meta1}</span></div>` : ''}
                ${matched.meta2 ? `<div class="sh-modal__meta-item"><span class="sh-modal__meta-label">Guide</span><span class="sh-modal__meta-value">${matched.meta2}</span></div>` : ''}
                ${matched.meta3 ? `<div class="sh-modal__meta-item"><span class="sh-modal__meta-label">Terrain</span><span class="sh-modal__meta-value">${matched.meta3}</span></div>` : ''}
              </div>
              <p class="sh-modal__desc">${itemDesc}</p>
              ${includes.length ? `
              <div class="sh-modal__extra">
                <h4 class="sh-modal__extra-title">What's Included</h4>
                <div class="sh-modal__tags-container">
                  ${includes.map(inc => `<span class="sh-modal__tag">${inc.trim()}</span>`).join('')}
                </div>
              </div>` : ''}
              <div class="sh-modal__cta" style="margin-top:24px;">
                <a href="https://wa.me/${wa_num}?text=${encodeURIComponent(matched.waMsg || '')}" class="btn btn--primary sh-modal__enquire" target="_blank" style="padding:12px 28px;"><span>Enquire Now</span></a>
                ${itineraryBtnHtml(matched.itineraryPdf, matched.itineraryPdfName)}
              </div>
            </div>`;
        }


        if (contentEl && overlay) {
          contentEl.innerHTML = html;
          overlay.classList.add('is-active');
          lockScroll();
        }
      }
    });

    // ── PDF Download Handler (single reusable listener for all popups) ──
    function loadScript(src) {
      return new Promise(function (resolve, reject) {
        if (document.querySelector('script[src="' + src + '"]')) { resolve(); return; }
        var s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    // ── Itinerary PDF: open in new tab (works for base64 and URL) ──
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.sh-modal__itinerary-btn');
      if (!btn) return;
      var pdfUrl = btn.getAttribute('data-pdf-url');
      var pdfName = btn.getAttribute('data-pdf-name') || 'itinerary.pdf';
      if (!pdfUrl) return;
      // base64 PDF — open as blob URL in new tab
      if (pdfUrl.startsWith('data:application/pdf')) {
        try {
          var byteStr = atob(pdfUrl.split(',')[1]);
          var ab = new ArrayBuffer(byteStr.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteStr.length; i++) ia[i] = byteStr.charCodeAt(i);
          var blob = new Blob([ab], { type: 'application/pdf' });
          var blobUrl = URL.createObjectURL(blob);
          var win = window.open(blobUrl, '_blank');
          if (win) win.document.title = pdfName;
        } catch (err) {
          // Fallback: open raw data URL
          window.open(pdfUrl, '_blank');
        }
      } else {
        window.open(pdfUrl, '_blank');
      }
    });

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.sh-modal__pdf-btn');
      if (!btn) return;
      if (btn.disabled) return;

      var title = (btn.getAttribute('data-pdf-title') || 'Shred-Himalayas').trim();
      var filename = title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-') + '.pdf';
      var modal = document.getElementById('shModal');
      if (!modal) return;

      // Loading state
      btn.disabled = true;
      var origHTML = btn.innerHTML;
      btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg><span>Generating…</span>';

      // Inject spinner keyframe once
      if (!document.getElementById('sh-pdf-spin-style')) {
        var st = document.createElement('style');
        st.id = 'sh-pdf-spin-style';
        st.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
        document.head.appendChild(st);
      }

      // Hide UI-only elements during capture
      var closeBtn = document.getElementById('shModalClose');
      var pdfBtns = modal.querySelectorAll('.sh-modal__pdf-btn');
      if (closeBtn) closeBtn.style.opacity = '0';
      pdfBtns.forEach(function (b) { b.style.opacity = '0'; });

      loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js')
        .then(function () {
          var opt = {
            margin: [10, 10, 10, 10],
            filename: filename,
            image: { type: 'jpeg', quality: 0.96 },
            html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#12160F' },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
          };
          return html2pdf().set(opt).from(modal).save();
        })
        .then(function () {
          if (closeBtn) closeBtn.style.opacity = '';
          pdfBtns.forEach(function (b) { b.style.opacity = ''; });
          btn.innerHTML = origHTML;
          btn.disabled = false;
        })
        .catch(function (err) {
          console.error('PDF generation failed:', err);
          if (closeBtn) closeBtn.style.opacity = '';
          pdfBtns.forEach(function (b) { b.style.opacity = ''; });
          btn.innerHTML = origHTML;
          btn.disabled = false;
        });
    });
  }

  // ─── RENDER RENTALS (homepage section — category overview cards) ───
  function renderRentals(containerId) {
    var cats = get('rentals');
    var el = document.getElementById(containerId);
    if (!el) return;
    if (!cats || cats.length === 0) {
      el.innerHTML = '<p style="color:rgba(255,255,255,.5);text-align:center;padding:40px 0;">No rental categories yet.</p>';
      return;
    }
    var settings = get('settings');
    var waNum = (settings.whatsappNumber || '919149974118').replace(/\D/g, '');
    el.innerHTML = cats.filter(function (c) { return c.title; }).map(function (cat, i) {
      var isCS = cat.comingSoon || !cat.items || cat.items.length === 0;
      return '<a href="rental.html?tab=' + i + '" class="rentals__card' + (isCS ? ' rentals__card--coming-soon' : '') + '">' +
        (isCS ? '<span class="rentals__card-badge">Coming Soon</span>' : '') +
        '<div class="rentals__card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 17h16M7 14l-3 3 3 3M17 14l3 3-3 3"/></svg></div>' +
        '<div class="rentals__card-title">' + cat.title + '</div>' +
        '<p class="rentals__card-desc">' + (isCS ? 'Coming soon — enquire for availability.' : (cat.items.length + ' items available for rent')) + '</p>' +
        '</a>';
    }).join('');
  }

  // ─── RENDER RENTAL PAGE (rentals.html — full tab+cards page) ────────
  function renderRentalPage(tabsId, panelsId) {
    var cats = get('rentals');
    var tabsEl = document.getElementById(tabsId);
    var panelsEl = document.getElementById(panelsId);
    if (!tabsEl || !panelsEl) return;

    var settings = get('settings');
    var waNum = (settings.whatsappNumber || '919149974118').replace(/\D/g, '');

    if (!cats || cats.length === 0) {
      tabsEl.innerHTML = '';
      panelsEl.innerHTML = '<div class="rental-coming-soon"><div class="rental-coming-soon__icon">🎿</div><div class="rental-coming-soon__title">No Categories Yet</div><p class="rental-coming-soon__text">We\'re building our rental fleet. Check back soon or <strong>WhatsApp us</strong> directly.</p><a href="https://wa.me/' + waNum + '" class="rental-coming-soon__btn">WhatsApp Us</a></div>';
      return;
    }

    // Check URL parameter 'tab' (e.g. ?tab=0, ?tab=1, or ?tab=Ski%20Rental)
    var activeIdx = 0;
    try {
      var urlParams = new URLSearchParams(window.location.search);
      var paramTab = urlParams.get('tab');
      if (paramTab !== null && paramTab !== '') {
        if (!isNaN(parseInt(paramTab))) {
          activeIdx = parseInt(paramTab);
        } else {
          var lowerParam = paramTab.toLowerCase();
          cats.forEach(function (c, idx) {
            if (c.id.toLowerCase() === lowerParam || c.title.toLowerCase() === lowerParam) {
              activeIdx = idx;
            }
          });
        }
      }
    } catch (e) { }
    if (activeIdx < 0 || activeIdx >= cats.length) activeIdx = 0;

    // Build tabs
    tabsEl.innerHTML = cats.map(function (cat, i) {
      var enabledItems = cat.items ? cat.items.filter(function (it) { return it.enabled !== false; }) : [];
      var isCS = (cat.comingSoon && enabledItems.length === 0) || (!cat.items || cat.items.length === 0);
      var isActive = (i === activeIdx);
      return '<button class="rental-tab-btn' + (isActive ? ' active' : '') + '" data-tab="' + i + '" onclick="window._rentalTab(this,' + i + ')" role="tab" aria-selected="' + (isActive ? 'true' : 'false') + '">' +
        '<span class="rental-tab-icon">' + (cat.icon || '🎿') + '</span>' +
        cat.title +
        (isCS ? '<span class="rental-tab-cs-badge">Soon</span>' : '') +
        '</button>';
    }).join('');

    // Build panels
    panelsEl.innerHTML = cats.map(function (cat, i) {
      var enabledItems = cat.items ? cat.items.filter(function (it) { return it.enabled !== false; }) : [];
      var isCS = (cat.comingSoon && enabledItems.length === 0) || (!cat.items || cat.items.length === 0);
      var panelContent = '';
      if (isCS) {
        panelContent = '<div class="rental-coming-soon">' +
          '<div class="rental-coming-soon__icon">' + (cat.icon || '🎿') + '</div>' +
          '<div class="rental-coming-soon__title">' + cat.title + ' — Coming Soon</div>' +
          '<p class="rental-coming-soon__text">This equipment category is not yet available. <strong>Enquire on WhatsApp</strong> for early access or custom arrangements.</p>' +
          '<a href="https://wa.me/' + waNum + '?text=' + encodeURIComponent('I\'m interested in ' + cat.title + ' rental') + '" target="_blank" class="rental-coming-soon__btn">📲 Enquire Now</a>' +
          '</div>';
      } else {
        if (enabledItems.length === 0) {
          panelContent = '<div class="rental-coming-soon"><div class="rental-coming-soon__icon">' + (cat.icon || '🎿') + '</div><div class="rental-coming-soon__title">No Items Available</div><p class="rental-coming-soon__text">Nothing available in this category yet. Check back soon.</p><a href="https://wa.me/' + waNum + '" class="rental-coming-soon__btn">📲 Enquire Now</a></div>';
        } else {
          panelContent = '<div class="rental-panel-header">' +
            '<div class="rental-panel-header__label">' + (cat.icon || '🎿') + ' ' + cat.title + '</div>' +
            '<div class="rental-panel-header__title">Choose Your Gear</div>' +
            '<div class="rental-panel-header__sub">All prices per day · Expert fitting included · Pick up from our base camp</div>' +
            '</div>' +
            '<div class="rental-eq-grid">' +
            enabledItems.map(function (item) {
              var waLink = 'https://wa.me/' + waNum + '?text=' + encodeURIComponent(item.waMsg || 'I\'m interested in renting ' + item.title);
              var displayPrice = item.price ? (item.price.indexOf('/per day') !== -1 ? item.price : (item.price.replace(/\/day$/, '') + '/per day')) : '';
              return '<div class="rental-eq-card">' +
                (item.image ? '<div class="rental-eq-card__img-wrap"><img class="rental-eq-card__img" src="' + item.image + '" alt="' + item.title + '" onerror="this.parentElement.style.display=\'none\'">' + (displayPrice ? '<span class="rental-eq-card__price">' + displayPrice + '</span>' : '') + '</div>' : '') +
                '<div class="rental-eq-card__body">' +
                '<div class="rental-eq-card__title">' + item.title + '</div>' +
                '<div class="rental-eq-card__desc">' + (item.desc || '') + '</div>' +
                (displayPrice ? '<div class="rental-eq-card__price-row"><span class="rental-eq-card__price-label">Rental Rate</span><span class="rental-eq-card__price-val">' + displayPrice + '</span></div>' : '') +
                '<a href="' + waLink + '" target="_blank" class="rental-eq-card__cta">📲 Enquire on WhatsApp</a>' +
                '</div></div>';
            }).join('') +
            '</div>';
        }
      }
      var isActive = (i === activeIdx);
      return '<div class="rental-panel' + (isActive ? ' active' : '') + '" id="rental-panel-' + i + '" role="tabpanel">' + panelContent + '</div>';
    }).join('');

    // Tab switcher
    window._rentalTab = function (btn, idx) {
      var allBtns = tabsEl.querySelectorAll('.rental-tab-btn');
      var allPanels = panelsEl.querySelectorAll('.rental-panel');
      allBtns.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      allPanels.forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      var panel = document.getElementById('rental-panel-' + idx);
      if (panel) panel.classList.add('active');
    };
  }

  /* ─── TRANSPORT PAGE RENDERER (mirrors renderRentalPage) ─── */
  function renderTransportPage(tabsContainerId, panelsContainerId) {
    var tabsEl = document.getElementById(tabsContainerId);
    var panelsEl = document.getElementById(panelsContainerId);
    if (!tabsEl || !panelsEl) return;

    var cats = get('transport');
    var settings = get('settings') || {};
    var waNum = (settings.whatsappNumber || '919149974118').replace(/\D/g, '');

    if (!cats || cats.length === 0) {
      tabsEl.innerHTML = '';
      panelsEl.innerHTML = '<div class="rental-coming-soon"><div class="rental-coming-soon__icon">🚗</div><div class="rental-coming-soon__title">No Categories Yet</div><p class="rental-coming-soon__text">We\'re building our transport fleet. Check back soon or <strong>WhatsApp us</strong> directly.</p><a href="https://wa.me/' + waNum + '" class="rental-coming-soon__btn">WhatsApp Us</a></div>';
      return;
    }

    // Check URL parameter 'tab' (e.g. ?tab=0, ?tab=1, or ?tab=Airport%20Transfers)
    var activeIdx = 0;
    try {
      var urlParams = new URLSearchParams(window.location.search);
      var paramTab = urlParams.get('tab');
      if (paramTab !== null && paramTab !== '') {
        if (!isNaN(parseInt(paramTab))) {
          activeIdx = parseInt(paramTab);
        } else {
          var lowerParam = paramTab.toLowerCase();
          cats.forEach(function (c, idx) {
            if (c.id.toLowerCase() === lowerParam || c.title.toLowerCase() === lowerParam) {
              activeIdx = idx;
            }
          });
        }
      }
    } catch (e) { }
    if (activeIdx < 0 || activeIdx >= cats.length) activeIdx = 0;

    // Build tabs
    tabsEl.innerHTML = cats.map(function (cat, i) {
      var isCS = cat.comingSoon || !cat.items || cat.items.length === 0;
      var isActive = (i === activeIdx);
      return '<button class="rental-tab-btn' + (isActive ? ' active' : '') + '" data-tab="' + i + '" onclick="window._transportTab(this,' + i + ')" role="tab" aria-selected="' + (isActive ? 'true' : 'false') + '">' +
        '<span class="rental-tab-icon">' + (cat.icon || '🚗') + '</span>' +
        cat.title +
        (isCS ? '<span class="rental-tab-cs-badge">Soon</span>' : '') +
        '</button>';
    }).join('');

    // Build panels
    panelsEl.innerHTML = cats.map(function (cat, i) {
      var isCS = cat.comingSoon || !cat.items || cat.items.length === 0;
      var panelContent = '';
      if (isCS) {
        panelContent = '<div class="rental-coming-soon">' +
          '<div class="rental-coming-soon__icon">' + (cat.icon || '🚗') + '</div>' +
          '<div class="rental-coming-soon__title">' + cat.title + ' — Coming Soon</div>' +
          '<p class="rental-coming-soon__text">This transport category is not yet available. <strong>Enquire on WhatsApp</strong> for early access or custom arrangements.</p>' +
          '<a href="https://wa.me/' + waNum + '?text=' + encodeURIComponent('I\'m interested in ' + cat.title) + '" target="_blank" class="rental-coming-soon__btn">📲 Enquire Now</a>' +
          '</div>';
      } else {
        var enabledItems = cat.items.filter(function (it) { return it.enabled !== false; });
        if (enabledItems.length === 0) {
          panelContent = '<div class="rental-coming-soon"><div class="rental-coming-soon__icon">' + (cat.icon || '🚗') + '</div><div class="rental-coming-soon__title">No Vehicles Available</div><p class="rental-coming-soon__text">Nothing available in this category yet. Check back soon.</p><a href="https://wa.me/' + waNum + '" class="rental-coming-soon__btn">📲 Enquire Now</a></div>';
        } else {
          panelContent = '<div class="rental-panel-header">' +
            '<div class="rental-panel-header__label">' + (cat.icon || '🚗') + ' ' + cat.title + '</div>' +
            '<div class="rental-panel-header__title">Choose Your Vehicle</div>' +
            '<div class="rental-panel-header__sub">All prices include professional driver · Fuel included · 24/7 support</div>' +
            '</div>' +
            '<div class="rental-eq-grid">' +
            enabledItems.map(function (item) {
              var waLink = 'https://wa.me/' + waNum + '?text=' + encodeURIComponent(item.waMsg || 'I\'m interested in ' + item.title);
              var displayPrice = item.price ? (item.price.indexOf('/per day') !== -1 ? item.price : (item.price.replace(/\/day$/, '') + '/per day')) : '';
              return '<div class="rental-eq-card">' +
                (item.image ? '<div class="rental-eq-card__img-wrap"><img class="rental-eq-card__img" src="' + item.image + '" alt="' + item.title + '" onerror="this.parentElement.style.display=\'none\'">' + (displayPrice ? '<span class="rental-eq-card__price">' + displayPrice + '</span>' : '') + '</div>' : '') +
                '<div class="rental-eq-card__body">' +
                '<div class="rental-eq-card__title">' + item.title + '</div>' +
                '<div class="rental-eq-card__desc">' + (item.desc || '') + '</div>' +
                (displayPrice ? '<div class="rental-eq-card__price-row"><span class="rental-eq-card__price-label">Price Rate</span><span class="rental-eq-card__price-val">' + displayPrice + '</span></div>' : '') +
                '<a href="' + waLink + '" target="_blank" class="rental-eq-card__cta">📲 Enquire on WhatsApp</a>' +
                '</div></div>';
            }).join('') +
            '</div>';
        }
      }
      var isActive = (i === activeIdx);
      return '<div class="rental-panel' + (isActive ? ' active' : '') + '" id="transport-panel-' + i + '" role="tabpanel">' + panelContent + '</div>';
    }).join('');

    // Tab switcher
    window._transportTab = function (btn, idx) {
      var allBtns = tabsEl.querySelectorAll('.rental-tab-btn');
      var allPanels = panelsEl.querySelectorAll('.rental-panel');
      allBtns.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      allPanels.forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      var panel = document.getElementById('transport-panel-' + idx);
      if (panel) panel.classList.add('active');
    };
  }

  function escHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ─── CONTACT SECTION RENDERER ─── */
  function renderContact(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;

    var contacts = get('contacts');
    if (!contacts || contacts.length === 0) {
      contacts = JSON.parse(JSON.stringify(defaults.contacts));
    }

    var activeContacts = contacts.filter(function (c) { return c.enabled !== false; });
    if (activeContacts.length === 0) {
      el.innerHTML = '';
      return;
    }

    var activeIdx = activeContacts.findIndex(function (c) { return c.isDefault; });
    if (activeIdx === -1) activeIdx = 0;

    function drawContact(idx) {
      var c = activeContacts[idx];
      var tabsHtml = '';
      if (activeContacts.length > 1) {
        tabsHtml = '<div class="contact-branch-tabs">' +
          activeContacts.map(function (item, i) {
            var activeClass = (i === idx) ? ' active' : '';
            return '<button class="contact-branch-btn' + activeClass + '" onclick="window._contactTab(this, ' + i + ')">' +
              escHtml(item.name) +
              '</button>';
          }).join('') +
          '</div>';
      }

      var formattedAddress = (c.address || '').replace(/\n/g, '<br>');
      var waMsg = "Hi, I would like to enquire about Shred Himalayas packages.";
      var waLink = 'https://wa.me/' + (c.whatsapp || '').replace(/\D/g, '') + '?text=' + encodeURIComponent(waMsg);
      var telLink = 'tel:' + (c.phone || '').replace(/\s+/g, '');

      return '<div class="contact-card-premium reveal">' +
        '<div class="contact-card-premium__ambient"></div>' +
        '<div class="contact-card-premium__header">' +
        (c.badge ? '<div class="contact-card-premium__badge">' +
          '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">' +
          '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>' +
          '</svg>' +
          '<span>' + escHtml(c.badge) + '</span>' +
          '</div>' : '') +
        '<h2 class="contact-card-premium__title">Get in <span class="text-gradient">Touch</span></h2>' +
        (c.subtitle ? '<p class="contact-card-premium__subtitle">' + escHtml(c.subtitle) + '</p>' : '') +
        '</div>' +
        tabsHtml +
        '<div class="contact-card-premium__grid">' +
        '  <!-- Office & Operations -->' +
        '  <div class="contact-card-item">' +
        '    <div class="contact-card-item__icon-wrap">' +
        '      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>' +
        '        <circle cx="12" cy="10" r="3"></circle>' +
        '      </svg>' +
        '    </div>' +
        '    <div class="contact-card-item__content">' +
        '      <h4 class="contact-card-item__label">OFFICE &amp; OPERATIONS</h4>' +
        '      <p class="contact-card-item__value">' +
        formattedAddress +
        '      </p>' +
        (c.mapUrl ? '      <a href="' + escHtml(c.mapUrl) + '" target="_blank" class="contact-card-item__link">' +
          '        <span>View on Map</span>' +
          '        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>' +
          '      </a>' : '') +
        '    </div>' +
        '  </div>' +
        '  <!-- Divider -->' +
        '  <div class="contact-card-premium__divider"></div>' +
        '  <!-- General Enquiries -->' +
        '  <div class="contact-card-item">' +
        '    <div class="contact-card-item__icon-wrap">' +
        '      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>' +
        '      </svg>' +
        '    </div>' +
        '    <div class="contact-card-item__content">' +
        '      <h4 class="contact-card-item__label">GENERAL ENQUIRIES</h4>' +
        '      <div class="contact-card-item__group">' +
        (c.email ? '        <a href="mailto:' + escHtml(c.email) + '" class="contact-card-item__contact-link">' +
          '          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' +
          '          <span>' + escHtml(c.email) + '</span>' +
          '        </a>' : '') +
        (c.phone ? '        <a href="' + escHtml(telLink) + '" class="contact-card-item__contact-link highlight">' +
          '          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
          '          <span>' + escHtml(c.phone) + '</span>' +
          '        </a>' : '') +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>' +
        '<!-- Actions -->' +
        '<div class="contact-card-premium__actions">' +
        (c.whatsapp ? '  <a href="' + escHtml(waLink) + '" target="_blank" class="contact-action-btn contact-action-btn--whatsapp">' +
          '    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>' +
          '    <span>Chat on WhatsApp</span>' +
          '  </a>' : '') +
        (c.phone ? '  <a href="' + escHtml(telLink) + '" class="contact-action-btn contact-action-btn--phone">' +
          '    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
          '    <span>Call Directly</span>' +
          '  </a>' : '') +
        '</div>' +
        '</div>';
    }

    el.innerHTML = drawContact(activeIdx);

    window._contactTab = function (btn, idx) {
      el.innerHTML = drawContact(idx);
      if (window.ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    };
  }

  /* ─── SEO META TAG INJECTOR ─── */
  function renderSEO() {
    var seo = get('seo');
    if (!seo) seo = JSON.parse(JSON.stringify(defaults.seo));

    function setMeta(name, content, prop) {
      if (!content) return;
      var sel = prop
        ? 'meta[property="' + name + '"]'
        : 'meta[name="' + name + '"]';
      var el = document.querySelector(sel);
      if (!el) {
        el = document.createElement('meta');
        if (prop) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    }

    function setLink(rel, href) {
      if (!href) return;
      var el = document.querySelector('link[rel="' + rel + '"]');
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    }

    // Page title
    if (seo.metaTitle) document.title = seo.metaTitle;

    // Core meta tags
    setMeta('description', seo.metaDescription);
    setMeta('keywords', seo.metaKeywords);
    setMeta('robots', seo.robotsDirective || 'index, follow');

    // Open Graph
    setMeta('og:title', seo.ogTitle, true);
    setMeta('og:description', seo.ogDescription, true);
    setMeta('og:image', seo.ogImage, true);
    setMeta('og:url', seo.ogUrl || seo.canonicalUrl, true);
    setMeta('og:type', 'website', true);
    setMeta('og:site_name', 'Shred Himalayas', true);

    // Twitter Card
    setMeta('twitter:card', seo.twitterCard || 'summary_large_image');
    setMeta('twitter:site', seo.twitterSite);
    setMeta('twitter:title', seo.twitterTitle || seo.ogTitle);
    setMeta('twitter:description', seo.twitterDescription || seo.ogDescription);
    setMeta('twitter:image', seo.ogImage);

    // Canonical
    setLink('canonical', seo.canonicalUrl);

    // JSON-LD Structured Data (LocalBusiness schema)
    if (seo.schemaEnabled !== false) {
      var existingScript = document.getElementById('sh-schema-ld');
      if (existingScript) existingScript.remove();
      var settings = get('settings');
      var contacts = get('contacts') || [];
      var primary = contacts.find(function(c){ return c.isDefault; }) || contacts[0] || {};
      var schema = {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": "Shred Himalayas Expeditions",
        "description": seo.metaDescription,
        "url": seo.canonicalUrl || 'https://shredhimalayas.com',
        "telephone": primary.phone || '+91 91499 74118',
        "email": primary.email || 'loneakash7753@gmail.com',
        "address": {
          "@type": "PostalAddress",
          "streetAddress": (primary.address || 'Chandilora, Tangmarg Gulmarg Road').split('\n')[0],
          "addressLocality": "Baramulla",
          "addressRegion": "Kashmir",
          "postalCode": "193402",
          "addressCountry": "IN"
        },
        "areaServed": "Kashmir, Gulmarg, Pahalgam, Sonamarg, Srinagar",
        "priceRange": "₹₹₹",
        "sameAs": []
      };
      var ldScript = document.createElement('script');
      ldScript.id = 'sh-schema-ld';
      ldScript.type = 'application/ld+json';
      ldScript.textContent = JSON.stringify(schema, null, 2);
      document.head.appendChild(ldScript);
    }
  }

  /* ─── RENDER OUR TEAM ─── */
  function renderTeam(containerId) {
    var el = document.getElementById(containerId || 'team-cards-container');
    if (!el) return;

    function esc(s) {
      if (!s) return '';
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    var team = get('team');
    if (!team || !Array.isArray(team)) team = defaults.team;

    var activeMembers = team.filter(function (m) { return m.enabled !== false; });
    if (!activeMembers.length) {
      el.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: rgba(255,255,255,0.6); padding: 40px; font-family: var(--font-body);">No team members listed currently.</div>';
      return;
    }

    el.innerHTML = activeMembers.map(function (m) {
      var photoSrc = m.photo || 'assets/images/akash-avatar.jpg';

      return '<div class="team-card">' +
        '  <div class="team-card__image-wrap">' +
        '    <img src="' + esc(photoSrc) + '" alt="' + esc(m.name) + '" class="team-card__photo" loading="lazy" onerror="this.onerror=null;this.src=\'assets/images/akash-avatar.jpg\'">' +
        '    <div class="team-card__overlay"></div>' +
        '    <div class="team-card__overlay-bottom"></div>' +
        (m.badge ? '    <span class="team-card__badge">' + esc(m.badge) + '</span>' : '') +
        '  </div>' +
        '  <div class="team-card__content">' +
        '    <h3 class="team-card__name">' + esc(m.name) + '</h3>' +
        '    <div class="team-card__role">' + esc(m.role || 'Himalayan Specialist') + '</div>' +
        '    <p class="team-card__desc">' + esc(m.description || '') + '</p>' +
        '  </div>' +
        '</div>';
    }).join('');
  }

  /* ─── RENDER OUR STORY / ABOUT ─── */
  function renderAbout(containerId) {
    var el = document.getElementById(containerId || 'about-container');
    if (!el) return;

    function esc(s) {
      if (!s) return '';
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    var about = get('about');
    if (!about || typeof about !== 'object') about = defaults.about;

    var portraitImg = about.portraitImage || 'assets/images/founder-portrait.png';
    var label = about.label || 'Our Story';
    var titlePrefix = about.titlePrefix !== undefined ? about.titlePrefix : 'Built By ';
    var titleGradient = about.titleGradient !== undefined ? about.titleGradient : 'Local Experts';
    var quote = about.quote || '';
    var bio = about.bio || '';
    var timeline = about.timeline || (defaults.about ? defaults.about.timeline : []);

    var activeTimeline = timeline.filter(function (item) { return item.enabled !== false; });

    var timelineHtml = activeTimeline.map(function (item) {
      return '<div class="about__timeline-item">' +
        '  <span class="about__timeline-year">' + esc(item.year) + '</span>' +
        '  <p class="about__timeline-text">' + esc(item.text) + '</p>' +
        '</div>';
    }).join('');

    el.innerHTML =
      '<div class="about__portrait reveal-left" data-speed="0.94">' +
      '  <img src="' + esc(portraitImg) + '" alt="Founder of Shred Himalayas" class="about__portrait-image">' +
      '  <div class="about__portrait-frame"></div>' +
      '</div>' +
      '<div class="about__content reveal-right">' +
      '  <p class="section-label">' + esc(label) + '</p>' +
      '  <h2 class="section-title split-text">' + esc(titlePrefix) + '<span class="text-gradient">' + esc(titleGradient) + '</span></h2>' +
      '  <blockquote class="about__quote">' + esc(quote) + '</blockquote>' +
      '  <p class="about__bio">' + esc(bio) + '</p>' +
      '  <div class="about__timeline">' + timelineHtml + '</div>' +
      '</div>';
  }

  // Public API
  return {
    init, onChange, get, set, reset, defaults,
    getPolicies, setPolicies,
    renderSkiing, renderSnowboarding, renderTrekking,
    renderPackages, renderActivities, renderRentals, renderRentalPage,
    renderTestimonials, renderHero, renderAbout, renderFooter, updateWhatsApp,
    renderTransportPage, renderContact, renderSEO, renderTeam
  };
})();

