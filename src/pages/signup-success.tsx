import { createRoot } from "react-dom/client";
import App from "../App";
import "../index.css";
import SignUpSuccess from "./SignUpSuccess";

createRoot(document.getElementById("root")!).render(
  <App>
    <SignUpSuccess />
  </App>
);
