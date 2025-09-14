import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import Index from "./pages/Index";

createRoot(document.getElementById("root")!).render(
  <App>
    <Index />
  </App>
);
