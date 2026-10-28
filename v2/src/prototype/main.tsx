import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import { LivingLogbook } from './LivingLogbook';
import './LivingLogbook.module.css';

const mount = document.getElementById('root');
if (!mount) throw new Error('Logbook prototype mount point is missing.');
createRoot(mount).render(<React.StrictMode><LivingLogbook /></React.StrictMode>);
