import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import { DeskExperience } from './DeskExperience';

const mount = document.getElementById('root');
if (!mount) throw new Error('Builder desk mount point is missing.');
createRoot(mount).render(<React.StrictMode><DeskExperience /></React.StrictMode>);
