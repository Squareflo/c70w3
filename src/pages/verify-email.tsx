import { createRoot } from "react-dom/client";
import App from "../App";
import "../index.css";
import VerifyEmailPage from "./VerifyEmailPage";

createRoot(document.getElementById("root")!).render(
  <App>
    <VerifyEmailPage />
  </App>
);
