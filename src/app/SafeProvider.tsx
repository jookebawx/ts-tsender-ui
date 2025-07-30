// src/app/safe-providers.tsx
"use client";

import dynamic from 'next/dynamic';

const SafeProvider = dynamic(() => import('./providers').then(mod => mod.Providers), {
  ssr: false,
});

export default SafeProvider;
