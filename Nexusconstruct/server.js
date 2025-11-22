require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Models
const User = require('./models/User');
const Equipment = require('./models/Equipment');
const Contractor = require('./models/Contractor');
const SecurityService = require('./models/SecurityService');
const Contact = require('./models/Contact');

// Email Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// File Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Authentication Routes
app.post('/api/register', async(req, res) => {
    const { name, email, password, phone, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({
            name,
            email,
            password,
            phone,
            role
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/login', async(req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Equipment Routes
app.get('/api/equipment', async(req, res) => {
    try {
        const equipment = await Equipment.find().sort({ date: -1 });
        res.json(equipment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/equipment', upload.single('image'), async(req, res) => {
    const { name, description, price, category, availability } = req.body;
    try {
        const newEquipment = new Equipment({
            name,
            description,
            price,
            category,
            availability,
            image: req.file ? req.file.path : ''
        });

        const equipment = await newEquipment.save();
        res.json(equipment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Contractor Routes
app.get('/api/contractors', async(req, res) => {
    try {
        const contractors = await Contractor.find().sort({ date: -1 });
        res.json(contractors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/contractors', upload.single('image'), async(req, res) => {
    const { name, specialization, experience, location, contact } = req.body;
    try {
        const newContractor = new Contractor({
            name,
            specialization,
            experience,
            location,
            contact,
            image: req.file ? req.file.path : ''
        });

        const contractor = await newContractor.save();
        res.json(contractor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Security Services Routes
app.get('/api/security-services', async(req, res) => {
    try {
        const services = await SecurityService.find().sort({ date: -1 });
        res.json(services);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Contact Form
app.post('/api/contact', async(req, res) => {
    const { name, email, phone, subject, message } = req.body;
    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            subject,
            message
        });

        await newContact.save();

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'info@nexusconstruct.com',
            subject: `New Contact Form Submission: ${subject}`,
            text: `
                Name: ${name}
                Email: ${email}
                Phone: ${phone}
                Message: ${message}
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ msg: 'Message sent successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Tracking Route
app.get('/api/track/:id', async(req, res) => {
    try {
        // In a real app, this would connect to IoT devices or GPS trackers
        const randomLocation = {
            latitude: -1.2921 + (Math.random() * 0.01),
            longitude: 36.8219 + (Math.random() * 0.01),
            status: ['Active', 'Inactive', 'Maintenance'][Math.floor(Math.random() * 3)],
            battery: Math.floor(Math.random() * 100)
        };
        res.json(randomLocation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));