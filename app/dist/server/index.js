const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'tripguard-secret-key-2026';

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data file if not exists
function initDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      users: [],
      admins: [
        {
          id: 'admin-001',
          email: 'admin@tripguard.com',
          password: bcrypt.hashSync('admin123', 10),
          name: 'System Admin',
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ],
      trips: [],
      bookings: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Read data
function readData() {
  initDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// Write data
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ============ AUTH ROUTES ============

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const data = readData();

    // Check if user exists
    const existingUser = data.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      name,
      email,
      phone: phone || '',
      password: hashedPassword,
      role: 'user',
      profile: {
        nationality: '',
        language: 'en',
        emergencyContact: '',
        photo: ''
      },
      createdAt: new Date().toISOString(),
      lastLogin: null,
      isActive: true
    };

    data.users.push(newUser);
    writeData(data);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const data = readData();

    // Find user
    const user = data.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    writeData(data);

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Admin Login
app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const data = readData();

    // Find admin
    const admin = data.admins.find(a => a.email === email);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Server error during admin login' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const data = readData();
    const user = data.users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============ USER DASHBOARD ROUTES ============

// Get user dashboard data
app.get('/api/user/dashboard', authenticateToken, (req, res) => {
  try {
    const data = readData();
    const user = data.users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's trips
    const userTrips = data.trips.filter(t => t.userId === user.id) || [];
    
    // Get user's bookings
    const userBookings = data.bookings.filter(b => b.userId === user.id) || [];

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        createdAt: user.createdAt
      },
      stats: {
        totalTrips: userTrips.length,
        totalBookings: userBookings.length,
        upcomingTrips: userTrips.filter(t => new Date(t.startDate) > new Date()).length,
        completedTrips: userTrips.filter(t => new Date(t.endDate) < new Date()).length
      },
      recentTrips: userTrips.slice(0, 5),
      recentBookings: userBookings.slice(0, 5)
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
app.patch('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const { name, phone, nationality, language, emergencyContact } = req.body;
    const data = readData();
    const userIndex = data.users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    if (name) data.users[userIndex].name = name;
    if (phone) data.users[userIndex].phone = phone;
    if (nationality) data.users[userIndex].profile.nationality = nationality;
    if (language) data.users[userIndex].profile.language = language;
    if (emergencyContact) data.users[userIndex].profile.emergencyContact = emergencyContact;

    writeData(data);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: data.users[userIndex].id,
        name: data.users[userIndex].name,
        email: data.users[userIndex].email,
        profile: data.users[userIndex].profile
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create trip
app.post('/api/user/trips', authenticateToken, (req, res) => {
  try {
    const { name, destination, startDate, endDate, type, members } = req.body;
    const data = readData();

    const newTrip = {
      id: uuidv4(),
      userId: req.user.id,
      name,
      destination,
      startDate,
      endDate,
      type: type || 'solo',
      members: members || [],
      itinerary: [],
      status: 'planned',
      createdAt: new Date().toISOString()
    };

    data.trips.push(newTrip);
    writeData(data);

    res.status(201).json({
      message: 'Trip created successfully',
      trip: newTrip
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user trips
app.get('/api/user/trips', authenticateToken, (req, res) => {
  try {
    const data = readData();
    const userTrips = data.trips.filter(t => t.userId === req.user.id);
    res.json({ trips: userTrips });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============ ADMIN ROUTES ============

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  try {
    const data = readData();
    const users = data.users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin,
      profile: u.profile
    }));

    res.json({ 
      users,
      total: users.length,
      active: users.filter(u => u.isActive).length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get admin dashboard stats
app.get('/api/admin/dashboard', authenticateToken, requireAdmin, (req, res) => {
  try {
    const data = readData();
    
    const totalUsers = data.users.length;
    const activeUsers = data.users.filter(u => u.isActive).length;
    const totalTrips = data.trips.length;
    const totalBookings = data.bookings.length;
    
    // Users created in last 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const newUsers = data.users.filter(u => new Date(u.createdAt) > lastWeek).length;

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalTrips,
        totalBookings,
        newUsers
      },
      recentUsers: data.users.slice(-10).reverse().map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
        isActive: u.isActive
      }))
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle user status (admin only)
app.patch('/api/admin/users/:id/status', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const data = readData();
    
    const userIndex = data.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    data.users[userIndex].isActive = isActive;
    writeData(data);

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: data.users[userIndex].id,
        name: data.users[userIndex].name,
        isActive: data.users[userIndex].isActive
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user (admin only)
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const data = readData();
    
    const userIndex = data.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    data.users.splice(userIndex, 1);
    writeData(data);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`TripGuard API Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  initDataFile();
});
