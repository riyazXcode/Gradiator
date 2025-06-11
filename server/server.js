const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/configs/db');
const authRoutes = require('./src/routes/auth');
const testRoutes = require('./src/routes/test');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
// app.use('/api/test', testRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
