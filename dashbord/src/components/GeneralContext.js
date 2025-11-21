// src/GeneralContext.js
import React, { createContext, useState } from "react";

const GeneralContext = createContext({
  isBuyWindowOpen: false,
  selectedStockUID: null,
  openBuyWindow: (uid) => {},
  closeBuyWindow: () => {},
  isSellWindowOpen: false,
  selectedSellUID: null,
  openSellWindow: (uid) => {},
  closeSellWindow: () => {},
});

export const GeneralContextProvider = ({ children }) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState(null);

  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedSellUID, setSelectedSellUID] = useState(null);

  const openBuyWindow = (uid) => {
    setSelectedStockUID(uid);
    setIsBuyWindowOpen(true);
  };
  const closeBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID(null);
  };

  const openSellWindow = (uid) => {
    setSelectedSellUID(uid);
    setIsSellWindowOpen(true);
  };
  const closeSellWindow = () => {
    setIsSellWindowOpen(false);
    setSelectedSellUID(null);
  };

  return (
    <GeneralContext.Provider
      value={{
        isBuyWindowOpen,
        selectedStockUID,
        openBuyWindow,
        closeBuyWindow,
        isSellWindowOpen,
        selectedSellUID,
        openSellWindow,
        closeSellWindow,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
