import { createRoot } from "react-dom/client";
import App from "../App";
import "../index.css";
import SignIn from "./SignIn";

createRoot(document.getElementById("root")!).render(
  <App>
    <SignIn />
  </App>
);
