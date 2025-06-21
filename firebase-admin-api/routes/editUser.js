// routes/editUser.js

const express = require('express');
const router = express.Router();

module.exports = (admin) => {
  /**
   * POST /admin-edit-user
   * Body: { uid, userId, email, password, name, phone, helperType }
   * - อัปเดต Auth (password) ถ้ามีส่ง password มา
   * - อัปเดต Firestore เฉพาะ field ที่ส่งมา
   */
  router.post('/admin-edit-user', async (req, res) => {
    // Debug: log payload ที่รับมา
    // console.log('Payload:', req.body);

    const { uid, userId, email, password, name, phone, helperType } = req.body;
    if (!uid || !userId) {
      return res.status(400).json({ error: 'Missing uid or userId' });
    }

    try {
      // อัปเดตรหัสผ่าน (ถ้ามี)
      if (password) {
        await admin.auth().updateUser(uid, { password });
      }

      // อัปเดตฟิลด์อื่นใน Firestore (เฉพาะที่ส่งมา)
      const updateData = {};
      if (email) updateData.email = email;
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      if (helperType) updateData.helperType = helperType;

      // อัปเดต Firestore document ตาม userId (doc id)
      if (Object.keys(updateData).length > 0) {
        await admin.firestore().collection('users').doc(userId).update(updateData);
      }

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
