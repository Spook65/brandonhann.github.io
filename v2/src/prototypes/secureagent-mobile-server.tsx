import { renderToString } from "react-dom/server";
import { SecureAgentMobile } from "./SecureAgentMobile";

export function renderSecureAgentMobile() {
  return renderToString(<SecureAgentMobile />);
}
