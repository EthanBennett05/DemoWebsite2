import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';

const app = express();

// When using ES Modules, __dirname is not defined by default. 
// Add these two lines to fix that:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION ---
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-to-something-secure';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('password123', 10);
const PORT = 5002;
const DB_PATH = path.join(__dirname, 'bookings.json');

// --- DIRECTORY SETUP ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// --- DATABASE HELPERS (JSON Persistence) ---
const readDB = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file:", err);
    return [];
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing to database file:", err);
  }
};

// --- MIDDLEWARE ---
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://demowebsite2-1.onrender.com', // Add Render frontend URL
  ],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- EMAIL SETUP ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- AUTH MIDDLEWARE ---
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Session expired' });
  }
};

// --- MULTER SETUP ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed!'));
  }
});

// --- EMAIL UTILITIES ---
const sendStatusEmail = async (booking, status) => {
  const isApproved = status === 'approved';
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: booking.email,
    subject: `Booking ${status.toUpperCase()} - 11 Rock Ranch`,
    html: `<h1>11 Rock Ranch</h1>
           <p>Dear ${booking.firstName}, your booking for ${booking.packageType} has been <b>${status}</b>.</p>
           <p>Dates: ${booking.startDate} to ${booking.endDate}</p>`
  };
  try { await transporter.sendMail(mailOptions); } 
  catch (e) { console.error("Email failed:", e); }
};

// --- ROUTES ---

// Auth
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// Bookings
app.get('/api/bookings', verifyAdmin, (req, res) => {
  res.json({ bookings: readDB() });
});

app.post('/api/bookings', async (req, res) => {
  const db = readDB();
  const newBooking = { id: Date.now().toString(), ...req.body, status: 'pending', createdAt: new Date().toISOString() };
  db.push(newBooking);
  writeDB(db);
  res.json({ message: 'Booking received', booking: newBooking });
});

app.patch('/api/bookings/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  let db = readDB();
  const index = db.findIndex(b => b.id === id);
  
  if (index !== -1) {
    db[index].status = status;
    db[index].updatedAt = new Date().toISOString();
    writeDB(db);

    // CRITICAL FIX: Send the JSON response to the dashboard immediately 
    // so the UI updates. Don't make the user wait for the email server.
    res.json({ message: 'Status updated', booking: db[index] });

    // Handle email in the background
    if (status === 'approved' || status === 'denied') {
      sendStatusEmail(db[index], status).catch(err => 
        console.error("Background email failed, but booking was updated:", err)
      );
    }
    return; // End the request here
  }
  
  res.status(404).json({ error: 'Booking not found' });
});

app.delete('/api/bookings/:id', verifyAdmin, (req, res) => {
  const db = readDB().filter(b => b.id !== req.params.id);
  writeDB(db);
  res.json({ message: 'Booking deleted' });
});

// Gallery
app.get('/api/images', (req, res) => {
  fs.readdir('uploads/', (err, files) => {
    if (err) return res.status(500).json({ error: 'Folder read error' });
    res.json({ images: files.map(f => `/uploads/${f}`) });
  });
});

app.post('/api/upload', verifyAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ path: `/uploads/${req.file.filename}` });
});

app.delete('/api/images/:filename', verifyAdmin, (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: 'File deleted' });
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));