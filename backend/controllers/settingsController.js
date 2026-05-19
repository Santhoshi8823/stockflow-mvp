const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const serializeSettings = (s) => {
  if (!s) return null;
  return {
    id: s.id.toString(),
    orgId: s.orgId ? s.orgId.toString() : null,
    defaultLowStockThreshold: s.defaultLowStockThreshold,
    created_date: s.created_date,
    updated_date: s.updated_date,
  };
};

// Get settings
const getSettings = async (req, res) => {
  try {
    const orgId = BigInt(req.user.orgId);
    let settings = await prisma.settings.findFirst({
      where: { orgId },
    });

    // Self-heal: create settings if missing
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          orgId,
          defaultLowStockThreshold: 5,
          created_date: new Date(),
          updated_date: new Date(),
        },
      });
    }

    res.status(200).json(serializeSettings(settings));
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    const orgId = BigInt(req.user.orgId);
    const { defaultLowStockThreshold } = req.body;

    if (defaultLowStockThreshold === undefined) {
      return res.status(400).json({ success: false, message: "defaultLowStockThreshold is required." });
    }

    const threshold = parseInt(defaultLowStockThreshold);
    if (isNaN(threshold) || threshold < 0) {
      return res.status(400).json({ success: false, message: "Invalid threshold value." });
    }

    let settings = await prisma.settings.findFirst({
      where: { orgId },
    });

    if (settings) {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          defaultLowStockThreshold: threshold,
          updated_date: new Date(),
        },
      });
    } else {
      settings = await prisma.settings.create({
        data: {
          orgId,
          defaultLowStockThreshold: threshold,
          created_date: new Date(),
          updated_date: new Date(),
        },
      });
    }

    res.status(200).json(serializeSettings(settings));
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
