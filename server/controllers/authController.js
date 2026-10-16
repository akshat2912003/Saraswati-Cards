const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Helper to sign a JWT token
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' });

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide email and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@saraswatitcards.com').toLowerCase().trim();
    const envAdminPass = process.env.ADMIN_PASSWORD || 'akshat2901';

    const isMasterEmail =
      cleanEmail === envAdminEmail ||
      cleanEmail === 'admin@saraswatitcards.com' ||
      cleanEmail === 'admin@saraswaticards.com';
    const isMasterPassword = password === envAdminPass || password === 'akshat2901';

    let admin = await Admin.findOne({
      email: { $in: [cleanEmail, 'admin@saraswatitcards.com', 'admin@saraswaticards.com'] },
    });

    // If admin not in DB yet, auto-create using master credentials
    if (!admin && isMasterEmail && isMasterPassword) {
      admin = new Admin({
        email: cleanEmail,
        passwordHash: password,
        name: 'Saraswati Cards Admin',
      });
      await admin.save();
      console.log(`✅ Auto-created initial admin: ${cleanEmail}`);
    }

    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password.' });
    }

    let isMatch = await admin.comparePassword(password);

    // If master password provided for master account, self-heal password in DB
    if (!isMatch && isMasterEmail && isMasterPassword) {
      admin.passwordHash = password;
      await admin.save();
      isMatch = true;
      console.log(`✅ Admin password self-healed and updated for: ${cleanEmail}`);
    }

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken(admin._id);

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get current logged-in admin
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        name: req.admin.name,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { login, getMe };
