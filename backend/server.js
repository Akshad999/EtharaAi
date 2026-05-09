const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Route files
const auth = require('./routes/auth');
const projects = require('./routes/projects');
const tasks = require('./routes/tasks');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/projects', projects);
app.use('/api/tasks', tasks);

// Nested routes
app.use('/api/projects/:projectId/tasks', tasks);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('../frontend/dist'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});


// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const path = require('path');

// // Load env vars
// dotenv.config();

// const app = express();

// // Body parser
// app.use(express.json());

// // Enable CORS
// app.use(cors());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log('MongoDB Connection Error:', err));

// // Routes
// const auth = require('./routes/auth');
// const projects = require('./routes/projects');
// const tasks = require('./routes/tasks');

// // API routes
// app.use('/api/auth', auth);
// app.use('/api/projects', projects);
// app.use('/api/tasks', tasks);

// // Nested route (project tasks)
// app.use('/api/projects/:projectId/tasks', tasks);

// // ================================
// // SERVE FRONTEND (PRODUCTION)
// // ================================
// if (process.env.NODE_ENV === 'production') {

//   const frontendPath = path.join(__dirname, '../frontend/dist');

//   // Serve static files
//   app.use(express.static(frontendPath));

//   // React fallback route (FIXED for Express 5)
//   app.use((req, res, next) => {
//     if (req.path.startsWith('/api')) return next();
//     res.sendFile(path.join(frontendPath, 'index.html'));
//   });
// }

// // ================================
// // START SERVER
// // ================================
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
// });
