const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// แนะนำ: อ่านไฟล์ .json ใน local หรือใช้ env ถ้า deploy บน Railway หรือคลาวด์
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

// 🟢 ปรับ origin ตามที่ใช้งานจริง
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

// 🟢 เพิ่ม route sendNotification ตรงนี้ (import แบบไม่มีฟังก์ชัน)
// ถ้า sendNotification.js ใช้รูปแบบ exports = router; แบบในตัวอย่างนี้
app.use('/api', require('./routes/sendNotification')); 

// หรือถ้าใช้แบบ module.exports = (admin) => router;
// ให้เป็น: app.use('/api', require('./routes/sendNotification')(admin));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Admin API running on http://localhost:${PORT}`);
});
