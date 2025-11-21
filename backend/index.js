require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');

const { HoldingsModel } = require('./model/HoldingsModel');
const { PositionsModel } = require('./model/PositionsModel');
const { OrdersModel } = require('./model/OrdersModel');

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Get all holdings
app.get('/allHoldings', async (req, res) => {
  const allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

// ✅ Get all positions
app.get('/allPositions', async (req, res) => {
  const allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

// ✅ Get one holding by stock name (for Sell window)
app.get('/holdings/:stockName', async (req, res) => {
  try {
    const name = req.params.stockName;
    const stock = await HoldingsModel.findOne({ name });

    if (!stock) {
      return res.json({ name, quantity: 0, avgPrice: 0 });
    }

    res.json({
      name: stock.name,
      quantity: stock.qty,
      avgPrice: stock.avg,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Dummy LTP route (you can later connect real API)
app.get('/stock/:stockName', async (req, res) => {
  try {
    const name = req.params.stockName;
    const randomChange = Number((Math.random() * 2 - 1).toFixed(2)); // -1% to +1%
    const randomLTP = Number((100 + Math.random() * 400).toFixed(2)); // 100–500 range
    res.json({
      name,
      ltp: randomLTP,
      change: randomChange,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Place new order (Buy / Sell)
app.post('/newOrder', async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    if (!name || !qty || !price || !mode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // save in Orders collection
    const newOrder = new OrdersModel({ name, qty, price, mode });
    await newOrder.save();

    // handle holdings logic
    let holding = await HoldingsModel.findOne({ name });

    if (mode === "BUY") {
      if (!holding) {
        // new stock
        holding = new HoldingsModel({
          name,
          qty,
          avg: price,
          price,
          net: "0",
          day: "0",
        });
      } else {
        // recalc avg
        const totalQty = holding.qty + qty;
        const newAvg = ((holding.avg * holding.qty) + (price * qty)) / totalQty;
        holding.qty = totalQty;
        holding.avg = newAvg;
      }
      await holding.save();
      return res.status(200).json({ message: "✅ Buy order placed", holding });
    }

    if (mode === "SELL") {
      if (!holding || holding.qty <= 0) {
        return res.status(400).json({ error: "❌ You don't own this stock" });
      }
      if (qty > holding.qty) {
        return res.status(400).json({ error: `⚠️ You only have ${holding.qty} shares` });
      }

      holding.qty -= qty;
      if (holding.qty === 0) holding.avg = 0;
      await holding.save();
      return res.status(200).json({ message: "✅ Sell order placed", holding });
    }

    res.json({ message: "Order saved" });
  } catch (err) {
    console.error("newOrder error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`App Started on port ${PORT}`);
  mongoose.connect(uri)
    .then(() => console.log("✅ MongoDB connected!"))
    .catch((err) => console.error("Mongo error:", err));
});
