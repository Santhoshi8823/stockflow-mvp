const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "stockflow-mvp-6hour-super-secret-key";

// Middlewares
app.use(cors());
app.use(express.json());

// Request logging middleware for easier debugging during demo
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Auth Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access token is required. Please log in." });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Session expired or invalid token. Please log in again." });
        }
        req.user = decoded; // Contains id, email, organizationId
        next();
    });
}

// --- AUTH ENDPOINTS ---

// Signup
app.post("/api/auth/signup", async (req, res) => {
    try {
        const { email, password, organizationName } = req.body;

        if (!email || !password || !organizationName) {
            return res.status(400).json({ error: "Email, password, and organization name are required." });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long." });
        }

        // Check if user already exists
        const existingUser = db.users.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists." });
        }

        // Create organization
        const organization = db.organizations.create(organizationName);

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user linked to organization
        const user = db.users.create(email, passwordHash, organization.id);

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, email: user.email, organizationId: user.organizationId },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "User and organization created successfully!",
            token,
            user,
            organizationName: organization.name
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Server error during registration." });
    }
});

// Login
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        // Find user
        const user = db.users.findByEmail(email);
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        // Get organization name
        const organization = db.organizations.findById(user.organizationId);
        const orgName = organization ? organization.name : "My Organization";

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, email: user.email, organizationId: user.organizationId },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful!",
            token,
            user: { id: user.id, email: user.email, organizationId: user.organizationId },
            organizationName: orgName
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error during login." });
    }
});

// Get current user profile (Me)
app.get("/api/auth/me", authenticateToken, (req, res) => {
    try {
        const user = db.users.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        const organization = db.organizations.findById(user.organizationId);
        res.json({
            user,
            organizationName: organization ? organization.name : "My Organization"
        });
    } catch (error) {
        console.error("Auth verify error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// --- PRODUCT ENDPOINTS ---

// Get all products
app.get("/api/products", authenticateToken, (req, res) => {
    try {
        const products = db.products.findAll(req.user.organizationId);
        res.json(products);
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ error: "Server error retrieving products." });
    }
});

// Create product
app.post("/api/products", authenticateToken, (req, res) => {
    try {
        const { name, sku, description, quantity, costPrice, sellingPrice, lowStockThreshold } = req.body;

        if (!name || !sku) {
            return res.status(400).json({ error: "Product Name and SKU are required." });
        }

        const product = db.products.create(req.user.organizationId, {
            name,
            sku,
            description,
            quantity,
            costPrice,
            sellingPrice,
            lowStockThreshold
        });

        res.status(201).json(product);
    } catch (error) {
        console.error("Create product error:", error);
        res.status(400).json({ error: error.message || "Failed to create product." });
    }
});

// Update product
app.put("/api/products/:id", authenticateToken, (req, res) => {
    try {
        const { name, sku, description, quantity, costPrice, sellingPrice, lowStockThreshold } = req.body;
        const productId = req.params.id;

        const product = db.products.update(productId, req.user.organizationId, {
            name,
            sku,
            description,
            quantity,
            costPrice,
            sellingPrice,
            lowStockThreshold
        });

        res.json(product);
    } catch (error) {
        console.error("Update product error:", error);
        res.status(400).json({ error: error.message || "Failed to update product." });
    }
});

// Delete product
app.delete("/api/products/:id", authenticateToken, (req, res) => {
    try {
        const productId = req.params.id;
        db.products.delete(productId, req.user.organizationId);
        res.json({ message: "Product deleted successfully." });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(400).json({ error: error.message || "Failed to delete product." });
    }
});

// --- SETTINGS ENDPOINTS ---

// Get settings
app.get("/api/settings", authenticateToken, (req, res) => {
    try {
        const settings = db.settings.get(req.user.organizationId);
        res.json(settings);
    } catch (error) {
        console.error("Get settings error:", error);
        res.status(500).json({ error: "Server error retrieving settings." });
    }
});

// Update settings
app.put("/api/settings", authenticateToken, (req, res) => {
    try {
        const { defaultLowStockThreshold } = req.body;
        
        if (defaultLowStockThreshold === undefined) {
            return res.status(400).json({ error: "defaultLowStockThreshold is required." });
        }

        const settings = db.settings.update(req.user.organizationId, defaultLowStockThreshold);
        res.json(settings);
    } catch (error) {
        console.error("Update settings error:", error);
        res.status(400).json({ error: "Failed to update settings." });
    }
});

// --- DASHBOARD OVERVIEW ENDPOINT ---
app.get("/api/dashboard", authenticateToken, (req, res) => {
    try {
        const orgId = req.user.organizationId;
        const products = db.products.findAll(orgId);
        const settings = db.settings.get(orgId);
        const defaultThreshold = settings ? settings.defaultLowStockThreshold : 5;

        const totalProducts = products.length;
        const totalStock = products.reduce((acc, p) => acc + (p.quantity || 0), 0);
        
        // Low Stock calculation
        const lowStockItems = products.filter(p => {
            const threshold = p.lowStockThreshold !== null && p.lowStockThreshold !== undefined
                ? p.lowStockThreshold
                : defaultThreshold;
            return p.quantity <= threshold;
        });

        res.json({
            totalProducts,
            totalStock,
            lowStockItemsCount: lowStockItems.length,
            lowStockItems: lowStockItems.map(p => ({
                id: p.id,
                name: p.name,
                sku: p.sku,
                quantity: p.quantity,
                lowStockThreshold: p.lowStockThreshold !== null ? p.lowStockThreshold : defaultThreshold
            }))
        });
    } catch (error) {
        console.error("Dashboard overview error:", error);
        res.status(500).json({ error: "Server error retrieving dashboard overview." });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`StockFlow Backend running on port ${PORT}`);
    console.log(`Database: d:\\stockflow-mvp\\backend\\database.json`);
    console.log(`==========================================`);
});