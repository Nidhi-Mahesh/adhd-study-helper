const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const notesRoutes = require('./routes/notes');

const app = express();
const PORT = 3000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api', notesRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
