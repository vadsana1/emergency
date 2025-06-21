const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

app.use(cors({
  origin: [
    "https://emergencytest.netlify.app",
    "https://emergency-production-292a.up.railway.app",
    "http://localhost:3000"
  ],
  credentials: true
}));

app.use(express.json());

// 🟢 ทุก route ต้อง prefix /api
app.use('/api', require('./routes/createUser')(admin));
app.use('/api', require('./routes/editUser')(admin));
app.use('/api', require('./routes/deleteUser')(admin));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Admin API running on http://localhost:${PORT}`);
});
