import { renderToString } from "react-dom/server";
import { SignalNetwork } from "./SignalNetwork";

export function renderSignalNetwork() {
  return renderToString(<SignalNetwork />);
}
