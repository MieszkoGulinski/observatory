import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ConfigProvider } from "./config";
import { BrowserRouter, Route, Routes } from "react-router";
import MonthView from "./pages/MonthView";
import NightView from "./pages/NightView";
import StatisticsHistoryPage from "./pages/StatisticsHistoryPage";
import StarCatalog from "./pages/StarCatalog";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MonthView />} />
          <Route path="/night/:date" element={<NightView />} />
          <Route path="/status" element={<StatisticsHistoryPage />} />
          <Route path="/catalog" element={<StarCatalog />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>,
);
