import { renderToString } from 'react-dom/server';
import { WelcomingHome } from './WelcomingHome';

export function renderHome() {
  return renderToString(<WelcomingHome />);
}
