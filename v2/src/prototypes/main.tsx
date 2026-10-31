import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { SignalNetwork } from "./SignalNetwork";
import "../styles/tokens.css";
import "../styles/base.css";

const mount = document.getElementById("signal-network-root");
if (!mount) throw new Error("Signal Network mount point is missing.");

const app = <React.StrictMode><SignalNetwork /></React.StrictMode>;
if (mount.dataset.prerendered === "signal-network") hydrateRoot(mount, app);
else createRoot(mount).render(app);
