import { createRoot } from "react-dom/client";
import App from "../App";
import "../index.css";
import Dashboard from "./Dashboard";

createRoot(document.getElementById("root")!).render(
  <App>
    <Dashboard />
  </App>
);
