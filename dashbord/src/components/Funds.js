import React from "react";
import { Link } from "react-router-dom";

const Funds = () => {
  return (
    <div class="funds-container">
        <header class="funds-header">
            <h2>💰 Funds Overview</h2>
            <button class="view-statement-btn">View Statement</button>
        </header>

        <div class="funds-card main-balance">
            <p class="label">Available Cash (Total)</p>
            <div class="balance-amount">
                <span class="currency-symbol">₹</span>
                <span class="amount">1,25,000.50</span>
            </div>
            <p class="detail-note">Includes ₹1,10,000.00 cash and ₹15,000.50 collateral margin.</p>
        </div>

        <div class="funds-actions">
            <button class="action-btn pay-in">
                <i class="fas fa-plus-circle"></i> 
                Add Funds (Pay-in)
            </button>
            <button class="action-btn pay-out">
                <i class="fas fa-minus-circle"></i> 
                Withdraw Funds (Pay-out)
            </button>
        </div>

        <div class="funds-details-grid">
            <div class="detail-card">
                <p class="detail-label">Used Margin</p>
                <p class="detail-value">₹5,000.00</p>
            </div>
            <div class="detail-card">
                <p class="detail-label">Opening Balance</p>
                <p class="detail-value">₹1,20,000.50</p>
            </div>
            <div class="detail-card">
                <p class="detail-label">Funds in Transit</p>
                <p class="detail-value">₹0.00</p>
            </div>
        </div>
    </div>


)};

export default Funds;
