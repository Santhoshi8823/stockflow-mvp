const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DB_FILE = path.join(__dirname, "database.json");

// Helper to ensure database file exists
function initDB() {
    if (!fs.existsSync(DB_FILE)) {
        const initialData = {
            users: [],
            organizations: [],
            products: [],
            settings: [] // array of { organizationId, defaultLowStockThreshold }
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf8");
    }
}

// Read database
function readDB() {
    initDB();
    try {
        const data = fs.readFileSync(DB_FILE, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading database file, resetting:", err);
        return { users: [], organizations: [], products: [], settings: [] };
    }
}

// Write database
function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

const db = {
    // ORGANIZATIONS
    organizations: {
        create(name) {
            const data = readDB();
            const newOrg = {
                id: crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex"),
                name,
                createdAt: new Date().toISOString()
            };
            data.organizations.push(newOrg);
            
            // Also initialize default settings for this organization
            data.settings.push({
                organizationId: newOrg.id,
                defaultLowStockThreshold: 5 // Default global threshold
            });

            writeDB(data);
            return newOrg;
        },
        findById(id) {
            const data = readDB();
            return data.organizations.find(org => org.id === id);
        }
    },

    // USERS
    users: {
        create(email, passwordHash, organizationId) {
            const data = readDB();
            const newUser = {
                id: crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex"),
                email: email.toLowerCase().trim(),
                password: passwordHash,
                organizationId,
                createdAt: new Date().toISOString()
            };
            data.users.push(newUser);
            writeDB(data);
            return { id: newUser.id, email: newUser.email, organizationId: newUser.organizationId };
        },
        findByEmail(email) {
            const data = readDB();
            return data.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        },
        findById(id) {
            const data = readDB();
            const user = data.users.find(u => u.id === id);
            if (!user) return null;
            return { id: user.id, email: user.email, organizationId: user.organizationId };
        }
    },

    // PRODUCTS
    products: {
        create(orgId, { name, sku, description, quantity, costPrice, sellingPrice, lowStockThreshold }) {
            const data = readDB();
            
            // Validate SKU uniqueness within the organization
            const skuExists = data.products.some(
                p => p.organizationId === orgId && p.sku.toLowerCase() === sku.toLowerCase().trim()
            );
            if (skuExists) {
                throw new Error("SKU must be unique within your organization");
            }

            const newProduct = {
                id: crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex"),
                organizationId: orgId,
                name: name.trim(),
                sku: sku.toUpperCase().trim(),
                description: (description || "").trim(),
                quantity: parseInt(quantity) || 0,
                costPrice: costPrice !== undefined && costPrice !== "" ? parseFloat(costPrice) : null,
                sellingPrice: sellingPrice !== undefined && sellingPrice !== "" ? parseFloat(sellingPrice) : null,
                lowStockThreshold: lowStockThreshold !== undefined && lowStockThreshold !== "" ? parseInt(lowStockThreshold) : null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            data.products.push(newProduct);
            writeDB(data);
            return newProduct;
        },

        findAll(orgId) {
            const data = readDB();
            return data.products.filter(p => p.organizationId === orgId);
        },

        findById(id, orgId) {
            const data = readDB();
            return data.products.find(p => p.id === id && p.organizationId === orgId);
        },

        update(id, orgId, updates) {
            const data = readDB();
            const productIndex = data.products.findIndex(p => p.id === id && p.organizationId === orgId);
            if (productIndex === -1) {
                throw new Error("Product not found");
            }

            const currentProduct = data.products[productIndex];

            // If updating SKU, check for uniqueness
            if (updates.sku && updates.sku.toUpperCase().trim() !== currentProduct.sku) {
                const skuExists = data.products.some(
                    p => p.id !== id && p.organizationId === orgId && p.sku.toLowerCase() === updates.sku.toLowerCase().trim()
                );
                if (skuExists) {
                    throw new Error("SKU must be unique within your organization");
                }
            }

            const updatedProduct = {
                ...currentProduct,
                name: updates.name !== undefined ? updates.name.trim() : currentProduct.name,
                sku: updates.sku !== undefined ? updates.sku.toUpperCase().trim() : currentProduct.sku,
                description: updates.description !== undefined ? updates.description.trim() : currentProduct.description,
                quantity: updates.quantity !== undefined ? parseInt(updates.quantity) : currentProduct.quantity,
                costPrice: updates.costPrice !== undefined && updates.costPrice !== "" ? parseFloat(updates.costPrice) : (updates.costPrice === "" ? null : currentProduct.costPrice),
                sellingPrice: updates.sellingPrice !== undefined && updates.sellingPrice !== "" ? parseFloat(updates.sellingPrice) : (updates.sellingPrice === "" ? null : currentProduct.sellingPrice),
                lowStockThreshold: updates.lowStockThreshold !== undefined && updates.lowStockThreshold !== "" ? parseInt(updates.lowStockThreshold) : (updates.lowStockThreshold === "" ? null : currentProduct.lowStockThreshold),
                updatedAt: new Date().toISOString()
            };

            data.products[productIndex] = updatedProduct;
            writeDB(data);
            return updatedProduct;
        },

        delete(id, orgId) {
            const data = readDB();
            const initialLength = data.products.length;
            data.products = data.products.filter(p => !(p.id === id && p.organizationId === orgId));
            
            if (data.products.length === initialLength) {
                throw new Error("Product not found");
            }
            
            writeDB(data);
            return true;
        }
    },

    // SETTINGS
    settings: {
        get(orgId) {
            const data = readDB();
            let setting = data.settings.find(s => s.organizationId === orgId);
            if (!setting) {
                // Self-heal: create settings if missing
                setting = { organizationId: orgId, defaultLowStockThreshold: 5 };
                data.settings.push(setting);
                writeDB(data);
            }
            return setting;
        },
        update(orgId, defaultLowStockThreshold) {
            const data = readDB();
            const index = data.settings.findIndex(s => s.organizationId === orgId);
            const threshold = parseInt(defaultLowStockThreshold) || 5;

            if (index !== -1) {
                data.settings[index].defaultLowStockThreshold = threshold;
            } else {
                data.settings.push({
                    organizationId: orgId,
                    defaultLowStockThreshold: threshold
                });
            }
            writeDB(data);
            return { organizationId: orgId, defaultLowStockThreshold: threshold };
        }
    }
};

module.exports = db;
