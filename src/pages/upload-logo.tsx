import { createRoot } from "react-dom/client";
import App from "../App";
import "../index.css";
import UploadLogo from "./UploadLogo";

createRoot(document.getElementById("root")!).render(
  <App>
    <UploadLogo />
  </App>
);
