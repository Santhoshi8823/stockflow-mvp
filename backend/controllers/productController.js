const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const serializeProduct = (p) => {
  if (!p) return null;
  return {
    id: p.id.toString(),
    name: p.name,
    sku: p.sku,
    description: p.description,
    quantity: p.quantity,
    costPrice: p.costPrice,
    sellingPrice: p.sellingPrice,
    lowStockThreshold: p.lowStockThreshold,
    orgId: p.orgId ? p.orgId.toString() : null,
    added_date: p.added_date,
    updated_date: p.updated_date,
  };
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const orgId = BigInt(req.user.orgId);
    const products = await prisma.products.findMany({
      where: { orgId },
      orderBy: { id: "desc" },
    });
    res.status(200).json(products.map(serializeProduct));
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const orgId = BigInt(req.user.orgId);
    const { name, sku, description, quantity, costPrice, sellingPrice, lowStockThreshold } = req.body;

    if (!name || !sku) {
      return res.status(400).json({ success: false, message: "Product Name and SKU are required." });
    }

    // Check SKU uniqueness within the organization
    const skuExists = await prisma.products.findFirst({
      where: {
        orgId,
        sku: sku.trim(),
      },
    });

    if (skuExists) {
      return res.status(400).json({ success: false, message: "SKU must be unique within your organization" });
    }

    const newProduct = await prisma.products.create({
      data: {
        orgId,
        name: name.trim(),
        sku: sku.toUpperCase().trim(),
        description: (description || "").trim(),
        quantity: parseInt(quantity) || 0,
        costPrice: costPrice !== undefined && costPrice !== "" ? parseInt(costPrice) : null,
        sellingPrice: sellingPrice !== undefined && sellingPrice !== "" ? parseInt(sellingPrice) : null,
        lowStockThreshold: lowStockThreshold !== undefined && lowStockThreshold !== "" ? parseInt(lowStockThreshold) : null,
        added_date: new Date(),
        updated_date: new Date(),
      },
    });

    res.status(201).json(serializeProduct(newProduct));
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const orgId = BigInt(req.user.orgId);
    const productId = BigInt(req.params.id);
    const { name, sku, description, quantity, costPrice, sellingPrice, lowStockThreshold } = req.body;

    // Check if product exists and belongs to organization
    const product = await prisma.products.findFirst({
      where: { id: productId, orgId },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // If updating SKU, check for uniqueness
    if (sku && sku.toUpperCase().trim() !== product.sku) {
      const skuExists = await prisma.products.findFirst({
        where: {
          id: { not: productId },
          orgId,
          sku: sku.trim(),
        },
      });

      if (skuExists) {
        return res.status(400).json({ success: false, message: "SKU must be unique within your organization" });
      }
    }

    const updatedProduct = await prisma.products.update({
      where: { id: productId },
      data: {
        name: name !== undefined ? name.trim() : product.name,
        sku: sku !== undefined ? sku.toUpperCase().trim() : product.sku,
        description: description !== undefined ? description.trim() : product.description,
        quantity: quantity !== undefined ? parseInt(quantity) : product.quantity,
        costPrice: costPrice !== undefined ? (costPrice !== "" ? parseInt(costPrice) : null) : product.costPrice,
        sellingPrice: sellingPrice !== undefined ? (sellingPrice !== "" ? parseInt(sellingPrice) : null) : product.sellingPrice,
        lowStockThreshold: lowStockThreshold !== undefined ? (lowStockThreshold !== "" ? parseInt(lowStockThreshold) : null) : product.lowStockThreshold,
        updated_date: new Date(),
      },
    });

    res.status(200).json(serializeProduct(updatedProduct));
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const orgId = BigInt(req.user.orgId);
    const productId = BigInt(req.params.id);

    // Check if product exists and belongs to organization
    const product = await prisma.products.findFirst({
      where: { id: productId, orgId },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await prisma.products.delete({
      where: { id: productId },
    });

    res.status(200).json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
