/*
Seed script: imports tours and destinations from ../src/locales/*.json
Uploads images to Cloudinary when URLs are present and creates Tour and Destination documents.

Run from backend folder:
  node scripts/seed.js

Requires: CLOUDINARY_* and MONGO_URI in env
*/

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const cloudinary = require('../src/config/cloudinary');
const connectDB = require('../src/config/db');
const Tour = require('../src/models/Tour');
const Destination = require('../src/models/Destination');

async function uploadImageFromUrl(url, folder = 'gwino-seed') {
  if (!url) return null;
  try {
    const result = await cloudinary.uploader.upload(url, { folder });
    return result.secure_url;
  } catch (err) {
    console.error('Cloudinary upload failed for', url, err.message || err);
    return url; // fallback to original url
  }
}

async function seed() {
  await connectDB();

  const localesDir = path.resolve(__dirname, '../../src/locales');
  const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

  // Clear existing tours/destinations (optional)
  console.log('Clearing existing Tours and Destinations...');
  await Tour.deleteMany({});
  await Destination.deleteMany({});

  for (const file of files) {
    const filePath = path.join(localesDir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    // Seed featuredTours under tours.featuredTours if present
    if (data.tours && data.tours.featuredTours) {
      const featured = data.tours.featuredTours;
      // featured might be an object of entries
      for (const key of Object.keys(featured)) {
        const item = featured[key];
        if (item && item.title) {
          const imageUrl = item.image || item.img || item.photo || null;
          const uploaded = imageUrl ? await uploadImageFromUrl(imageUrl) : (item.image || null);
          const tour = new Tour({
            title: item.title,
            slug: (item.title || key).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: item.description || item.shortDescription || '',
            duration: item.duration || '',
            priceText: item.price || '',
            image: uploaded,
            featured: true
          });
          await tour.save();
          console.log('Seeded tour:', tour.title);
        }
      }
    }

    // Seed destinations if present
    if (data.destinations) {
      for (const key of Object.keys(data.destinations)) {
        const item = data.destinations[key];
        if (item && item.name) {
          const img = item.image || null;
          const uploaded = img ? await uploadImageFromUrl(img) : null;
          const dest = new Destination({
            name: item.name,
            slug: (item.name || key).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            shortDescription: item.description || '',
            longDescription: item.longDescription || item.description || '',
            activities: item.activities || [],
            image: uploaded
          });
          await dest.save();
          console.log('Seeded destination:', dest.name);
        }
      }
    }
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
