import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { SecureAgentMobile } from "./SecureAgentMobile";
import "../styles/tokens.css";
import "../styles/base.css";

const mount = document.getElementById("secureagent-mobile-root");
if (!mount) throw new Error("SecureAgent mobile prototype mount point is missing.");

const app = <React.StrictMode><SecureAgentMobile /></React.StrictMode>;
if (mount.dataset.prerendered === "secureagent-mobile") hydrateRoot(mount, app);
else createRoot(mount).render(app);
