import { createRoot } from "react-dom/client";
import App from "../App";
import "../index.css";
import SignUpPage from "./SignUpPage";

createRoot(document.getElementById("root")!).render(
  <App>
    <SignUpPage />
  </App>
);
