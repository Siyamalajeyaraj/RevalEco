
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
let db;
try {
  db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Test connection and create tables if needed
  await db.execute('SELECT 1');
  console.log('Database connected successfully');

  // Create tables if they don't exist
  await db.execute(`
    CREATE TABLE IF NOT EXISTS buyers (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      eco_score INT DEFAULT 0,
      favorite_ids JSON DEFAULT ('[]'),
      avatar VARCHAR(500),
      location VARCHAR(100),
      phone VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS sellers (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      eco_score INT DEFAULT 0,
      business_name VARCHAR(100),
      business_type VARCHAR(50),
      license_number VARCHAR(50),
      avatar VARCHAR(500),
      location VARCHAR(100),
      phone VARCHAR(20),
      rating DECIMAL(3,1) DEFAULT 5.0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      category ENUM('Plastic', 'Paper', 'Metal', 'Glass', 'Organic', 'E-Waste') NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      quantity INT NOT NULL,
      unit VARCHAR(50) NOT NULL,
      description TEXT,
      image VARCHAR(500),
      seller_id VARCHAR(50),
      location VARCHAR(100),
      distance DECIMAL(5,2),
      rating DECIMAL(3,1) DEFAULT 5.0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_category (category),
      INDEX idx_seller (seller_id)
    )
  `);

  // Insert sample data if tables are empty
  const [buyerRows] = await db.execute('SELECT COUNT(*) as count FROM buyers');
  if (buyerRows[0].count === 0) {
    await db.execute(`
      INSERT INTO buyers (id, name, email, password, eco_score, favorite_ids, avatar, location) VALUES
      ('buyer-1', 'Eco Enthusiast', 'buyer@revaleco.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 850, '[]', 'https://picsum.photos/seed/avatar/200/200', 'Colombo, SL')
    `);
  }

  const [sellerRows] = await db.execute('SELECT COUNT(*) as count FROM sellers');
  if (sellerRows[0].count === 0) {
    await db.execute(`
      INSERT INTO sellers (id, name, email, password, eco_score, business_name, business_type, avatar, location, rating) VALUES
      ('seller-1', 'Green Waste Co', 'seller@revaleco.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 920, 'Green Waste Solutions', 'Recycling Center', 'https://picsum.photos/seed/seller/200/200', 'Colombo Hub', 4.8)
    `);
  }

  const [productRows] = await db.execute('SELECT COUNT(*) as count FROM products');
  if (productRows[0].count === 0) {
    await db.execute(`
      INSERT INTO products (title, category, price, quantity, unit, description, image, seller_id, location, distance, rating) VALUES
      ('Pressed Plastic Bales', 'Plastic', 15450.00, 10, 'Bales', 'High-quality HDPE plastic bales, sorted and cleaned.', 'https://www.makabale.com/media/159/IMG_3258-1.jpg', 'seller-1', 'Downtown Hub', 2.4, 4.8),
      ('Assorted Glass Bottles', 'Glass', 3250.50, 50, 'kg', 'Clear and brown glass bottles ready for crushing.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzzZXXkgX4LnJJkheDVgH0mlKxClcnEeRrrQ&s', 'seller-1', 'East Industrial', 8.1, 4.5),
      ('Cardboard Sheets', 'Paper', 1800.00, 100, 'Sheets', 'Corrugated cardboard, 100% recyclable material.', 'https://bcbox.ca/wp-content/uploads/2024/08/industrial-uses-of-cardboard-sheets.jpg', 'seller-1', 'North Depot', 12.5, 4.2),
      ('Aluminum Scrap', 'Metal', 26500.00, 20, 'kg', 'Mixed aluminum scrap from household electronics.', 'https://www.globalscraps.com/upload/category/1628492232Aluminum-scrap.jpg', 'seller-1', 'South Yard', 4.7, 4.9),
      ('Old Circuit Boards', 'E-Waste', 42000.00, 5, 'kg', 'Recoverable electronic components for gold/copper extraction.', 'https://i.sstatic.net/sIri0.jpg', 'seller-1', 'West Processing', 18.2, 4.7),
      ('Organic Compost Mix', 'Organic', 450.00, 500, 'kg', 'Premium organic waste prepared for high-yield composting.', 'https://www.promixgardening.com/sites/promix/files/promix-premium-organic-garden-mix-03.png', 'seller-1', 'Rural Node A', 35.0, 4.6)
    `);
  }

} catch (error) {
  console.error('Database setup failed:', error);
  console.log('Running in offline mode with mock data');
  db = null;
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Fallback mock data for offline mode
const mockProducts = [
  { id: '1', title: 'Pressed Plastic Bales', category: 'Plastic', price: 15450, quantity: 10, unit: 'Bales', description: 'High-quality HDPE plastic bales, sorted and cleaned.', image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=400', sellerId: 's1', location: 'Downtown Hub', rating: 4.8, distance: 2.4 },
  { id: '2', title: 'Assorted Glass Bottles', category: 'Glass', price: 3250.50, quantity: 50, unit: 'kg', description: 'Clear and brown glass bottles ready for crushing.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', sellerId: 's2', location: 'East Industrial', rating: 4.5, distance: 8.1 },
  { id: '3', title: 'Cardboard Sheets', category: 'Paper', price: 1800, quantity: 100, unit: 'Sheets', description: 'Corrugated cardboard, 100% recyclable material.', image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400', sellerId: 's1', location: 'North Depot', rating: 4.2, distance: 12.5 },
  { id: '4', title: 'Aluminum Scrap', category: 'Metal', price: 26500, quantity: 20, unit: 'kg', description: 'Mixed aluminum scrap from household electronics.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', sellerId: 's3', location: 'South Yard', rating: 4.9, distance: 4.7 },
  { id: '5', title: 'Old Circuit Boards', category: 'E-Waste', price: 42000, quantity: 5, unit: 'kg', description: 'Recoverable electronic components for gold/copper extraction.', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400', sellerId: 's4', location: 'West Processing', rating: 4.7, distance: 18.2 },
  { id: '6', title: 'Organic Compost Mix', category: 'Organic', price: 450, quantity: 500, unit: 'kg', description: 'Premium organic waste prepared for high-yield composting.', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', sellerId: 's5', location: 'Rural Node A', rating: 4.6, distance: 35.0 }
];

const mockUsers = {
  'buyer-1': { id: 'buyer-1', name: 'Eco Enthusiast', email: 'buyer@revaleco.com', role: 'BUYER', ecoScore: 850, favoriteIds: '[]', avatar: 'https://picsum.photos/seed/avatar/200/200' },
  'seller-1': { id: 'seller-1', name: 'Green Waste Co', email: 'seller@revaleco.com', role: 'SELLER', ecoScore: 920, favoriteIds: '[]', avatar: 'https://picsum.photos/seed/seller/200/200' }
};

// Routes
// 1. User signup
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role, ...extra } = req.body;

  if (!db) {
    // Mock signup for offline mode
    const user = {
      id: Date.now().toString(),
      name,
      email,
      role,
      avatar: 'https://picsum.photos/seed/avatar/200/200',
      ecoScore: 0,
      favoriteIds: []
    };
    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
    return res.status(201).json({ token, user });
  }

  try {
    const table = role === 'BUYER' ? 'buyers' : 'sellers';
    const hashedPassword = await bcrypt.hash(password, 10);

    let query, values;
    if (role === 'BUYER') {
      query = 'INSERT INTO buyers (id, name, email, password, location) VALUES (?, ?, ?, ?, ?)';
      values = [Date.now().toString(), name, email, hashedPassword, extra.location || ''];
    } else {
      query = 'INSERT INTO sellers (id, name, email, password, business_name, business_type, location) VALUES (?, ?, ?, ?, ?, ?, ?)';
      values = [Date.now().toString(), name, email, hashedPassword, extra.businessName || '', extra.businessType || '', extra.location || ''];
    }

    const [result] = await db.execute(query, values);
    const token = jwt.sign({ id: result.insertId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: result.insertId, name, email, role } });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

// 2. User login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!db) {
    // Mock login for offline mode
    let user;
    if (email === 'buyer@revaleco.com' && password === 'password123') {
      user = mockUsers['buyer-1'];
    } else if (email === 'seller@revaleco.com' && password === 'password123') {
      user = mockUsers['seller-1'];
    }

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  }

  try {
    // Check buyers first
    let [rows] = await db.execute('SELECT * FROM buyers WHERE email = ?', [email]);
    let user = rows[0];
    let role = 'BUYER';

    if (!user) {
      // Check sellers
      [rows] = await db.execute('SELECT * FROM sellers WHERE email = ?', [email]);
      user = rows[0];
      role = 'SELLER';
    }

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role, avatar: user.avatar } });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// 3. Get all marketplace products
app.get('/api/products', async (req, res) => {
  if (!db) {
    return res.json(mockProducts);
  }
  try {
    const [rows] = await db.execute('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// 4. Get user profile
app.get('/api/user/:id', async (req, res) => {
  if (!db) {
    const user = mockUsers[req.params.id];
    return user ? res.json(user) : res.status(404).json({ error: 'User not found' });
  }
  try {
    // Check buyers first
    let [rows] = await db.execute('SELECT *, "BUYER" as role FROM buyers WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      return res.json(rows[0]);
    }

    // Check sellers
    [rows] = await db.execute('SELECT *, "SELLER" as role FROM sellers WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      return res.json(rows[0]);
    }

    res.status(404).json({ error: 'User not found' });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// 5. Toggle Favorites
app.post('/api/user/:id/favorites', async (req, res) => {
  const { productId } = req.body;
  try {
    // Check buyers first
    let table = 'buyers';
    let [userRows] = await db.execute(`SELECT favorite_ids FROM ${table} WHERE id = ?`, [req.params.id]);

    if (userRows.length === 0) {
      // Check sellers
      table = 'sellers';
      [userRows] = await db.execute(`SELECT favorite_ids FROM ${table} WHERE id = ?`, [req.params.id]);
      if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });
    }

    let favorites = JSON.parse(userRows[0].favorite_ids || '[]');
    const index = favorites.indexOf(productId);

    if (index > -1) {
      favorites.splice(index, 1); // Remove
      await db.execute(`UPDATE ${table} SET favorite_ids = ? WHERE id = ?`, [JSON.stringify(favorites), req.params.id]);
      res.json({ message: 'Removed from favorites', favorites });
    } else {
      favorites.push(productId); // Add
      await db.execute(`UPDATE ${table} SET favorite_ids = ? WHERE id = ?`, [JSON.stringify(favorites), req.params.id]);
      res.json({ message: 'Added to favorites', favorites });
    }
  } catch (error) {
    console.error('Error updating favorites:', error);
    res.status(500).json({ error: 'Failed to update favorites' });
  }
});

// 4. Create new waste listing (Sellers)
app.post('/api/products', async (req, res) => {
  try {
    const { title, category, price, quantity, unit, description, image, sellerId, location, distance } = req.body;
    const [result] = await db.execute(
      'INSERT INTO products (title, category, price, quantity, unit, description, image, seller_id, location, distance, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, category, price, quantity, unit, description, image, sellerId, location, distance, 5.0]
    );
    const newProduct = {
      id: result.insertId,
      title, category, price, quantity, unit, description, image, sellerId, location, distance, rating: 5.0
    };
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// 6. Clear products (for testing)
app.delete('/api/products/clear', async (req, res) => {
  if (!db) {
    return res.status(500).json({ error: 'Database not connected' });
  }
  try {
    await db.execute('DELETE FROM products');
    res.json({ message: 'Products cleared successfully' });
  } catch (error) {
    console.error('Error clearing products:', error);
    res.status(500).json({ error: 'Failed to clear products' });
  }
});

app.listen(PORT, () => {
  console.log(`RevalEco Server running on port ${PORT}`);
});
