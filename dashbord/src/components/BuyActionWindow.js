// src/BuyActionWindow.js
import React, { useContext, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css"; // keep your CSS

const BuyActionWindow = () => {
  const { isBuyWindowOpen, selectedStockUID, closeBuyWindow } = useContext(GeneralContext);

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState("");

  // reset inputs when popup opens / stock changes
  useEffect(() => {
    if (isBuyWindowOpen) {
      setStockQuantity(1);
      setStockPrice("");
    }
  }, [isBuyWindowOpen, selectedStockUID]);
  
  if (!isBuyWindowOpen) return null;

  const handleBuyClick = async () => {
    try {
      // adjust endpoint if needed
      await axios.post("http://localhost:3002/newOrder", {
        name: selectedStockUID,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode: "BUY",
      });
      closeBuyWindow();
    } catch (err) {
      console.error("Order failed:", err);
      // optionally show error to user
    }
  };

  const handleCancelClick = () => {
    closeBuyWindow();
  };

  const dialog = (
    <div className="buy-overlay" style={overlayStyle}>
      <div className="container" id="buy-window" draggable="true">
        <div className="regular-order">
          <h3 style={{ marginTop: 0 }}>Buy — {selectedStockUID}</h3>

          <div className="inputs">
            <fieldset>
              <legend>Qty.</legend>
              <input
                type="number"
                name="qty"
                id="qty"
                min="1"
                onChange={(e) => setStockQuantity(e.target.value)}
                value={stockQuantity}
              />
            </fieldset>

            <fieldset>
              <legend>Price</legend>
              <input
                type="number"
                name="price"
                id="price"
                step="0.05"
                onChange={(e) => setStockPrice(e.target.value)}
                value={stockPrice}
              />
            </fieldset>
          </div>
        </div>

        <div className="buttons">
          <span>Margin required ₹140.65</span>
          <div>
            <button className="btn btn-blue" onClick={handleBuyClick}>
              Buy
            </button>
            <button className="btn btn-grey" onClick={handleCancelClick}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // portal to body to avoid clipping by overflow/transform parents
  return ReactDOM.createPortal(dialog, document.body);
};

const overlayStyle = {
  position: "fixed",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 99999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.25)",
};

export default BuyActionWindow;
