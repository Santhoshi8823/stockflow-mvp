const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get dashboard overview metrics
const getDashboardOverview = async (req, res) => {
  try {
    const orgId = BigInt(req.user.orgId);

    // Fetch all products for the organization
    const products = await prisma.products.findMany({
      where: { orgId },
    });

    // Fetch settings for the organization (with default fallback of 5)
    let settings = await prisma.settings.findFirst({
      where: { orgId },
    });

    const defaultThreshold = settings ? settings.defaultLowStockThreshold : 5;

    const totalProducts = products.length;
    const totalStock = products.reduce((acc, p) => acc + (p.quantity || 0), 0);

    // Calculate low stock items
    const lowStockItems = products.filter((p) => {
      const threshold =
        p.lowStockThreshold !== null && p.lowStockThreshold !== undefined
          ? p.lowStockThreshold
          : defaultThreshold;
      return p.quantity <= threshold;
    });

    res.status(200).json({
      totalProducts,
      totalStock,
      lowStockItemsCount: lowStockItems.length,
      lowStockItems: lowStockItems.map((p) => ({
        id: p.id.toString(),
        name: p.name,
        sku: p.sku,
        quantity: p.quantity,
        lowStockThreshold:
          p.lowStockThreshold !== null ? p.lowStockThreshold : defaultThreshold,
      })),
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getDashboardOverview,
};
