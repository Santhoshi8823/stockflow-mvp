const express = require("express");
const router = express.Router();
const authMiddleware = require("../authchecker/authMiddleware");
const { getDashboardOverview } = require("../controllers/dashboardController");

// Secure all dashboard routes
router.use(authMiddleware);

router.get("/", getDashboardOverview);

module.exports = router;
