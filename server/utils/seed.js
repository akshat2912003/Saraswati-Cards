const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Admin = require('../models/Admin');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saraswati-cards';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Admin.deleteMany({});

    // Seed Categories
    const categoriesData = [
      { name: 'Wedding Cards', slug: 'wedding-cards', description: 'Traditional, modern & luxury wedding cards', order: 1 },
      { name: 'Digital Wedding Cards', slug: 'digital-wedding-cards', description: 'Shareable digital invitation cards for WhatsApp & social media', order: 2 },
      { name: 'Video Wedding Cards', slug: 'video-wedding-cards', description: 'Animated wedding video invitations', order: 3 },
      { name: 'Birthday Cards', slug: 'birthday-cards', description: 'Fun & elegant birthday invitation cards', order: 4 },
      { name: 'Welcome Boards', slug: 'welcome-boards', description: 'Wedding & event entrance welcome boards', order: 5 },
      { name: 'Gift Envelopes', slug: 'gift-envelopes', description: 'Fancy wedding & event shagun gift envelopes', order: 6 },
      { name: 'Visiting Cards', slug: 'visiting-cards', description: 'Business & personal visiting cards', order: 8 },
    ];

    const insertedCategories = await Category.insertMany(categoriesData);
    console.log(`Seeded ${insertedCategories.length} categories.`);

    const catMap = {};
    insertedCategories.forEach((cat) => {
      catMap[cat.slug] = cat._id;
    });

    // Seed Products matching user screenshots & sample catalog
    const productsData = [
      // 1. Wedding Cards
      {
        name: 'Ivory Floral Wedding Card',
        slug: 'ivory-floral-wedding-card',
        category: catMap['wedding-cards'],
        price: 28,
        priceUnit: 'piece',
        minimumOrderQuantity: 100,
        shortDescription: 'Premium maroon wedding card with gold leaf embossed Ganesha motif & floral border.',
        description: 'Includes main card, outer envelope, and 2 matching inserts. High quality textured ivory & maroon paper stock.',
        images: ['https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600&auto=format&fit=crop&q=80'],
        thumbnail: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600&auto=format&fit=crop&q=80',
        tags: ['wedding', 'maroon', 'gold', 'floral', 'traditional'],
        badges: ['New', 'Trending'],
        stockStatus: 'inStock',
        isNew: true,
        isTrending: true,
        isFeatured: true,
      },
      {
        name: 'Royal Traditional Wedding Card',
        slug: 'royal-traditional-wedding-card',
        category: catMap['wedding-cards'],
        price: 35,
        priceUnit: 'piece',
        minimumOrderQuantity: 50,
        shortDescription: 'Deep maroon laser cut wedding card with rich gold metallic envelope.',
        description: 'Royal regal design with custom name printing included.',
        images: ['https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80'],
        thumbnail: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
        tags: ['royal', 'wedding', 'laser cut'],
        badges: ['Bestseller', 'Trending'],
        stockStatus: 'inStock',
        isTrending: true,
        isFeatured: true,
      },

      // 2. Digital Wedding Cards
      {
        name: 'Digital Shubh Vivah Invitation',
        slug: 'digital-shubh-vivah-invitation',
        category: catMap['digital-wedding-cards'],
        price: 499,
        priceUnit: 'design',
        minimumOrderQuantity: 1,
        shortDescription: 'Stunning HD digital invitation card for WhatsApp with personalized bride & groom illustration.',
        description: 'Delivered in high-resolution JPEG & PDF formats. Ready within 24 hours with custom functions list.',
        images: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80'],
        thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80',
        tags: ['digital', 'whatsapp', 'shubh vivah'],
        badges: ['Trending'],
        stockStatus: 'inStock',
        isTrending: true,
        isNew: true,
      },

      // 3. Video Wedding Cards
      {
        name: 'Royal Wedding Video Invitation',
        slug: 'royal-wedding-video-invitation',
        category: catMap['video-wedding-cards'],
        price: 999,
        priceUnit: 'video',
        minimumOrderQuantity: 1,
        shortDescription: 'Animated HD wedding video invitation with background instrumental music.',
        description: 'Includes multiple pages for Haldi, Mehendi, Sangeet & Wedding ceremony.',
        images: [],
        videos: [],
        thumbnail: '',
        tags: ['video', 'animated', 'wedding'],
        badges: ['Premium', 'Trending'],
        stockStatus: 'inStock',
        isTrending: true,
      },

      // 4. Birthday Cards
      {
        name: 'Kids Party Balloon Birthday Card',
        slug: 'kids-party-balloon-birthday-card',
        category: catMap['birthday-cards'],
        price: 15,
        priceUnit: 'piece',
        minimumOrderQuantity: 30,
        shortDescription: 'Cute pastel balloon theme birthday invitation card.',
        description: 'Printed on premium 300 GSM matte paper with matching envelope.',
        images: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80'],
        thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80',
        tags: ['birthday', 'kids', 'balloons'],
        badges: ['New'],
        stockStatus: 'inStock',
        isNew: true,
      },

      // 5. Welcome Boards
      {
        name: 'Floral Wedding Welcome Board',
        slug: 'floral-wedding-welcome-board',
        category: catMap['welcome-boards'],
        price: 599,
        priceUnit: 'board',
        minimumOrderQuantity: 1,
        shortDescription: 'Rigid sunboard venue entrance welcome board with floral arch graphics.',
        description: 'Weatherproof high resolution vinyl printing on 3mm thick sunboard.',
        images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&auto=format&fit=crop&q=80'],
        thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&auto=format&fit=crop&q=80',
        tags: ['welcome board', 'entrance', 'wedding'],
        badges: ['Premium'],
        stockStatus: 'inStock',
      },

      // 6. Out of Stock Sample
      {
        name: 'Velvet Gold Foil Luxury Card',
        slug: 'velvet-gold-foil-luxury-card',
        category: catMap['wedding-cards'],
        price: 65,
        priceUnit: 'piece',
        minimumOrderQuantity: 100,
        shortDescription: 'Handcrafted velvet cover with heavy gold foil embossing.',
        description: 'Luxury wedding invitation box card.',
        images: ['https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80'],
        thumbnail: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
        tags: ['velvet', 'luxury', 'gold'],
        badges: ['Premium'],
        stockStatus: 'outOfStock',
      },
    ];

    const insertedProducts = await Product.insertMany(productsData);
    console.log(`Seeded ${insertedProducts.length} products.`);

    // Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@saraswatitcards.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

    const admin = new Admin({
      email: adminEmail,
      passwordHash: adminPassword, // Pre-save hook hashes this
      name: 'Saraswati Cards Admin',
    });
    await admin.save();
    console.log(`Seeded admin user: ${adminEmail}`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
