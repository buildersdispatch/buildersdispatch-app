"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { Webhook } = require("svix");

// --------------------
// App + Config
// --------------------
const app = express();
const PORT = process.env.PORT || 3000;

// Basic CORS (adjust origins later if needed)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// --------------------
// Database (PostgreSQL)
// --------------------
// Uses DATABASE_URL if set, otherwise individual PG* vars
const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.PGHOST || "localhost",
        port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
        user: process.env.PGUSER || "postgres",
        password: process.env.PGPASSWORD || "",
        database: process.env.PGDATABASE || "postgres",
      }
);

// --------------------
// Health Check
// --------------------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// --------------------
// Crossmint Webhook
// IMPORTANT: must use RAW body and must be defined BEFORE express.json()
// --------------------
app.post(
  "/api/webhooks/crossmint",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const secret = process.env.CROSSMINT_WEBHOOK_SECRET;

    if (!secret) {
      console.error("❌ Missing CROSSMINT_WEBHOOK_SECRET in .env");
      return res.status(500).send("Webhook secret not configured");
    }

    const headers = {
      "svix-id": req.get("svix-id"),
      "svix-timestamp": req.get("svix-timestamp"),
      "svix-signature": req.get("svix-signature"),
    };

    const payload = req.body.toString("utf8");

    let event;
    try {
      const wh = new Webhook(secret);
      event = wh.verify(payload, headers);
    } catch (err) {
      console.error("❌ Crossmint webhook signature verification failed:", err?.message || err);
      return res.status(400).send("Invalid signature");
    }

    // ACK FAST (always respond quickly)
    res.status(200).json({ received: true });

    // Process after ACK (log + DB update hook point)
    try {
      console.log("✅ Crossmint webhook received:", event.type);

      // Crossmint payload is usually here:
      const p = event.payload || {};
      console.log("Payload:", JSON.stringify(p, null, 2));

      // -------------------------------------------------
      // TODO: Database updates go here.
      // We will implement this next once we see real event payloads.
      // Example pattern (we'll adapt to your schema):
      //
      // if (event.type === "orders.delivery.completed") { ... }
      // if (event.type === "orders.payment.succeeded") { ... }
      // -------------------------------------------------
    } catch (e) {
      console.error("Webhook processing error:", e);
    }
  }
);

// --------------------
// JSON body parser for all other routes
// --------------------
app.use(express.json({ limit: "2mb" }));

// --------------------
// Example placeholder route (optional)
// --------------------
app.get("/api/version", (req, res) => {
  res.json({
    service: "buildersdispatch-backend",
    env: process.env.NODE_ENV || "development",
  });
});

// --------------------
// Start server
// --------------------
app.listen(PORT, () => {
  console.log(`✅ BuildersDispatch API on port ${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🪝 Webhook endpoint: /api/webhooks/crossmint`);
});
