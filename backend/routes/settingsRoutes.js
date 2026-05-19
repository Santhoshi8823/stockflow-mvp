const express = require("express");
const router = express.Router();
const authMiddleware = require("../authchecker/authMiddleware");
const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

// Secure all settings routes
router.use(authMiddleware);

router.get("/", getSettings);
router.put("/", updateSettings);

module.exports = router;
