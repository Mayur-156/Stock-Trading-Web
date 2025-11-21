// src/SellActionWindow.js
import React, { useContext, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css"; // reuse same CSS for consistent style

const SellActionWindow = () => {
  const { isSellWindowOpen, selectedSellUID, closeSellWindow } = useContext(GeneralContext);

  const [sellQty, setSellQty] = useState(1);
  const [sellPrice, setSellPrice] = useState("");
  const [availableQty, setAvailableQty] = useState(0);
  const [ltp, setLtp] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [avgBuyPrice, setAvgBuyPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (isSellWindowOpen && selectedSellUID) {
        try {
          // 1) fetch holdings for this stock (backend must implement)
          const holdingRes = await axios.get(`http://localhost:3002/holdings/${selectedSellUID}`);
          const hold = holdingRes.data || {};
          setAvailableQty(hold.quantity || 0);
          setAvgBuyPrice(hold.avgPrice || 0);

          // 2) fetch live stock info (backend must implement)
          const stockRes = await axios.get(`http://localhost:3002/stock/${selectedSellUID}`);
          const stock = stockRes.data || {};
          setLtp(stock.ltp || 0);
          setPriceChange(stock.change || 0);

          // autofill sell price with LTP
          setSellPrice(stock.ltp || 0);
        } catch (err) {
          console.error("Error fetching sell data:", err);
          setAvailableQty(0);
          setAvgBuyPrice(0);
          setLtp(0);
          setPriceChange(0);
        }
      }
    };

    fetchData();
    // reset on close
    if (!isSellWindowOpen) {
      setSellQty(1);
      setSellPrice("");
      setAvailableQty(0);
      setLtp(0);
      setPriceChange(0);
      setAvgBuyPrice(0);
    }
  }, [isSellWindowOpen, selectedSellUID]);

  if (!isSellWindowOpen) return null;

  // profit/loss calculation
  const totalSellValue = Number(sellQty) * Number(sellPrice || 0);
  const totalBuyValue = Number(sellQty) * Number(avgBuyPrice || 0);
  const profitLoss = totalSellValue - totalBuyValue;
  const profitPercent = avgBuyPrice > 0 ? ((profitLoss / totalBuyValue) * 100).toFixed(2) : "0.00";

  const handleSellClick = async () => {
    // validations
    if (availableQty <= 0) {
      alert("❌ You don’t own this stock. Buy it before selling.");
      return;
    }
    if (!sellQty || Number(sellQty) <= 0) {
      alert("Enter valid quantity.");
      return;
    }
    if (Number(sellQty) > Number(availableQty)) {
      alert(`⚠️ You only have ${availableQty} shares. Reduce quantity.`);
      return;
    }
    if (!sellPrice || Number(sellPrice) <= 0) {
      alert("Enter valid price!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3002/newOrder", {
        name: selectedSellUID,
        qty: Number(sellQty),
        price: Number(sellPrice),
        mode: "SELL",
      });

      if (res.status === 200) {
        alert("✅ Sell order placed successfully!");
        closeSellWindow();
      } else {
        alert("⚠️ Something went wrong. Try again.");
      }
    } catch (err) {
      console.error("Sell failed:", err);
      alert("❌ Failed to place sell order. See console.");
    }
  };

  return ReactDOM.createPortal(
    <div className="buy-overlay">
      <div className="container" id="buy-window">
        <h3>Sell — {selectedSellUID}</h3>

        <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "10px", marginBottom: "12px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", fontWeight: "500" }}>
            <span>LTP: <b>₹{ltp}</b></span>
            <span style={{ color: priceChange >= 0 ? "#16a34a" : "#dc2626", fontWeight: "600" }}>
              {priceChange >= 0 ? "▲" : "▼"} {priceChange}%
            </span>
          </div>
        </div>

        <p style={{ color: "#555", marginBottom: "10px" }}>
          Available Quantity: <b>{availableQty}</b> | Avg. Buy: ₹{avgBuyPrice}
        </p>

        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input type="number" min="1" onChange={(e) => setSellQty(e.target.value)} value={sellQty} />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input type="number" step="0.05" onChange={(e) => setSellPrice(e.target.value)} value={sellPrice} />
          </fieldset>
        </div>

        <div style={{ background: "#f8fafc", padding: "8px 12px", borderRadius: "8px", margin: "12px 0", border: "1px solid #e2e8f0" }}>
          <p style={{ color: profitLoss >= 0 ? "#16a34a" : "#dc2626", margin: 0, fontWeight: "600" }}>
            {profitLoss >= 0 ? "Profit" : "Loss"}: ₹{profitLoss.toFixed(2)} ({profitPercent}%)
          </p>
        </div>

        <div className="buttons">
          <span>Order Value ₹{(sellQty * sellPrice || 0).toFixed(2)}</span>
          <div>
            <button className="btn btn-blue" onClick={handleSellClick}>Sell</button>
            <button className="btn btn-grey" onClick={closeSellWindow}>Cancel</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SellActionWindow;
