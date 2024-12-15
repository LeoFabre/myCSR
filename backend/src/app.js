const express = require('express');
const cors = require('cors');
const requirementsRoutes = require('./routes/requirements');
const documentsRoutes = require('./routes/documents');
const { seedDB } = require("../prisma/seed");

(async () => {
  await seedDB();
})();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/requirements', requirementsRoutes);
app.use('/api/documents', documentsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'myCSR : Endpoint not found.' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`myCSR backend running on port ${PORT} ! enjoy !`);
});

module.exports = app;
