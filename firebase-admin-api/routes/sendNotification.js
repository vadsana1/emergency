const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// POST /api/send-notification
router.post("/send-notification", async (req, res) => {
  try {
    console.log("REQ BODY", req.body);

    const { userId, incidentId, message } = req.body;
    if (!userId || !incidentId || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // ดึง FCM Token จาก collection 'users'
    const userDoc = await admin.firestore().collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    const { fcmToken, fcm_tokens } = userDoc.data();
    // รองรับทั้งแบบเก่า (fcmToken เดี่ยว) และแบบใหม่ (fcm_tokens array)
    const token = fcmToken || (Array.isArray(fcm_tokens) && fcm_tokens[0]);
    if (!token) {
      return res.status(400).json({ error: "No FCM token" });
    }

    // สร้าง payload FCM
    const payload = {
      notification: {
        title: "ແຈ້ງເຫດໃໝ່",
        body: message,
      },
      data: {
        IncidentID: incidentId,
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
      token: token,
    };

    // ส่ง FCM
    await admin.messaging().send(payload);

    // เพิ่ม log ลง collection 'notifications'
    await admin.firestore().collection("notifications").add({
      IncidentID: incidentId,
      Message: message,
      ReadStatus: false,
      SentAt: admin.firestore.FieldValue.serverTimestamp(),
      UserID: userId,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("FCM/Firestore Error:", err);
    return res.status(500).json({ error: "Send notification failed", detail: err.message });
  }
});

module.exports = router;
