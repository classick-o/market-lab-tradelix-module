import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MarketLab } from "@market-lab/ui";
import "@market-lab/ui/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MarketLab basePath={import.meta.env.BASE_URL} />
  </StrictMode>,
);
