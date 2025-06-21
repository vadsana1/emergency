const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

// 🟢 ใส่ CORS ที่นี่ (ก่อน .use(express.json()) และก่อน .use(routes))
app.use(cors({
  origin: [
    "https://emergencyctest.netlify.app", // แก้เป็น domain Netlify ของคุณ
    "http://localhost:3000"               // สำหรับตอน dev
  ],
  credentials: true
}));

app.use(express.json());

// === routes ทั้งหมดด้านล่างนี้ ===
app.use(require('./routes/createUser')(admin));
app.use(require('./routes/editUser')(admin));
app.use(require('./routes/deleteUser')(admin));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Admin API running on http://localhost:${PORT}`);
});
