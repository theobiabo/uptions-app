import { Suspense, lazy } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Loader } from '@/components/misc/load';

const Homepage = lazy(() => import('@/pages'));

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <Suspense fallback={<Loader />}>
      <Homepage />
    </Suspense>
  );
}
