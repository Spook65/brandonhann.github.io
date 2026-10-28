import { lazy, Suspense } from 'react';
import { WelcomingHome } from './WelcomingHome';

const GuardianExperience = lazy(() => import('./GuardianExperience'));
const SecurityOutpost = lazy(() => import('./outpost/SecurityOutpost'));

export default function App() {
  const guardianSelected = new URLSearchParams(window.location.search).get('experience') === 'guardian';
  const outpostSelected = window.location.pathname.endsWith('/outpost.html');

  if (outpostSelected) return (
    <Suspense fallback={<main className="experience-fallback"><p>Opening the Signal Outpost…</p><a href={import.meta.env.BASE_URL}>Return to homepage</a></main>}>
      <SecurityOutpost />
    </Suspense>
  );

  if (!guardianSelected) return <WelcomingHome />;

  return (
    <Suspense fallback={<main className="experience-fallback"><p>Opening The Inner Workings…</p><a href={import.meta.env.BASE_URL}>Return to homepage</a></main>}>
      <GuardianExperience />
    </Suspense>
  );
}
