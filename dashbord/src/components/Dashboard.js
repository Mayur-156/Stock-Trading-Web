// src/Dashboard.js
import React from "react";
import { Route, Routes } from "react-router-dom";

import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";

import { GeneralContextProvider } from "./GeneralContext";
import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <GeneralContextProvider>
        {/* Left watchlist */}
        <WatchList />

        {/* main content */}
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Summary />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/holdings" element={<Holdings />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/funds" element={<Funds />} />
            <Route path="/apps" element={<Apps />} />
          </Routes>
        </div>

        {/* popups (render inside provider) */}
        <BuyActionWindow />
        <SellActionWindow />
      </GeneralContextProvider>
    </div>
  );
};

export default Dashboard;
